import { projects } from "../../content/projects";
import {
  about,
  credentials,
  education,
  experience,
  lab,
  site,
  skills,
} from "../../content/site";
import {
  captureFlag,
  FLAG_CODES,
  FLAG_HINTS,
  FLAG_IDS,
  getFlags,
  setMode,
  submitFlag,
} from "../../lib/flags";
import { formatLocalDate } from "../../lib/time";

export type LineKind = "input" | "output" | "muted" | "accent" | "error";
export type TerminalLine = { kind: LineKind; text: string; href?: string };
export type CommandContext = {
  navigate: (to: string) => void;
  close: () => void;
  history: readonly string[];
};
export type CommandResult = { lines: TerminalLine[]; clear?: boolean };

const out = (text: string): TerminalLine => ({ kind: "output", text });
const muted = (text: string): TerminalLine => ({ kind: "muted", text });
const accent = (text: string): TerminalLine => ({ kind: "accent", text });
const error = (text: string): TerminalLine => ({ kind: "error", text });
const link = (text: string, href: string): TerminalLine => ({
  kind: "output",
  text,
  href,
});

const COMMANDS = [
  "help",
  "whoami",
  "about",
  "skills",
  "experience",
  "education",
  "projects",
  "open",
  "achievements",
  "lab",
  "contact",
  "socials",
  "resume",
  "ls",
  "cat",
  "flags",
  "submit",
  "theme",
  "history",
  "date",
  "echo",
  "clear",
  "sudo",
  "exit",
];
const FILES = ["about.txt", "skills.txt", "contact.txt", "projects/"];

const HELP: [string, string][] = [
  ["whoami", "who is behind this site"],
  ["about", "short bio"],
  ["skills", "technical stack"],
  ["experience", "work history"],
  ["education", "degree & certifications"],
  ["projects", "list projects, then: open <name>"],
  ["achievements", "ranks & awards"],
  ["lab", "where I practice"],
  ["contact", "email & profiles"],
  ["resume", "open the web resume"],
  ["ls, cat <file>", "explore the file system"],
  ["flags, submit <flag>", "capture-the-flag progress"],
  ["theme <green|red>", "switch the accent (red is earned)"],
  ["history, date, echo, clear, exit", "the usual"],
];

function readFile(file: string): CommandResult {
  switch (file) {
    case "":
      return { lines: [error("usage: cat <file>")] };
    case "about.txt":
      return { lines: [out(about.lead)] };
    case "skills.txt":
      return {
        lines: skills.map((group) =>
          out(`${group.title}: ${group.items.join(", ")}`),
        ),
      };
    case "contact.txt":
      return {
        lines: [
          out(site.email),
          out(site.githubLabel),
          out(site.linkedinLabel),
        ],
      };
    case ".flag":
      captureFlag("terminal");
      return { lines: [accent(FLAG_CODES.terminal)] };
    case "projects":
    case "projects/":
      return { lines: [error(`cat: ${file}: is a directory`)] };
    default:
      return { lines: [error(`cat: ${file}: no such file or directory`)] };
  }
}

