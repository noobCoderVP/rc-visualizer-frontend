"use client";

import { useState } from "react";

import SectionCard from "../../components/SectionCard";
import DualCodeEditor from "../../components/DualCodeEditor";
import ProblemHistoryModal from "@/app/components/ProblemHistoryModal";

import { useProblemEditor } from "@/app/hooks/useProblemEditor";
import { useProblemHistory } from "@/app/hooks/useProblemHistory";

import { CP_CODE_OPTIMIZER_PROMPT } from "@/app/prompts/cp/optimize";
import { generateText } from "@/app/lib/llm";
import { ProblemHistoryItem } from "@/app/lib/problemHistoryStorage";
import { getActiveModelLabel } from "@/app/lib/getActiveModel";

/* ---------- Types ---------- */

type CPOptimizeResult = {
    assessment: string;
    optimized_code: string;
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

            // ✅ store per-run history with model info
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
            {/* INPUT */}
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

            {/* HISTORY MODAL */}
            {historyOpen && (
                <ProblemHistoryModal
                    items={history}
                    onSelect={(item: ProblemHistoryItem) => {
                        setProblem(item.problem);
                        setSolution(item.payload.solution);
                        setResult({
                            assessment: item.payload.assessment,
                            optimized_code: item.payload.optimized_code,
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
