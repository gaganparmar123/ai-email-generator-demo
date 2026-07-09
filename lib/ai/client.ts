import OpenAI from "openai"

if (typeof window !== "undefined") {
  throw new Error("AI client can only be used on the server side.")
}

const apiKey = process.env.OPENAI_API_KEY

// Create client instance. 
// If API key is missing or is the placeholder 'sk-xxxxxxxxxxxxxxxx', 
// we will construct it but any actual request will return a descriptive error in the service layer.
export const openai = new OpenAI({
  apiKey: apiKey === "sk-xxxxxxxxxxxxxxxx" ? "" : apiKey || "",
})

export function isApiKeyConfigured(): boolean {
  return !!apiKey && apiKey !== "sk-xxxxxxxxxxxxxxxx" && apiKey.trim() !== ""
}
