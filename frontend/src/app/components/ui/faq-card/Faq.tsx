"use client";

import { useState } from "react";
import styles from "./faq.module.css";

interface Question {
  question: string;
  answer: string;
}

interface AccordionProps {
  questions: Question[];
  allowMultiple?: boolean;
  title?: string;
}

function Accordion({
  questions,
  allowMultiple = false,
  title = "Frequently Asked Questions",
}: AccordionProps) {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const handleToggle = (index: number) => {
    const isOpen = openIndices.includes(index);

    if (isOpen) {
      setOpenIndices(openIndices.filter((i) => i !== index));
      return;
    }

    if (allowMultiple) setOpenIndices([...openIndices, index]);
    else setOpenIndices([index]);
  };

  return (
    <div className={styles.accordionCard}>
      <div className="text-4xl text-center text-(--primary) border-b border-(--primary)/25 font-bold p-6">
        {title}
      </div>

      {questions.map((faqQuestion, index) => {
        const isOpen = openIndices.includes(index);

        return (
          <div key={index} className="border-b border-(--primary)/25">
            <button
              type="button"
              onClick={() => handleToggle(index)}
              className="flex items-center w-full text-left hover:bg-(--primary)/10 p-4 "
            >
              <div className="flex-1 font-bold text-(--primary)">
                {faqQuestion.question}
              </div>

              <div className="w-4 h-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.chevronIcon}
                  viewBox="0 0 512 512"
                >
                  {isOpen ? (
                    <path d="M112 328l144-144 144 144" />
                  ) : (
                    <path d="M112 184l144 144 144-144" />
                  )}
                </svg>
              </div>
            </button>

            {isOpen && <p className="p-4 pt-0">{faqQuestion.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}

const faqQuestions: Question[] = [
  {
    question: "What is a hackathon?",
    answer:
      "A hackathon is an event where individuals come together to collaborate on software or hardware projects within a set time frame.",
  },
  {
    question: "Is there a theme?",
    answer:
      "Yes, each hackathon may have a specific theme or focus area, such as healthcare, education, or sustainability.",
  },
  {
    question: "How many people can be in a group?",
    answer:
      "Group sizes can vary, but typically teams consist of 2 to 5 members.",
  },
  {
    question: "Who can join?",
    answer:
      "Any UNLV and CSN student enrolled during the spring semester can attend. All majors are welcome.",
  },
];

export default function Faq() {
  return <Accordion questions={faqQuestions} allowMultiple />;
}
