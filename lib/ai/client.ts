import { GoogleGenerativeAI } from "@google/generative-ai"

if (typeof window !== "undefined") {
  throw new Error("AI client can only be used on the server side.")
}

const apiKey = process.env.GEMINI_API_KEY

// Create client instance.
// If API key is missing or is a placeholder value,
// any actual request will return a descriptive error in the service layer.
export const genAI = new GoogleGenerativeAI(apiKey || "")

export function isApiKeyConfigured(): boolean {
  return !!apiKey && apiKey.trim() !== ""
}
