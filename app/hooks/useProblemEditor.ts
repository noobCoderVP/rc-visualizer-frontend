"use client";

import { useState } from "react";

export function useProblemEditor() {
    const [problem, setProblem] = useState("");
    const [preview, setPreview] = useState(false);

    function resetEditor() {
        setProblem("");
    }

    return {
        problem,
        setProblem,
        preview,
        setPreview,
        resetEditor,
    };
}
