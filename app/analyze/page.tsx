/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import SectionCard from "../components/SectionCard";
import TransitionVisualizer from "../components/TransitionVisualizer";

export default function AnalyzerPage() {
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [passage, setPassage] = useState("");
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [readingView, setReadingView] = useState<string | null>(null);
    const [readingLoading, setReadingLoading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => setIsMounted(true), []);

    // ✅ Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [passage]);

    // ✅ Analyze Passage
    async function handleSubmit() {
        const text = passage.trim();
        if (!text) return alert("Please enter a passage before analyzing.");
        setLoading(true);
        setIsReadOnly(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/analyze`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ passage: text }),
                }
            );

            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error("Error analyzing passage:", err);
            alert("Something went wrong. Please try again.");
            setIsReadOnly(false);
        } finally {
            setLoading(false);
        }
    }

    // ✅ Read Passage / Mindmap
    async function handleReadPassage() {
        const text = passage.trim();
        if (!text) return alert("Please enter a passage before reading.");

        setReadingLoading(true);
        setIsReadOnly(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/mindmap`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ passage: text }),
                }
            );

            const data = await res.text();
            setReadingView(data);
        } catch (err) {
            console.error("Error fetching reading view:", err);
            alert("Something went wrong while fetching the reading view.");
            setIsReadOnly(false);
        } finally {
            setReadingLoading(false);
        }
    }

    function handleReset() {
        setPassage("");
        setResult(null);
        setReadingView(null);
        setIsReadOnly(false);
    }

    if (!isMounted)
        return (
            <div className="p-4 text-gray-600 text-center">
                Loading editor...
            </div>
        );

    return (
        <div className="mx-auto max-w-[1300px] p-4 pb-24 space-y-8">
            {/* --- INPUT SECTION --- */}
            <div className="space-y-3">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-700">
                    Enter Passage
                </h2>

                <textarea
                    ref={textareaRef}
                    value={passage}
                    onChange={(e) => setPassage(e.target.value)}
                    readOnly={isReadOnly}
                    placeholder="Paste or type your passage here..."
                    className={`w-full rounded-xl text-gray-800 p-4 resize-none focus:outline-none shadow-sm overflow-hidden text-base sm:text-lg transition-all
                        ${
                            isReadOnly
                                ? "bg-gray-50 font-serif cursor-not-allowed shadow-md"
                                : "bg-white focus:shadow-lg"
                        }`}
                />
            </div>

            {/* --- RESULT SECTIONS --- */}
            {readingView && (
                <SectionCard
                    title="Read Passage"
                    color="bg-teal-50"
                    border="border-teal-400"
                >
                    <div
                        className="prose prose-sm sm:prose-base lg:prose-lg max-w-none"
                        dangerouslySetInnerHTML={{ __html: readingView }}
                    />
                </SectionCard>
            )}

            {result && (
                <div className="space-y-5">
                    <SectionCard
                        title="Title"
                        color="bg-blue-50"
                        border="border-blue-400"
                    >
                        <p>{result.title}</p>
                    </SectionCard>

                    <SectionCard
                        title="Main Idea"
                        color="bg-green-50"
                        border="border-green-400"
                    >
                        <p>
                            <strong>Direct:</strong> {result.main_idea.direct}
                        </p>
                        <p>
                            <strong>Indirect:</strong>{" "}
                            {result.main_idea.indirect}
                        </p>
                    </SectionCard>

                    <SectionCard
                        title="Vocabulary"
                        color="bg-yellow-50"
                        border="border-yellow-400"
                    >
                        <ul className="list-disc pl-6">
                            {result.vocabulary?.map((v: any, i: number) => (
                                <li key={i}>
                                    <strong>{v.word}:</strong> {v.meaning}
                                </li>
                            ))}
                        </ul>
                    </SectionCard>

                    <SectionCard
                        title="Facts, Opinions & Inferences"
                        color="bg-purple-50"
                        border="border-purple-400"
                    >
                        <ul className="list-disc pl-6">
                            {result.facts_opinions_inferences?.map(
                                (f: any, i: number) => (
                                    <li key={i}>
                                        <strong>{f.type}:</strong> {f.text}
                                    </li>
                                )
                            )}
                        </ul>
                    </SectionCard>

                    <SectionCard
                        title="Transitions"
                        color="bg-pink-50"
                        border="border-pink-400"
                    >
                        <TransitionVisualizer
                            transitions={result.transitions}
                        />
                    </SectionCard>

                    <SectionCard
                        title="Keywords"
                        color="bg-indigo-50"
                        border="border-indigo-400"
                    >
                        <div className="flex flex-wrap gap-2">
                            {result.keywords?.map((k: string, i: number) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 bg-indigo-200 rounded-full text-sm"
                                >
                                    {k}
                                </span>
                            ))}
                        </div>
                    </SectionCard>

                    <SectionCard
                        title="Purpose"
                        color="bg-rose-50"
                        border="border-rose-400"
                    >
                        <p>{result.purpose}</p>
                    </SectionCard>
                </div>
            )}

            {/* --- STICKY BOTTOM NAVIGATION (Mobile Friendly) --- */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-300 shadow-lg flex justify-around items-center p-3 sm:hidden">
                <button
                    onClick={handleReset}
                    disabled={loading || readingLoading}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all
                        ${
                            loading || readingLoading
                                ? "text-gray-400 border-gray-300"
                                : "text-gray-700 border-gray-300 hover:bg-gray-100"
                        }`}
                >
                    Reset
                </button>

                <button
                    onClick={handleReadPassage}
                    disabled={readingLoading}
                    className={`px-4 py-2 rounded-lg text-sm text-white font-medium transition-all
                        ${
                            readingLoading || isReadOnly
                                ? "bg-gray-400"
                                : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                >
                    {readingLoading ? "Reading..." : "Read"}
                </button>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg text-sm text-white font-medium transition-all
                        ${
                            loading || isReadOnly
                                ? "bg-gray-400"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Analyzing..." : "Analyze"}
                </button>
            </div>
        </div>
    );
}
