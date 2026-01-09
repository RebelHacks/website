import { useState } from "react";
import styles from "./faq.module.css";

interface Question {
  question: string;
  answer: string;
}

interface AccordionArgs {
  questions: Question[];
  allowMultiple: boolean;
}

export default function Accordion({ questions, allowMultiple }: AccordionArgs) {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const handleToggle = (index: number): void => {
    if (openIndices.includes(index)) {
      setOpenIndices(openIndices.filter((i) => i !== index));
    } else {
      setOpenIndices(allowMultiple ? [...openIndices, index] : [index]);
    }
  };

  return (
    <div className={styles.accordionCard}>
      <div className={styles.accordionHeader}>Frequently Asked Questions</div>

      {questions.map((faqQuestion, index) => {
        const isOpen = openIndices.includes(index);

        return (
          <div key={index} className={styles.accordionItem}>
            <button
              onClick={() => handleToggle(index)}
              className={styles.accordionButton}
            >
              <div className={styles.accordionQuestion}>
                {faqQuestion.question}
              </div>

              <div className={styles.chevronWrapper}>
                {isOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.chevronIcon}
                    viewBox="0 0 512 512"
                  >
                    <path d="M112 328l144-144 144 144" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.chevronIcon}
                    viewBox="0 0 512 512"
                  >
                    <path d="M112 184l144 144 144-144" />
                  </svg>
                )}
              </div>
            </button>

            {isOpen && (
              <p className={styles.accordionAnswer}>{faqQuestion.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
