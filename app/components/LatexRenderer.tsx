"use client";

import { MathJax, MathJaxContext } from "better-react-mathjax";

/**
 * MathJax configuration:
 * - Supports $...$, $$...$$
 * - Supports \(...\), \[...\]
 * - Supports mixed text + math
 * - Works for editorial-style LaTeX
 */
const config = {
    tex: {
        inlineMath: [
            ["$", "$"],
            ["\\(", "\\)"],
        ],
        displayMath: [
            ["$$", "$$"],
            ["\\[", "\\]"],
        ],
    },
    options: {
        skipHtmlTags: ["script", "noscript", "style", "textarea", "pre"],
    },
};

export default function LatexRenderer({ latex }: { latex: string }) {
    return (
        <MathJaxContext config={config}>
            <div className="prose max-w-none text-gray-900">
                <MathJax dynamic>{latex}</MathJax>
            </div>
        </MathJaxContext>
    );
}
