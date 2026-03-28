import { GoogleGenerativeAI } from "@google/generative-ai";

const MAX_OUTPUT_TOKENS = 8192;

export function getGeminiModel() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    return !apiUrl && apiKey
        ? new GoogleGenerativeAI(apiKey).getGenerativeModel({
              model: "gemini-2.5-flash",
              generationConfig: {
                  maxOutputTokens: MAX_OUTPUT_TOKENS,
              },
          })
        : null;
}
