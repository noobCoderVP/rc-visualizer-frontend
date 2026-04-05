// app/lib/llm/providers/gemini.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { LLMRequest, LLMResponse } from "../types";
import { resolveMaxOutputTokens } from "../modelLimits";

export async function callGemini(
    apiKey: string,
    model: string,
    request: LLMRequest
): Promise<LLMResponse> {
    if (!apiKey) {
        throw new Error("Missing Gemini API key");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const maxOutputTokens = resolveMaxOutputTokens(
        "gemini",
        model,
        request.maxOutputTokens
    );

    const generativeModel = genAI.getGenerativeModel({
        model,
        generationConfig: {
            ...(maxOutputTokens !== undefined ? { maxOutputTokens } : {}),
        },
    });

    const promptParts: string[] = [];

    if (request.systemPrompt) {
        promptParts.push(request.systemPrompt);
    }

    promptParts.push(request.userPrompt);

    const finalPrompt = promptParts.join("\n\n");

    const result = await generativeModel.generateContent(finalPrompt);

    return {
        rawText: result.response.text(),
    };
}
