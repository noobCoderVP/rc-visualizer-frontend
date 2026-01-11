"use client";

import { useState } from "react";

import SectionCard from "../../components/SectionCard";
import ProblemEditor from "@/app/components/ProblemEditor";
import ProblemHistoryModal from "@/app/components/ProblemHistoryModal";

import { useProblemEditor } from "@/app/hooks/useProblemEditor";
import { useProblemHistory } from "@/app/hooks/useProblemHistory";

import { CP_PSEUDOCODE_EXPLORER_PROMPT } from "@/app/prompts/cp/solve";
import { generateText } from "@/app/lib/llm";
import { ProblemHistoryItem } from "@/app/lib/problemHistoryStorage";
import { getActiveModelLabel } from "@/app/lib/getActiveModel";

/* ---------- Types ---------- */

type CPSolveApproach = {
    idea: string;
    pseudocode: string;
    time_complexity: string;
    space_complexity: string;
    concepts_required: string[];
    works_or_fails: string;
};

type CPSolveResult = {
    approaches: CPSolveApproach[];
};

export default function CPSolvePage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CPSolveResult | null>(null);
    const [historyOpen, setHistoryOpen] = useState(false);

    const { problem, setProblem, preview, setPreview, resetEditor } =
        useProblemEditor();

    const { history, saveRun, deleteRun } = useProblemHistory("solve");

    async function handleSubmit() {
        const text = problem.trim();
        if (!text) {
            alert("Please enter a problem statement.");
            return;
        }

        setLoading(true);

        try {
            const raw = await generateText({
                systemPrompt: CP_PSEUDOCODE_EXPLORER_PROMPT,
                userPrompt: `Problem:\n${text}`,
            });

            const clean = raw.replace(/```json|```/g, "").trim();
            const jsonStart = clean.indexOf("{");
            const jsonEnd = clean.lastIndexOf("}");

            if (jsonStart === -1 || jsonEnd === -1) {
                throw new Error("Invalid JSON output");
            }

            const data: CPSolveResult = JSON.parse(
                clean.slice(jsonStart, jsonEnd + 1)
            );

            setResult(data);

            // ✅ Save run with model from llm_config
            const modelLabel = getActiveModelLabel();
            saveRun(text, data, modelLabel);
        } catch (err) {
            console.error("Error generating pseudocode:", err);
            alert("Failed to generate pseudocode approaches.");
        } finally {
            setLoading(false);
        }
    }

    function handleReset() {
        resetEditor();
        setResult(null);
    }

    return (
        <div className="mx-auto max-w-[1200px] p-4 space-y-10">
            {/* ================= INPUT ================= */}
            <ProblemEditor
                title="Enter CP Problem"
                problem={problem}
                onChange={setProblem}
                preview={preview}
                onTogglePreview={() => setPreview((p) => !p)}
                onOpenHistory={() => setHistoryOpen(true)}
            />

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

            {/* ================= RESULTS ================= */}
            {result?.approaches && (
                <div className="space-y-6">
                    {result.approaches.map((app, idx) => (
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
                                        {app.concepts_required.map((c, i) => (
                                            <li key={i}>{c}</li>
                                        ))}
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

            {/* ================= HISTORY MODAL ================= */}
            {historyOpen && (
                <ProblemHistoryModal
                    items={history}
                    onSelect={(item: ProblemHistoryItem) => {
                        setProblem(item.problem);
                        setResult(item.payload as CPSolveResult);
                        setHistoryOpen(false);
                    }}
                    onDelete={deleteRun}
                    onClose={() => setHistoryOpen(false)}
                />
            )}
        </div>
    );
}
