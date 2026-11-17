"use client";

import { useRef, useState, type FormEvent } from "react";
import FlashMessage from "../FlashMessage";
import Section from "../section/Section";
import { CONTACT_EMAIL, contactRoles } from "./contactData";
import { sendMessage } from "./sendMessage";
import styles from "./contact.module.css";

// Same message for every failure. The visitor's fix is the same either way.
const ERROR_MESSAGE = `Your message couldn't be sent. Try again in a moment, or email us at ${CONTACT_EMAIL}.`;

export default function Contact() {
  const [isSending, setIsSending] = useState(false);
  const [hasError, setHasError] = useState(false);
  // the address an organizer will reply to, once the message is sent
  const [sentTo, setSentTo] = useState<string | null>(null);

  const messageRef = useRef<HTMLTextAreaElement>(null);
  const lastTemplate = useRef("");

  // Swaps in the role's template, unless the visitor has written their own message.
  const fillTemplate = (template: string) => {
    const message = messageRef.current;
    if (!message) return;
    const isUntouched =
      message.value.trim() === "" || message.value === lastTemplate.current;
    if (!isUntouched) return;
    message.value = template;
    lastTemplate.current = template;
  };

  // Fields are read on submit. Nothing needs them in state while typing.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email"));

    setIsSending(true);
    setHasError(false);
    const isSent = await sendMessage({
      name: String(formData.get("name")),
      email,
      role: String(formData.get("role") ?? "Not picked"),
      message: String(formData.get("message")),
      botcheck: formData.has("botcheck"),
    });
    setIsSending(false);

    if (isSent) {
      lastTemplate.current = "";
      setSentTo(email);
    } else {
      setHasError(true);
    }
  };

  return (
    <Section
      id="contact"
      title="Contact"
      lead={
        <>
          Have a question, or want to judge or sponsor? Send us a message and an
          organizer will get back to you. You can also email us at{" "}
          {CONTACT_EMAIL}.
        </>
      }
      stickyHeading
    >
      {sentTo ? (
        <div className={`card ${styles.sent}`} role="status">
          <svg
            className={styles.sentTick}
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
          <h3 className={styles.sentTitle}>Message sent</h3>
          <p>An organizer will reply to {sentTo}.</p>
          <button
            type="button"
            className={`button ${styles.submit}`}
            onClick={() => setSentTo(null)}
          >
            Send another
          </button>
        </div>
      ) : (
        <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
          {hasError && (
            <FlashMessage
              type="error"
              message={ERROR_MESSAGE}
              onClose={() => setHasError(false)}
            />
          )}
          <fieldset className={styles.roles}>
            <legend className={styles.label}>I&apos;m writing as</legend>
            <div className={styles.roleList}>
              {contactRoles.map(({ label, template }) => (
                <label key={label} className={styles.role}>
                  <input
                    type="radio"
                    name="role"
                    value={label}
                    onChange={() => fillTemplate(template)}
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <div className={styles.row}>
            <label className={styles.label}>
              Name
              <input
                name="name"
                type="text"
                autoComplete="name"
                className={styles.input}
                required
                placeholder="Your name"
              />
            </label>
            <label className={styles.label}>
              Email
              <input
                name="email"
                type="email"
                autoComplete="email"
                className={styles.input}
                required
                placeholder="email@example.com"
              />
            </label>
          </div>
          <label className={styles.label}>
            Message
            <textarea
              ref={messageRef}
              name="message"
              className={styles.textarea}
              rows={6}
              placeholder="Your message here..."
              required
            />
          </label>
          {/* spam trap: hidden from people, so only bots tick it */}
          <input
            type="checkbox"
            name="botcheck"
            className={styles.botcheck}
            tabIndex={-1}
            aria-hidden="true"
          />
          <button
            type="submit"
            className={`button ${styles.submit}`}
            disabled={isSending}
          >
            {isSending ? "Sending…" : "Send message"}
          </button>
        </form>
      )}
    </Section>
  );
}
