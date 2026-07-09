import { NextRequest, NextResponse } from "next/server"
import { aiService } from "@/lib/ai/service"
import { SummarizerInputSchema } from "@/lib/ai/schemas"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validationResult = SummarizerInputSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation Error", details: validationResult.error.format() },
        { status: 400 }
      )
    }

    const output = await aiService.summarizeEmail(validationResult.data)
    return NextResponse.json(output)
  } catch (error: any) {
    console.error("API Error [summarize]:", error)
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during summarization." },
      { status: error.message?.includes("API Key") || error.message?.includes("Unauthorized") ? 401 : 500 }
    )
  }
}
