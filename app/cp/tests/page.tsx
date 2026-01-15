"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import SectionCard from "../../components/SectionCard";
import ProblemEditor from "@/app/components/ProblemEditor";
import ProblemHistoryModal from "@/app/components/ProblemHistoryModal";

import { useProblemEditor } from "@/app/hooks/useProblemEditor";
import { useProblemHistory } from "@/app/hooks/useProblemHistory";

import { CP_TESTCASE_GENERATOR_PROMPT } from "@/app/prompts/cp/generate-test";
import { generateText } from "@/app/lib/llm";
import { ProblemHistoryItem } from "@/app/lib/problemHistoryStorage";
import { getActiveModelLabel } from "@/app/lib/getActiveModel";

/* ---------- Types ---------- */

type TestcaseItem = {
    title: string;
    input: string;
    expected_output: string;
    explanation: string;
};

type CPTestcaseResult = {
    testcases: TestcaseItem[];
};

/* ---------- Animations ---------- */

const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
};

export default function CPTestcasePage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CPTestcaseResult | null>(null);
    const [historyOpen, setHistoryOpen] = useState(false);

    const { problem, setProblem, preview, setPreview, resetEditor } =
        useProblemEditor();

    const { history, saveRun, deleteRun } = useProblemHistory("testcases");

    async function handleSubmit() {
        const text = problem.trim();
        if (!text) {
            alert("Please enter a problem statement.");
            return;
        }

        setLoading(true);

        try {
            const raw = await generateText({
                systemPrompt: CP_TESTCASE_GENERATOR_PROMPT,
                userPrompt: `Problem:\n${text}`,
            });

            const clean = raw.replace(/```json|```/g, "").trim();
            const jsonStart = clean.indexOf("{");
            const jsonEnd = clean.lastIndexOf("}");

            if (jsonStart === -1 || jsonEnd === -1) {
                throw new Error("Invalid JSON output");
            }

            const data: CPTestcaseResult = JSON.parse(
                clean.slice(jsonStart, jsonEnd + 1)
            );

            setResult(data);

            const modelLabel = getActiveModelLabel();
            saveRun(text, data, modelLabel);
        } catch (err) {
            console.error(err);
            alert("Failed to generate testcases.");
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
                    className="px-6 py-2 rounded-lg bg-orange-600 text-white"
                >
                    {loading ? "Generating..." : "Generate Testcases"}
                </button>
            </div>

            {/* ================= RESULTS ================= */}
            {result && (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                >
                    {result.testcases.map((tc, idx) => (
                        <SectionCard
                            key={idx}
                            title={`Testcase ${idx + 1}: ${tc.title}`}
                            color="bg-slate-50"
                            border="border-slate-400"
                        >
                            <div className="space-y-5">
                                <div>
                                    <strong>Input</strong>
                                    <pre className="mt-2 bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                                        {tc.input}
                                    </pre>
                                </div>

                                <div>
                                    <strong>Expected Output</strong>
                                    <pre className="mt-2 bg-gray-900 text-gray-100 p-3 rounded text-sm overflow-x-auto">
                                        {tc.expected_output}
                                    </pre>
                                </div>

                                <div>
                                    <strong>Why this output is correct</strong>
                                    <p className="mt-2">{tc.explanation}</p>
                                </div>
                            </div>
                        </SectionCard>
                    ))}
                </motion.div>
            )}

            {/* ================= HISTORY ================= */}
            {historyOpen && (
                <ProblemHistoryModal
                    items={history}
                    onSelect={(item: ProblemHistoryItem) => {
                        setProblem(item.problem);
                        setResult(item.payload as CPTestcaseResult);
                        setHistoryOpen(false);
                    }}
                    onDelete={deleteRun}
                    onClose={() => setHistoryOpen(false)}
                />
            )}
        </div>
    );
}
