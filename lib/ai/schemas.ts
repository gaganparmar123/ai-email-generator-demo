import { z } from "zod"

// ----------------------------------------------------
// 1. EMAIL GENERATOR SCHEMAS
// ----------------------------------------------------
export const GeneratorInputSchema = z.object({
  recipient: z.string().min(1, "Recipient name is required"),
  tone: z.enum(["professional", "friendly", "urgent", "apologetic", "direct", "sales"]),
  length: z.enum(["short", "medium", "long"]),
  prompt: z.string().min(5, "Please describe the email purpose (at least 5 characters)"),
  keyPoints: z.array(z.string()),
})

export type GeneratorInput = z.infer<typeof GeneratorInputSchema>

export const GeneratorOutputSchema = z.object({
  greeting: z.string(),
  subject: z.string(),
  body: z.string().describe("The email body text, formatted using markdown for paragraphs, lists, or bolding where appropriate"),
  signOff: z.string(),
  alternativeSubjects: z.array(z.string()).min(3, "At least 3 alternative subjects should be provided"),
})

export type GeneratorOutput = z.infer<typeof GeneratorOutputSchema>

// ----------------------------------------------------
// 2. EMAIL REWRITER SCHEMAS
// ----------------------------------------------------
export const RewriterInputSchema = z.object({
  originalText: z.string().min(10, "Please provide an email text to rewrite (at least 10 characters)"),
  tone: z.enum(["professional", "friendly", "empathetic", "persuasive", "assertive"]),
  lengthAdjustment: z.enum(["shorter", "same", "longer"]),
  extraInstructions: z.string().optional(),
})

export type RewriterInput = z.infer<typeof RewriterInputSchema>

export const RewriterOutputSchema = z.object({
  rewrittenText: z.string().describe("The fully rewritten email text, formatted with appropriate spacing"),
  changesMade: z.array(z.string()).describe("A list of key changes made and the design rationale behind them"),
})

export type RewriterOutput = z.infer<typeof RewriterOutputSchema>

// ----------------------------------------------------
// 3. GRAMMAR FIXER SCHEMAS
// ----------------------------------------------------
export const GrammarInputSchema = z.object({
  text: z.string().min(5, "Please provide some text to check (at least 5 characters)"),
})

export type GrammarInput = z.infer<typeof GrammarInputSchema>

export const GrammarOutputSchema = z.object({
  correctedText: z.string(),
  corrections: z.array(
    z.object({
      original: z.string().describe("The segment of text that contained errors"),
      corrected: z.string().describe("The corrected segment"),
      reason: z.string().describe("Why the correction was made (grammar, punctuation, vocabulary, tone)"),
    })
  ).describe("List of individual grammatical, spelling, or styling corrections made. If no corrections were needed, return an empty list."),
})

export type GrammarOutput = z.infer<typeof GrammarOutputSchema>

// ----------------------------------------------------
// 4. EMAIL SUMMARIZER SCHEMAS
// ----------------------------------------------------
export const SummarizerInputSchema = z.object({
  text: z.string().min(20, "Please enter at least 20 characters of email text to summarize"),
  format: z.enum(["bulletPoints", "tldr", "executiveSummary"]),
})

export type SummarizerInput = z.infer<typeof SummarizerInputSchema>

export const SummarizerOutputSchema = z.object({
  summary: z.string().describe("The main summary block (TLDR, paragraphs, or executive summary text)"),
  keyPoints: z.array(z.string()).describe("High-level bullet points summarizing the core discussion or news in the email"),
  actionItems: z.array(z.string()).describe("Actionable items or tasks requested from the email. Return empty list if none found."),
})

export type SummarizerOutput = z.infer<typeof SummarizerOutputSchema>

// ----------------------------------------------------
// 5. SUBJECT LINE GENERATOR SCHEMAS
// ----------------------------------------------------
export const SubjectLineInputSchema = z.object({
  emailBody: z.string().min(10, "Please provide the email body (at least 10 characters)"),
  keywords: z.array(z.string()),
  count: z.number().int().min(1).max(10),
})

export type SubjectLineInput = z.infer<typeof SubjectLineInputSchema>

export const SubjectLineOutputSchema = z.object({
  subjectLines: z.array(
    z.object({
      subject: z.string().describe("The generated subject line"),
      tone: z.string().describe("The tone classification (e.g. Professional, Casual, Clicky, Direct)"),
      explanation: z.string().describe("Short explanation of why this subject line is effective"),
    })
  ).min(1),
})

export type SubjectLineOutput = z.infer<typeof SubjectLineOutputSchema>
