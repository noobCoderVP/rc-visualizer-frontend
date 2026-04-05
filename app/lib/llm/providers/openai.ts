// app/lib/llm/providers/openai.ts

import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat";
import { LLMRequest, LLMResponse } from "../types";
import { resolveMaxOutputTokens } from "../modelLimits";

export async function callOpenAI(
    apiKey: string,
    model: string,
    request: LLMRequest
): Promise<LLMResponse> {
    const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

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

    const max_completion_tokens = resolveMaxOutputTokens(
        "openai",
        model,
        request.maxOutputTokens
    );

    const completion = await client.chat.completions.create({
        model,
        messages,
        ...(max_completion_tokens !== undefined
            ? { max_completion_tokens }
            : {}),
    });

    return {
        rawText: completion.choices[0]?.message?.content ?? "",
    };
}
