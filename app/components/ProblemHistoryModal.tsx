"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import { ProblemHistoryItem } from "@/app/lib/problemHistoryStorage";

function preview(text: string, words = 30) {
    const w = text.split(/\s+/);
    return w.length <= words ? text : w.slice(0, words).join(" ") + " …";
}

function badgeColor(type: "tool" | "model") {
    if (type === "tool")
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
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
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-white w-full max-w-4xl rounded-xl shadow-xl flex flex-col"
            >
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <div className="text-lg font-semibold">History</div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black text-lg"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-4 overflow-y-auto max-h-[70vh]">
                    {items.length === 0 ? (
                        <div className="text-sm text-gray-500">
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
                                        className="border rounded-lg px-4 py-3 hover:bg-gray-50 flex justify-between gap-4"
                                    >
                                        {/* Left content */}
                                        <div
                                            className="flex-1 cursor-pointer"
                                            onClick={() => onSelect(item)}
                                        >
                                            <div className="text-sm text-gray-900">
                                                {preview(item.problem)}
                                            </div>

                                            <div className="flex flex-wrap gap-2 mt-2 items-center text-xs">
                                                <div
                                                    className={`px-2 py-0.5 rounded border ${badgeColor(
                                                        "tool"
                                                    )}`}
                                                >
                                                    {item.tool.toUpperCase()}
                                                </div>

                                                <div
                                                    className={`px-2 py-0.5 rounded border ${badgeColor(
                                                        "model"
                                                    )}`}
                                                >
                                                    {item.model}
                                                </div>

                                                <div className="text-gray-400">
                                                    {new Date(
                                                        item.createdAt
                                                    ).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Delete */}
                                        <div className="flex items-start">
                                            <button
                                                onClick={() =>
                                                    onDelete(item.id)
                                                }
                                                title="Delete"
                                                className="text-red-500 hover:text-red-700 p-2"
                                            >
                                                <FiTrash2 size={22} />
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
