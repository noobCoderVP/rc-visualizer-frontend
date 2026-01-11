/* eslint-disable @typescript-eslint/no-explicit-any */
import { nanoid } from "nanoid";

/* ---------- Types ---------- */

export type ToolType = "hints" | "solve" | "optimize" | "explain" | "dry_run";

export type ToolResult = {
    tool: ToolType;
    payload: any;
    createdAt: number;
};

export type ProblemSession = {
    id: string;
    problem: string;
    results: ToolResult[];
    createdAt: number;
    updatedAt: number;
};

/* ---------- Storage ---------- */

const STORAGE_KEY = "cp_problem_sessions_v1";

function loadAll(): ProblemSession[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveAll(sessions: ProblemSession[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

/* ---------- Public API ---------- */

export function getSessions(): ProblemSession[] {
    return loadAll().sort((a, b) => b.updatedAt - a.updatedAt);
}

export function upsertSession(
    problem: string,
    tool: ToolType,
    payload: any
): ProblemSession {
    const sessions = loadAll();
    const now = Date.now();

    let session = sessions.find((s) => s.problem.trim() === problem.trim());

    if (!session) {
        session = {
            id: nanoid(),
            problem,
            results: [],
            createdAt: now,
            updatedAt: now,
        };
        sessions.unshift(session);
    }

    session.results.unshift({
        tool,
        payload,
        createdAt: now,
    });

    session.updatedAt = now;

    saveAll(sessions);
    return session;
}

export function deleteSession(id: string) {
    saveAll(loadAll().filter((s) => s.id !== id));
}
