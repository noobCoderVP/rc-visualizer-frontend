"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import SectionCard from "../../components/SectionCard";
import ProblemEditor from "@/app/components/ProblemEditor";
import ProblemHistoryModal from "@/app/components/ProblemHistoryModal";

import { useProblemEditor } from "@/app/hooks/useProblemEditor";
import { useProblemHistory } from "@/app/hooks/useProblemHistory";

import { CP_DRY_RUN_EXPLAINER_PROMPT } from "@/app/prompts/cp/dryrun";
import { generateText } from "@/app/lib/llm";
import { ProblemHistoryItem } from "@/app/lib/problemHistoryStorage";
import { getActiveModelLabel } from "@/app/lib/getActiveModel";
import DryRunStepsList from "@/app/components/dryrun/DryRunStepsList";

/* ---------- Types ---------- */

type DryRunStep = {
    step: string;
    state: string;
    explanation: string;
};

type DryRunTestcase = {
    title: string;
    input: string;
    expected_output: string;
    dry_run_steps: DryRunStep[];
    final_explanation: string;
};

type CPDryRunResult = {
    problem_understanding: {
        restatement: string;
        inputs: string[];
        outputs: string[];
        key_points: string[];
    };
    testcases: DryRunTestcase[];
    insights_from_dry_runs: string[];
    common_mistakes: string[];
};

/* ---------- Animations ---------- */

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
};

export default function CPDryRunPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CPDryRunResult | null>(null);
    const [historyOpen, setHistoryOpen] = useState(false);

    const { problem, setProblem, preview, setPreview, resetEditor } =
        useProblemEditor();

    const { history, saveRun, deleteRun } = useProblemHistory("dryrun");

    async function handleSubmit() {
        const text = problem.trim();
        if (!text) {
            alert("Enter a problem.");
            return;
        }

        setLoading(true);

        try {
            const raw = await generateText({
                systemPrompt: CP_DRY_RUN_EXPLAINER_PROMPT,
                userPrompt: `Problem:\n${text}`,
            });

            const clean = raw.replace(/```json|```/g, "").trim();
            const jsonStart = clean.indexOf("{");
            const jsonEnd = clean.lastIndexOf("}");

            if (jsonStart === -1 || jsonEnd === -1) {
                throw new Error("Invalid JSON output");
            }

            const data: CPDryRunResult = JSON.parse(
                clean.slice(jsonStart, jsonEnd + 1)
            );

            setResult(data);

            const modelLabel = getActiveModelLabel();
            saveRun(text, data, modelLabel);
        } catch (err) {
            console.error(err);
            alert("Failed to generate dry run.");
        } finally {
            setLoading(false);
        }
    }

    function handleReset() {
        resetEditor();
        setResult(null);
    }

    return (
        <div className="mx-auto max-w-[1200px] p-4 space-y-12">
            {/* ================= INPUT ================= */}
            <ProblemEditor
                title="Enter CP Problem"
                problem={problem}
                onChange={setProblem}
                preview={preview}
                onTogglePreview={() => setPreview((p) => !p)}
                onOpenHistory={() => setHistoryOpen(true)}
            />

            <div className="flex justify-end gap-3">
                <button
                    onClick={handleReset}
                    className="px-5 py-2 rounded-lg border"
                >
                    Reset
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-2 rounded-lg bg-teal-600 text-white"
                >
                    {loading ? "Simulating..." : "Generate Dry Runs"}
                </button>
            </div>

            {/* ================= RESULTS ================= */}
            {result && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    transition={{ duration: 0.4 }}
                    className="space-y-10"
                >
                    {/* ===== Problem Understanding ===== */}
                    <SectionCard
                        title="Problem Understanding"
                        color="bg-blue-50"
                        border="border-blue-400"
                    >
                        <p className="mb-3">
                            {result.problem_understanding.restatement}
                        </p>

                        <ul className="list-disc pl-6 space-y-1">
                            {result.problem_understanding.key_points.map(
                                (k, i) => (
                                    <li key={i}>{k}</li>
                                )
                            )}
                        </ul>
                    </SectionCard>

                    {/* ===== Testcases ===== */}
                    {result.testcases.map((tc, idx) => (
                        <SectionCard
                            key={idx}
                            title={`Testcase ${idx + 1}: ${tc.title}`}
                            color="bg-slate-50"
                            border="border-slate-400"
                        >
                            <div className="space-y-6">
                                <div>
                                    <strong>Input</strong>
                                    <pre className="mt-2 bg-gray-900 text-gray-100 p-3 rounded">
                                        {tc.input}
                                    </pre>
                                </div>

                                <div>
                                    <strong>Expected Output</strong>
                                    <pre className="mt-2 bg-gray-900 text-gray-100 p-3 rounded">
                                        {tc.expected_output}
                                    </pre>
                                </div>

                                {/* ===== Dry Run Steps ===== */}
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <DryRunStepsList
                                            steps={tc.dry_run_steps}
                                        />
                                    </div>
                                </div>

                                <div className="pt-3">
                                    <strong>Final Explanation</strong>
                                    <p className="mt-1">
                                        {tc.final_explanation}
                                    </p>
                                </div>
                            </div>
                        </SectionCard>
                    ))}

                    {/* ===== Insights ===== */}
                    <SectionCard
                        title="Insights from Dry Runs"
                        color="bg-green-50"
                        border="border-green-400"
                    >
                        <ul className="list-disc pl-6">
                            {result.insights_from_dry_runs.map((i, idx) => (
                                <li key={idx}>{i}</li>
                            ))}
                        </ul>
                    </SectionCard>

                    {/* ===== Common Mistakes ===== */}
                    <SectionCard
                        title="Common Mistakes"
                        color="bg-red-50"
                        border="border-red-400"
                    >
                        <ul className="list-disc pl-6">
                            {result.common_mistakes.map((m, idx) => (
                                <li key={idx}>{m}</li>
                            ))}
                        </ul>
                    </SectionCard>
                </motion.div>
            )}

            {/* ================= HISTORY ================= */}
            {historyOpen && (
                <ProblemHistoryModal
                    items={history}
                    onSelect={(item: ProblemHistoryItem) => {
                        setProblem(item.problem);
                        setResult(item.payload as CPDryRunResult);
                        setHistoryOpen(false);
                    }}
                    onDelete={deleteRun}
                    onClose={() => setHistoryOpen(false)}
                />
            )}
        </div>
    );
}
