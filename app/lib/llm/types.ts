// app/lib/llm/types.ts

export type LLMProvider = "openai" | "gemini" | "groq" | "ollama";

export type LLMConfig = {
    provider: LLMProvider;
    model: string;
    apiKey?: string; // decoded before use
};

export type LLMRequest = {
    systemPrompt?: string;
    userPrompt: string;
};

export type LLMResponse = {
    rawText: string;
};
