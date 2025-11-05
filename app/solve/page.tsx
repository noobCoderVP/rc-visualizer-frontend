/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import SectionCard from "../components/SectionCard";

export default function SolvePage() {
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [passage, setPassage] = useState("");
    const [questions, setQuestions] = useState("");
    const [result, setResult] = useState<any>(null);
    const passageRef = useRef<HTMLTextAreaElement>(null);
    const questionsRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => setIsMounted(true), []);

    // ✅ Auto-resize textareas
    useEffect(() => {
        if (passageRef.current) {
            passageRef.current.style.height = "auto";
            passageRef.current.style.height = `${passageRef.current.scrollHeight}px`;
        }
    }, [passage]);
    useEffect(() => {
        if (questionsRef.current) {
            questionsRef.current.style.height = "auto";
            questionsRef.current.style.height = `${questionsRef.current.scrollHeight}px`;
        }
    }, [questions]);

    async function handleSubmit() {
        const p = passage.trim();
        const q = questions.trim();
        if (!p || !q) return alert("Please enter both passage and questions.");

        setLoading(true);
        setIsReadOnly(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/solve`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ passage: p, questions: q }),
                }
            );

            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error("Error solving:", err);
            alert("Something went wrong while solving. Please try again.");
            setIsReadOnly(false);
        } finally {
            setLoading(false);
        }
    }

    function handleReset() {
        setPassage("");
        setQuestions("");
        setResult(null);
        setIsReadOnly(false);
    }

    if (!isMounted)
        return <div className="p-4 text-gray-600 text-center">Loading...</div>;

    return (
        <div className="mx-auto max-w-[1300px] p-4 space-y-8">
            <h2 className="text-2xl font-semibold text-gray-800">RC Solver</h2>

            {/* --- INPUT SECTION --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                        Passage
                    </h3>
                    <textarea
                        ref={passageRef}
                        value={passage}
                        onChange={(e) => setPassage(e.target.value)}
                        readOnly={isReadOnly}
                        placeholder="Paste or type your passage here..."
                        className={`w-full rounded-xl p-4 text-gray-800 resize-none focus:outline-none shadow-sm transition-all
                            ${
                                isReadOnly
                                    ? "bg-gray-50 cursor-not-allowed shadow-md"
                                    : "bg-white focus:shadow-lg"
                            }`}
                    />
                </div>

                <div>
                    <h3 className="text-lg font-semibold text-gray-700">
                        Questions
                    </h3>
                    <textarea
                        ref={questionsRef}
                        value={questions}
                        onChange={(e) => setQuestions(e.target.value)}
                        readOnly={isReadOnly}
                        placeholder="Paste questions here (plain text format)..."
                        className={`w-full rounded-xl p-4 text-gray-800 resize-none focus:outline-none shadow-sm transition-all
                            ${
                                isReadOnly
                                    ? "bg-gray-50 cursor-not-allowed shadow-md"
                                    : "bg-white focus:shadow-lg"
                            }`}
                    />
                </div>
            </div>

            {/* --- BUTTONS --- */}
            <div className="flex justify-end gap-3 flex-wrap">
                <button
                    onClick={handleReset}
                    disabled={loading}
                    className={`px-5 py-2 rounded-lg font-medium border transition-all 
                        ${
                            loading
                                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                : "text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                >
                    Reset
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`px-6 py-2 rounded-lg text-white font-medium transition-all 
                        ${
                            loading || isReadOnly
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                        }`}
                >
                    {loading ? "Solving..." : "Solve Questions"}
                </button>
            </div>

            {/* --- RESULT SECTION --- */}
            {result && (
                <div className="space-y-6">
                    <SectionCard
                        title="Passage Summary"
                        color="bg-blue-50"
                        border="border-blue-400"
                    >
                        <p className="leading-relaxed text-gray-800">
                            {result.passage_summary}
                        </p>
                    </SectionCard>

                    {result.questions_analysis?.map((q: any, index: number) => (
                        <SectionCard
                            key={index}
                            title={`Q${index + 1}: ${q.question_type}`}
                            color="bg-emerald-50"
                            border="border-emerald-400"
                        >
                            <p className="text-gray-800 mb-2">
                                <strong>Question:</strong> {q.question}
                            </p>
                            <p className="text-gray-700 mb-2">
                                <strong>Clue Location:</strong>{" "}
                                {q.clue_location}
                            </p>

                            <div className="my-3">
                                <strong>Reasoning Steps:</strong>
                                <ul className="list-decimal pl-6 text-gray-800">
                                    {q.reasoning_steps?.map(
                                        (step: string, i: number) => (
                                            <li key={i}>{step}</li>
                                        )
                                    )}
                                </ul>
                            </div>

                            <div className="my-3">
                                <strong>Option Analysis:</strong>
                                <ul className="list-disc pl-6 text-gray-800">
                                    {q.option_analysis?.map(
                                        (opt: any, i: number) => (
                                            <li key={i}>
                                                <strong>{opt.option} </strong>
                                                {opt.analysis}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>

                            <p className="mt-2">
                                <strong>Final Answer:</strong>{" "}
                                <span className="text-blue-700 font-semibold">
                                    {q.final_answer.toUpperCase()}
                                </span>
                            </p>
                            <p>
                                <strong>Cognitive Skill:</strong>{" "}
                                {q.cognitive_skill}
                            </p>
                        </SectionCard>
                    ))}
                </div>
            )}
        </div>
    );
}
