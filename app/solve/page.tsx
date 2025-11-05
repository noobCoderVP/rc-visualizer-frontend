/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import SectionCard from "../components/SectionCard";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { RC_THOUGHT_SOLVER_PROMPT } from "../prompts/solve"; // ✅ Import your solve prompt

export default function SolvePage() {
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [passage, setPassage] = useState("");
    const [questions, setQuestions] = useState("");
    const [result, setResult] = useState<any>(null);
    const passageRef = useRef<HTMLTextAreaElement>(null);
    const questionsRef = useRef<HTMLTextAreaElement>(null);

    // Scroll refs
    const inputRef = useRef<HTMLDivElement | null>(null);
    const summaryRef = useRef<HTMLDivElement | null>(null);
    const questionsRefSection = useRef<HTMLDivElement | null>(null);

    // ✅ ENV detection
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    const genAI =
        !apiUrl && apiKey
            ? new GoogleGenerativeAI(apiKey).getGenerativeModel({
                  model: "gemini-2.0-flash",
              })
            : null;

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

    // ✅ Updated handleSubmit
    async function handleSubmit() {
        const p = passage.trim();
        const q = questions.trim();
        if (!p || !q) return alert("Please enter both passage and questions.");

        setLoading(true);
        setIsReadOnly(true);
        try {
            let data: any;

            // ---- Use backend if available ----
            if (apiUrl) {
                const res = await fetch(`${apiUrl}/solve`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ passage: p, questions: q }),
                });
                data = await res.json();
            }
            // ---- Use Gemini directly otherwise ----
            else if (genAI) {
                const prompt = `${RC_THOUGHT_SOLVER_PROMPT}\n\nPassage:\n${p}\n\nQuestions:\n${q}`;
                const response = await genAI.generateContent(prompt);
                const cleanText = response.response
                    .text()
                    .replace(/```json|```/g, "")
                    .trim();
                const jsonStart = cleanText.indexOf("{");
                const jsonEnd = cleanText.lastIndexOf("}");
                data = JSON.parse(cleanText.slice(jsonStart, jsonEnd + 1));
            } else {
                throw new Error(
                    "No backend URL or Gemini API key found. Please configure one."
                );
            }

            setResult(data);
            setTimeout(
                () =>
                    summaryRef.current?.scrollIntoView({ behavior: "smooth" }),
                300
            );
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
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (!isMounted)
        return <div className="p-4 text-gray-600 text-center">Loading...</div>;

    return (
        <div className="relative mx-auto max-w-[1300px] p-4 pb-24 space-y-8">
            {/* --- HEADER --- */}
            <h2 className="text-2xl font-semibold text-gray-800 text-center sm:text-left">
                RC Solver
            </h2>

            {/* --- INPUT SECTION --- */}
            <div
                ref={inputRef}
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
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
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
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
                <div ref={summaryRef} className="space-y-6 scroll-mt-24">
                    <SectionCard
                        title="Passage Summary"
                        color="bg-blue-50"
                        border="border-blue-400"
                    >
                        <p className="leading-relaxed text-gray-800">
                            {result.passage_summary}
                        </p>
                    </SectionCard>

                    <div
                        ref={questionsRefSection}
                        className="space-y-6 scroll-mt-24"
                    >
                        {result.questions_analysis?.map(
                            (q: any, index: number) => (
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
                                                        <strong>
                                                            {opt.option}{" "}
                                                        </strong>
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
                            )
                        )}
                    </div>
                </div>
            )}

            {/* --- FLOATING NAV BAR --- */}
            {result && (
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 border-t border-gray-300 flex justify-around items-center p-2 sm:hidden backdrop-blur-sm shadow-lg">
                    <button
                        onClick={() => scrollToSection(inputRef)}
                        className="text-sm text-gray-700 font-medium px-3 py-1 rounded-md hover:bg-gray-100"
                    >
                        Inputs
                    </button>
                    <button
                        onClick={() => scrollToSection(summaryRef)}
                        className="text-sm text-gray-700 font-medium px-3 py-1 rounded-md hover:bg-gray-100"
                    >
                        Summary
                    </button>
                    <button
                        onClick={() => scrollToSection(questionsRefSection)}
                        className="text-sm text-gray-700 font-medium px-3 py-1 rounded-md hover:bg-gray-100"
                    >
                        Questions
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
