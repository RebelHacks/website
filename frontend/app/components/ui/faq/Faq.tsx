import SectionHeading from "../section/SectionHeading";
import type { Question } from "./faqData";
import styles from "./faq.module.css";

interface AccordionArgs {
  questions: Question[];
  allowMultiple: boolean;
}

// Built on <details>, so opening and closing is handled by the browser.
// Giving every item the same `name` makes the browser keep only one open.
export default function Accordion({ questions, allowMultiple }: AccordionArgs) {
  return (
    <div className="columns sticky">
      <SectionHeading id="faq-heading" title="FAQ">
        Something we missed? <a href="#contact">Send us a message.</a>
      </SectionHeading>

      <div className={`card ${styles.list}`}>
        {questions.map(({ question, answer }) => (
          <details
            key={question}
            className={styles.item}
            name={allowMultiple ? undefined : "faq"}
          >
            <summary className={styles.question}>
              {question}
              <span className={styles.icon} aria-hidden="true" />
            </summary>
            <p className={styles.answer}>{answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
