// app/lib/llm/index.ts

import { getActiveLLMConfig } from "./config";
import { LLMRequest } from "./types";

import { callGemini } from "./providers/gemini";
import { callOpenAI } from "./providers/openai";
import { callGroq } from "./providers/groq";
import { callOllama } from "./providers/ollama";

export async function generateText(request: LLMRequest): Promise<string> {
    const config = getActiveLLMConfig();

    switch (config.provider) {
        case "gemini": {
            if (!config.apiKey) {
                throw new Error(
                    "Missing Gemini API key. Please set it in Model Configuration."
                );
            }

            // 🔒 apiKey is now narrowed to string
            return (await callGemini(config.apiKey, config.model, request))
                .rawText;
        }

        case "openai": {
            if (!config.apiKey) {
                throw new Error(
                    "Missing OpenAI API key. Please set it in Model Configuration."
                );
            }

            return (await callOpenAI(config.apiKey, config.model, request))
                .rawText;
        }

        case "groq": {
            if (!config.apiKey) {
                throw new Error(
                    "Missing Groq API key. Please set it in Model Configuration."
                );
            }

            return (await callGroq(config.apiKey, config.model, request))
                .rawText;
        }

        case "ollama": {
            return (await callOllama(config.model, request)).rawText;
        }

        default: {
            // Exhaustive check (TS safety)
            const _exhaustive: never = config.provider;
            throw new Error(`Unsupported provider: ${_exhaustive}`);
        }
    }
}
