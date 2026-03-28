// app/lib/llm/providers/openai.ts

import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat";
import { LLMRequest, LLMResponse } from "../types";

const MAX_COMPLETION_TOKENS = 12000;

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

    const completion = await client.chat.completions.create({
        model,
        messages,
        max_completion_tokens: MAX_COMPLETION_TOKENS,
    });

    return {
        rawText: completion.choices[0]?.message?.content ?? "",
    };
}
