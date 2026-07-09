"use client"

import * as React from "react"
import { SummarizerOutput as SummarizerOutputType } from "@/lib/ai/schemas"
import { OutputPreview } from "@/features/shared/components/OutputPreview"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, ListPlus, Bookmark } from "lucide-react"

interface SummarizerOutputProps {
  output: SummarizerOutputType | null
  isLoading: boolean
  error: string | null
}

export function SummarizerOutput({ output, isLoading, error }: SummarizerOutputProps) {
  // Build details section for Bullet Points and Action Items
  const extraSummariesSection = React.useMemo(() => {
    if (!output) return null

    const hasKeyPoints = output.keyPoints && output.keyPoints.length > 0
    const hasActionItems = output.actionItems && output.actionItems.length > 0

    if (!hasKeyPoints && !hasActionItems) return null

    return (
      <div className="mt-8 space-y-6">
        {/* Key Takeaways */}
        {hasKeyPoints && (
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <ListPlus className="size-4 text-primary" />
              Key Takeaways
            </h4>
            <div className="rounded-xl border border-zinc-100 bg-zinc-50/20 p-4 dark:border-zinc-800 dark:bg-zinc-950/20 space-y-2">
              {output.keyPoints.map((point, index) => (
                <div key={index} className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <Bookmark className="size-3.5 mt-0.5 text-primary shrink-0 fill-primary/10" />
                  <span className="leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Items */}
        {hasActionItems && (
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckSquare className="size-4 text-emerald-600 dark:text-emerald-400" />
              Extracted Action Items
            </h4>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/5 p-4 dark:border-emerald-950/20 dark:bg-emerald-950/5 space-y-2">
              {output.actionItems.map((item, index) => (
                <div key={index} className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    readOnly
                    checked={false}
                    className="size-3.5 mt-0.5 accent-primary shrink-0 border-zinc-300 rounded-sm focus:ring-0 cursor-default"
                  />
                  <span className="leading-relaxed font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }, [output])

  return (
    <OutputPreview
      title="Summarization Output"
      content={output?.summary || ""}
      isLoading={isLoading}
      error={error}
      extraSection={extraSummariesSection}
    />
  )
}
