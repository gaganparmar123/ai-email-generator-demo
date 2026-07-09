"use client"

import * as React from "react"
import copy from "copy-to-clipboard"
import { SubjectLineOutput as SubjectLineOutputType } from "@/lib/ai/schemas"
import { OutputPreview } from "@/features/shared/components/OutputPreview"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Check, Sparkles } from "lucide-react"

interface SubjectLineOutputProps {
  output: SubjectLineOutputType | null
  isLoading: boolean
  error: string | null
}

export function SubjectLineOutput({ output, isLoading, error }: SubjectLineOutputProps) {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null)

  const handleCopy = (text: string, index: number) => {
    copy(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  // Get a colored badge variant based on the tone name
  const getToneBadgeVariant = (tone: string) => {
    const t = tone.toLowerCase()
    if (t.includes("professional") || t.includes("formal")) return "default"
    if (t.includes("urgent") || t.includes("critical") || t.includes("alert")) return "destructive"
    if (t.includes("curiosity") || t.includes("clicky") || t.includes("creative")) return "outline"
    // fallback
    return "secondary"
  }

  // Build the list grid showing each subject line with custom copy actions
  const extraSubjectsSection = React.useMemo(() => {
    if (!output || !output.subjectLines || output.subjectLines.length === 0) return null

    return (
      <div className="mt-6 space-y-3.5">
        <h4 className="text-xs font-semibold text-zinc-700 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-primary" />
          Suggested Subject Line Options ({output.subjectLines.length})
        </h4>

        <div className="flex flex-col gap-3">
          {output.subjectLines.map((item, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col sm:flex-row sm:items-center justify-between border border-zinc-150 rounded-xl p-4 bg-white hover:border-primary/20 hover:shadow-xs transition-all dark:border-zinc-800 dark:bg-zinc-950/20 dark:hover:border-zinc-700"
            >
              <div className="flex-1 space-y-1.5 pr-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">
                    {item.subject}
                  </span>
                  <Badge variant={getToneBadgeVariant(item.tone)} className="text-[10px] px-1.5 py-0">
                    {item.tone}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.explanation}
                </p>
              </div>

              <div className="mt-3 sm:mt-0 flex shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(item.subject, idx)}
                  className="h-8 w-8 p-0 cursor-pointer sm:opacity-0 group-hover:opacity-100 transition-opacity dark:border-zinc-800"
                  title="Copy subject line"
                >
                  {copiedIndex === idx ? (
                    <Check className="size-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="size-3.5" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }, [output, copiedIndex])

  // Assemble a simple Markdown block for the primary text area
  const mainMarkdown = React.useMemo(() => {
    if (!output) return ""
    return `### Generated Subject Lines

Analyze and choose from the tailored options below. Each option is optimized for different user psychology and tones.`
  }, [output])

  return (
    <OutputPreview
      title="Subject Lines Output"
      content={mainMarkdown}
      isLoading={isLoading}
      error={error}
      extraSection={extraSubjectsSection}
    />
  )
}
