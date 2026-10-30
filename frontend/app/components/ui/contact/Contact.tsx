"use client";

import { useRef, useState, type FormEvent } from "react";
import Section from "../section/Section";
import { CONTACT_EMAIL, contactRoles } from "./contactData";
import styles from "./contact.module.css";

export default function Contact() {
  const [hasOpenedEmail, setHasOpenedEmail] = useState(false);

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

  // TODO: send through a form service once the organizers pick one.
  // Until then, this opens the visitor's email app with everything filled in.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name"));
    const role = String(formData.get("role") ?? "Not picked");
    const subject = `Website message from ${name} (${role})`;
    const body = `${formData.get("message")}\n\n${name}\n${formData.get("email")}`;

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setHasOpenedEmail(true);
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
      <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
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
        <button type="submit" className={`button ${styles.submit}`}>
          Open in email app
        </button>
        {hasOpenedEmail && (
          <p className={styles.note} role="status">
            Your email app should open with this message ready to send. If it
            didn&apos;t, email us at {CONTACT_EMAIL}.
          </p>
        )}
      </form>
    </Section>
  );
}
