/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import SectionCard from "../../components/SectionCard";
import { CP_INTUITION_COACH_PROMPT } from "@/app/prompts/cp/hints";
import { generateText } from "@/app/lib/llm";

const MAX_INPUT_WIDTH = 1600;
const MAX_INPUT_HEIGHT = "70vh";

export default function CPHintsPage() {
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [problem, setProblem] = useState("");
    const [preview, setPreview] = useState(false);
    const [result, setResult] = useState<any>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => setIsMounted(true), []);

    async function handleSubmit() {
        const text = problem.trim();
        if (!text) return alert("Please enter a problem statement.");

        setLoading(true);

        try {
            let data: any;

            // 🔹 Prefer backend if configured
            if (apiUrl) {
                const res = await fetch(`${apiUrl}/cp/hints`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ problem: text }),
                });

                data = await res.json();
            }
            // 🔹 Otherwise use local LLM interface (provider-agnostic)
            else {
                const rawText = await generateText({
                    systemPrompt: CP_INTUITION_COACH_PROMPT,
                    userPrompt: `Problem:\n${text}`,
                });

                const cleanText = rawText.replace(/```json|```/g, "").trim();

                const jsonStart = cleanText.indexOf("{");
                const jsonEnd = cleanText.lastIndexOf("}");

                if (jsonStart === -1 || jsonEnd === -1) {
                    throw new Error("Invalid JSON output from model");
                }

                data = JSON.parse(cleanText.slice(jsonStart, jsonEnd + 1));
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

    if (!isMounted) {
        return (
            <div className="p-4 text-center text-gray-400">
                Loading editor...
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-[1200px] p-4 space-y-10">
            {/* ================= INPUT ================= */}
            <div className="mx-auto" style={{ maxWidth: MAX_INPUT_WIDTH }}>
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Enter CP Problem
                    </h2>

                    <button
                        onClick={() => setPreview((p) => !p)}
                        className="text-xs px-3 py-1 rounded-md bg-gray-800 text-gray-200 hover:bg-gray-700"
                    >
                        {preview ? "Edit" : "Preview"}
                    </button>
                </div>

                <div
                    className="rounded-xl shadow-sm overflow-hidden"
                    style={{
                        backgroundColor: "#0b1220",
                        maxHeight: MAX_INPUT_HEIGHT,
                    }}
                >
                    {!preview ? (
                        <textarea
                            ref={textareaRef}
                            value={problem}
                            onChange={(e) => setProblem(e.target.value)}
                            placeholder="Paste the full problem statement here (Markdown supported)…"
                            className="w-full resize-none p-4 focus:outline-none"
                            style={{
                                backgroundColor: "transparent",
                                color: "#e5e7eb",
                                fontFamily: "Georgia, serif",
                                fontSize: 15,
                                lineHeight: 1.7,
                                minHeight: 240,
                                maxHeight: MAX_INPUT_HEIGHT,
                                overflowY: "auto",
                            }}
                        />
                    ) : (
                        <div
                            className="p-4 overflow-y-auto"
                            style={{
                                color: "#e5e7eb",
                                lineHeight: 1.75,
                                maxHeight: MAX_INPUT_HEIGHT,
                            }}
                        >
                            <div className="mb-3 text-xs text-gray-400 italic">
                                Preview mode (read-only)
                            </div>

                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {problem || "_Nothing to preview_"}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={handleReset}
                        className="px-5 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                        Reset
                    </button>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`px-6 py-2 rounded-lg text-white font-medium
                            ${
                                loading
                                    ? "bg-gray-600 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700 shadow-md"
                            }`}
                    >
                        {loading ? "Thinking..." : "Get Hints"}
                    </button>
                </div>
            </div>

            {/* ================= RESULTS ================= */}
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
