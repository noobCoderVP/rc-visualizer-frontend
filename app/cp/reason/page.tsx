"use client";

import { useState } from "react";

import SectionCard from "../../components/SectionCard";
import DualCodeEditor from "../../components/DualCodeEditor";
import ProblemHistoryModal from "@/app/components/ProblemHistoryModal";
import LatexRenderer from "@/app/components/LatexRenderer";

import { useProblemEditor } from "@/app/hooks/useProblemEditor";
import { useProblemHistory } from "@/app/hooks/useProblemHistory";

import { CP_MATH_REASONING_PROMPT } from "@/app/prompts/cp/reason";
import { generateText } from "@/app/lib/llm";
import { ProblemHistoryItem } from "@/app/lib/problemHistoryStorage";
import { getActiveModelLabel } from "@/app/lib/getActiveModel";

/* ---------- Types ---------- */

type CPReasoningResult = {
    overview: string;
    mathematical_model: string;
    invariants: string[];
    correctness_proof: string;
    complexity_analysis: string;
    failure_conditions: string[];
    full_latex: string;
};

type CPReasoningPayload = CPReasoningResult & {
    solution?: string;
};

export default function CPReasonPage() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<CPReasoningResult | null>(null);
    const [historyOpen, setHistoryOpen] = useState(false);

    const { problem, setProblem, resetEditor } = useProblemEditor();
    const [solution, setSolution] = useState("");

    const { history, saveRun, deleteRun } = useProblemHistory("reason");

    async function handleSubmit() {
        if (!problem.trim()) {
            alert("Please enter the problem statement.");
            return;
        }

        setLoading(true);

        try {
            const combinedInput = `
Problem:
${problem}

Code (optional):
${solution || "Not provided"}
`;

            const raw = await generateText({
                systemPrompt: CP_MATH_REASONING_PROMPT,
                userPrompt: combinedInput,
            });

            const clean = raw.replace(/```json|```/g, "").trim();
            const start = clean.indexOf("{");
            const end = clean.lastIndexOf("}");

            if (start === -1 || end === -1) {
                throw new Error("Invalid JSON output");
            }

            const data: CPReasoningResult = JSON.parse(
                clean.slice(start, end + 1),
            );

            setResult(data);

            const payload: CPReasoningPayload = {
                ...data,
                solution,
            };

            const modelLabel = getActiveModelLabel();
            saveRun(problem, payload, modelLabel);
        } catch (err) {
            console.error("Reasoning error:", err);
            alert("Failed to generate reasoning.");
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
                solutionOptional
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
                                : "bg-indigo-600 hover:bg-indigo-700 shadow-md"
                        }`}
                >
                    {loading ? "Reasoning..." : "Explain Why"}
                </button>
            </div>

            {/* ================= RESULTS ================= */}
            {result && (
                <div className="space-y-6">
                    <SectionCard
                        title="Conceptual Overview"
                        color="bg-sky-50"
                        border="border-sky-400"
                    >
                        <p>{result.overview}</p>
                    </SectionCard>

                    <SectionCard
                        title="Mathematical Model"
                        color="bg-violet-50"
                        border="border-violet-400"
                    >
                        <LatexRenderer latex={result.mathematical_model} />
                    </SectionCard>

                    <SectionCard
                        title="Key Invariants"
                        color="bg-amber-50"
                        border="border-amber-400"
                    >
                        <ul className="list-disc pl-6">
                            {result.invariants.map((x, i) => (
                                <li key={i}><LatexRenderer latex={x} /></li>
                            ))}
                        </ul>
                    </SectionCard>

                    <SectionCard
                        title="Proof of Correctness"
                        color="bg-emerald-50"
                        border="border-emerald-400"
                    >
                        <LatexRenderer latex={result.correctness_proof} />
                    </SectionCard>

                    <SectionCard
                        title="Complexity Analysis"
                        color="bg-indigo-50"
                        border="border-indigo-400"
                    >
                        <LatexRenderer latex={result.complexity_analysis} />
                    </SectionCard>

                    <SectionCard
                        title="Failure Conditions / Edge Cases"
                        color="bg-rose-50"
                        border="border-rose-400"
                    >
                        <ul className="list-disc pl-6">
                            {result.failure_conditions.map((x, i) => (
                                <li key={i}>{x}</li>
                            ))}
                        </ul>
                    </SectionCard>

                    <SectionCard
                        title="Mathematical Explanation (Rendered LaTeX)"
                        color="bg-slate-50"
                        border="border-slate-400"
                    >
                        <LatexRenderer latex={result.full_latex} />
                    </SectionCard>
                </div>
            )}

            {/* ================= HISTORY ================= */}
            {historyOpen && (
                <ProblemHistoryModal
                    items={history}
                    onSelect={(item: ProblemHistoryItem) => {
                        const payload = item.payload as CPReasoningPayload;

                        setProblem(item.problem);
                        setSolution(payload.solution || "");
                        setResult({
                            overview: payload.overview,
                            mathematical_model: payload.mathematical_model,
                            invariants: payload.invariants,
                            correctness_proof: payload.correctness_proof,
                            complexity_analysis: payload.complexity_analysis,
                            failure_conditions: payload.failure_conditions,
                            full_latex: payload.full_latex,
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
