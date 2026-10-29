import { useState, type FormEvent } from "react";
import { site } from "../content/site";
import Button from "../components/ui/Button";
import FlagButton from "../components/ui/FlagButton";
import styles from "./ContactForm.module.css";

const MAX_MESSAGE = 1000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT;

type Status = { kind: "idle" | "sending" | "sent" | "error"; message: string };

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle", message: "" });

  const errors = {
    name: name.trim().length < 2 ? "Please enter your name." : "",
    email: EMAIL_PATTERN.test(email.trim())
      ? ""
      : "Expected format: your.name@example.com",
    message:
      message.trim().length < 10 ? "Please write at least 10 characters." : "",
  };
  const invalid = Boolean(errors.name || errors.email || errors.message);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    // Bots fill the hidden field; pretend success and send nothing.
    if (company) {
      setStatus({ kind: "sent", message: "Message sent." });
      return;
    }
    if (invalid) {
      setStatus({
        kind: "error",
        message: "Please fix the highlighted fields.",
      });
      return;
    }

    const payload = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    };

    if (!ENDPOINT) {
      const subject = encodeURIComponent(`Portfolio contact — ${payload.name}`);
      const body = encodeURIComponent(
        `${payload.message}\n\n— ${payload.name} <${payload.email}>`,
      );
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      setStatus({
        kind: "sent",
        message: "Your email app should open with the message ready to send.",
      });
      return;
    }

    setStatus({ kind: "sending", message: "Sending…" });
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setStatus({
        kind: "sent",
        message: "Message sent — I will get back to you soon.",
      });
      setName("");
      setEmail("");
      setMessage("");
      setTouched(false);
    } catch {
      setStatus({
        kind: "error",
        message: `Could not send right now. Please email ${site.email} directly.`,
      });
    }
  }

  const fieldError = (key: keyof typeof errors) =>
    touched && errors[key] ? errors[key] : "";

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <span className={styles.plus} data-pos="tl" aria-hidden="true">
        +
      </span>
      <span className={styles.plus} data-pos="br" aria-hidden="true">
        +
      </span>
      <div className={styles.head}>
        <span>
          &gt; new_message<span className={styles.caret}>_</span>
        </span>
        <FlagButton id="contact" />
      </div>

      <label className={styles.field}>
        <span className={styles.label}>01 · Name</span>
        <input
          className={styles.input}
          name="name"
          autoComplete="name"
          placeholder="Your name"
          maxLength={80}
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={Boolean(fieldError("name"))}
        />
        {fieldError("name") ? (
          <span className={styles.error}>{fieldError("name")}</span>
        ) : null}
      </label>

      <label className={styles.field}>
        <span className={styles.label}>02 · Email</span>
        <input
          className={styles.input}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="your@email.com"
          maxLength={120}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={Boolean(fieldError("email"))}
        />
        <span className={fieldError("email") ? styles.error : styles.hint}>
          {fieldError("email") || "Expected format: your.name@example.com"}
        </span>
      </label>

      <label className={styles.field}>
        <span className={styles.label}>03 · Message</span>
        <textarea
          className={`${styles.input} ${styles.textarea}`}
          name="message"
          placeholder="Your message…"
          rows={5}
          maxLength={MAX_MESSAGE}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          aria-invalid={Boolean(fieldError("message"))}
        />
        <span className={styles.meta}>
          <span className={styles.error}>{fieldError("message")}</span>
          <span className={styles.hint}>
            {message.length} / {MAX_MESSAGE} characters
          </span>
        </span>
      </label>

      <div className={styles.trap} aria-hidden="true">
        <label>
          Company
          <input
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
          />
        </label>
      </div>

      <Button
        type="submit"
        variant="solid"
        icon="arrow-up-right"
        disabled={status.kind === "sending"}
      >
        {status.kind === "sending" ? "Sending…" : "Send message"}
      </Button>
      <p
        className={styles.status}
        data-kind={status.kind}
        role="status"
        aria-live="polite"
      >
        {status.message}
      </p>
    </form>
  );
}
