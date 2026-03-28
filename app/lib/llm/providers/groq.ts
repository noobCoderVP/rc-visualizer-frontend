// app/lib/llm/providers/groq.ts

import Groq from "groq-sdk";
import type { ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

import { LLMRequest, LLMResponse } from "../types";

const MAX_COMPLETION_TOKENS = 12000;

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

    const res = await client.chat.completions.create({
        model,
        messages,
        max_completion_tokens: MAX_COMPLETION_TOKENS,
    });

    return {
        rawText: res.choices[0]?.message?.content ?? "",
    };
}
