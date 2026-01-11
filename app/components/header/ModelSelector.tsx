// components/header/ModelSelector.tsx

"use client";

import { useEffect, useState } from "react";
import { loadLLMConfig } from "@/app/lib/storage";
import ModelSelectorModal from "./ModelSelectorModal";

export default function ModelSelector() {
    const [open, setOpen] = useState(false);
    const [label, setLabel] = useState("Select Model");

    useEffect(() => {
        const cfg = loadLLMConfig();
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (cfg?.model) setLabel(cfg.model);
    }, [open]);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="text-xs md:text-sm px-3 py-1.5 border ml-4 border-gray-700 rounded hover:border-blue-400 transition"
            >
                Model: <span className="text-cyan-400">{label}</span>
            </button>

            {open && <ModelSelectorModal onClose={() => setOpen(false)} />}
        </>
    );
}
