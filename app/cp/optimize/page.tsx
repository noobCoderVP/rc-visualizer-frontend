/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import SectionCard from "../../components/SectionCard";
import DualCodeEditor from "../../components/DualCodeEditor";
import { CP_CODE_OPTIMIZER_PROMPT } from "@/app/prompts/cp/optimize";
import { getGeminiModel } from "../../utils/gemini";

export default function CPOptimizePage() {
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [problem, setProblem] = useState("");
    const [solution, setSolution] = useState("");
    const [result, setResult] = useState<any>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const genAI = getGeminiModel();

    useEffect(() => setIsMounted(true), []);

    async function handleSubmit() {
        if (!solution.trim()) return alert("Please paste your solution code.");

        setLoading(true);

        try {
            let data: any;
            const combinedInput = `
Problem:
${problem}

Code:
${solution}
`;

            if (apiUrl) {
                const res = await fetch(`${apiUrl}/cp/optimize`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ input: combinedInput }),
                });
                data = await res.json();
            } else if (genAI) {
                const prompt = `${CP_CODE_OPTIMIZER_PROMPT}\n\n${combinedInput}`;
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
            console.error(err);
            alert("Failed to optimize code.");
        } finally {
            setLoading(false);
        }
    }

    function handleReset() {
        setProblem("");
        setSolution("");
        setResult(null);
    }

    if (!isMounted)
        return <div className="p-4 text-center">Loading editor…</div>;

    return (
        <div className="mx-auto max-w-[1400px] p-4 space-y-8">
            {/* INPUT */}
            <DualCodeEditor
                problem={problem}
                solution={solution}
                onProblemChange={setProblem}
                onSolutionChange={setSolution}
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
                                : "bg-rose-600 hover:bg-rose-700 shadow-md"
                        }`}
                >
                    {loading ? "Optimizing..." : "Optimize Code"}
                </button>
            </div>

            {/* RESULTS */}
            {result && (
                <div className="space-y-6">
                    <SectionCard
                        title="Assessment"
                        color="bg-blue-50"
                        border="border-blue-400"
                    >
                        <p>{result.assessment}</p>
                    </SectionCard>

                    <SectionCard
                        title="Optimized Code"
                        color="bg-slate-50"
                        border="border-slate-400"
                    >
                        <pre className="rounded-lg bg-gray-900 text-gray-100 p-4 text-sm overflow-x-auto">
                            {result.optimized_code}
                        </pre>
                    </SectionCard>
                </div>
            )}
        </div>
    );
}
