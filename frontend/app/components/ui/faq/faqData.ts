export interface Question {
  question: string;
  answer: string;
}

// Order: what it is, who can come, what it takes, then details.
// Only add answers the organizers have confirmed.
export const faqQuestions: Question[] = [
  {
    question: "What is a hackathon?",
    answer:
      "An event where teams come together to build a software or hardware project in a set amount of time, then present it to be judged.",
  },
  {
    question: "Who can join?",
    answer: "Any university student. All majors are welcome.",
  },
  {
    question: "How much does it cost to join?",
    answer: "Nothing. RebelHacks is 100% free to enter!",
  },
  {
    question: "Do I need coding experience?",
    answer:
      "No. Everyone starts somewhere, and if it's your first RebelHacks, you're eligible for the Beginner prize.",
  },
  {
    question: "How many people can be in a team?",
    answer: "Anywhere from 1 to 5, so you can also go solo.",
  },
  {
    question: "Where is it?",
    answer:
      "In the SEB Auditorium at UNLV. Overnight, hacking moves to the first floor of AEB.",
  },
  {
    question: "Is it overnight?",
    answer:
      "Yes. The first floor of AEB is booked for us, so you can keep building through Saturday night.",
  },
  {
    question: "Is there a theme?",
    answer: "Yes. It's announced on-site after the opening ceremony.",
  },
  {
    question: "Can we start building before the event?",
    answer:
      "No. The theme is revealed at the opening ceremony, so every project starts there.",
  },
  {
    question: "Will there be food?",
    answer: "Yes! There's free food during the event.",
  },
];
