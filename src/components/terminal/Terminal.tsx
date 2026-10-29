import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router";
import { closeTerminal, useTerminal } from "../../lib/terminal";
import Icon from "../ui/Icon";
import {
  complete,
  runCommand,
  type LineKind,
  type TerminalLine,
} from "./commands";
import styles from "./Terminal.module.css";

type Line = TerminalLine & { id: number };

const KIND_CLASS: Record<LineKind, string> = {
  input: styles.lineInput,
  output: styles.lineOutput,
  muted: styles.lineMuted,
  accent: styles.lineAccent,
  error: styles.lineError,
};

let nextLineId = 0;
const withIds = (lines: TerminalLine[]): Line[] =>
  lines.map((line) => ({ ...line, id: ++nextLineId }));

const BANNER: TerminalLine[] = [
  { kind: "accent", text: "PRP-OS 2.6 · secure shell" },
  {
    kind: "muted",
    text: "type 'help' to list commands · tab completes · esc closes",
  },
];

export default function Terminal() {
  const { open, command, nonce } = useTerminal();
  const navigate = useNavigate();
  const [lines, setLines] = useState<Line[]>(() => withIds(BANNER));
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const handledNonce = useRef(0);

  const execute = (raw: string) => {
    const input = raw.trim();
    const nextHistory = input ? [...history, input] : history;
    setHistory(nextHistory);
    setCursor(null);
    const result = runCommand(input, {
      navigate,
      close: closeTerminal,
      history: nextHistory,
    });
    const echo: TerminalLine = { kind: "input", text: input };
    setLines((previous) =>
      result.clear ? [] : [...previous, ...withIds([echo, ...result.lines])],
    );
  };

  // Commands can be queued from elsewhere on the page, e.g. the Lab rows.
  useEffect(() => {
    if (!open || !command || handledNonce.current === nonce) return;
    handledNonce.current = nonce;
    execute(command);
  });

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const output = outputRef.current;
    if (output) output.scrollTop = output.scrollHeight;
  }, [lines]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    execute(value);
    setValue("");
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp" && history.length > 0) {
      event.preventDefault();
      const next =
        cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next]);
    } else if (event.key === "ArrowDown" && cursor !== null) {
      event.preventDefault();
      const next = cursor + 1;
      setCursor(next >= history.length ? null : next);
      setValue(next >= history.length ? "" : history[next]);
    } else if (event.key === "Tab") {
      event.preventDefault();
      setValue((current) => complete(current));
    } else if (event.key.toLowerCase() === "l" && event.ctrlKey) {
      event.preventDefault();
      setLines([]);
    }
  };

  return (
    <div
      id="prp-terminal"
      className={styles.panel}
      role="dialog"
      aria-modal="false"
      aria-label="Interactive terminal"
      hidden={!open}
      onKeyDown={(event) => {
        if (event.key === "Escape") closeTerminal();
      }}
    >
      <div className={styles.bar}>
        <span className={styles.lights}>
          <span />
          <span />
          <span />
        </span>
        <span className={styles.title}>visitor@prp: ~</span>
        <button
          type="button"
          className={styles.close}
          onClick={closeTerminal}
          aria-label="Close terminal"
        >
          <Icon name="close" />
        </button>
      </div>

      <div
        ref={outputRef}
        className={styles.output}
        role="log"
        aria-live="polite"
        data-lenis-prevent=""
      >
        {lines.map((line) => (
          <p key={line.id} className={KIND_CLASS[line.kind]}>
            {line.kind === "input" ? (
              <span className={styles.prompt}>visitor@prp:~$ </span>
            ) : null}
            {line.href ? (
              <a
                href={line.href}
                target={line.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
              >
                {line.text}
              </a>
            ) : (
              line.text
            )}
          </p>
        ))}
      </div>

      <form className={styles.inputRow} onSubmit={onSubmit}>
        <span className={styles.prompt} aria-hidden="true">
          visitor@prp:~$
        </span>
        <label htmlFor="terminal-input" className="sr-only">
          Terminal command
        </label>
        <input
          id="terminal-input"
          ref={inputRef}
          className={styles.input}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={onInputKeyDown}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          maxLength={200}
        />
      </form>
    </div>
  );
}
