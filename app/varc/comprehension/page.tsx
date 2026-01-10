/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import SectionCard from "../../components/SectionCard";
import { RC_QUIZ_PROMPT } from "../../prompts/rc"; // <-- Import your RC prompt
import { getGeminiModel } from "../../utils/gemini";

export default function RCQuizPage() {
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [rcData, setRcData] = useState<any | null>(null);
    const [selectedAnswers, setSelectedAnswers] = useState<{
        [key: number]: string;
    }>({});
    const [score, setScore] = useState<number>(0);
    const [showResults, setShowResults] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(false);

    const passageRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLDivElement | null>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const genAI = getGeminiModel();

    useEffect(() => setIsMounted(true), []);

    // ===========================
    // GENERATE RC QUIZ
    // ===========================
    async function handleGenerateRC() {
        setLoading(true);
        setIsReadOnly(true);
        setShowResults(false);
        setScore(0);
        setSelectedAnswers({});

        try {
            let data: any;

            if (apiUrl) {
                const res = await fetch(`${apiUrl}/rc-quiz`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt: RC_QUIZ_PROMPT }),
                });
                data = await res.json();
            } else if (genAI) {
                const response = await genAI.generateContent(RC_QUIZ_PROMPT);
                const cleanText = response.response
                    .text()
                    .replace(/```json|```/g, "")
                    .trim();
                data = JSON.parse(cleanText);
            } else {
                throw new Error("No API key or backend URL found.");
            }

            setRcData(data);
            setTimeout(
                () =>
                    passageRef.current?.scrollIntoView({ behavior: "smooth" }),
                300
            );
        } catch (err) {
            console.error("RC generation error:", err);
            alert("Something went wrong while generating the RC set.");
            setIsReadOnly(false);
        } finally {
            setLoading(false);
        }
    }

    function handleReset() {
        setRcData(null);
        setSelectedAnswers({});
        setScore(0);
        setShowResults(false);
        setIsReadOnly(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function handleSelect(qid: number, opt: string) {
        if (!showResults) {
            setSelectedAnswers((prev) => ({ ...prev, [qid]: opt }));
        }
    }

    function handleSubmit() {
        if (!rcData) return;

        let total = 0;
        rcData.questions.forEach((q: any) => {
            if (selectedAnswers[q.id] === q.correct_answer) total++;
        });

        setScore(total);
        setShowResults(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (!isMounted)
        return <div className="p-4 text-center text-gray-600">Loading…</div>;

    return (
        <div className="relative mx-auto max-w-[1100px] p-4 pb-24 space-y-8">
            {/* HEADER */}
            <h2 className="text-2xl font-semibold text-gray-800 text-center sm:text-left">
                CAT Reading Comprehension Generator
            </h2>

            {/* INPUT SECTION */}
            <div ref={inputRef} className="text-center space-y-4">
                <p className="text-gray-700 text-lg">
                    Generate a CAT-level Reading Comprehension passage with 4–6
                    analytical questions.
                </p>

                <button
                    onClick={handleGenerateRC}
                    disabled={loading || isReadOnly}
                    className={`px-6 py-3 rounded-lg text-white font-medium transition-all ${
                        loading || isReadOnly
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-purple-600 hover:bg-purple-700 shadow-md hover:shadow-lg"
                    }`}
                >
                    {loading ? "Generating RC..." : "Generate RC"}
                </button>

                <button
                    onClick={handleReset}
                    disabled={loading}
                    className={`ml-3 px-5 py-3 rounded-lg font-medium border transition-all ${
                        loading
                            ? "text-gray-400 border-gray-300 cursor-not-allowed"
                            : "text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                >
                    Reset
                </button>
            </div>

            {/* SCORE DISPLAY */}
            {showResults && (
                <div className="text-center mt-4">
                    <h3 className="text-2xl font-semibold text-gray-800">
                        Your Score: {score}/{rcData?.questions.length}
                    </h3>
                    <p className="text-gray-600">
                        {score === rcData?.questions.length
                            ? "Outstanding! Perfect score! 🌟"
                            : score >= rcData?.questions.length * 0.7
                            ? "Great work! Keep sharpening your RC skills 💪"
                            : "Keep practicing — RC improves with time and exposure! 📘"}
                    </p>
                </div>
            )}

            {/* PASSAGE + QUESTIONS */}
            {rcData && (
                <div ref={passageRef} className="space-y-6 scroll-mt-24">
                    {/* PASSAGE */}
                    <SectionCard
                        title="Reading Comprehension Passage"
                        color="bg-blue-50"
                        border="border-blue-400"
                    >
                        <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                            {rcData.passage}
                        </p>
                    </SectionCard>

                    {/* QUESTIONS */}
                    {rcData.questions.map((q: any, index: number) => {
                        const userAnswer = selectedAnswers[q.id];
                        const isCorrect = userAnswer === q.correct_answer;
                        const showFeedback = showResults && userAnswer;

                        return (
                            <SectionCard
                                key={index}
                                title={`Q${q.id}: Comprehension Question`}
                                color="bg-yellow-50"
                                border="border-yellow-400"
                            >
                                <p className="text-gray-800 font-medium mb-2">
                                    {q.question}
                                </p>

                                <ul className="space-y-2">
                                    {["a", "b", "c", "d"].map((optKey) => {
                                        const text = q.options[optKey];
                                        const isSelected =
                                            userAnswer === optKey;
                                        const isAnswer =
                                            q.correct_answer === optKey;

                                        let className =
                                            "border rounded-lg p-2 cursor-pointer transition-all";

                                        if (showFeedback) {
                                            if (isAnswer)
                                                className +=
                                                    " border-green-500 bg-green-50";
                                            else if (isSelected)
                                                className +=
                                                    " border-red-500 bg-red-50";
                                            else
                                                className += " border-gray-300";
                                        } else {
                                            className += isSelected
                                                ? " border-blue-500 bg-blue-50"
                                                : " border-gray-300 hover:bg-gray-100";
                                        }

                                        return (
                                            <li
                                                key={optKey}
                                                onClick={() =>
                                                    handleSelect(q.id, optKey)
                                                }
                                                className={className}
                                            >
                                                <strong>
                                                    {optKey.toUpperCase()}.
                                                </strong>{" "}
                                                {text}
                                            </li>
                                        );
                                    })}
                                </ul>

                                {showFeedback && (
                                    <div className="mt-3 text-sm text-gray-700">
                                        <p>
                                            <strong>
                                                {isCorrect
                                                    ? "✅ Correct!"
                                                    : `❌ Incorrect. Correct: ${q.correct_answer.toUpperCase()}`}
                                            </strong>
                                        </p>

                                        <ul className="list-disc pl-5 mt-2">
                                            <li>
                                                <strong>a:</strong>{" "}
                                                {q.explanations.a}
                                            </li>
                                            <li>
                                                <strong>b:</strong>{" "}
                                                {q.explanations.b}
                                            </li>
                                            <li>
                                                <strong>c:</strong>{" "}
                                                {q.explanations.c}
                                            </li>
                                            <li>
                                                <strong>d:</strong>{" "}
                                                {q.explanations.d}
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </SectionCard>
                        );
                    })}

                    {/* SUBMIT BUTTON */}
                    {!showResults && (
                        <div className="text-center mt-4">
                            <button
                                onClick={handleSubmit}
                                disabled={
                                    Object.keys(selectedAnswers).length <
                                    rcData.questions.length
                                }
                                className={`px-6 py-3 rounded-lg text-white font-medium transition-all ${
                                    Object.keys(selectedAnswers).length <
                                    rcData.questions.length
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                                }`}
                            >
                                Submit Answers
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* FLOATING NAV (Mobile) */}
            {rcData && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 border-t border-gray-300 flex justify-around p-2 sm:hidden backdrop-blur-md shadow-lg">
                    <button
                        onClick={() => scrollToSection(inputRef)}
                        className="text-sm text-gray-700 font-medium px-3 py-1 rounded-md hover:bg-gray-100"
                    >
                        Input
                    </button>
                    <button
                        onClick={() => scrollToSection(passageRef)}
                        className="text-sm text-gray-700 font-medium px-3 py-1 rounded-md hover:bg-gray-100"
                    >
                        RC
                    </button>
                    <button
                        onClick={() =>
                            window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                        className="text-sm text-gray-700 font-medium px-3 py-1 rounded-md hover:bg-gray-100"
                    >
                        ↑ Top
                    </button>
                </div>
            )}
        </div>
    );
}
