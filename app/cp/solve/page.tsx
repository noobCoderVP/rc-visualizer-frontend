/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import SectionCard from "../../components/SectionCard";
import { CP_PSEUDOCODE_EXPLORER_PROMPT } from "@/app/prompts/cp/solve";
import { getGeminiModel } from "../../utils/gemini";

const MAX_INPUT_WIDTH = 900;
const MAX_INPUT_HEIGHT = "70vh";

export default function CPSolvePage() {
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [problem, setProblem] = useState("");
    const [preview, setPreview] = useState(false);
    const [result, setResult] = useState<any>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const genAI = getGeminiModel();

    useEffect(() => setIsMounted(true), []);

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
                                    : "bg-emerald-600 hover:bg-emerald-700 shadow-md"
                            }`}
                    >
                        {loading ? "Thinking..." : "Explore Approaches"}
                    </button>
                </div>
            </div>

            {/* ================= RESULTS ================= */}
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