export function runCommand(
  raw: string,
  context: CommandContext,
): CommandResult {
  const input = raw.trim();
  if (!input) return { lines: [] };
  const [name, ...args] = input.split(/\s+/);
  const argument = args.join(" ");

  switch (name.toLowerCase()) {
    case "help":
      return {
        lines: [
          accent("available commands"),
          ...HELP.map(([command, text]) =>
            out(`  ${command.padEnd(34)}${text}`),
          ),
        ],
      };
    case "whoami":
      return {
        lines: [
          out(
            "prajwal r pattanshetti — cybersecurity student & software engineering intern",
          ),
          muted(
            `general motors · ${site.location.short} · ${site.location.coords}`,
          ),
        ],
      };
    case "about":
      return { lines: [out(about.lead), muted(about.paragraphs[1])] };
    case "skills":
      return {
        lines: skills.flatMap((group) => [
          accent(`> ${group.title}`),
          out(`  ${group.items.join(" · ")}`),
        ]),
      };
    case "experience":
    case "exp":
      return {
        lines: experience.flatMap((job) => [
          accent(`[${job.period}] ${job.role} — ${job.company}`),
          muted(`  ${job.meta}`),
          ...job.bullets.map((bullet) => out(`  - ${bullet}`)),
        ]),
      };
    case "education":
    case "edu":
    case "certs":
      return {
        lines: [
          ...education.flatMap((item) => [
            accent(`[${item.period}] ${item.title}`),
            muted(`  ${item.org} · ${item.note ?? ""}`),
          ]),
          accent(
            "[certification] Microsoft Professional Cybersecurity Certificate",
          ),
        ],
      };
    case "projects":
      return {
        lines: [
          ...projects.map((project) =>
            out(
              `  ${project.slug.padEnd(28)}${project.title} (${project.year})`,
            ),
          ),
          muted("type 'open <name>' to read a case study"),
        ],
      };
    case "open": {
      const project = projects.find(
        (item) => item.slug === argument.toLowerCase(),
      );
      if (!project) {
        return {
          lines: [
            error(
              argument
                ? `open: ${argument}: no such project`
                : "usage: open <name>",
            ),
            muted("type 'projects' to list names"),
          ],
        };
      }
      context.navigate(`/projects/${project.slug}`);
      context.close();
      return { lines: [accent(`opening ${project.title} …`)] };
    }
    case "achievements":
      return {
        lines: credentials.map((item) => out(`  ${item.title} — ${item.org}`)),
      };
    case "lab":
      return {
        lines: [
          ...lab.items.map((item) =>
            out(`  ${item.name.padEnd(16)}${item.tag}`),
          ),
          muted(
            "  home lab: Kali Linux, Ubuntu Server and Windows 10 virtual machines",
          ),
        ],
      };
    case "contact":
      return {
        lines: [
          link(`  email     ${site.email}`, `mailto:${site.email}`),
          link(`  github    ${site.githubLabel}`, site.github),
          link(`  linkedin  ${site.linkedinLabel}`, site.linkedin),
          out(`  base      ${site.location.city}, ${site.location.region}`),
        ],
      };
    case "socials":
      return {
        lines: [
          link(`  github    ${site.githubLabel}`, site.github),
          link(`  linkedin  ${site.linkedinLabel}`, site.linkedin),
        ],
      };
    case "resume":
      context.navigate("/resume");
      context.close();
      return { lines: [accent("opening resume …")] };
    case "ls": {
      const all = args.some(
        (flag) => flag.startsWith("-") && flag.includes("a"),
      );
      return {
        lines: [
          out((all ? [".", "..", ".flag", ...FILES] : FILES).join("   ")),
        ],
      };
    }
    case "cat":
      return readFile(argument);
    case "flags": {
      const captured = getFlags();
      return {
        lines: [
          accent(`flags captured: ${captured.length} / ${FLAG_IDS.length}`),
          ...FLAG_IDS.map((id) =>
            captured.includes(id)
              ? out(`  [x] ${FLAG_CODES[id]}`)
              : muted(`  [ ] ${FLAG_HINTS[id]}`),
          ),
        ],
      };
    }
    case "submit": {
      const id = submitFlag(argument);
      if (!id) return { lines: [error("invalid flag")] };
      captureFlag(id);
      return { lines: [accent(`accepted: ${FLAG_CODES[id]}`)] };
    }
    case "theme":
      if (argument === "red") {
        return setMode("redteam")
          ? { lines: [accent("red-team mode engaged")] }
          : {
              lines: [
                error("access denied: capture all 3 flags first"),
                muted("type 'flags' for hints"),
              ],
            };
      }
      if (argument === "green" || argument === "default") {
        setMode("default");
        return { lines: [accent("accent reset to terminal green")] };
      }
      return { lines: [error("usage: theme <green|red>")] };
    case "history":
      return {
        lines: context.history.map((entry, index) =>
          out(`  ${String(index + 1).padStart(3)}  ${entry}`),
        ),
      };
    case "date":
      return { lines: [out(formatLocalDate(new Date()))] };
    case "echo":
      return { lines: [out(argument)] };
    case "clear":
    case "cls":
      return { lines: [], clear: true };
    case "sudo":
      return {
        lines: [
          error(
            "visitor is not in the sudoers file. this incident will be reported.",
          ),
        ],
      };
    case "rm":
      return { lines: [error("rm: permission denied — nice try")] };
    case "exit":
    case "quit":
      context.close();
      return { lines: [muted("session closed")] };
    default:
      return {
        lines: [
          error(`command not found: ${name}`),
          muted("type 'help' for a list of commands"),
        ],
      };
  }
}

export function complete(value: string) {
  const [first = "", second] = value.split(" ");
  const pick = (options: string[], prefix: string) => {
    const matches = options.filter((option) => option.startsWith(prefix));
    return matches.length === 1 ? matches[0] : null;
  };

  if (second === undefined) {
    const match = pick(COMMANDS, first.toLowerCase());
    return match ? `${match} ` : value;
  }
  if (first === "open") {
    const match = pick(
      projects.map((project) => project.slug),
      second,
    );
    return match ? `open ${match}` : value;
  }
  if (first === "cat") {
    const files = second.startsWith(".")
      ? [".flag"]
      : ["about.txt", "skills.txt", "contact.txt"];
    const match = pick(files, second);
    return match ? `cat ${match}` : value;
  }
  return value;
}
