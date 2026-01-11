export const MODEL_REGISTRY: Record<string, string[]> = {
    ollama: ["llama3.1:latest"],

    gemini: [
        "models/gemini-2.5-flash-lite",
        "models/gemini-2.5-flash",
        "models/gemini-3-flash",
    ],

    groq: [
        "llama-3.1-8b-instant",
        "llama-3.3-70b-versatile",
        "qwen/qwen3-32b",
        "moonshotai/kimi-k2-instruct",
        "openai/gpt-oss-120b",
    ],

    openai: [
        // 🔥 Recommended default
        "gpt-5.2-chat-latest",

        // 🧠 Deep optimization
        "gpt-5.2-pro",
        "gpt-5.1-chat-latest",

        // ⚡ Fast hints
        "gpt-5-mini",
        "gpt-4.1-mini",
        "gpt-4o-mini",

        // 🧱 Stable legacy
        "gpt-4.1",
        "gpt-4o",
    ],
};
