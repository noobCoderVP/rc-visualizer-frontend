/* eslint-disable @typescript-eslint/no-explicit-any */
import { nanoid } from "nanoid";

export type ToolType = "hints" | "solve" | "optimize" | "dryrun" | "testcases";

export type ProblemHistoryItem = {
    id: string;
    problem: string;
    tool: ToolType;
    model: string;
    payload: any;
    createdAt: number;
};

const STORAGE_KEY = "cp_problem_history_v3";

function loadAll(): ProblemHistoryItem[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveAll(items: ProblemHistoryItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getHistory(): ProblemHistoryItem[] {
    return loadAll().sort((a, b) => b.createdAt - a.createdAt);
}

export function addHistoryItem(
    item: Omit<ProblemHistoryItem, "id" | "createdAt">
) {
    const history = loadAll();

    history.unshift({
        ...item,
        id: nanoid(),
        createdAt: Date.now(),
    });

    saveAll(history);
}

export function deleteHistoryItem(id: string) {
    saveAll(loadAll().filter((h) => h.id !== id));
}
