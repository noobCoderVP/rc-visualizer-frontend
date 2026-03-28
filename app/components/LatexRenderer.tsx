"use client";

import {
    Children,
    cloneElement,
    isValidElement,
    type ReactNode,
    useMemo,
} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BlockMath, InlineMath } from "react-katex";

type ContentBlock =
    | { type: "markdown"; content: string }
    | { type: "display-math"; content: string };

const DISPLAY_MATH_REGEX = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]/g;
const INLINE_MATH_REGEX =
    /(\\\((?:\\.|[^\\])+?\\\)|\$(?!\$)(?:\\.|[^$\n])+\$)/g;

function stripMathDelimiters(value: string) {
    if (value.startsWith("$$") && value.endsWith("$$")) {
        return value.slice(2, -2).trim();
    }

    if (value.startsWith("\\[") && value.endsWith("\\]")) {
        return value.slice(2, -2).trim();
    }

    if (value.startsWith("\\(") && value.endsWith("\\)")) {
        return value.slice(2, -2).trim();
    }

    if (value.startsWith("$") && value.endsWith("$")) {
        return value.slice(1, -1).trim();
    }

    return value.trim();
}

function splitContentIntoBlocks(source: string): ContentBlock[] {
    const blocks: ContentBlock[] = [];
    let lastIndex = 0;

    for (const match of source.matchAll(DISPLAY_MATH_REGEX)) {
        const matchIndex = match.index ?? 0;
        const before = source.slice(lastIndex, matchIndex);

        if (before.trim()) {
            blocks.push({ type: "markdown", content: before.trim() });
        }

        blocks.push({
            type: "display-math",
            content: stripMathDelimiters(match[0]),
        });

        lastIndex = matchIndex + match[0].length;
    }

    const tail = source.slice(lastIndex);

    if (tail.trim()) {
        blocks.push({ type: "markdown", content: tail.trim() });
    }

    return blocks.length > 0
        ? blocks
        : [{ type: "markdown", content: source.trim() }];
}

function renderInlineMath(content: string, keyPrefix: string): ReactNode[] {
    if (!content) {
        return [];
    }

    const result: ReactNode[] = [];
    let lastIndex = 0;
    let matchIndex = 0;

    for (const match of content.matchAll(INLINE_MATH_REGEX)) {
        const start = match.index ?? 0;

        if (start > lastIndex) {
            result.push(content.slice(lastIndex, start));
        }

        result.push(
            <span
                key={`${keyPrefix}-inline-${matchIndex}`}
                className="latex-inline"
            >
                <InlineMath math={stripMathDelimiters(match[0])} />
            </span>,
        );

        lastIndex = start + match[0].length;
        matchIndex += 1;
    }

    if (lastIndex < content.length) {
        result.push(content.slice(lastIndex));
    }

    return result;
}

function renderChildrenWithMath(
    children: ReactNode,
    keyPrefix: string,
): ReactNode {
    return Children.toArray(children).map((child, index) => {
        const childKey = `${keyPrefix}-${index}`;

        if (typeof child === "string") {
            return (
                <span key={childKey}>{renderInlineMath(child, childKey)}</span>
            );
        }

        if (isValidElement<{ children?: ReactNode }>(child)) {
            if (child.type === "code" || child.type === "pre") {
                return child;
            }

            return cloneElement(
                child,
                { key: childKey },
                renderChildrenWithMath(child.props.children, childKey),
            );
        }

        return child;
    });
}

export default function LatexRenderer({ latex }: { latex: string }) {
    const blocks = useMemo(() => splitContentIntoBlocks(latex), [latex]);

    return (
        <div className="latex-renderer max-w-none text-gray-900">
            {blocks.map((block, index) => {
                if (block.type === "display-math") {
                    return (
                        <div
                            key={`display-math-${index}`}
                            className="latex-display overflow-x-auto rounded-2xl border border-slate-200 bg-white/80 px-4 py-4 shadow-sm"
                        >
                            <BlockMath math={block.content} />
                        </div>
                    );
                }

                return (
                    <ReactMarkdown
                        key={`markdown-${index}`}
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ children }) => (
                                <h1 className="mb-3 text-2xl font-semibold text-slate-900">
                                    {renderChildrenWithMath(children, `h1-${index}`)}
                                </h1>
                            ),
                            h2: ({ children }) => (
                                <h2 className="mb-3 text-xl font-semibold text-slate-900">
                                    {renderChildrenWithMath(children, `h2-${index}`)}
                                </h2>
                            ),
                            h3: ({ children }) => (
                                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                                    {renderChildrenWithMath(children, `h3-${index}`)}
                                </h3>
                            ),
                            p: ({ children }) => (
                                <p className="mb-4 leading-7 text-slate-800">
                                    {renderChildrenWithMath(children, `p-${index}`)}
                                </p>
                            ),
                            li: ({ children }) => (
                                <li className="mb-2 leading-7 text-slate-800">
                                    {renderChildrenWithMath(children, `li-${index}`)}
                                </li>
                            ),
                            strong: ({ children }) => (
                                <strong className="font-semibold text-slate-900">
                                    {renderChildrenWithMath(
                                        children,
                                        `strong-${index}`,
                                    )}
                                </strong>
                            ),
                            em: ({ children }) => (
                                <em className="italic text-slate-800">
                                    {renderChildrenWithMath(children, `em-${index}`)}
                                </em>
                            ),
                            blockquote: ({ children }) => (
                                <blockquote className="mb-4 rounded-r-xl border-l-4 border-sky-300 bg-sky-50 px-4 py-3 text-slate-700">
                                    {renderChildrenWithMath(
                                        children,
                                        `blockquote-${index}`,
                                    )}
                                </blockquote>
                            ),
                            ul: ({ children }) => (
                                <ul className="mb-4 list-disc space-y-1 pl-6">
                                    {children}
                                </ul>
                            ),
                            ol: ({ children }) => (
                                <ol className="mb-4 list-decimal space-y-1 pl-6">
                                    {children}
                                </ol>
                            ),
                            code: ({ children }) => (
                                <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-sm text-slate-900">
                                    {children}
                                </code>
                            ),
                            pre: ({ children }) => (
                                <pre className="mb-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-sm text-slate-100">
                                    {children}
                                </pre>
                            ),
                        }}
                    >
                        {block.content}
                    </ReactMarkdown>
                );
            })}
        </div>
    );
}
