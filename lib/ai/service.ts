import { genAI, isApiKeyConfigured } from "./client"
import { SchemaType } from "@google/generative-ai"
import { promptBuilder } from "./prompts"
import {
  GeneratorInput,
  GeneratorOutput,
  GeneratorOutputSchema,
  RewriterInput,
  RewriterOutput,
  RewriterOutputSchema,
  GrammarInput,
  GrammarOutput,
  GrammarOutputSchema,
  SummarizerInput,
  SummarizerOutput,
  SummarizerOutputSchema,
  SubjectLineInput,
  SubjectLineOutput,
  SubjectLineOutputSchema,
} from "./schemas"
import { ZodType } from "zod"

if (typeof window !== "undefined") {
  throw new Error("AI service can only be used on the server side.")
}

// ---------------------------------------------------------------------------
// Gemini model name
// ---------------------------------------------------------------------------
const GEMINI_MODEL = "gemini-2.0-flash"

// ---------------------------------------------------------------------------
// Zod → Gemini response schema converter (handles the shapes used in this app)
// ---------------------------------------------------------------------------
function zodToGeminiSchema(schema: ZodType<any>): any {
  const def = (schema as any)._def

  // ZodObject
  if (def.typeName === "ZodObject") {
    const shape = def.shape()
    const properties: Record<string, any> = {}
    const required: string[] = []
    for (const [key, value] of Object.entries(shape)) {
      properties[key] = zodToGeminiSchema(value as ZodType<any>)
      required.push(key)
    }
    return { type: SchemaType.OBJECT, properties, required }
  }

  // ZodArray
  if (def.typeName === "ZodArray") {
    return { type: SchemaType.ARRAY, items: zodToGeminiSchema(def.type) }
  }

  // ZodString
  if (def.typeName === "ZodString") {
    return { type: SchemaType.STRING }
  }

  // ZodNumber
  if (def.typeName === "ZodNumber") {
    return { type: SchemaType.NUMBER }
  }

  // ZodEnum
  if (def.typeName === "ZodEnum") {
    return { type: SchemaType.STRING, enum: def.values }
  }

  // ZodOptional — unwrap and mark as nullable
  if (def.typeName === "ZodOptional") {
    const inner = zodToGeminiSchema(def.innerType)
    return { ...inner, nullable: true }
  }

  // ZodEffects (e.g. .describe()) — recurse into inner type
  if (def.typeName === "ZodEffects") {
    return zodToGeminiSchema(def.schema)
  }

  // ZodBoolean
  if (def.typeName === "ZodBoolean") {
    return { type: SchemaType.BOOLEAN }
  }

  // Fallback
  return { type: SchemaType.STRING }
}

// ---------------------------------------------------------------------------
// Generic helper to run a structured Gemini completion request
// ---------------------------------------------------------------------------
async function runStructuredCompletion<T>(
  prompt: string,
  schema: ZodType<T>,
  systemPrompt: string = "You are a helpful, professional AI email copywriter and editor."
): Promise<T> {
  if (!isApiKeyConfigured()) {
    throw new Error(
      "Gemini API Key is not configured. Please set the GEMINI_API_KEY environment variable in your .env.local file."
    )
  }

  try {
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      systemInstruction: systemPrompt,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: zodToGeminiSchema(schema),
        temperature: 0.7,
      },
    })

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    if (!text) {
      throw new Error("AI completed the request but did not return any text content.")
    }

    const parsed = schema.parse(JSON.parse(text))
    return parsed
  } catch (error: any) {
    console.error(`[AI Service Error]:`, error)

    // Graceful error classification
    const msg: string = error.message || ""
    if (msg.includes("API_KEY_INVALID") || msg.includes("401")) {
      throw new Error("Unauthorized: The Gemini API Key provided in .env.local is invalid.")
    }
    if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
      throw new Error("Rate Limit: Gemini API rate limit exceeded. Please wait a moment and try again.")
    }
    if (msg.includes("500") || msg.includes("503") || msg.includes("SERVICE_UNAVAILABLE")) {
      throw new Error("Service Unavailable: Gemini services are currently experiencing issues. Please try again later.")
    }

    throw new Error(msg || "An unexpected error occurred during AI processing.")
  }
}

// ---------------------------------------------------------------------------
// AI Email Studio Service Layer
// ---------------------------------------------------------------------------
export const aiService = {
  /**
   * Generates a new email based on recipient, tone, length, and description prompts.
   */
  async generateEmail(input: GeneratorInput): Promise<GeneratorOutput> {
    const prompt = promptBuilder.generator(input)
    return runStructuredCompletion<GeneratorOutput>(
      prompt,
      GeneratorOutputSchema,
      "You are a professional email writing assistant that outputs detailed emails with alternative subject lines."
    )
  },

  /**
   * Rewrites an existing email with changes in tone, length, and optional instructions.
   */
  async rewriteEmail(input: RewriterInput): Promise<RewriterOutput> {
    const prompt = promptBuilder.rewriter(input)
    return runStructuredCompletion<RewriterOutput>(
      prompt,
      RewriterOutputSchema,
      "You are a professional editor that rewrites emails and clearly explains stylistic updates."
    )
  },

  /**
   * Fixes grammar, vocabulary, spelling, and phrasing issues inside a body text.
   */
  async fixGrammar(input: GrammarInput): Promise<GrammarOutput> {
    const prompt = promptBuilder.grammar(input)
    return runStructuredCompletion<GrammarOutput>(
      prompt,
      GrammarOutputSchema,
      "You are an expert editor who corrects all grammar, spelling, and style errors, logging each change."
    )
  },

  /**
   * Summarizes long emails or logs, generating bullet summaries, action points, and TLDRs.
   */
  async summarizeEmail(input: SummarizerInput): Promise<SummarizerOutput> {
    const prompt = promptBuilder.summarizer(input)
    return runStructuredCompletion<SummarizerOutput>(
      prompt,
      SummarizerOutputSchema,
      "You are an expert executive assistant that extracts core context, key points, and action items."
    )
  },

  /**
   * Suggests high-open-rate subject lines for a given email body.
   */
  async generateSubjectLines(input: SubjectLineInput): Promise<SubjectLineOutput> {
    const prompt = promptBuilder.subjectLine(input)
    return runStructuredCompletion<SubjectLineOutput>(
      prompt,
      SubjectLineOutputSchema,
      "You are a professional copywriter that crafts highly converting and engaging subject lines."
    )
  },
}
