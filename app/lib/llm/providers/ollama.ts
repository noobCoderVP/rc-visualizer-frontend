// app/lib/llm/providers/ollama.ts

import { LLMRequest, LLMResponse } from "../types";

export async function callOllama(
    model: string,
    request: LLMRequest
): Promise<LLMResponse> {
    const res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model,
            prompt: `
${request.systemPrompt ?? ""}
${request.userPrompt}
`,
            stream: false,
        }),
    });

    const data = await res.json();

    return {
        rawText: data.response,
    };
}
