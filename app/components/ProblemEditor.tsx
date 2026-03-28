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
                className="overflow-hidden rounded-2xl border shadow-lg"
                style={{
                    backgroundColor: "var(--editor-shell)",
                    borderColor: "var(--editor-shell-border)",
                    boxShadow: "var(--editor-shell-shadow)",
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
                            color: "var(--editor-text)",
                            fontFamily: "Georgia, serif",
                            fontSize: 15,
                            lineHeight: 1.7,
                            minHeight: 240,
                            maxHeight: MAX_INPUT_HEIGHT,
                            overflowY: "auto",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
                        }}
                    />
                ) : (
                    <div
                        className="overflow-y-auto p-4"
                        style={{
                            backgroundColor: "var(--editor-preview-bg)",
                            lineHeight: 1.75,
                            maxHeight: MAX_INPUT_HEIGHT,
                        }}
                    >
                        <div
                            className="mb-3 text-xs italic"
                            style={{ color: "var(--editor-preview-muted)" }}
                        >
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
                                    <p
                                        className="mb-4 text-[15px] leading-7"
                                        style={{
                                            color: "var(--editor-preview-text)",
                                        }}
                                    >
                                        {children}
                                    </p>
                                ),
                                ul: ({ children }) => (
                                    <ul
                                        className="mb-4 list-disc pl-6"
                                        style={{
                                            color: "var(--editor-preview-text)",
                                        }}
                                    >
                                        {children}
                                    </ul>
                                ),
                                ol: ({ children }) => (
                                    <ol
                                        className="mb-4 list-decimal pl-6"
                                        style={{
                                            color: "var(--editor-preview-text)",
                                        }}
                                    >
                                        {children}
                                    </ol>
                                ),
                                li: ({ children }) => (
                                    <li
                                        className="mb-2 text-[15px] leading-7"
                                        style={{
                                            color: "var(--editor-preview-text)",
                                        }}
                                    >
                                        {children}
                                    </li>
                                ),
                                strong: ({ children }) => (
                                    <strong
                                        className="font-semibold"
                                        style={{
                                            color: "var(--editor-preview-text)",
                                        }}
                                    >
                                        {children}
                                    </strong>
                                ),
                                code: ({ children }) => (
                                    <code
                                        className="rounded px-1.5 py-0.5 font-mono text-sm"
                                        style={{
                                            backgroundColor:
                                                "var(--editor-code-inline-bg)",
                                            color:
                                                "var(--editor-code-inline-text)",
                                        }}
                                    >
                                        {children}
                                    </code>
                                ),
                                pre: ({ children }) => (
                                    <pre
                                        className="mb-4 overflow-x-auto rounded-xl p-4 text-sm"
                                        style={{
                                            backgroundColor:
                                                "var(--editor-code-block-bg)",
                                            color:
                                                "var(--editor-code-block-text)",
                                        }}
                                    >
                                        {children}
                                    </pre>
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote
                                        className="mb-4 rounded-r-lg border-l-4 px-4 py-3"
                                        style={{
                                            borderLeftColor:
                                                "var(--editor-quote-border)",
                                            backgroundColor:
                                                "var(--editor-quote-bg)",
                                            color: "var(--editor-quote-text)",
                                        }}
                                    >
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
