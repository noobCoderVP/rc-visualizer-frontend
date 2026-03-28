"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MAX_INPUT_HEIGHT = "70vh";

export default function ProblemEditor({
    title,
    problem,
    onChange,
    preview,
    onTogglePreview,
    onOpenHistory,
}: {
    title: string;
    problem: string;
    onChange: (v: string) => void;
    preview: boolean;
    onTogglePreview: () => void;
    onOpenHistory: () => void;
}) {
    const previewContent = problem || "_Nothing to preview_";

    return (
        <>
            <div className="flex justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>

                <div className="flex gap-2">
                    <button
                        onClick={onOpenHistory}
                        className="text-xs px-3 py-1 rounded-md bg-gray-700 text-gray-200"
                    >
                        History
                    </button>

                    <button
                        onClick={onTogglePreview}
                        className="text-xs px-3 py-1 rounded-md bg-gray-800 text-gray-200"
                    >
                        {preview ? "Edit" : "Preview"}
                    </button>
                </div>
            </div>

            <div
                className="rounded-xl shadow-sm overflow-hidden"
                style={{
                    backgroundColor: "#0b1220",
                    maxHeight: MAX_INPUT_HEIGHT,
                }}
            >
                {!preview ? (
                    <textarea
                        value={problem}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Paste the full problem statement here (Markdown supported)…"
                        className="w-full resize-none p-4 focus:outline-none"
                        style={{
                            backgroundColor: "transparent",
                            color: "#e5e7eb",
                            fontFamily: "Georgia, serif",
                            fontSize: 15,
                            lineHeight: 1.7,
                            minHeight: 240,
                            maxHeight: MAX_INPUT_HEIGHT,
                            overflowY: "auto",
                        }}
                    />
                ) : (
                    <div
                        className="overflow-y-auto bg-white p-4"
                        style={{
                            lineHeight: 1.75,
                            maxHeight: MAX_INPUT_HEIGHT,
                        }}
                    >
                        <div className="mb-3 text-xs italic text-slate-500">
                            Preview mode (read-only)
                        </div>

                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({ children }) => (
                                    <h1 className="mb-3 text-2xl font-semibold text-slate-900">
                                        {children}
                                    </h1>
                                ),
                                h2: ({ children }) => (
                                    <h2 className="mb-3 text-xl font-semibold text-slate-900">
                                        {children}
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className="mb-2 text-lg font-semibold text-slate-900">
                                        {children}
                                    </h3>
                                ),
                                p: ({ children }) => (
                                    <p className="mb-4 text-[15px] leading-7 text-slate-800">
                                        {children}
                                    </p>
                                ),
                                ul: ({ children }) => (
                                    <ul className="mb-4 list-disc pl-6 text-slate-800">
                                        {children}
                                    </ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className="mb-4 list-decimal pl-6 text-slate-800">
                                        {children}
                                    </ol>
                                ),
                                li: ({ children }) => (
                                    <li className="mb-2 text-[15px] leading-7 text-slate-800">
                                        {children}
                                    </li>
                                ),
                                strong: ({ children }) => (
                                    <strong className="font-semibold text-slate-950">
                                        {children}
                                    </strong>
                                ),
                                code: ({ children }) => (
                                    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-slate-900">
                                        {children}
                                    </code>
                                ),
                                pre: ({ children }) => (
                                    <pre className="mb-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-100">
                                        {children}
                                    </pre>
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote className="mb-4 rounded-r-lg border-l-4 border-sky-300 bg-sky-50 px-4 py-3 text-slate-700">
                                        {children}
                                    </blockquote>
                                ),
                            }}
                        >
                            {previewContent}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </>
    );
}
