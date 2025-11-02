"use client";

import { useState } from "react";

export default function AdditionPractice() {
    const [questions, setQuestions] = useState<number[][]>([]);
    const [userAnswers, setUserAnswers] = useState<string[]>([]);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [results, setResults] = useState<
        { correct: boolean; correctAnswer: number; timeTaken: string }[]
    >([]);
    const [submitted, setSubmitted] = useState(false);

    const generateQuestions = () => {
        const nums = Array.from(
            { length: 10 },
            () => Math.floor(Math.random() * 90) + 10
        );
        setQuestions([nums]);
        setUserAnswers([""]);
        setResults([]);
        setSubmitted(false);
        setStartTime(Date.now());
    };

    const handleAnswerChange = (value: string) => {
        setUserAnswers([value]);
    };

    const handleSubmit = () => {
        if (!startTime || questions.length === 0) return;
        const endTime = Date.now();
        const totalSeconds = ((endTime - startTime) / 1000).toFixed(2);

        const correctAnswer = questions[0].reduce((a, b) => a + b, 0);
        const userAnswer = Number(userAnswers[0]);
        const correct = userAnswer === correctAnswer;

        setResults([{ correct, correctAnswer, timeTaken: `${totalSeconds}s` }]);
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
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h2 className="font-semibold text-gray-700 mb-2">
                        Add the following numbers:
                    </h2>
                    <div className="text-lg font-mono mb-3">
                        {questions[0].join(" + ")}
                    </div>
                    <input
                        type="number"
                        value={userAnswers[0]}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        placeholder="Your answer"
                        className="w-full p-2 border rounded-md text-gray-800"
                        disabled={submitted}
                    />
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
                </div>
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
