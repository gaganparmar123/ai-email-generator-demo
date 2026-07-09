// Type shim for @google/generative-ai
// The package ships types split across multiple files; this re-exports them
// so TypeScript can resolve the module without errors.
declare module "@google/generative-ai" {
  export * from "@google/generative-ai/dist/types/enums"
  export * from "@google/generative-ai/dist/types/content"
  export * from "@google/generative-ai/dist/types/function-calling"

  export class GoogleGenerativeAI {
    constructor(apiKey: string)
    getGenerativeModel(params: {
      model: string
      systemInstruction?: string
      generationConfig?: GenerationConfig
      safetySettings?: SafetySetting[]
    }): GenerativeModel
  }

  export interface GenerationConfig {
    temperature?: number
    topP?: number
    topK?: number
    maxOutputTokens?: number
    responseMimeType?: string
    responseSchema?: Schema
    stopSequences?: string[]
    candidateCount?: number
  }

  export interface SafetySetting {
    category: HarmCategory
    threshold: HarmBlockThreshold
  }

  export interface Schema {
    type: SchemaType
    properties?: Record<string, Schema>
    items?: Schema
    enum?: string[]
    required?: string[]
    nullable?: boolean
    description?: string
  }

  export enum SchemaType {
    STRING = "STRING",
    NUMBER = "NUMBER",
    INTEGER = "INTEGER",
    BOOLEAN = "BOOLEAN",
    ARRAY = "ARRAY",
    OBJECT = "OBJECT",
  }

  export enum HarmCategory {
    HARM_CATEGORY_UNSPECIFIED = "HARM_CATEGORY_UNSPECIFIED",
    HARM_CATEGORY_HATE_SPEECH = "HARM_CATEGORY_HATE_SPEECH",
    HARM_CATEGORY_SEXUALLY_EXPLICIT = "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    HARM_CATEGORY_HARASSMENT = "HARM_CATEGORY_HARASSMENT",
    HARM_CATEGORY_DANGEROUS_CONTENT = "HARM_CATEGORY_DANGEROUS_CONTENT",
  }

  export enum HarmBlockThreshold {
    HARM_BLOCK_THRESHOLD_UNSPECIFIED = "HARM_BLOCK_THRESHOLD_UNSPECIFIED",
    BLOCK_LOW_AND_ABOVE = "BLOCK_LOW_AND_ABOVE",
    BLOCK_MEDIUM_AND_ABOVE = "BLOCK_MEDIUM_AND_ABOVE",
    BLOCK_ONLY_HIGH = "BLOCK_ONLY_HIGH",
    BLOCK_NONE = "BLOCK_NONE",
  }

  export class GenerativeModel {
    generateContent(prompt: string | Part[]): Promise<GenerateContentResult>
    generateContentStream(prompt: string | Part[]): Promise<GenerateContentStreamResult>
    startChat(params?: StartChatParams): ChatSession
  }

  export interface GenerateContentResult {
    response: GenerateContentResponse
  }

  export interface GenerateContentStreamResult {
    stream: AsyncGenerator<GenerateContentResponse>
    response: Promise<GenerateContentResponse>
  }

  export interface GenerateContentResponse {
    text(): string
    candidates?: Candidate[]
    promptFeedback?: PromptFeedback
    usageMetadata?: UsageMetadata
  }

  export interface Candidate {
    content: Content
    finishReason?: string
    safetyRatings?: SafetyRating[]
    index?: number
  }

  export interface Content {
    parts: Part[]
    role: string
  }

  export type Part = TextPart | InlineDataPart | FunctionCallPart | FunctionResponsePart

  export interface TextPart {
    text: string
  }

  export interface InlineDataPart {
    inlineData: { mimeType: string; data: string }
  }

  export interface FunctionCallPart {
    functionCall: { name: string; args: Record<string, unknown> }
  }

  export interface FunctionResponsePart {
    functionResponse: { name: string; response: Record<string, unknown> }
  }

  export interface PromptFeedback {
    blockReason?: string
    safetyRatings?: SafetyRating[]
  }

  export interface SafetyRating {
    category: HarmCategory
    probability: string
  }

  export interface UsageMetadata {
    promptTokenCount?: number
    candidatesTokenCount?: number
    totalTokenCount?: number
  }

  export interface StartChatParams {
    history?: Content[]
    generationConfig?: GenerationConfig
    safetySettings?: SafetySetting[]
  }

  export interface ChatSession {
    sendMessage(message: string | Part[]): Promise<GenerateContentResult>
    sendMessageStream(message: string | Part[]): Promise<GenerateContentStreamResult>
    getHistory(): Promise<Content[]>
  }
}
