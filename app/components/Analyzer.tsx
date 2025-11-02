/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import SectionCard from "./SectionCard";
import TransitionVisualizer from "./TransitionVisualizer";

export default function AnalyzerPage() {
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [passage, setPassage] = useState("");
    const [isReadOnly, setIsReadOnly] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // ✅ Auto resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [passage]);

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

    // ✅ Reset everything
    function handleReset() {
        setPassage("");
        setResult(null);
        setIsReadOnly(false);
    }

    if (!isMounted)
        return (
            <div className="p-4 text-gray-600 text-center">
                Loading editor...
            </div>
        );

    return (
        <div className="mx-auto max-w-[1300px] p-4 space-y-8">
            {/* --- INPUT SECTION --- */}
            <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-700">
                    Enter Passage
                </h2>

                <textarea
                    ref={textareaRef}
                    value={passage}
                    onChange={(e) => setPassage(e.target.value)}
                    readOnly={isReadOnly}
                    placeholder="Paste or type your passage here..."
                    className={`w-full rounded-xl text-gray-800 transition-all duration-200 p-4 resize-none focus:outline-none shadow-sm overflow-hidden
                        ${
                            isReadOnly
                                ? "bg-gray-50 text-[1.05rem] leading-relaxed font-serif cursor-not-allowed shadow-md"
                                : "bg-white focus:shadow-lg"
                        }
                    `}
                />

                {/* ✅ Buttons */}
                <div className="flex justify-end gap-3 pt-1">
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={loading}
                        className={`px-5 py-2 rounded-lg font-medium border transition-all 
                            ${
                                loading
                                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                    : "text-gray-700 border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        Reset
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || isReadOnly}
                        className={`px-6 py-2 rounded-lg text-white font-medium transition-all 
                            ${
                                loading || isReadOnly
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                            }`}
                    >
                        {loading ? "Analyzing..." : "Analyze Passage"}
                    </button>
                </div>
            </div>

            {/* --- RESULT SECTION --- */}
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
        </div>
    );
}
