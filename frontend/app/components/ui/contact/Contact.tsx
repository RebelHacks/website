"use client";

import { useState, type FormEvent } from "react";
import { useMutation } from "@/hooks/useApi";
import type { EmailResponse } from "@/lib/types";
import FlashMessage from "../FlashMessage";
import Section from "../section/Section";
import styles from "./contact.module.css";

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

interface Flash {
  type: "success" | "error";
  message: string;
  // used as the key, so a new id replays the entrance animation
  id: number;
}

// Same message for every failure. The visitor's fix is the same either way.
const ERROR_MESSAGE =
  "Your message couldn't be sent. Please try again in a moment.";

export default function Contact() {
  const [flashMessage, setFlashMessage] = useState<Flash | null>(null);

  const { mutate: sendEmail, loading: isSending } = useMutation<
    ContactForm,
    EmailResponse
  >("post", "/contact-email");

  // Fields are read on submit. Nothing needs them in state while typing.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const result = await sendEmail({
      name: String(formData.get("name")),
      email: String(formData.get("email")),
      message: String(formData.get("message")),
    });

    if (result?.success) {
      form.reset(); // so it isn't sent twice by accident
      setFlashMessage({
        type: "success",
        message: result.message || "Email sent successfully!",
        id: Date.now(),
      });
      return;
    }

    // Failed requests are already logged by lib/api.ts. This is for a normal
    // reply with success: false.
    if (result) console.error("The contact form was refused:", result);
    setFlashMessage({ type: "error", message: ERROR_MESSAGE, id: Date.now() });
  };

  return (
    <Section
      id="contact"
      title="Contact"
      lead={
        <>
          Have a question that isn&apos;t answered above? Send us a message and
          an organizer will get back to you.
        </>
      }
      stickyHeading
    >
      <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
        {flashMessage && (
          <FlashMessage
            key={flashMessage.id}
            type={flashMessage.type}
            message={flashMessage.message}
            onClose={() => setFlashMessage(null)}
          />
        )}
        <label className={styles.label}>
          Name
          <input
            name="name"
            type="text"
            autoComplete="name"
            className={styles.input}
            required
            placeholder="Your Name"
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
        <label className={styles.label}>
          Message
          <textarea
            name="message"
            className={styles.textarea}
            rows={5}
            placeholder="Your message here..."
            required
          />
        </label>
        <button
          type="submit"
          className={`button ${styles.submit}`}
          disabled={isSending}
        >
          {isSending ? "Sending…" : "Send message"}
        </button>
      </form>
    </Section>
  );
}
