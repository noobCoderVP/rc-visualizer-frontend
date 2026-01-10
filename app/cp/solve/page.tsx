/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import SectionCard from "../../components/SectionCard";
import { CP_PSEUDOCODE_EXPLORER_PROMPT } from "@/app/prompts/cp/solve";
import { getGeminiModel } from "../../utils/gemini";

export default function CPSolvePage() {
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
                const res = await fetch(`${apiUrl}/cp/pseudocode`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ problem: text }),
                });
                data = await res.json();
            } else if (genAI) {
                const prompt = `${CP_PSEUDOCODE_EXPLORER_PROMPT}\n\nProblem:\n${text}`;
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
            console.error("Error generating pseudocode:", err);
            alert("Failed to generate pseudocode approaches.");
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
                                    : "bg-emerald-600 hover:bg-emerald-700 shadow-md"
                            }`}
                    >
                        {loading ? "Thinking..." : "Explore Approaches"}
                    </button>
                </div>
            </div>

            {/* RESULTS */}
            {result?.approaches && (
                <div className="space-y-6">
                    {result.approaches.map((app: any, idx: number) => (
                        <SectionCard
                            key={idx}
                            title={`Approach ${idx + 1}`}
                            color="bg-slate-50"
                            border="border-slate-400"
                        >
                            <div className="space-y-4">
                                <p>
                                    <strong>Idea:</strong> {app.idea}
                                </p>

                                <div>
                                    <strong>Pseudocode:</strong>
                                    <pre className="mt-2 rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto">
                                        {app.pseudocode}
                                    </pre>
                                </div>

                                <p>
                                    <strong>Time Complexity:</strong>{" "}
                                    {app.time_complexity}
                                </p>

                                <p>
                                    <strong>Space Complexity:</strong>{" "}
                                    {app.space_complexity}
                                </p>

                                <div>
                                    <strong>Concepts Required:</strong>
                                    <ul className="list-disc pl-6 mt-1">
                                        {app.concepts_required?.map(
                                            (c: string, i: number) => (
                                                <li key={i}>{c}</li>
                                            )
                                        )}
                                    </ul>
                                </div>

                                <p>
                                    <strong>
                                        Why / When it works or fails:
                                    </strong>{" "}
                                    {app.works_or_fails}
                                </p>
                            </div>
                        </SectionCard>
                    ))}
                </div>
            )}
        </div>
    );
}
