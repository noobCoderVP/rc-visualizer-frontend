// components/header/ModelSelector.tsx

"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { Bot } from "lucide-react";
import ModelSelectorModal from "./ModelSelectorModal";

function subscribe() {
    return () => {};
}

function getSnapshot() {
    return localStorage.getItem("llm_config");
}

function getServerSnapshot() {
    return null;
}

export default function ModelSelector() {
    const [open, setOpen] = useState(false);
    const configSnapshot = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot,
    );
    const config = useMemo(() => {
        if (!configSnapshot) {
            return null;
        }

        try {
            return JSON.parse(configSnapshot) as {
                provider?: string;
                model?: string;
            };
        } catch {
            return null;
        }
    }, [configSnapshot]);
    const label = config?.model ?? "Select model";
    const provider = config?.provider?.toUpperCase() ?? "";

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left text-xs shadow-sm transition hover:border-teal-400 hover:bg-teal-50 md:min-w-[220px] md:text-sm"
            >
                <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-slate-500">
                    <Bot className="h-3.5 w-3.5" />
                    {provider || "AI provider"}
                </span>
                <span className="mt-1 flex items-center gap-2 truncate font-medium text-slate-900">
                    <Bot className="h-4 w-4 shrink-0" />
                    {label}
                </span>
            </button>

            {open && <ModelSelectorModal onClose={() => setOpen(false)} />}
        </>
    );
}
