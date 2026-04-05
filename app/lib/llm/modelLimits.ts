import type { LLMProvider } from "./types";

const OPENAI_DEFAULT_MAX_OUTPUT_TOKENS = 8192;
const GEMINI_DEFAULT_MAX_OUTPUT_TOKENS = 8192;
const GROQ_DEFAULT_MAX_OUTPUT_TOKENS = 4096;

const GROQ_MODEL_MAX_OUTPUT_TOKENS: Record<string, number> = {
    "allam-2-7b": 6000,
    "canopylabs/orpheus-arabic-saudi": 1200,
    "canopylabs/orpheus-v1-english": 1200,
    "groq/compound": 70000,
    "groq/compound-mini": 70000,
    "llama-3.1-8b-instant": 6000,
    "llama-3.3-70b-versatile": 12000,
    "meta-llama/llama-4-scout-17b-16e-instruct": 30000,
    "meta-llama/llama-prompt-guard-2-22m": 15000,
    "meta-llama/llama-prompt-guard-2-86m": 15000,
    "moonshotai/kimi-k2-instruct": 10000,
    "moonshotai/kimi-k2-instruct-0905": 10000,
    "openai/gpt-oss-120b": 8000,
    "openai/gpt-oss-20b": 8000,
    "openai/gpt-oss-safeguard-20b": 8000,
    "qwen/qwen3-32b": 6000,
};

const GROQ_MODEL_TPM_LIMITS: Record<string, number> = {
    "allam-2-7b": 7000,
    "canopylabs/orpheus-arabic-saudi": 1200,
    "canopylabs/orpheus-v1-english": 1200,
    "groq/compound": 70000,
    "groq/compound-mini": 70000,
    "llama-3.1-8b-instant": 6000,
    "llama-3.3-70b-versatile": 12000,
    "meta-llama/llama-4-scout-17b-16e-instruct": 30000,
    "meta-llama/llama-prompt-guard-2-22m": 15000,
    "meta-llama/llama-prompt-guard-2-86m": 15000,
    "moonshotai/kimi-k2-instruct": 10000,
    "moonshotai/kimi-k2-instruct-0905": 10000,
    "openai/gpt-oss-120b": 8000,
    "openai/gpt-oss-20b": 8000,
    "openai/gpt-oss-safeguard-20b": 8000,
    "qwen/qwen3-32b": 6000,
};

function getProviderDefaultMaxOutputTokens(provider: LLMProvider): number {
    switch (provider) {
        case "openai":
            return OPENAI_DEFAULT_MAX_OUTPUT_TOKENS;
        case "gemini":
            return GEMINI_DEFAULT_MAX_OUTPUT_TOKENS;
        case "groq":
            return GROQ_DEFAULT_MAX_OUTPUT_TOKENS;
        case "ollama":
            return Number.POSITIVE_INFINITY;
        default: {
            const _exhaustive: never = provider;
            return _exhaustive;
        }
    }
}

export function resolveMaxOutputTokens(
    provider: LLMProvider,
    model: string,
    requestedMaxOutputTokens?: number
): number | undefined {
    const providerLimit = getProviderDefaultMaxOutputTokens(provider);
    const modelLimit =
        provider === "groq"
            ? GROQ_MODEL_MAX_OUTPUT_TOKENS[model] ?? providerLimit
            : providerLimit;

    if (!Number.isFinite(modelLimit)) {
        return requestedMaxOutputTokens;
    }

    if (
        requestedMaxOutputTokens === undefined ||
        requestedMaxOutputTokens <= 0
    ) {
        return modelLimit;
    }

    return Math.min(requestedMaxOutputTokens, modelLimit);
}

export function estimateTokenCount(text: string): number {
    if (!text.trim()) {
        return 0;
    }

    // Bias high on purpose so we reserve a safer amount under TPM limits.
    return Math.ceil(text.length / 3);
}

export function resolveGroqCompletionBudget(
    model: string,
    promptText: string,
    requestedMaxOutputTokens?: number
): number | undefined {
    const modelMaxOutputTokens = resolveMaxOutputTokens(
        "groq",
        model,
        requestedMaxOutputTokens
    );

    if (modelMaxOutputTokens === undefined) {
        return undefined;
    }

    const tpmLimit = GROQ_MODEL_TPM_LIMITS[model];
    if (!tpmLimit) {
        return modelMaxOutputTokens;
    }

    const estimatedPromptTokens = estimateTokenCount(promptText);
    const safetyBuffer = Math.max(256, Math.ceil(tpmLimit * 0.1));
    const availableCompletionTokens = tpmLimit - estimatedPromptTokens - safetyBuffer;

    if (availableCompletionTokens <= 0) {
        return 1;
    }

    return Math.max(1, Math.min(modelMaxOutputTokens, availableCompletionTokens));
}
