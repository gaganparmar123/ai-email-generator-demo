"use client"

import * as React from "react"
import { GrammarOutput as GrammarOutputType } from "@/lib/ai/schemas"
import { OutputPreview } from "@/features/shared/components/OutputPreview"
import { Badge } from "@/components/ui/badge"
import { Check, Info } from "lucide-react"

interface GrammarOutputProps {
  output: GrammarOutputType | null
  isLoading: boolean
  error: string | null
}

export function GrammarOutput({ output, isLoading, error }: GrammarOutputProps) {
  // Build a comparison list showing original vs corrected segments
  const correctionsSection = React.useMemo(() => {
    if (!output) return null

    if (!output.corrections || output.corrections.length === 0) {
      return (
        <div className="mt-8 flex items-center gap-3 p-4 rounded-xl border border-emerald-100 bg-emerald-50/15 dark:border-emerald-950/20 dark:bg-emerald-950/10 text-emerald-700 dark:text-emerald-400">
          <div className="size-6 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center shrink-0">
            <Check className="size-3.5" />
          </div>
          <div>
            <h4 className="font-semibold text-xs leading-none mb-1">Excellent Writing!</h4>
            <p className="text-xs text-emerald-600/90 dark:text-emerald-400/80 leading-normal">
              No spelling or grammatical errors were detected. Your text is ready to send.
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className="mt-8 space-y-3.5">
        <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <Info className="size-3.5 text-primary" />
          Detailed Corrections Log ({output.corrections.length})
        </h4>
        
        <div className="overflow-hidden border border-zinc-150 rounded-xl dark:border-zinc-800">
          <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-400 font-medium">
              <tr>
                <th className="px-4 py-2.5">Original</th>
                <th className="px-4 py-2.5">Corrected</th>
                <th className="px-4 py-2.5">Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-950/20">
              {output.corrections.map((corr, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/30 dark:hover:bg-zinc-900/20">
                  <td className="px-4 py-3 font-mono text-xs text-rose-600 dark:text-rose-400/90 bg-rose-50/10 line-through max-w-[200px] break-words">
                    {corr.original}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50/10 font-medium max-w-[200px] break-words">
                    {corr.corrected}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400 max-w-[250px] leading-relaxed break-words">
                    {corr.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }, [output])

  return (
    <OutputPreview
      title="Corrected Text Output"
      content={output?.correctedText || ""}
      isLoading={isLoading}
      error={error}
      extraSection={correctionsSection}
    />
  )
}
