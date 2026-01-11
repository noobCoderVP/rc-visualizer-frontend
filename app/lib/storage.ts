// components/llm/storage.ts

export type LLMConfig = {
    provider: string;
    model: string;
    apiKey?: string; // base64 encoded
};

const KEY = "llm_config";

export function saveLLMConfig(config: LLMConfig) {
    localStorage.setItem(KEY, JSON.stringify(config));
}

export function loadLLMConfig(): LLMConfig | null {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
}

export function encodeKey(key: string) {
    return btoa(key);
}

export function decodeKey(encoded: string) {
    return atob(encoded);
}
