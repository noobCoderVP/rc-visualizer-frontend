"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { ProblemHistoryItem } from "@/app/lib/problemHistoryStorage";

function preview(text: string, words = 30) {
    const splitWords = text.split(/\s+/);
    return splitWords.length <= words
        ? text
        : `${splitWords.slice(0, words).join(" ")} ...`;
}

function badgeColor(type: "tool" | "model") {
    if (type === "tool") {
        return "border-sky-300 bg-sky-100 text-sky-900";
    }

    return "border-emerald-300 bg-emerald-100 text-emerald-900";
}

export default function ProblemHistoryModal({
    items,
    onSelect,
    onDelete,
    onClose,
}: {
    items: ProblemHistoryItem[];
    onSelect: (item: ProblemHistoryItem) => void;
    onDelete: (id: string) => void;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="flex max-h-[82vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-300/80 bg-white shadow-2xl"
            >
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
                    <div>
                        <div className="text-lg font-semibold text-slate-900">
                            History
                        </div>
                        <div className="text-sm text-slate-500">
                            Reopen previous runs and compare outputs.
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                    >
                        Close
                    </button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
                    {items.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500">
                            No history yet.
                        </div>
                    ) : (
                        <ul className="space-y-4">
                            <AnimatePresence>
                                {items.map((item) => (
                                    <motion.li
                                        key={item.id}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={{ duration: 0.15 }}
                                        className="flex gap-4 rounded-2xl border border-slate-300 bg-white px-4 py-4 shadow-md transition hover:border-slate-400 hover:bg-slate-50 hover:shadow-lg"
                                    >
                                        <div
                                            className="flex-1 cursor-pointer"
                                            onClick={() => onSelect(item)}
                                        >
                                            <div className="text-sm leading-7 text-slate-800">
                                                {preview(item.problem)}
                                            </div>

                                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                                                <div
                                                    className={`rounded-full border px-2.5 py-1 font-medium ${badgeColor(
                                                        "tool",
                                                    )}`}
                                                >
                                                    {item.tool.toUpperCase()}
                                                </div>

                                                <div
                                                    className={`rounded-full border px-2.5 py-1 font-medium ${badgeColor(
                                                        "model",
                                                    )}`}
                                                >
                                                    {item.model}
                                                </div>

                                                <div className="text-slate-500">
                                                    {new Date(
                                                        item.createdAt,
                                                    ).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <button
                                                onClick={() => onDelete(item.id)}
                                                title="Delete"
                                                className="rounded-xl border border-red-200 bg-red-50 p-2 text-red-600 transition hover:border-red-300 hover:bg-red-100 hover:text-red-700"
                                            >
                                                <FiTrash2 size={20} />
                                            </button>
                                        </div>
                                    </motion.li>
                                ))}
                            </AnimatePresence>
                        </ul>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
