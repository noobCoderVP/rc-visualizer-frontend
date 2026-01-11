/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { CAT_TIMED_SOLVER_PROMPT } from "../../prompts/trainer";
import { generateText } from "@/app/lib/llm";

export default function TimedSolverUI() {
    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        // auto-grow textarea
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [question]);

    const stepBg = [
        "bg-red-50 border-red-200",
        "bg-yellow-50 border-yellow-200",
        "bg-green-50 border-green-200",
        "bg-blue-50 border-blue-200",
        "bg-red-50 border-red-200",
    ];

    async function handleGenerate() {
        setError(null);
        const trimmed = question.trim();
        if (!trimmed) {
            return setError("Please paste a question first.");
        }

        setLoading(true);
        setResult(null);

        try {
            let data: any;

            // 🔹 Prefer backend if configured
            if (apiUrl) {
                const res = await fetch(
                    `${apiUrl.replace(/\/+$/, "")}/timed-solver`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ question: trimmed }),
                    }
                );

                if (!res.ok) {
                    throw new Error(`Backend error ${res.status}`);
                }

                data = await res.json();
            }
            // 🔹 Otherwise use local LLM interface (provider-agnostic)
            else {
                const rawText = await generateText({
                    systemPrompt: CAT_TIMED_SOLVER_PROMPT,
                    userPrompt: `Passage:\n${trimmed}\n\nProvide the output in JSON format only.`,
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
        } catch (err: any) {
            console.error(err);
            setError(err.message || String(err));
        } finally {
            setLoading(false);
        }
    }

    function handleCopy() {
        if (!result) return;
        navigator.clipboard
            .writeText(JSON.stringify(result, null, 2))
            .catch(() => setError("Unable to copy to clipboard."));
    }

    function downloadJson() {
        if (!result) return;
        const blob = new Blob([JSON.stringify(result, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "timed-solver-result.json";
        a.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="p-4 max-w-3xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
                CAT Timed Solver
            </h2>
            <p className="text-sm text-gray-600 mb-4">
                Paste a single question (with options) and get a stepwise timed
                solution plan optimized for CAT.
            </p>

            <div className="mb-3">
                <label className="sr-only">Question</label>
                <textarea
                    ref={textareaRef}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={`Paste question here. Example:\n\nA tank has 20 L of a mixture with 40% acid. ...`}
                    className="w-full min-h-[120px] md:min-h-40 rounded-lg p-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-200 resize-none text-sm"
                />
            </div>

            {error && <div className="text-sm text-red-600 mb-3">{error}</div>}

            <div className="flex gap-2 justify-end mb-6">
                <button
                    onClick={() => {
                        setQuestion("");
                        setResult(null);
                        setError(null);
                    }}
                    className="px-4 py-2 rounded-lg border text-sm text-gray-700 bg-white hover:bg-gray-50"
                >
                    Reset
                </button>

                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg text-sm text-white ${
                        loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
                >
                    {loading ? "Generating..." : "Generate Plan"}
                </button>
            </div>

            {/* Result area */}
            {result && (
                <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h3 className="text-md font-medium text-gray-800">
                                Plan
                            </h3>
                            <p className="text-sm text-gray-600">
                                Concept:{" "}
                                <span className="font-semibold">
                                    {result.concept}
                                </span>
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCopy}
                                className="px-3 py-1.5 text-sm rounded border"
                            >
                                Copy JSON
                            </button>
                            <button
                                onClick={downloadJson}
                                className="px-3 py-1.5 text-sm rounded border"
                            >
                                Download
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {Array.isArray(result.Steps) &&
                            result.Steps.slice(0, 5).map(
                                (s: any, idx: number) => (
                                    <div
                                        key={idx}
                                        className={`p-3 rounded-lg border ${
                                            stepBg[idx % stepBg.length]
                                        } shadow-sm`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <div className="text-sm text-gray-600">
                                                    Step {idx + 1}
                                                </div>
                                                <div className="mt-1 text-base font-medium text-gray-800">
                                                    {s.step}
                                                </div>
                                            </div>
                                            <div className="ml-4 shrink-0">
                                                <div className="text-sm font-semibold text-gray-700">
                                                    {s.time}s
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Approx
                                                </div>
                                            </div>
                                        </div>

                                        {s.note && (
                                            <div className="mt-2 text-xs text-gray-600">
                                                {s.note}
                                            </div>
                                        )}
                                    </div>
                                )
                            )}
                    </div>

                    {result.suggestions && (
                        <div className="p-3 rounded-lg border border-dashed border-gray-200 bg-white">
                            <strong className="block text-sm text-gray-800">
                                Tip
                            </strong>
                            <p className="text-sm text-gray-600 mt-1">
                                {result.suggestions}
                            </p>
                        </div>
                    )}

                    <div className="p-3 rounded-lg border bg-gray-50 text-sm text-gray-700">
                        <div className="flex items-center justify-between">
                            <div>Total time</div>
                            <div className="font-semibold">
                                {result.time_required
                                    ? result.time_required + "s"
                                    : "-"}
                            </div>
                        </div>
                    </div>

                    <details className="text-sm">
                        <summary className="cursor-pointer py-2">
                            View raw JSON
                        </summary>
                        <pre className="whitespace-pre-wrap bg-white p-3 rounded border text-xs max-h-60 overflow-auto">
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </details>
                </div>
            )}

            {!result && (
                <div className="mt-6 text-sm text-gray-500">
                    Tip: For best results include the options with the question.
                    Configure a backend via <code>NEXT_PUBLIC_API_URL</code> or
                    select a model in the header.
                </div>
            )}

            <div className="mt-6 text-xs text-gray-400">
                Mobile-first UI • Tailwind-ready • Steps cycle colors: red →
                yellow → green → blue → red
            </div>
        </div>
    );
}
