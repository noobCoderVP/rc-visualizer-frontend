"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import SectionCard from "../../components/SectionCard";
import DualCodeEditor from "../../components/DualCodeEditor";
import ProblemHistoryModal from "@/app/components/ProblemHistoryModal";

import { useProblemEditor } from "@/app/hooks/useProblemEditor";
import { useProblemHistory } from "@/app/hooks/useProblemHistory";

import { CP_CODE_OPTIMIZER_PROMPT } from "@/app/prompts/cp/optimize";
import { generateText } from "@/app/lib/llm";
import { ProblemHistoryItem } from "@/app/lib/problemHistoryStorage";
import { getActiveModelLabel } from "@/app/lib/getActiveModel";

/* ---------- Monaco (SSR-safe) ---------- */
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
});

/* ---------- Types ---------- */

type CPOptimizeResult = {
    assessment: string;
    original_complexity: {
        time: string;
        space: string;
    };
    bottlenecks: string[];
    optimization_strategy: string;
    optimized_code: string;
    optimized_complexity: {
        time: string;
        space: string;
    };
    concepts_used: string[];
    edge_cases: string[];
};


export default function CPOptimizePage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CPOptimizeResult | null>(null);
    const [historyOpen, setHistoryOpen] = useState(false);

    // Reuse common editor logic for problem text
    const { problem, setProblem, resetEditor } = useProblemEditor();
    const [solution, setSolution] = useState("");

    const { history, saveRun, deleteRun } = useProblemHistory("optimize");

    async function handleSubmit() {
        if (!solution.trim()) {
            alert("Please paste your solution code.");
            return;
        }

        setLoading(true);

        try {
            const combinedInput = `
Problem:
${problem}

Code:
${solution}
`;

            const raw = await generateText({
                systemPrompt: CP_CODE_OPTIMIZER_PROMPT,
                userPrompt: combinedInput,
            });

            const clean = raw.replace(/```json|```/g, "").trim();
            const jsonStart = clean.indexOf("{");
            const jsonEnd = clean.lastIndexOf("}");

            if (jsonStart === -1 || jsonEnd === -1) {
                throw new Error("Invalid JSON output");
            }

            const data: CPOptimizeResult = JSON.parse(
                clean.slice(jsonStart, jsonEnd + 1)
            );

            setResult(data);

            // store per-run history with model info
            const modelLabel = getActiveModelLabel();
            saveRun(problem, { ...data, solution }, modelLabel);
        } catch (err) {
            console.error("Error optimizing code:", err);
            alert("Failed to optimize code.");
        } finally {
            setLoading(false);
        }
    }

    function handleReset() {
        resetEditor();
        setSolution("");
        setResult(null);
    }

    return (
        <div className="mx-auto max-w-[1400px] p-4 space-y-8">
            {/* ================= INPUT ================= */}
            <DualCodeEditor
                problem={problem}
                solution={solution}
                onProblemChange={setProblem}
                onSolutionChange={setSolution}
                onOpenHistory={() => setHistoryOpen(true)}
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

            {/* ================= RESULTS ================= */}
            {result && (
                <div className="space-y-6">
                    {/* ===== Assessment ===== */}
                    <SectionCard
                        title="Initial Code Assessment"
                        color="bg-blue-50"
                        border="border-blue-400"
                    >
                        <p>{result.assessment}</p>
                    </SectionCard>

                    {/* ===== Original Complexity ===== */}
                    <SectionCard
                        title="Original Complexity Analysis"
                        color="bg-yellow-50"
                        border="border-yellow-400"
                    >
                        <ul className="list-disc pl-6 space-y-1">
                            <li>
                                Time Complexity:{" "}
                                {result.original_complexity.time}
                            </li>
                            <li>
                                Space Complexity:{" "}
                                {result.original_complexity.space}
                            </li>
                        </ul>
                    </SectionCard>

                    {/* ===== Bottlenecks ===== */}
                    <SectionCard
                        title="Bottlenecks Identified"
                        color="bg-red-50"
                        border="border-red-400"
                    >
                        <ul className="list-disc pl-6 space-y-1">
                            {result.bottlenecks.map((b, i) => (
                                <li key={i}>{b}</li>
                            ))}
                        </ul>
                    </SectionCard>

                    {/* ===== Optimization Strategy ===== */}
                    <SectionCard
                        title="Optimization Strategy"
                        color="bg-purple-50"
                        border="border-purple-400"
                    >
                        <p>{result.optimization_strategy}</p>
                    </SectionCard>

                    {/* ===== Optimized Code ===== */}
                    <SectionCard
                        title="Optimized Code (Contest Ready)"
                        color="bg-slate-50"
                        border="border-slate-400"
                    >
                        <MonacoEditor
                            value={result.optimized_code}
                            language="cpp"
                            theme="vs-dark"
                            height="800px"
                            options={{
                                readOnly: true,
                                fontSize: 14,
                                lineHeight: 22,
                                padding: { top: 12, bottom: 12 },

                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,

                                wordWrap: "on",
                                wrappingIndent: "indent",

                                automaticLayout: true,
                                renderWhitespace: "boundary",

                                cursorBlinking: "smooth",
                                cursorSmoothCaretAnimation: "on",

                                glyphMargin: false,
                                folding: true,
                                bracketPairColorization: {
                                    enabled: true,
                                },
                            }}
                        />
                    </SectionCard>

                    {/* ===== Optimized Complexity ===== */}
                    <SectionCard
                        title="Optimized Complexity"
                        color="bg-green-50"
                        border="border-green-400"
                    >
                        <ul className="list-disc pl-6 space-y-1">
                            <li>
                                Time Complexity:{" "}
                                {result.optimized_complexity.time}
                            </li>
                            <li>
                                Space Complexity:{" "}
                                {result.optimized_complexity.space}
                            </li>
                        </ul>
                    </SectionCard>

                    {/* ===== Concepts Used ===== */}
                    <SectionCard
                        title="Concepts Used"
                        color="bg-indigo-50"
                        border="border-indigo-400"
                    >
                        <ul className="list-disc pl-6 space-y-1">
                            {result.concepts_used.map((c, i) => (
                                <li key={i}>{c}</li>
                            ))}
                        </ul>
                    </SectionCard>

                    {/* ===== Edge Cases ===== */}
                    <SectionCard
                        title="Failure Modes and Edge Cases"
                        color="bg-pink-50"
                        border="border-pink-400"
                    >
                        <ul className="list-disc pl-6 space-y-1">
                            {result.edge_cases.map((e, i) => (
                                <li key={i}>{e}</li>
                            ))}
                        </ul>
                    </SectionCard>
                </div>
            )}

            {/* ================= HISTORY MODAL ================= */}
            {historyOpen && (
                <ProblemHistoryModal
                    items={history}
                    onSelect={(item: ProblemHistoryItem) => {
                        setProblem(item.problem);
                        setSolution(item.payload.solution);
                        setResult({
                            assessment: item.payload.assessment,
                            original_complexity: {
                                time: item.payload.original_complexity.time,
                                space: item.payload.original_complexity.space,
                            },
                            bottlenecks: item.payload.bottlenecks,
                            optimization_strategy:
                                item.payload.optimization_strategy,
                            optimized_code: item.payload.optimized_code,
                            optimized_complexity: {
                                time: item.payload.optimized_complexity.time,
                                space: item.payload.optimized_complexity.space,
                            },
                            concepts_used: item.payload.concepts_used,
                            edge_cases: item.payload.edge_cases,
                        });
                        setHistoryOpen(false);
                    }}
                    onDelete={deleteRun}
                    onClose={() => setHistoryOpen(false)}
                />
            )}
        </div>
    );
}
