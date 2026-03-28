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

    useEffect(() => {
        const stored = loadLLMConfig();
        if (!stored) return;

        if (stored.provider && MODEL_REGISTRY[stored.provider]) {
            setProvider(stored.provider);

            if (
                stored.model &&
                MODEL_REGISTRY[stored.provider].includes(stored.model)
            ) {
                setModel(stored.model);
            } else {
                setModel(MODEL_REGISTRY[stored.provider][0]);
            }
        }

        if (stored.apiKey) {
            try {
                setApiKey(decodeKey(stored.apiKey));
            } catch {
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
                onClick={(event) => event.stopPropagation()}
                className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white shadow-2xl"
            >
                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">
                            Model Configuration
                        </h2>
                        <p className="text-xs text-slate-500">
                            Choose provider, model, and API credentials.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                        X
                    </button>
                </div>

                <div className="space-y-5 px-6 py-5">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-500">
                            Provider
                        </label>
                        <select
                            value={provider}
                            onChange={(event) => {
                                const nextProvider = event.target.value;
                                setProvider(nextProvider);
                                setModel(MODEL_REGISTRY[nextProvider][0]);
                            }}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            {providers.map((item) => (
                                <option key={item} value={item}>
                                    {item.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-500">
                            Model
                        </label>
                        <select
                            value={model}
                            onChange={(event) => setModel(event.target.value)}
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            {MODEL_REGISTRY[provider].map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                        <div className="mt-1 text-[11px] text-slate-500">
                            Higher-capacity responses are enabled to reduce
                            truncation during longer solves and explanations.
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-slate-500">
                            API Key
                        </label>

                        <div className="relative">
                            <input
                                type={showKey ? "text" : "password"}
                                value={apiKey}
                                onChange={(event) => setApiKey(event.target.value)}
                                placeholder="Paste provider API key"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 pr-10 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowKey((value) => !value)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-900"
                            >
                                {showKey ? "Hide" : "Show"}
                            </button>
                        </div>

                        <div className="mt-1 text-[11px] text-slate-500">
                            Stored locally in the browser. It is not submitted
                            until you run a generation request.
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/70 px-6 py-4">
                    <button
                        onClick={onClose}
                        className="text-sm text-slate-500 transition hover:text-slate-900"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-600"
                    >
                        Save Configuration
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
