// app/lib/llm/providers/openai.ts

import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat";
import { LLMRequest, LLMResponse } from "../types";

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
    });

    return {
        rawText: completion.choices[0]?.message?.content ?? "",
    };
}
