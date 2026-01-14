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
  // Array of open indices anything in this array is considered "open"
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const handleToggle = (index: number): void => {
    // If the index is already open close it
    if (openIndices.includes(index)) {
      // This will filter out the index and return an array without it
      setOpenIndices(
        openIndices.filter((indices: number) => indices !== index)
      );
    } else {
      // If allowing multiple, add to array, else replace
      if (allowMultiple) {
        // New array with all old indices and the new one
        setOpenIndices([...openIndices, index]);
      } else {
        // Replaces the array with the new index only
        setOpenIndices([index]);
      }
    }
  };

  return (
    <div className={styles.faqWrapper}>
      <div className={styles.accordionHeader}>Frequently Asked Questions</div>

      <div className={styles.accordionCard}>
        {questions.map((faqQuestion, index) => {
          // Explicitly typed boolean check
          const isOpen: boolean = openIndices.includes(index);

          return (
            <div key={index}>
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
                      className={`${styles.chevronIcon} ${
                        isOpen ? styles.chevronOpen : ""
                      }`}
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
    </div>
  );
}
