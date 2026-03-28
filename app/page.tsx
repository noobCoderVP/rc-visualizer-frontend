"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    ArrowRight,
    Binary,
    BookOpenCheck,
    Brain,
    BrainCircuit,
    Calculator,
    CheckCircle2,
    Sparkles,
} from "lucide-react";

const QUICK_STARTS = [
    {
        title: "RC Analyze",
        href: "/varc/analyze",
        description:
            "Break a passage into title, idea flow, vocabulary, transitions, and purpose.",
        accent: "from-sky-500 to-cyan-500",
        icon: Brain,
    },
    {
        title: "RC Solve",
        href: "/varc/solve",
        description:
            "Paste a passage with questions and get structured option-wise reasoning.",
        accent: "from-emerald-500 to-teal-500",
        icon: BookOpenCheck,
    },
    {
        title: "CP Reason",
        href: "/cp/reason",
        description:
            "Generate mathematical models, invariants, proofs, and complexity explanations.",
        accent: "from-violet-500 to-indigo-500",
        icon: Binary,
    },
    {
        title: "Math Practice",
        href: "/qa/math",
        description:
            "Warm up with arithmetic drills before longer test sessions.",
        accent: "from-amber-500 to-orange-500",
        icon: Calculator,
    },
];

const WORKFLOWS = [
    "Pick the model from the top-right selector before a long run.",
    "Use Analyze first when you want passage structure before solving questions.",
    "Use CP Reason when the answer needs proofs or formula-heavy output.",
];

export default function HomePage() {
    return (
        <main className="space-y-10 py-6">
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="glass-panel overflow-hidden rounded-[2rem] p-6 sm:p-8"
            >
                <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-center">
                    <div>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">
                            CAT + CP Workspace
                        </p>
                        <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                            Better structure for long passages, proofs, and
                            AI-assisted practice.
                        </h1>
                        <p className="mb-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                            Passage Visualizer works best as a launchpad. Start
                            from the right workspace, keep your model selection
                            visible, and move from reading to solving without
                            losing context.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/varc/analyze"
                                className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
                            >
                                <Brain className="h-4 w-4" />
                                Analyze RC
                            </Link>
                            <Link
                                href="/cp/reason"
                                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
                            >
                                <Binary className="h-4 w-4" />
                                Open CP Reason
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-[1.75rem] border border-white/70 bg-slate-950 p-5 text-white shadow-2xl">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-teal-300">
                            Quick Workflow
                        </p>
                        <div className="space-y-3">
                            {WORKFLOWS.map((step) => (
                                <div
                                    key={step}
                                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                                >
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-300" />
                                    {step}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="space-y-5"
            >
                <div>
                    <h2 className="mb-1 text-2xl font-semibold text-slate-900 sm:text-3xl">
                        Quick Start
                    </h2>
                    <p className="mb-0 text-slate-600">
                        Jump directly into the workflow you actually need.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {QUICK_STARTS.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="group glass-panel rounded-[1.75rem] p-5 transition hover:-translate-y-1 hover:shadow-2xl"
                            >
                                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 shadow-sm">
                                    <Icon className="h-5 w-5 text-slate-900" />
                                </div>
                                <div
                                    className={`mb-4 h-2 rounded-full bg-gradient-to-r ${item.accent}`}
                                />
                                <h3 className="mb-2 text-xl font-semibold text-slate-900">
                                    {item.title}
                                </h3>
                                <p className="mb-4 text-sm leading-7 text-slate-600">
                                    {item.description}
                                </p>
                                <span className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 transition group-hover:text-teal-800">
                                    Open workspace
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </motion.section>

            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"
            >
                <div className="glass-panel rounded-[1.75rem] p-6">
                    <h2 className="mb-3 text-2xl font-semibold text-slate-900">
                        What Changed
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl bg-sky-50 p-4">
                            <p className="mb-2 text-sm font-semibold text-sky-800">
                                <span className="inline-flex items-center gap-2">
                                    <Sparkles className="h-4 w-4" />
                                    Math Rendering
                                </span>
                            </p>
                            <p className="mb-0 text-sm leading-6 text-slate-700">
                                Inline math, display equations, and markdown
                                lists now render together more reliably.
                            </p>
                        </div>
                        <div className="rounded-2xl bg-emerald-50 p-4">
                            <p className="mb-2 text-sm font-semibold text-emerald-800">
                                <span className="inline-flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Longer Responses
                                </span>
                            </p>
                            <p className="mb-0 text-sm leading-6 text-slate-700">
                                Higher output token ceilings reduce mid-answer
                                cutoffs for longer reasoning runs.
                            </p>
                        </div>
                        <div className="rounded-2xl bg-violet-50 p-4">
                            <p className="mb-2 text-sm font-semibold text-violet-800">
                                <span className="inline-flex items-center gap-2">
                                    <BrainCircuit className="h-4 w-4" />
                                    Better Navigation
                                </span>
                            </p>
                            <p className="mb-0 text-sm leading-6 text-slate-700">
                                Home and header now point to real workflows.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass-panel rounded-[1.75rem] p-6">
                    <h2 className="mb-3 text-2xl font-semibold text-slate-900">
                        Recommended Start
                    </h2>
                    <p className="mb-4 text-sm leading-7 text-slate-600">
                        For RC work, begin with passage analysis, then move to
                        solver once the structure is clear. For algorithmic
                        problems, go straight to CP Reason when you need proof
                        and formula output.
                    </p>
                    <Link
                        href="/varc/analyze"
                        className="inline-flex items-center gap-2 rounded-full bg-teal-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-teal-600"
                    >
                        <Brain className="h-4 w-4" />
                        Start with RC Analyze
                    </Link>
                </div>
            </motion.section>
        </main>
    );
}
