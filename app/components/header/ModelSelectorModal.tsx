/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MODEL_REGISTRY } from "@/app/lib/models";
import {
    saveLLMConfig,
    encodeKey,
    decodeKey,
    loadLLMConfig,
} from "@/app/lib/storage";

export default function ModelSelectorModal({
    onClose,
}: {
    onClose: () => void;
}) {
    const providers = Object.keys(MODEL_REGISTRY);

    const [provider, setProvider] = useState(providers[0]);
    const [model, setModel] = useState(MODEL_REGISTRY[providers[0]][0]);
    const [apiKey, setApiKey] = useState("");
    const [showKey, setShowKey] = useState(false);

    /* -------------------- Prefill from localStorage -------------------- */
    useEffect(() => {
        const stored = loadLLMConfig();
        if (!stored) return;

        // Validate provider
        if (stored.provider && MODEL_REGISTRY[stored.provider]) {
            setProvider(stored.provider);

            // Validate model under provider
            if (
                stored.model &&
                MODEL_REGISTRY[stored.provider].includes(stored.model)
            ) {
                setModel(stored.model);
            } else {
                setModel(MODEL_REGISTRY[stored.provider][0]);
            }
        }

        // Decode API key if present
        if (stored.apiKey) {
            try {
                setApiKey(decodeKey(stored.apiKey));
            } catch {
                // corrupted key, ignore silently
                setApiKey("");
            }
        }
    }, []);

    function handleSave() {
        saveLLMConfig({
            provider,
            model,
            apiKey: apiKey ? encodeKey(apiKey) : undefined,
        });
        onClose();
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg rounded-xl border border-gray-800 bg-gray-950 shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                    <div>
                        <h2 className="text-lg font-semibold text-white">
                            Model Configuration
                        </h2>
                        <p className="text-xs text-gray-400">
                            Choose provider, model, and API credentials
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-md p-1 text-gray-400 hover:bg-gray-800 hover:text-white transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-5">
                    {/* Provider */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                            Provider
                        </label>
                        <select
                            value={provider}
                            onChange={(e) => {
                                const p = e.target.value;
                                setProvider(p);
                                setModel(MODEL_REGISTRY[p][0]);
                            }}
                            className="w-full rounded-md border border-gray-800 bg-black px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            {providers.map((p) => (
                                <option key={p} value={p}>
                                    {p.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Model */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                            Model
                        </label>
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="w-full rounded-md border border-gray-800 bg-black px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            {MODEL_REGISTRY[provider].map((m) => (
                                <option key={m} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                        <div className="mt-1 text-[11px] text-gray-500">
                            Selected model will be used across hints, solve, and
                            optimization.
                        </div>
                    </div>

                    {/* API Key */}
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                            API Key
                        </label>

                        <div className="relative">
                            <input
                                type={showKey ? "text" : "password"}
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                placeholder="sk-••••••••••••••••"
                                className="w-full rounded-md border border-gray-800 bg-black px-3 py-2 pr-10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowKey((v) => !v)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
                            >
                                {showKey ? "Hide" : "Show"}
                            </button>
                        </div>

                        <div className="mt-1 text-[11px] text-gray-500">
                            Stored locally (base64-encoded). Never sent
                            automatically.
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 bg-gray-950/50">
                    <button
                        onClick={onClose}
                        className="text-sm text-gray-400 hover:text-white transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition"
                    >
                        Save Configuration
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
