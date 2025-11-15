"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="border-b border-gray-300 bg-black text-white sticky top-0 z-50">
            <nav className="container mx-auto flex justify-between items-center px-4 py-3 md:px-6">
                <h1 className="text-lg md:text-xl font-bold tracking-wide">
                    Passage Visualizer
                </h1>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-6 text-sm font-medium">
                    <Link href="/" className="hover:underline">
                        Home
                    </Link>
                    <Link href="/analyze" className="hover:underline">
                        Analyze
                    </Link>
                    <Link href="/solve" className="hover:underline">
                        Solve
                    </Link>
                    <Link href="/math" className="hover:underline">
                        Math
                    </Link>
                    <Link href="/vocab" className="hover:underline">
                        Vocabulary
                    </Link>
                    <Link href="/comprehension" className="hover:underline">
                        Comprehension
                    </Link>
                    <Link href="/about" className="hover:underline">
                        About
                    </Link>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden focus:outline-none"
                    onClick={() => setMenuOpen(!menuOpen)}
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

            {/* Mobile Menu (Animated) */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden bg-black border-t border-gray-700 flex flex-col items-center space-y-2 py-3"
                    >
                        <Link
                            href="/"
                            className="hover:underline"
                            onClick={() => setMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            href="/analyze"
                            className="hover:underline"
                            onClick={() => setMenuOpen(false)}
                        >
                            Analyze
                        </Link>
                        <Link
                            href="/math"
                            className="hover:underline"
                            onClick={() => setMenuOpen(false)}
                        >
                            Math
                        </Link>
                        <Link
                            href="/solve"
                            className="hover:underline"
                            onClick={() => setMenuOpen(false)}
                        >
                            Solve
                        </Link>
                        <Link
                            href="/vocab"
                            className="hover:underline"
                            onClick={() => setMenuOpen(false)}
                        >
                            Vocabulary
                        </Link>
                        <Link
                            href="/comprehension"
                            className="hover:underline"
                            onClick={() => setMenuOpen(false)}
                        >
                            Comprehension
                        </Link>
                        <Link
                            href="/about"
                            className="hover:underline"
                            onClick={() => setMenuOpen(false)}
                        >
                            About
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
