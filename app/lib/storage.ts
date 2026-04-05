// components/llm/storage.ts

export type LLMConfig = {
    provider: string;
    model: string;
    apiKey?: string; // base64 encoded
};

const KEY = "llm_config";
const CONFIG_CHANGED_EVENT = "llm-config-changed";

export function saveLLMConfig(config: LLMConfig) {
    localStorage.setItem(KEY, JSON.stringify(config));
    window.dispatchEvent(new Event(CONFIG_CHANGED_EVENT));
}

export function loadLLMConfig(): LLMConfig | null {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
}

export function subscribeToLLMConfig(callback: () => void) {
    const handleChange = () => callback();

    window.addEventListener("storage", handleChange);
    window.addEventListener(CONFIG_CHANGED_EVENT, handleChange);

    return () => {
        window.removeEventListener("storage", handleChange);
        window.removeEventListener(CONFIG_CHANGED_EVENT, handleChange);
    };
}

export function encodeKey(key: string) {
    return btoa(key);
}

export function decodeKey(encoded: string) {
    return atob(encoded);
}
