"use client";

import { useState } from "react";

export default function MultiplicationPractice() {
    const [questions, setQuestions] = useState<number[][]>([]);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [results, setResults] = useState<
        { correct: boolean; correctAnswer: number; timeTaken: string }[]
    >([]);
    const [submitted, setSubmitted] = useState(false);

    const generateQuestions = () => {
        const newQs: number[][] = [];
        for (let i = 0; i < 5; i++) {
            newQs.push([
                Math.floor(Math.random() * 90) + 10,
                Math.floor(Math.random() * 90) + 10,
            ]);
        }
        setQuestions(newQs);
        setUserAnswers(Array(5).fill(""));
        setResults([]);
        setSubmitted(false);
        setStartTime(Date.now());
    };

    const handleAnswerChange = (index: number, value: string) => {
        const updated = [...userAnswers];
        updated[index] = value;
        setUserAnswers(updated);
    };

    const handleSubmit = () => {
        if (!startTime || questions.length === 0) return;
        const endTime = Date.now();
        const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);

        const newResults = questions.map((pair, i) => {
            const correctAnswer = pair[0] * pair[1];
            const userAnswer = Number(userAnswers[i]);
            const correct = userAnswer === correctAnswer;
            return {
                correct,
                correctAnswer,
                timeTaken: `${totalSeconds}s`,
            };
        });

        setResults(newResults);
        setSubmitted(true);
    };

    return (
        <div className="space-y-6">
            <button
                onClick={generateQuestions}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
            >
                New Set
            </button>

            {questions.length > 0 && (
                <>
                    {questions.map((pair, i) => (
                        <div
                            key={i}
                            className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                            <h2 className="font-semibold text-gray-700 mb-2">
                                Problem {i + 1}:
                            </h2>
                            <div className="text-lg font-mono mb-3">
                                {pair[0]} × {pair[1]}
                            </div>
                            <input
                                type="number"
                                value={userAnswers[i]}
                                onChange={(e) =>
                                    handleAnswerChange(i, e.target.value)
                                }
                                placeholder="Your answer"
                                className="w-full p-2 border rounded-md text-gray-800"
                                disabled={submitted}
                            />
                        </div>
                    ))}

                    <div className="flex justify-end mt-3">
                        <button
                            onClick={handleSubmit}
                            disabled={submitted}
                            className={`px-6 py-2 rounded-lg text-white font-medium ${
                                submitted
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700 shadow-md"
                            }`}
                        >
                            Submit
                        </button>
                    </div>
                </>
            )}

            {submitted && results.length > 0 && (
                <div className="mt-4 space-y-3">
                    {results.map((r, i) => (
                        <div
                            key={i}
                            className={`p-3 rounded-lg border ${
                                r.correct
                                    ? "border-green-400 bg-green-50"
                                    : "border-red-400 bg-red-50"
                            }`}
                        >
                            <p className="font-medium">
                                Q{i + 1}:{" "}
                                {r.correct ? "✅ Correct" : "❌ Wrong"}
                            </p>
                            {!r.correct && (
                                <p className="text-sm">
                                    Correct Answer: {r.correctAnswer}
                                </p>
                            )}
                            <p className="text-sm text-gray-600">
                                Time Taken: {r.timeTaken}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
