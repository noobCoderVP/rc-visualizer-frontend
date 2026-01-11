export type LLMConfig = {
    provider: string;
    model: string;
    apiKey?: string;
};

export function getActiveModelLabel(): string {
    try {
        const raw = localStorage.getItem("llm_config");
        if (!raw) return "unknown";

        const cfg: LLMConfig = JSON.parse(raw);

        if (!cfg.provider || !cfg.model) {
            return "unknown";
        }

        // Example: groq:moonshotai/kimi-k2-instruct
        return `${cfg.provider}:${cfg.model}`;
    } catch {
        return "unknown";
    }
}
