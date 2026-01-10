"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="border-b border-gray-800 bg-black text-white sticky top-0 z-50">
            <nav className="container mx-auto flex justify-between items-center px-4 py-3 md:px-6">
                {/* Logo */}
                <h1 className="text-lg md:text-xl font-bold tracking-wide">
                    Passage Visualizer
                </h1>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
                    <Link href="/" className="hover:text-blue-400 transition">
                        Home
                    </Link>

                    {/* Quants Dropdown */}
                    <div className="relative group">
                        <span className="cursor-pointer hover:text-blue-400 transition">
                            Quants ▾
                        </span>
                        <div className="absolute left-0 mt-2 w-40 bg-gray-900 border border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <Link
                                href="/qa/math"
                                className="block px-4 py-2 hover:bg-gray-800"
                            >
                                Math
                            </Link>
                            <Link
                                href="/qa/train"
                                className="block px-4 py-2 hover:bg-gray-800"
                            >
                                Trainer
                            </Link>
                        </div>
                    </div>

                    {/* VARC Dropdown */}
                    <div className="relative group">
                        <span className="cursor-pointer hover:text-blue-400 transition">
                            VARC ▾
                        </span>
                        <div className="absolute left-0 mt-2 w-44 bg-gray-900 border border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <Link
                                href="/varc/vocab"
                                className="block px-4 py-2 hover:bg-gray-800"
                            >
                                Vocabulary
                            </Link>
                            <Link
                                href="/varc/comprehension"
                                className="block px-4 py-2 hover:bg-gray-800"
                            >
                                Comprehension
                            </Link>
                            <Link
                                href="/varc/analyze"
                                className="block px-4 py-2 hover:bg-gray-800"
                            >
                                Analyze
                            </Link>
                        </div>
                    </div>

                    {/* Competitive Programming Dropdown */}
                    <div className="relative group">
                        <span className="cursor-pointer hover:text-blue-400 transition">
                            Competitive Programming ▾
                        </span>
                        <div className="absolute left-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <Link
                                href="/cp/hints"
                                className="block px-4 py-2 hover:bg-gray-800"
                            >
                                Hints
                            </Link>
                            <Link
                                href="/cp/optimize"
                                className="block px-4 py-2 hover:bg-gray-800"
                            >
                                Optimize
                            </Link>
                            <Link
                                href="/cp/solve"
                                className="block px-4 py-2 hover:bg-gray-800"
                            >
                                Solve
                            </Link>
                        </div>
                    </div>

                    <Link
                        href="/about"
                        className="hover:text-blue-400 transition"
                    >
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

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="md:hidden bg-black border-t border-gray-800 px-4 py-3 space-y-3 text-sm"
                    >
                        <Link href="/" className="block">
                            Home
                        </Link>

                        <div>
                            <p className="font-semibold text-gray-400">
                                Quants
                            </p>
                            <Link href="/qa/math" className="block pl-3 py-1">
                                Math
                            </Link>
                            <Link href="/qa/train" className="block pl-3 py-1">
                                Trainer
                            </Link>
                        </div>

                        <div>
                            <p className="font-semibold text-gray-400">VARC</p>
                            <Link
                                href="/varc/vocab"
                                className="block pl-3 py-1"
                            >
                                Vocabulary
                            </Link>
                            <Link
                                href="/varc/comprehension"
                                className="block pl-3 py-1"
                            >
                                Comprehension
                            </Link>
                            <Link
                                href="/varc/analyze"
                                className="block pl-3 py-1"
                            >
                                Analyze
                            </Link>
                        </div>

                        <div>
                            <p className="font-semibold text-gray-400">
                                Competitive Programming
                            </p>
                            <Link href="/cp/hints" className="block pl-3 py-1">
                                Hints
                            </Link>
                            <Link
                                href="/cp/optimize"
                                className="block pl-3 py-1"
                            >
                                Optimize
                            </Link>
                            <Link href="/cp/solve" className="block pl-3 py-1">
                                Solve
                            </Link>
                        </div>

                        <Link href="/about" className="block">
                            About
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
