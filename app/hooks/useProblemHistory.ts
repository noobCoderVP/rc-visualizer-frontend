/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import {
    getHistory,
    addHistoryItem,
    deleteHistoryItem,
    ProblemHistoryItem,
    ToolType,
} from "@/app/lib/problemHistoryStorage";

export function useProblemHistory(tool: ToolType) {
    const [history, setHistory] = useState<ProblemHistoryItem[]>([]);

    useEffect(() => {
        setHistory(getHistory().filter((h) => h.tool === tool));
    }, [tool]);

    function saveRun(problem: string, payload: any, model: string) {
        addHistoryItem({
            problem,
            tool,
            payload,
            model,
        });
        setHistory(getHistory().filter((h) => h.tool === tool));
    }

    function deleteRun(id: string) {
        deleteHistoryItem(id);
        setHistory(getHistory().filter((h) => h.tool === tool));
    }

    return {
        history,
        saveRun,
        deleteRun,
    };
}
