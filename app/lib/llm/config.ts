// app/lib/llm/config.ts

import { decodeKey, loadLLMConfig } from "../storage";
import { LLMConfig, LLMProvider } from "./types";

const VALID_PROVIDERS: readonly LLMProvider[] = [
    "openai",
    "gemini",
    "groq",
    "ollama",
];

function isLLMProvider(p: string): p is LLMProvider {
    return VALID_PROVIDERS.includes(p as LLMProvider);
}

export function getActiveLLMConfig(): LLMConfig {
    const stored = loadLLMConfig();

    if (!stored) {
        throw new Error("No LLM configuration found");
    }

    if (!isLLMProvider(stored.provider)) {
        throw new Error(`Invalid LLM provider: ${stored.provider}`);
    }

    return {
        provider: stored.provider, // now correctly narrowed
        model: stored.model,
        apiKey: stored.apiKey ? decodeKey(stored.apiKey) : undefined,
    };
}
