"use client";

import { useMemo, useState } from "react";

const questions = [
  {
    prompt: "Ari's favorite post-homework snack?",
    options: ["Popcorn", "Sushi", "Chocolate chip cookies"],
    answer: 0,
  },
  {
    prompt: "What hobby is Ari most into this year?",
    options: ["Basketball", "Coding", "Playing guitar"],
    answer: 1,
  },
  {
    prompt: "Which song should definitely be in the dance set?",
    options: ["Levitating", "Can’t Stop the Feeling", "Happy"],
    answer: 2,
  },
];

export default function TriviaPage() {
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number[]>([]);

  const finished = useMemo(() => answered.length === questions.length, [answered]);

  const checkAnswer = (questionIndex: number, optionIndex: number) => {
    if (answered.includes(questionIndex)) {
      return;
    }

    setAnswered((existing) => [...existing, questionIndex]);
    if (questions[questionIndex].answer === optionIndex) {
      setScore((current) => current + 1);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 py-10">
      <h1 className="text-3xl font-bold text-[#f38a4a]">Ari Trivia</h1>
      <p className="text-[#006a78]">
        A quick game for guests while they wait for the party to start.
      </p>

      {questions.map((question, questionIndex) => (
        <section
          key={question.prompt}
          className="rounded-xl bg-[#efefef] p-4 shadow-sm ring-1 ring-[#f3b28a]"
        >
          <h2 className="font-semibold text-[#006a78]">{question.prompt}</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {question.options.map((option, optionIndex) => (
              <button
                key={option}
                type="button"
                onClick={() => checkAnswer(questionIndex, optionIndex)}
                className="rounded-md border border-[#86dbe4] bg-white px-3 py-2 text-sm text-[#006a78] transition hover:bg-[#bfeef3]"
              >
                {option}
              </button>
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-xl bg-[#006a78] p-4 text-[#e8fbff]">
        <p className="font-semibold">
          Score: {score} / {questions.length}
        </p>
        {finished && (
          <p className="mt-1 text-sm">Perfect warm-up for a fun weekend celebration.</p>
        )}
      </section>
    </main>
  );
}
