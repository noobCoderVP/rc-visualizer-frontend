// app/lib/llm/providers/groq.ts

import Groq from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

import { LLMRequest, LLMResponse } from "../types";
import { resolveGroqCompletionBudget } from "../modelLimits";

export async function callGroq(
    apiKey: string,
    model: string,
    request: LLMRequest
): Promise<LLMResponse> {
    const client = new Groq({
        apiKey,
        dangerouslyAllowBrowser: true,
    });

    // ✅ Explicitly typed messages array
    const messages: ChatCompletionMessageParam[] = [];

    if (request.systemPrompt) {
        messages.push({
            role: "system",
            content: request.systemPrompt,
        });
    }

    messages.push({
        role: "user",
        content: request.userPrompt,
    });

    const promptText = messages
        .map((message) =>
            typeof message.content === "string" ? message.content : ""
        )
        .join("\n\n");

    const max_completion_tokens = resolveGroqCompletionBudget(
        model,
        promptText,
        request.maxOutputTokens
    );

    const res = await client.chat.completions.create({
        model,
        messages,
        ...(max_completion_tokens !== undefined
            ? { max_completion_tokens }
            : {}),
    });

    return {
        rawText: res.choices[0]?.message?.content ?? "",
    };
}
