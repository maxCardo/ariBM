"use client";

import { useMemo, useState } from "react";

const questions = [
  {
    prompt: "What is Ari's favorite sport to play?",
    options: ["Baseball", "Basketball", "Soccer"],
    answer: 0,
  },
  {
    prompt: "What is Ari's favorite food?",
    options: ["Pizza", "Sushi", "Hamburger"],
    answer: 1,
  },
  {
    prompt: "Is Ari a lefty or a righty?",
    options: ["Lefty", "Righty"],
    answer: 1,
  },
  {
    prompt: "Are Ari's curls natural or a perm?",
    options: ["Natural", "Perm", "Mostly Natural but Styled by Mom"],
    answer: 0,
  },
];

export default function TriviaPage() {
  const [score, setScore] = useState(0);
  /** question index → chosen option index (set once per question) */
  const [chosen, setChosen] = useState<Record<number, number>>({});

  const finished = useMemo(
    () => Object.keys(chosen).length === questions.length,
    [chosen],
  );

  const selectOption = (questionIndex: number, optionIndex: number) => {
    if (chosen[questionIndex] !== undefined) {
      return;
    }

    setChosen((prev) => ({ ...prev, [questionIndex]: optionIndex }));
    if (questions[questionIndex].answer === optionIndex) {
      setScore((current) => current + 1);
    }
  };

  const reset = () => {
    setScore(0);
    setChosen({});
  };

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 shrink-0 flex-col gap-6 px-4 py-10">
      <h1 className="text-3xl font-bold text-[#f38a4a]">Ari Trivia</h1>
      <p className="text-[#006a78]">
        A quick game for guests while they wait for the party to start.
      </p>

      {questions.map((question, questionIndex) => {
        const picked = chosen[questionIndex];
        const locked = picked !== undefined;

        return (
          <section
            key={question.prompt}
            className="shrink-0 rounded-xl bg-[#efefef] p-4 shadow-sm ring-1 ring-[#f3b28a]"
          >
            <h2 className="font-semibold text-[#006a78]">{question.prompt}</h2>
            <div className="relative z-10 mt-3 flex flex-wrap gap-2">
              {question.options.map((option, optionIndex) => {
                const isSelected = picked === optionIndex;
                const isCorrectOption = question.answer === optionIndex;

                let choiceStyles =
                  "border-[#86dbe4] bg-white text-[#006a78] hover:bg-[#bfeef3]";
                if (locked) {
                  if (isCorrectOption) {
                    choiceStyles =
                      "border-emerald-600 bg-emerald-100 text-emerald-900";
                  } else if (isSelected) {
                    choiceStyles = "border-red-400 bg-red-50 text-red-900";
                  } else {
                    choiceStyles =
                      "border-[#86dbe4]/50 bg-[#f5f5f5] text-[#006a78]/50";
                  }
                }

                return (
                  <button
                    key={`${questionIndex}-${optionIndex}`}
                    type="button"
                    disabled={locked}
                    aria-pressed={isSelected}
                    onClick={() => selectOption(questionIndex, optionIndex)}
                    className={`cursor-pointer touch-manipulation rounded-md border px-3 py-2 text-sm transition disabled:cursor-default ${choiceStyles}`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      <section className="flex shrink-0 flex-col gap-3 rounded-xl bg-[#006a78] p-4 text-[#e8fbff] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold">
            Score: {score} / {questions.length}
          </p>
          {finished && (
            <p className="mt-1 text-sm">
              Perfect warm-up for a fun weekend celebration.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={reset}
          className="shrink-0 cursor-pointer rounded-md border border-[#e8fbff] px-3 py-2 text-sm font-medium text-[#e8fbff] transition hover:bg-white/10"
        >
          Reset
        </button>
      </section>
    </main>
  );
}
