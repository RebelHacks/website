'use client'
import Accordion from './Accordion';

// TODO:
// - Fill out the faq.module.css to deal with more custom stuff related to my page if needed

// DONE:
// - Move the accordion logic/structure into a separate component
// - Toggle added to accordion
// - Reduced the tailwind used.
// - Can toggle if multiple questions can be open at once or not

interface Question {
  question: string;
  answer: string;
}

const faqQuestions: Question[] = [
  {
    question: "What is a hackathon?",
    answer: "A hackathon is an event where individuals come together to collaborate on software or hardware projects within a set time frame."
  },
  {
    question: "Is there a theme?",
    answer: "Yes, each hackathon may have a specific theme or focus area, such as healthcare, education, or sustainability."
  },
  {
    question: "How many people can be in a group?",
    answer: "Group sizes can vary, but typically teams consist of 2 to 5 members."
  },
  {
    question: "Who can join?",
    answer: "Any UNLV and CSN student enrolled during the spring semester can attend. All majors are welcome."
  },
];

export default function Faq() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-background p-4">
      <Accordion questions={faqQuestions} allowMultiple={true} />
    </div>
  );
}