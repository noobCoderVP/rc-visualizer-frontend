/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import SectionCard from "../components/SectionCard";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { VOCAB_QUIZ_PROMPT } from "../prompts/vocab"; // ✅ Import your quiz prompt

export default function QuizPage() {
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [quizData, setQuizData] = useState<any[]>([]);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState<{
        [key: number]: string;
    }>({});
    const [score, setScore] = useState<number>(0);
    const [showResults, setShowResults] = useState(false);

    const summaryRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLDivElement | null>(null);

    // ENV setup
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    const genAI =
        !apiUrl && apiKey
            ? new GoogleGenerativeAI(apiKey).getGenerativeModel({
                  model: "gemini-2.0-flash",
              })
            : null;

    useEffect(() => setIsMounted(true), []);

    // ✅ Generate quiz
    async function handleGenerateQuiz() {
        setLoading(true);
        setIsReadOnly(true);
        setScore(0);
        setShowResults(false);
        try {
            let data: any;

            // Use backend if exists
            if (apiUrl) {
                const res = await fetch(`${apiUrl}/vocab-quiz`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt: VOCAB_QUIZ_PROMPT }),
                });
                data = await res.json();
            }
            // Else use Gemini directly
            else if (genAI) {
                const response = await genAI.generateContent(VOCAB_QUIZ_PROMPT);
                const cleanText = response.response
                    .text()
                    .replace(/```json|```/g, "")
                    .trim();
                data = JSON.parse(cleanText);
            } else {
                throw new Error("No backend URL or Gemini API key found.");
            }

            setQuizData(data);
            setTimeout(
                () =>
                    summaryRef.current?.scrollIntoView({ behavior: "smooth" }),
                300
            );
        } catch (err) {
            console.error("Error generating quiz:", err);
            alert("Something went wrong while generating quiz.");
            setIsReadOnly(false);
        } finally {
            setLoading(false);
        }
    }

    // ✅ Reset everything
    function handleReset() {
        setQuizData([]);
        setSelectedAnswers({});
        setScore(0);
        setIsReadOnly(false);
        setShowResults(false);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // ✅ Track user selections
    function handleSelectAnswer(qid: number, option: string) {
        setSelectedAnswers((prev) => ({ ...prev, [qid]: option }));
    }

    // ✅ Submit quiz and calculate score
    function handleSubmitQuiz() {
        let total = 0;
        quizData.forEach((q) => {
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
        return <div className="p-4 text-gray-600 text-center">Loading...</div>;

    return (
        <div className="relative mx-auto max-w-[1100px] p-4 pb-24 space-y-8">
            {/* HEADER */}
            <h2 className="text-2xl font-semibold text-gray-800 text-center sm:text-left">
                CAT Vocabulary Quiz Generator
            </h2>

            {/* INPUT SECTION */}
            <div ref={inputRef} className="text-center space-y-4">
                <p className="text-gray-700 text-lg">
                    Generate a 10-question CAT-level vocabulary quiz on topics
                    like politics, history, finance, and society. Test yourself
                    and see your score instantly!
                </p>

                <button
                    onClick={handleGenerateQuiz}
                    disabled={loading}
                    className={`px-6 py-3 rounded-lg text-white font-medium transition-all ${
                        loading || isReadOnly
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg"
                    }`}
                >
                    {loading ? "Generating Quiz..." : "Generate Quiz"}
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
                <div className="text-center mt-6">
                    <h3 className="text-2xl font-semibold text-gray-800">
                        Your Score: {score}/10
                    </h3>
                    <p className="text-gray-600">
                        {score === 10
                            ? "Outstanding! Perfect score! 🌟"
                            : score >= 7
                            ? "Great job! Keep polishing your vocabulary 💪"
                            : "Keep practicing — you’ll improve fast! 📘"}
                    </p>
                </div>
            )}

            {/* QUIZ SECTION */}
            {quizData.length > 0 && (
                <div ref={summaryRef} className="space-y-6 scroll-mt-24">
                    {quizData.map((q: any, index: number) => {
                        const userAnswer = selectedAnswers[q.id];
                        const isCorrect = userAnswer === q.correct_answer;
                        const showFeedback = showResults && userAnswer;

                        return (
                            <SectionCard
                                key={index}
                                title={`Q${q.id}: Vocabulary Question`}
                                color="bg-yellow-50"
                                border="border-yellow-400"
                            >
                                <p className="text-gray-800 font-medium mb-2">
                                    {q.question}
                                </p>

                                <ul className="space-y-2">
                                    {["a", "b", "c", "d"].map((optKey) => {
                                        const optionText = q.options[optKey];
                                        const isSelected =
                                            userAnswer === optKey;
                                        const isAnswer =
                                            q.correct_answer === optKey;

                                        let optionClass =
                                            "border rounded-lg p-2 cursor-pointer";
                                        if (showFeedback) {
                                            if (isAnswer)
                                                optionClass +=
                                                    " border-green-500 bg-green-50";
                                            else if (isSelected && !isAnswer)
                                                optionClass +=
                                                    " border-red-400 bg-red-50";
                                            else
                                                optionClass +=
                                                    " border-gray-300";
                                        } else {
                                            optionClass += isSelected
                                                ? " border-blue-500 bg-blue-50"
                                                : " border-gray-300 hover:bg-gray-100";
                                        }

                                        return (
                                            <li
                                                key={optKey}
                                                onClick={() =>
                                                    !showResults &&
                                                    handleSelectAnswer(
                                                        q.id,
                                                        optKey
                                                    )
                                                }
                                                className={optionClass}
                                            >
                                                <strong>
                                                    {optKey.toUpperCase()}.
                                                </strong>{" "}
                                                {optionText}
                                            </li>
                                        );
                                    })}
                                </ul>

                                {/* Feedback after submission */}
                                {showFeedback && (
                                    <div className="mt-3 text-sm text-gray-700">
                                        <p>
                                            <strong>
                                                {isCorrect
                                                    ? "✅ Correct!"
                                                    : `❌ Incorrect. Correct Answer: ${q.correct_answer.toUpperCase()}`}
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
                        <div className="text-center mt-6">
                            <button
                                onClick={handleSubmitQuiz}
                                disabled={
                                    Object.keys(selectedAnswers).length <
                                    quizData.length
                                }
                                className={`px-6 py-3 rounded-lg text-white font-medium transition-all ${
                                    Object.keys(selectedAnswers).length <
                                    quizData.length
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                                }`}
                            >
                                Submit Quiz
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* FLOATING NAV BAR */}
            {quizData.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 border-t border-gray-300 flex justify-around items-center p-2 sm:hidden backdrop-blur-sm shadow-lg">
                    <button
                        onClick={() => scrollToSection(inputRef)}
                        className="text-sm text-gray-700 font-medium px-3 py-1 rounded-md hover:bg-gray-100"
                    >
                        Input
                    </button>
                    <button
                        onClick={() => scrollToSection(summaryRef)}
                        className="text-sm text-gray-700 font-medium px-3 py-1 rounded-md hover:bg-gray-100"
                    >
                        Quiz
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
