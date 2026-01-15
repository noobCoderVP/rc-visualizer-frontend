"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModelSelector from "./header/ModelSelector";

/* -------------------- Menu Config -------------------- */

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
        ],
    },
    {
        label: "Competitive Programming",
        items: [
            { label: "Hints", href: "/cp/hints" },
            { label: "Solve", href: "/cp/solve" },
            { label: "Dry Run", href: "/cp/dryrun" }, // ✅ added
            { label: "Testcases", href: "/cp/tests" }, // ✅ added
            { label: "Optimize", href: "/cp/optimize" },
        ],
    },
];


/* -------------------- Header -------------------- */

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-gray-800 bg-black text-white">
            <nav className="container mx-auto flex items-center justify-between px-4 py-3 md:px-6">
                {/* Logo */}
                <h1 className="text-lg md:text-xl font-bold tracking-wide">
                    Passage Visualizer
                </h1>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
                    <Link href="/" className="hover:text-blue-400 transition">
                        Home
                    </Link>

                    {MENU_SECTIONS.map((section) => (
                        <div key={section.label} className="relative group">
                            <span className="cursor-pointer hover:text-blue-400 transition">
                                {section.label} ▾
                            </span>

                            <div className="absolute left-0 mt-2 min-w-40 bg-gray-900 border border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                {section.items.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="block px-4 py-2 hover:bg-gray-800"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}

                    <Link
                        href="/about"
                        className="hover:text-blue-400 transition"
                    >
                        About
                    </Link>
                </div>

                {/* Right Actions (Desktop) */}
                <div className="hidden md:flex items-center gap-4">
                    <ModelSelector />
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden focus:outline-none"
                    onClick={() => setMenuOpen((v) => !v)}
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

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden bg-black border-t border-gray-800 px-4 py-3 space-y-4 text-sm"
                    >
                        <Link href="/" className="block">
                            Home
                        </Link>

                        {MENU_SECTIONS.map((section) => (
                            <div key={section.label}>
                                <p className="font-semibold text-gray-400">
                                    {section.label}
                                </p>

                                {section.items.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className="block pl-3 py-1"
                                    >
                                        {item.label}
                                    </Link>
                                ))}
                            </div>
                        ))}

                        <Link href="/about" className="block">
                            About
                        </Link>

                        {/* Mobile Model Selector (optional but useful) */}
                        <div className="pt-2 border-t border-gray-800">
                            <ModelSelector />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
