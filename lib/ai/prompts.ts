import { GeneratorInput, RewriterInput, GrammarInput, SummarizerInput, SubjectLineInput } from "./schemas"

export const promptBuilder = {
  /**
   * Build the prompt for the Email Generator
   */
  generator(input: GeneratorInput): string {
    const keyPointsStr = input.keyPoints.length > 0 
      ? `Ensure you cover the following key points in the email:\n${input.keyPoints.map(point => `- ${point}`).join("\n")}`
      : ""

    return `You are a professional email writing assistant.
Generate an email to the recipient: "${input.recipient}".
The tone of the email should be: "${input.tone}".
The overall length of the email should be: "${input.length}".
Email purpose / prompt: "${input.prompt}"

${keyPointsStr}

Guidelines:
- Ensure the email structure is clear.
- Do NOT include placeholder tokens like "[Your Name]" inside the body. If signature information is needed, write it in a generic but neat manner or format it for the user to append.
- Provide a greeting suited for "${input.recipient}" and the tone "${input.tone}".
- Provide a matching signOff.
- Provide a main subject line and at least 3 alternative subject lines in the requested output schema format.
`
  },

  /**
   * Build the prompt for the Email Rewriter
   */
  rewriter(input: RewriterInput): string {
    const extraInstr = input.extraInstructions 
      ? `Follow these extra formatting or content instructions: "${input.extraInstructions}"` 
      : ""

    return `You are a professional editor. Rewrite the following email to match the target requirements:
Original Email:
"""
${input.originalText}
"""

Target Requirements:
- Tone: "${input.tone}"
- Length Adjustment: Make it "${input.lengthAdjustment}" compared to the original text.
${extraInstr}

Guidelines:
- Rewrite the email while preserving its core message, but significantly improve its style, clarity, and tone.
- Do not add placeholders.
- Provide the rewritten text and explain the key changes/improvements made in a structured list.
`
  },

  /**
   * Build the prompt for the Grammar Fixer
   */
  grammar(input: GrammarInput): string {
    return `You are an expert copyeditor. Proofread the following text for spelling, grammar, punctuation, vocabulary, and flow:
Text to proofread:
"""
${input.text}
"""

Guidelines:
- Correct all errors and improve phrasing for natural readability.
- If the text is already perfect, return the original text as correctedText and an empty list of corrections.
- Otherwise, list each specific correction with the original text segment, corrected text segment, and a brief description of the grammatical or spelling rule applied.
`
  },

  /**
   * Build the prompt for the Email Summarizer
   */
  summarizer(input: SummarizerInput): string {
    let formatInstruction = ""
    switch (input.format) {
      case "bulletPoints":
        formatInstruction = "Focus the main summary as a bulleted list explaining the key topics."
        break
      case "tldr":
        formatInstruction = "Provide a single, very concise paragraph (TL;DR) summarizing the entire email."
        break
      case "executiveSummary":
        formatInstruction = "Provide a structured, formal executive summary outlining context, details, and expectations."
        break
    }

    return `You are an executive assistant. Summarize the following email text:
Email text to summarize:
"""
${input.text}
"""

Format requested: "${input.format}"
${formatInstruction}

Guidelines:
- Extract all high-level takeaways.
- Explicitly look for and extract action items (tasks, responsibilities, meetings, deliverables, and deadlines). If there are no clear action items, return an empty array for actionItems.
`
  },

  /**
   * Build the prompt for the Subject Line Generator
   */
  subjectLine(input: SubjectLineInput): string {
    const keywordsStr = input.keywords.length > 0
      ? `Try to incorporate or focus on these keywords/themes: ${input.keywords.join(", ")}.`
      : ""

    return `You are a copywriter specializing in high-open-rate email subject lines.
Generate ${input.count} distinct and compelling subject lines for the following email body:
Email Body:
"""
${input.emailBody}
"""

${keywordsStr}

Guidelines:
- Offer a variety of tones (e.g. Professional, Direct, Urgency, Curiosity, Question).
- Keep them engaging and concise.
- For each subject line, provide the tone class and a brief explanation of why it is effective.
`
  },
}
