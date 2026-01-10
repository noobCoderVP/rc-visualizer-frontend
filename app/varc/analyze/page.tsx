/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import SectionCard from "../../components/SectionCard";
import TransitionVisualizer from "../../components/TransitionVisualizer";
import { RC_ANALYSIS_PROMPT } from "../../prompts/analyze";
import { RC_MINDMAP_PROMPT } from "../../prompts/read";
import { getGeminiModel } from "../../utils/gemini";

export default function AnalyzerPage() {
    const [loading, setLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [passage, setPassage] = useState("");
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [readingView, setReadingView] = useState<string | null>(null);
    const [readingLoading, setReadingLoading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [modalText, setModalText] = useState<string | null>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const genAI = getGeminiModel();

    useEffect(() => setIsMounted(true), []);

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
            let data: any;

            // ✅ Use backend if available
            if (apiUrl) {
                const res = await fetch(`${apiUrl}/analyze`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ passage: text }),
                });
                data = await res.json();
            } else if (genAI) {
                // ✅ Direct Gemini call if backend not present
                const prompt = `${RC_ANALYSIS_PROMPT}\n\nPassage:\n${text}`;
                const response = await genAI.generateContent(prompt);
                const cleanText = response.response
                    .text()
                    .replace(/```json|```/g, "")
                    .trim();
                const jsonStart = cleanText.indexOf("{");
                const jsonEnd = cleanText.lastIndexOf("}");
                data = JSON.parse(cleanText.slice(jsonStart, jsonEnd + 1));
            } else {
                throw new Error(
                    "No backend URL or Gemini API key found. Please configure one."
                );
            }

            setResult(data);
        } catch (err) {
            console.error("Error analyzing passage:", err);
            alert("Something went wrong. Please try again.");
            setIsReadOnly(false);
        } finally {
            setLoading(false);
        }
    }

    async function handleReadPassage() {
        const text = passage.trim();
        if (!text) return alert("Please enter a passage before reading.");

        setReadingLoading(true);
        setIsReadOnly(true);

        try {
            let htmlData: string;

            if (apiUrl) {
                const res = await fetch(`${apiUrl}/mindmap`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ passage: text }),
                });
                htmlData = await res.text();
            } else if (genAI) {
                const prompt = `${RC_MINDMAP_PROMPT}\n\nPassage:\n${text}`;
                const response = await genAI.generateContent(prompt);
                htmlData = response.response
                    .text()
                    .replace(/```html|```/g, "")
                    .trim();
            } else {
                throw new Error(
                    "No backend URL or Gemini API key found. Please configure one."
                );
            }

            setReadingView(htmlData);
        } catch (err) {
            console.error("Error fetching reading view:", err);
            alert("Something went wrong while fetching the reading view.");
            setIsReadOnly(false);
        } finally {
            setReadingLoading(false);
        }
    }

    // ---------- Click logic for modal -------------
    useEffect(() => {
        if (!readingView) return;
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const wordEl = target.closest(
                ".highlighted-word"
            ) as HTMLElement | null;
            if (wordEl) {
                const tooltipText = wordEl.dataset.tooltip;
                if (tooltipText) setModalText(tooltipText);
            }
        };
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [readingView]);

    function handleCloseModal() {
        setModalText(null);
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
        <div className="mx-auto max-w-[1300px] p-4 space-y-8 relative">
            {/* --- MODAL for Explanation --- */}
            {modalText && (
                <div className="fixed w-96 inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div
                        className="bg-white rounded-xl shadow-2xl max-w-[300px] p-5 sm:p-6 relative animate-fadeIn mx-auto overflow-hidden"
                        style={{ wordWrap: "break-word" }}
                    >
                        <h3 className="text-lg font-semibold text-amber-700 mb-2 text-center">
                            Explanation
                        </h3>
                        <p className="text-gray-800 leading-relaxed text-sm sm:text-base wrap-break-word">
                            {modalText}
                        </p>
                        <button
                            onClick={handleCloseModal}
                            className="mt-4 w-full sm:w-auto px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

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
                        }`}
                />

                {/* ✅ Buttons */}
                <div className="flex justify-end gap-3 pt-1 flex-wrap">
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={loading || readingLoading}
                        className={`px-5 py-2 rounded-lg font-medium border transition-all 
                            ${
                                loading || readingLoading
                                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                    : "text-gray-700 border-gray-300 hover:bg-gray-100"
                            }`}
                    >
                        Reset
                    </button>

                    <button
                        type="button"
                        onClick={handleReadPassage}
                        disabled={readingLoading}
                        className={`px-6 py-2 rounded-lg text-white font-medium transition-all 
                            ${
                                readingLoading || isReadOnly
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg"
                            }`}
                    >
                        {readingLoading ? "Reading..." : "Read Passage"}
                    </button>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading}
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

            {/* --- READ PASSAGE SECTION --- */}
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
