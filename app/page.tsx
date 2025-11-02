"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
    return (
        <main className="flex flex-col items-center text-center py-10 px-4 sm:px-8">
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl"
            >
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">
                    Welcome to{" "}
                    <span className="text-gray-700">Passage Visualizer</span>
                </h1>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
                    A modern AI-powered interface that helps CAT aspirants and
                    readers
                    <strong>
                        {" "}
                        analyze Reading Comprehension (RC) passages visually
                    </strong>{" "}
                    and
                    <strong> solve questions logically</strong>. Understand
                    every paragraph — not just read it.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                    <Link
                        href="/analyze"
                        className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                    >
                        Analyze Passage
                    </Link>
                    <Link
                        href="/solve"
                        className="border border-black text-black px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
                    >
                        Solve RC
                    </Link>
                </div>
            </motion.section>

            {/* Features Section */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-16 max-w-5xl text-left"
            >
                <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">
                    What Can Passage Visualizer Do?
                </h2>

                <div className="grid md:grid-cols-2 gap-10">
                    {/* Analyze Feature */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-6 border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition"
                    >
                        <h3 className="text-lg font-bold mb-3 text-black">
                            🧠 AI-Based RC Analysis
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            Upload or paste any Reading Comprehension passage,
                            and our AI breaks it down visually — identifying key
                            vocabulary, transitions, logical flow, and author’s
                            purpose. Get structured insights like{" "}
                            <strong>facts, opinions, inferences,</strong> and
                            <strong> logical connections</strong> in JSON-based
                            visualization.
                        </p>
                    </motion.div>

                    {/* Solve Feature */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-6 border border-gray-300 rounded-xl shadow-sm hover:shadow-md transition"
                    >
                        <h3 className="text-lg font-bold mb-3 text-black">
                            🧩 Logical Question Solving
                        </h3>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            In the <strong>“Solve”</strong> section, you can
                            provide the passage and its questions. The AI
                            explains step-by-step reasoning for each answer —
                            helping you understand not just <em>what</em> is
                            right, but
                            <em>why</em>. Perfect for deep conceptual clarity
                            and CAT-level accuracy.
                        </p>
                    </motion.div>
                </div>
            </motion.section>

            {/* Call to Action */}
            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mt-20 text-center"
            >
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">
                    Ready to Improve Your RC Skills?
                </h2>
                <p className="text-gray-700 mb-6 text-sm sm:text-base">
                    Dive into AI-powered analysis and logical solving to make RC
                    your strongest section.
                </p>
                <Link
                    href="/analyze"
                    className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                >
                    Start Now
                </Link>
            </motion.section>
        </main>
    );
}
