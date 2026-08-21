export interface FaqData{
    question :string;
    answer:string;
}

export const faqItems: FaqData[] = [
  {
    question: "Is Lapwork free to use?",
    answer:
      "Yes, Lapwork's core features are completely free.",
  },
  {
    question: "Which Windows versions does Lapwork support?",
    answer:
      "Lapwork works smoothly on Windows 10 and Windows 11.",
  },
  {
    question: "Does Lapwork track my data even when I'm offline?",
    answer:
      "Yes, Lapwork tracks your activity locally on your device, so it works even without an internet connection.",
  },
  {
    question: "Is Daily Tracker useful for students?",
    answer:
      "Absolutely. Students can use it to track study sessions, assignments, projects, revision, and daily learning goals",
  },
  {
    question: "Can I see detailed reports of my daily activity?",
    answer:
      "Absolutely. Lapwork generates clear daily and weekly reports showing your productive hours, distractions, and overall focus trends, so you can track your improvement over time.",
  },
  {
    question: "Will Lapwork slow down my computer?",
    answer:
      "No, Lapwork is built to be lightweight and runs quietly in the background without affecting your system's performance.",
  },
];