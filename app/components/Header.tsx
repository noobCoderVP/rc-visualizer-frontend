"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ModelSelector from "./header/ModelSelector";
import ThemeToggle from "./header/ThemeToggle";

type MenuItem = {
    label: string;
    href: string;
};

type MenuSection = {
    label: string;
    items: MenuItem[];
};

const MENU_SECTIONS: MenuSection[] = [
    {
        label: "Quants",
        items: [
            { label: "Math", href: "/qa/math" },
            { label: "Trainer", href: "/qa/train" },
        ],
    },
    {
        label: "VARC",
        items: [
            { label: "Vocabulary", href: "/varc/vocab" },
            { label: "Comprehension", href: "/varc/comprehension" },
            { label: "Analyze", href: "/varc/analyze" },
            { label: "Solve", href: "/varc/solve" },
        ],
    },
    {
        label: "Competitive Programming",
        items: [
            { label: "Hints", href: "/cp/hints" },
            { label: "Solve", href: "/cp/solve" },
            { label: "Dry Run", href: "/cp/dryrun" },
            { label: "Testcases", href: "/cp/tests" },
            { label: "Optimize", href: "/cp/optimize" },
            { label: "Reason", href: "/cp/reason" },
        ],
    },
];

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (href: string) => pathname === href;

    return (
        <header className="sticky top-0 z-50 border-b border-slate-300/80 bg-white/82 text-slate-900 shadow-[0_8px_28px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <nav className="container mx-auto flex items-center justify-between gap-4 px-4 py-3 md:px-6">
                <Link href="/" className="min-w-0">
                    <p className="mb-0 text-[11px] font-semibold uppercase tracking-[0.32em] text-teal-700">
                        RC Visualizer
                    </p>
                    <h1 className="mb-0 truncate text-lg font-bold tracking-tight md:text-xl">
                        Practice With Better AI Structure
                    </h1>
                </Link>

                <div className="hidden items-center space-x-3 text-sm font-medium md:flex">
                    <Link
                        href="/"
                        className={`rounded-full px-3 py-2 transition ${
                            isActive("/")
                                ? "bg-slate-900 text-white"
                                : "text-slate-700 hover:bg-slate-100"
                        }`}
                    >
                        Home
                    </Link>

                    {MENU_SECTIONS.map((section) => (
                        <div key={section.label} className="group relative">
                            <span className="cursor-pointer rounded-full px-3 py-2 text-slate-700 transition hover:bg-slate-100 hover:shadow-sm">
                                {section.label} v
                            </span>

                            <div className="invisible absolute left-0 mt-2 min-w-52 rounded-2xl border border-slate-300 bg-white p-2 opacity-0 shadow-2xl ring-1 ring-slate-200/70 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                                {section.items.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`block rounded-xl px-4 py-2.5 ${
                                            isActive(item.href)
                                                ? "bg-slate-900 text-white"
                                                : "text-slate-700 hover:bg-slate-100"
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="hidden items-center gap-3 md:flex">
                    <ThemeToggle />
                    <ModelSelector />
                </div>

                <button
                    className="rounded-xl border border-slate-300 bg-white p-2 text-slate-700 shadow-md md:hidden"
                    onClick={() => setMenuOpen((value) => !value)}
                    aria-label="Toggle menu"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        {menuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
            </nav>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="border-t border-slate-300 bg-white/95 px-4 py-4 text-sm shadow-2xl backdrop-blur-xl md:hidden"
                    >
                        <Link
                            href="/"
                            className={`block rounded-xl px-3 py-2 ${
                                isActive("/")
                                    ? "bg-slate-900 text-white"
                                    : "text-slate-700"
                            }`}
                        >
                            Home
                        </Link>

                        {MENU_SECTIONS.map((section) => (
                            <div key={section.label} className="mt-4">
                                <p className="mb-2 font-semibold text-slate-500">
                                    {section.label}
                                </p>

                                {section.items.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`block rounded-lg px-3 py-2 ${
                                            isActive(item.href)
                                                ? "bg-slate-900 text-white"
                                                : "text-slate-700"
                                        }`}
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        ))}

                        <div className="mt-4 border-t border-slate-200 pt-3">
                            <div className="mb-3">
                                <ThemeToggle />
                            </div>
                            <ModelSelector />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
