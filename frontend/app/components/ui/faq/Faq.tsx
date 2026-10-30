"use client";

import { useState } from "react";
import { sectionHref } from "../header/navLinks";
import Section from "../section/Section";
import { faqQuestions } from "./faqData";
import styles from "./faq.module.css";

interface FAQProps {
  // let several answers be open at once
  allowMultiple?: boolean;
}

// Uses <details>. allowMultiple={false} gives every item the same `name`,
// so only one can be open.
export default function FAQ({ allowMultiple = true }: FAQProps) {
  // questions that have been opened, for the tick marks
  const [read, setRead] = useState<string[]>([]);

  const markRead = (question: string) =>
    setRead((list) => (list.includes(question) ? list : [...list, question]));

  return (
    <Section
      id="faq"
      title="FAQ"
      lead={
        <>
          Something we missed?{" "}
          <a href={sectionHref("contact")}>Send us a message.</a>
        </>
      }
      stickyHeading
    >
      <div className={`card ${styles.list}`}>
        {faqQuestions.map(({ question, answer }) => (
          <details
            key={question}
            className={styles.item}
            name={allowMultiple ? undefined : "faq"}
            data-read={read.includes(question) || undefined}
            onToggle={(event) => {
              if (event.currentTarget.open) markRead(question);
            }}
          >
            <summary className={styles.question}>
              <CheckMark />
              <span className={styles.questionText}>{question}</span>
              <span className={styles.plusMinus} aria-hidden="true" />
            </summary>
            <p className={styles.answer}>{answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

// Checkbox in the light theme, sparkle in the dark theme. faq.module.css
// hides the other one.
function CheckMark() {
  return (
    <span className={styles.mark} aria-hidden="true">
      <svg className={styles.box} viewBox="0 0 24 24">
        <rect x="3" y="5" width="16" height="16" rx="1.5" />
        <path d="M6.5 12.5 11 17.5 22 3" pathLength={1} />
      </svg>
      <svg className={styles.sparkle} viewBox="0 0 24 24">
        <path d="M12 2c.6 5.4 4.6 9.4 10 10-5.4.6-9.4 4.6-10 10-.6-5.4-4.6-9.4-10-10 5.4-.6 9.4-4.6 10-10Z" />
      </svg>
    </span>
  );
}
