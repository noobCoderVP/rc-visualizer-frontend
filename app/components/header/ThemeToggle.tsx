"use client";

import { useState } from "react";

const THEME_STORAGE_KEY = "app_theme";

function applyTheme(nextTheme: "light" | "dark") {
    const root = document.documentElement;
    root.classList.toggle("dark", nextTheme === "dark");
    root.style.colorScheme = nextTheme;
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
}

export default function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        if (
            typeof document !== "undefined" &&
            document.documentElement.classList.contains("dark")
        ) {
            return "dark";
        }

        return "light";
    });

    function handleToggle() {
        const nextTheme = theme === "dark" ? "light" : "dark";
        applyTheme(nextTheme);
        setTheme(nextTheme);
    }

    return (
        <button
            type="button"
            onClick={handleToggle}
            aria-label="Toggle dark mode"
            className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left text-xs shadow-sm transition hover:border-teal-400 hover:bg-teal-50 md:text-sm"
        >
            <span className="block text-[10px] uppercase tracking-[0.24em] text-slate-500">
                Theme
            </span>
            <span
                suppressHydrationWarning
                className="block font-medium text-slate-900"
            >
                {theme === "dark" ? "Dark" : "Light"}
            </span>
        </button>
    );
}
