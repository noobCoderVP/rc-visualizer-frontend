"use client";

import { useState } from "react";

import SectionCard from "../../components/SectionCard";
import ProblemEditor from "@/app/components/ProblemEditor";
import ProblemHistoryModal from "@/app/components/ProblemHistoryModal";

import { useProblemEditor } from "@/app/hooks/useProblemEditor";
import { useProblemHistory } from "@/app/hooks/useProblemHistory";

import { CP_INTUITION_COACH_PROMPT } from "@/app/prompts/cp/hints";
import { generateText } from "@/app/lib/llm";
import { ProblemHistoryItem } from "@/app/lib/problemHistoryStorage";
import { getActiveModelLabel } from "@/app/lib/getActiveModel";

/* ---------- Types ---------- */

type CPHintsResult = {
    restatement: string;
    constraints_insight: string;
    core_difficulty: string;
    observations: string[];
    algorithmic_direction: string[];
    common_traps: string[];
    guiding_questions: string[];
};

export default function CPHintsPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CPHintsResult | null>(null);
    const [historyOpen, setHistoryOpen] = useState(false);

    const { problem, setProblem, preview, setPreview, resetEditor } =
        useProblemEditor();

    const { history, saveRun, deleteRun } = useProblemHistory("hints");

    async function handleSubmit() {
        const text = problem.trim();
        if (!text) {
            alert("Enter a problem.");
            return;
        }

        setLoading(true);

        try {
            const raw = await generateText({
                systemPrompt: CP_INTUITION_COACH_PROMPT,
                userPrompt: `Problem:\n${text}`,
            });

            const clean = raw.replace(/```json|```/g, "").trim();
            const jsonStart = clean.indexOf("{");
            const jsonEnd = clean.lastIndexOf("}");

            if (jsonStart === -1 || jsonEnd === -1) {
                throw new Error("Invalid JSON output");
            }

            const data: CPHintsResult = JSON.parse(
                clean.slice(jsonStart, jsonEnd + 1)
            );

            setResult(data);

            // ✅ store model from llm_config
            const modelLabel = getActiveModelLabel();
            saveRun(text, data, modelLabel);
        } catch (err) {
            console.error(err);
            alert("Failed to generate hints.");
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
                    className="px-5 py-2 rounded-lg border"
                >
                    Reset
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-2 rounded-lg bg-indigo-600 text-white"
                >
                    {loading ? "Thinking..." : "Get Hints"}
                </button>
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
                            {result.observations.map((o, i) => (
                                <li key={i}>{o}</li>
                            ))}
                        </ul>
                    </SectionCard>

                    <SectionCard
                        title="Algorithmic Direction"
                        color="bg-pink-50"
                        border="border-pink-400"
                    >
                        <ul className="list-disc pl-6">
                            {result.algorithmic_direction.map((a, i) => (
                                <li key={i}>{a}</li>
                            ))}
                        </ul>
                    </SectionCard>

                    <SectionCard
                        title="Common Traps"
                        color="bg-red-50"
                        border="border-red-400"
                    >
                        <ul className="list-disc pl-6">
                            {result.common_traps.map((t, i) => (
                                <li key={i}>{t}</li>
                            ))}
                        </ul>
                    </SectionCard>

                    <SectionCard
                        title="Guiding Questions"
                        color="bg-indigo-50"
                        border="border-indigo-400"
                    >
                        <ul className="list-decimal pl-6">
                            {result.guiding_questions.map((q, i) => (
                                <li key={i}>{q}</li>
                            ))}
                        </ul>
                    </SectionCard>
                </div>
            )}

            {/* ================= HISTORY ================= */}
            {historyOpen && (
                <ProblemHistoryModal
                    items={history}
                    onSelect={(item: ProblemHistoryItem) => {
                        setProblem(item.problem);
                        setResult(item.payload as CPHintsResult);
                        setHistoryOpen(false);
                    }}
                    onDelete={deleteRun}
                    onClose={() => setHistoryOpen(false)}
                />
            )}
        </div>
    );
}
