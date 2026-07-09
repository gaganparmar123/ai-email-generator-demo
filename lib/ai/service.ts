import { openai, isApiKeyConfigured } from "./client"
import { zodResponseFormat } from "openai/helpers/zod"
import { ZodType } from "zod"
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

if (typeof window !== "undefined") {
  throw new Error("AI service can only be used on the server side.")
}

/**
 * Generic helper to run a structured OpenAI completion request
 */
async function runStructuredCompletion<T>(
  prompt: string,
  schema: ZodType<T>,
  schemaName: string,
  systemPrompt: string = "You are a helpful, professional AI email copywriter and editor."
): Promise<T> {
  if (!isApiKeyConfigured()) {
    throw new Error(
      "OpenAI API Key is not configured. Please set the OPENAI_API_KEY environment variable in your .env.local file."
    )
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // fast, cost-effective, and fully supports Structured Outputs
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      response_format: zodResponseFormat(schema, schemaName),
      temperature: 0.7,
    })

    const content = response.choices[0]?.message.content
    if (!content) {
      throw new Error("AI completed the request but did not return any text content.")
    }

    const parsed = schema.parse(JSON.parse(content))
    return parsed
  } catch (error: any) {
    console.error(`[AI Service Error] [${schemaName}]:`, error)
    
    // Graceful error classification
    if (error.status === 401) {
      throw new Error("Unauthorized: The OpenAI API Key provided in .env.local is invalid.")
    }
    if (error.status === 429) {
      throw new Error("Rate Limit: OpenAI API rate limit exceeded. Please wait a moment and try again.")
    }
    if (error.status === 500 || error.status === 503) {
      throw new Error("Service Unavailable: OpenAI services are currently experiencing issues. Please try again later.")
    }
    
    throw new Error(error.message || "An unexpected error occurred during AI processing.")
  }
}

/**
 * AI Email Studio Service Layer
 */
export const aiService = {
  /**
   * Generates a new email based on recipient, tone, length, and description prompts.
   */
  async generateEmail(input: GeneratorInput): Promise<GeneratorOutput> {
    const prompt = promptBuilder.generator(input)
    return runStructuredCompletion<GeneratorOutput>(
      prompt,
      GeneratorOutputSchema,
      "email_generator",
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
      "email_rewriter",
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
      "grammar_fixer",
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
      "email_summarizer",
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
      "subject_line_generator",
      "You are a professional copywriter that crafts highly converting and engaging subject lines."
    )
  },
}
