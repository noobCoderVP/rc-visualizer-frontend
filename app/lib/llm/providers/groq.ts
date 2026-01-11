// app/lib/llm/providers/groq.ts

import Groq from "groq-sdk";
import { LLMRequest, LLMResponse } from "../types";

export async function callGroq(
    apiKey: string,
    model: string,
    request: LLMRequest
): Promise<LLMResponse> {
    const client = new Groq({ apiKey });

    const res = await client.chat.completions.create({
        model,
        messages: [
            ...(request.systemPrompt
                ? [{ role: "system", content: request.systemPrompt }]
                : []),
            { role: "user", content: request.userPrompt },
        ],
    });

    return {
        rawText: res.choices[0]?.message?.content ?? "",
    };
}
