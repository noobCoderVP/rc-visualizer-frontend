"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import styles from "./DualCodeEditor.module.css";

/* Monaco must be dynamically imported in Next.js */
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
});

interface DualCodeEditorProps {
    problem: string;
    solution: string;
    onProblemChange: (v: string) => void;
    onSolutionChange: (v: string) => void;
}

export default function DualCodeEditor({
    problem,
    solution,
    onProblemChange,
    onSolutionChange,
}: DualCodeEditorProps) {
    const [preview, setPreview] = useState(false);

    return (
        <div className={styles.wrapper}>
            {/* ================= Problem Pane ================= */}
            <div className={styles.column}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Problem Statement</h3>
                    <button
                        onClick={() => setPreview((p) => !p)}
                        className={styles.toggleBtn}
                    >
                        {preview ? "Edit" : "Preview"}
                    </button>
                </div>

                <div className={styles.problemContainer}>
                    {!preview ? (
                        <textarea
                            value={problem}
                            onChange={(e) => onProblemChange(e.target.value)}
                            placeholder="Paste the problem here (Markdown supported)…"
                            className={styles.problemTextarea}
                        />
                    ) : (
                        <div className={styles.previewWrapper}>
                            <div className={styles.previewLabel}>
                                Preview mode (read-only)
                            </div>

                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {problem || "_Nothing to preview_"}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>

            {/* ================= Code Pane (REAL editor) ================= */}
            <div className={styles.column}>
                <h3 className={styles.title}>Your Solution Code</h3>

                <div className={styles.codeContainer}>
                    <div className={styles.codeEditorWrapper}>
                        <MonacoEditor
                            value={solution}
                            onChange={(v) => onSolutionChange(v ?? "")}
                            language="cpp"
                            theme="vs-dark"
                            options={{
                                fontSize: 14,
                                lineHeight: 22, // ✅ fixes line merging
                                padding: { top: 12, bottom: 12 }, // ✅ visual breathing room

                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,

                                wordWrap: "on", // ✅ respects line breaks
                                wrappingIndent: "indent",

                                automaticLayout: true,
                                renderWhitespace: "boundary",
                                smoothScrolling: true,

                                cursorBlinking: "smooth",
                                cursorSmoothCaretAnimation: "on",

                                fontLigatures: false, // cleaner for CP
                                glyphMargin: false,
                                folding: true,
                                bracketPairColorization: { enabled: true },
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

