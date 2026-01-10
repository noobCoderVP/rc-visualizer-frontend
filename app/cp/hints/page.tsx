/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import SectionCard from "../../components/SectionCard";
import { CP_INTUITION_COACH_PROMPT } from "@/app/prompts/cp/hints";
import { getGeminiModel } from "../../utils/gemini";

export default function CPHintsPage() {
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [problem, setProblem] = useState("");
    const [result, setResult] = useState<any>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const genAI = getGeminiModel();

    useEffect(() => setIsMounted(true), []);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [problem]);

    async function handleSubmit() {
        const text = problem.trim();
        if (!text) return alert("Please enter a problem statement.");

        setLoading(true);

        try {
            let data: any;

            if (apiUrl) {
                const res = await fetch(`${apiUrl}/cp/hints`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ problem: text }),
                });
                data = await res.json();
            } else if (genAI) {
                const prompt = `${CP_INTUITION_COACH_PROMPT}\n\nProblem:\n${text}`;
                const response = await genAI.generateContent(prompt);
                const cleanText = response.response
                    .text()
                    .replace(/```json|```/g, "")
                    .trim();
                const jsonStart = cleanText.indexOf("{");
                const jsonEnd = cleanText.lastIndexOf("}");
                data = JSON.parse(cleanText.slice(jsonStart, jsonEnd + 1));
            } else {
                throw new Error("No backend or Gemini configuration found.");
            }

            setResult(data);
        } catch (err) {
            console.error("Error generating hints:", err);
            alert("Failed to generate hints.");
        } finally {
            setLoading(false);
        }
    }

    function handleReset() {
        setProblem("");
        setResult(null);
    }

    if (!isMounted)
        return (
            <div className="p-4 text-center text-gray-600">
                Loading editor...
            </div>
        );

    return (
        <div className="mx-auto max-w-[1200px] p-4 space-y-8">
            {/* INPUT */}
            <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-700">
                    Enter CP Problem
                </h2>

                <textarea
                    ref={textareaRef}
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="Paste the full problem statement here..."
                    className="w-full rounded-xl p-4 resize-none focus:outline-none shadow-sm bg-white"
                />

                <div className="flex justify-end gap-3">
                    <button
                        onClick={handleReset}
                        className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                        Reset
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`px-6 py-2 rounded-lg text-white font-medium
                            ${
                                loading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700 shadow-md"
                            }`}
                    >
                        {loading ? "Thinking..." : "Get Hints"}
                    </button>
                </div>
            </div>

            {/* RESULTS */}
            {result && (
                <div className="space-y-5">
                    <SectionCard
                        title="Restatement"
                        color="bg-blue-50"
                        border="border-blue-400"
                    >
                        <p>{result.restatement}</p>
                    </SectionCard>

                    <SectionCard
                        title="Constraints Insight"
                        color="bg-green-50"
                        border="border-green-400"
                    >
                        <p>{result.constraints_insight}</p>
                    </SectionCard>

                    <SectionCard
                        title="Core Difficulty"
                        color="bg-yellow-50"
                        border="border-yellow-400"
                    >
                        <p>{result.core_difficulty}</p>
                    </SectionCard>

                    <SectionCard
                        title="Key Observations"
                        color="bg-purple-50"
                        border="border-purple-400"
                    >
                        <ul className="list-disc pl-6">
                            {result.observations?.map(
                                (o: string, i: number) => (
                                    <li key={i}>{o}</li>
                                )
                            )}
                        </ul>
                    </SectionCard>

                    <SectionCard
                        title="Algorithmic Direction"
                        color="bg-pink-50"
                        border="border-pink-400"
                    >
                        <ul className="list-disc pl-6">
                            {result.algorithmic_direction?.map(
                                (a: string, i: number) => (
                                    <li key={i}>{a}</li>
                                )
                            )}
                        </ul>
                    </SectionCard>

                    <SectionCard
                        title="Common Traps"
                        color="bg-red-50"
                        border="border-red-400"
                    >
                        <ul className="list-disc pl-6">
                            {result.common_traps?.map(
                                (t: string, i: number) => (
                                    <li key={i}>{t}</li>
                                )
                            )}
                        </ul>
                    </SectionCard>

                    <SectionCard
                        title="Guiding Questions"
                        color="bg-indigo-50"
                        border="border-indigo-400"
                    >
                        <ul className="list-decimal pl-6">
                            {result.guiding_questions?.map(
                                (q: string, i: number) => (
                                    <li key={i}>{q}</li>
                                )
                            )}
                        </ul>
                    </SectionCard>
                </div>
            )}
        </div>
    );
}
