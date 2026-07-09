import { NextResponse } from "next/server"
import { isApiKeyConfigured } from "@/lib/ai/client"

export async function GET() {
  // Never expose the actual key string, only verify its presence/integrity
  return NextResponse.json({
    isConfigured: isApiKeyConfigured(),
  })
}
export const dynamic = "force-dynamic"
