import { NextRequest, NextResponse } from "next/server"
import { aiService } from "@/lib/ai/service"
import { GeneratorInputSchema } from "@/lib/ai/schemas"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    const validationResult = GeneratorInputSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation Error", details: validationResult.error.format() },
        { status: 400 }
      )
    }

    const output = await aiService.generateEmail(validationResult.data)
    return NextResponse.json(output)
  } catch (error: any) {
    console.error("API Error [generate]:", error)
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred during email generation." },
      { status: error.message?.includes("API Key") || error.message?.includes("Unauthorized") ? 401 : 500 }
    )
  }
}
