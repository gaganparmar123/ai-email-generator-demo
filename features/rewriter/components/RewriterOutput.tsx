"use client"

import * as React from "react"
import { RewriterOutput as RewriterOutputType } from "@/lib/ai/schemas"
import { OutputPreview } from "@/features/shared/components/OutputPreview"
import { Sparkles, Info } from "lucide-react"

interface RewriterOutputProps {
  output: RewriterOutputType | null
  isLoading: boolean
  error: string | null
}

export function RewriterOutput({ output, isLoading, error }: RewriterOutputProps) {
  // Build the detailed list of changes made to be shown under the rewritten email
  const extraChangesSection = React.useMemo(() => {
    if (!output || !output.changesMade || output.changesMade.length === 0) return null

    return (
      <div className="mt-8 p-4 rounded-xl border border-blue-100 bg-blue-50/10 dark:border-blue-900/30 dark:bg-blue-950/10">
        <h4 className="text-xs font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Info className="size-3.5" />
          Rewriting Changes & Details
        </h4>
        <ul className="list-disc pl-4 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
          {output.changesMade.map((change, index) => (
            <li key={index} className="leading-relaxed">
              {change}
            </li>
          ))}
        </ul>
      </div>
    )
  }, [output])

  return (
    <OutputPreview
      title="Rewritten Email Output"
      content={output?.rewrittenText || ""}
      isLoading={isLoading}
      error={error}
      extraSection={extraChangesSection}
    />
  )
}
