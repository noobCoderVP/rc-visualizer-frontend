/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import SectionCard from "./SectionCard";
import TransitionVisualizer from "./TransitionVisualizer";

export default function AnalyzerPage() {
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const editor = useEditor({
        extensions: [StarterKit],
        content: "",
        editorProps: {
            attributes: {
                class: "min-h-[200px] p-4 focus:outline-none text-gray-800 bg-white",
            },
        },
        immediatelyRender: false,
    });

    async function handleSubmit() {
        if (!editor) return;
        const passage = editor.getText().trim();
        if (!passage) return alert("Please enter a passage before analyzing.");

        setLoading(true);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/analyze`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ passage }),
                }
            );
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error("Error analyzing passage:", err);
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (!isMounted)
        return (
            <div className="p-6 bg-white rounded-2xl border shadow-md text-gray-600 text-center">
                Loading editor...
            </div>
        );

    return (
        <div className="space-y-10 max-w-3xl mx-auto">
            {/* --- INPUT SECTION --- */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 space-y-4">
                <h2 className="text-2xl font-semibold text-gray-700">
                    Enter Passage
                </h2>

                {/* ✅ Only render editor when initialized */}
                {editor ? (
                    <div className="border border-gray-300 rounded-lg shadow-sm bg-gray-50">
                        <EditorContent
                            editor={editor}
                            className="min-h-[200px] p-4 text-gray-800 focus:outline-none prose prose-sm max-w-none"
                        />
                    </div>
                ) : (
                    <div className="h-[200px] border border-gray-300 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                        Loading editor...
                    </div>
                )}

                {/* ✅ Always visible button */}
                <div className="flex justify-end pt-2">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`px-6 py-2 rounded-lg text-white font-medium ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "Analyzing..." : "Analyze Passage"}
                    </button>
                </div>
            </div>

            {/* --- RESULT SECTION --- */}
            {result && (
                <div className="space-y-6">
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
