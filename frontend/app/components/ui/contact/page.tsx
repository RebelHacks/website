"use client";
import styles from "@/app/components/ui/contact/contact.module.css";
import { useState, type FormEvent } from "react";
import { useMutation } from "@/hooks/useApi";
import type { EmailResponse } from "@/lib/types";
import FlashMessage from "@/app/components/ui/FlashMessage";
import SectionHeading from "@/app/components/ui/section/SectionHeading";

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

const ERROR_MESSAGE =
  "Error sending email, please double-check your email and try again";

export default function Contact() {
  const [flashMessage, setFlashMessage] = useState<{
    type: "success" | "error";
    message: string;
    id: number;
  } | null>(null);

  const { mutate: sendEmail, loading: isSendingEmail } = useMutation<
    ContactForm,
    EmailResponse
  >("post", "/contact-email");

  // The fields aren't tracked in state: their values are read from the form
  // (by their `name`) when it's submitted.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fields = Object.fromEntries(formData) as unknown as ContactForm;

    const result = await sendEmail(fields).catch((error) => {
      console.error("Error sending email:", error);
      return null;
    });

    setFlashMessage(
      result?.success
        ? {
            type: "success",
            message: result.message || "Email sent successfully!",
            id: Date.now(),
          }
        : { type: "error", message: ERROR_MESSAGE, id: Date.now() },
    );
  };

  return (
    <div className={styles.container}>
      <SectionHeading id="contact-heading" title="Contact">
        Have a question that isn&apos;t answered above? Send us a message and an
        organizer will get back to you.
      </SectionHeading>
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
          disabled={isSendingEmail}
        >
          {isSendingEmail ? "Sending…" : "Send message"}
        </button>
      </form>
    </div>
  );
}
