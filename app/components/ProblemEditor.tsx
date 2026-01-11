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
                        className="p-4 overflow-y-auto"
                        style={{
                            color: "#e5e7eb",
                            lineHeight: 1.75,
                            maxHeight: MAX_INPUT_HEIGHT,
                        }}
                    >
                        <div className="mb-3 text-xs text-gray-400 italic">
                            Preview mode (read-only)
                        </div>

                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {problem || "_Nothing to preview_"}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </>
    );
}
