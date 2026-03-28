"use client";

import { useState } from "react";
import { Calculator, Hash, Sigma } from "lucide-react";
import AdditionPractice from "../../components/AdditionPractice";
import MultiplicationPractice from "../../components/MultiplicationPractice";

const MODE_CONTENT = {
    addition: {
        title: "Addition Sprints",
        description:
            "Warm up calculation speed, mental carrying, and clean arithmetic rhythm.",
        tips: [
            "Start with accuracy, then chase speed.",
            "Say the carry step mentally before typing.",
            "Reset when you feel pattern fatigue.",
        ],
    },
    multiplication: {
        title: "Multiplication Drills",
        description:
            "Build faster table recall and cleaner multi-step number handling.",
        tips: [
            "Track place value before the final answer.",
            "Use chunking for larger products.",
            "Review misses immediately to lock the pattern in.",
        ],
    },
} as const;

export default function MathPracticePage() {
    const [mode, setMode] = useState<"addition" | "multiplication">("addition");
    const activeContent = MODE_CONTENT[mode];

    return (
        <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
            <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
                    <div>
                        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.28em] text-amber-700">
                            <span className="inline-flex items-center gap-2">
                                <Calculator className="h-4 w-4" />
                                Quants Practice
                            </span>
                        </p>
                        <h1 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                            Math Practice
                        </h1>
                        <p className="mb-5 max-w-2xl text-base leading-8 text-slate-600">
                            Switch between focused arithmetic drills and keep
                            the current session simple enough to use every day.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {["addition", "multiplication"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() =>
                                        setMode(
                                            tab as
                                                | "addition"
                                                | "multiplication",
                                        )
                                    }
                                    className={`rounded-full px-4 py-2 font-medium transition-all ${
                                        mode === tab
                                            ? "bg-slate-900 text-white shadow-lg"
                                            : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                                    }`}
                                >
                                    <span className="inline-flex items-center gap-2">
                                        {tab === "addition" ? (
                                            <Sigma className="h-4 w-4" />
                                        ) : (
                                            <Hash className="h-4 w-4" />
                                        )}
                                        {tab === "addition"
                                            ? "Addition"
                                            : "Multiplication"}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-[1.75rem] border border-white/70 bg-gradient-to-br from-amber-50 to-orange-50 p-5">
                        <p className="mb-1 text-sm font-semibold text-amber-800">
                            {activeContent.title}
                        </p>
                        <p className="mb-4 text-sm leading-7 text-slate-700">
                            {activeContent.description}
                        </p>
                        <div className="space-y-2">
                            {activeContent.tips.map((tip) => (
                                <div
                                    key={tip}
                                    className="rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm"
                                >
                                    {tip}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Practice Workspace
                    </h2>
                    <p className="mb-0 text-sm text-slate-500">
                        Current mode: {activeContent.title}
                    </p>
                </div>

                <div className="glass-panel rounded-[1.75rem] p-4 sm:p-6">
                    {mode === "addition" ? (
                        <AdditionPractice />
                    ) : (
                        <MultiplicationPractice />
                    )}
                </div>
            </section>
        </div>
    );
}
