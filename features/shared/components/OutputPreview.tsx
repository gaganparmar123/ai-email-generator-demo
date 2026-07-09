"use client"

import * as React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import copy from "copy-to-clipboard"
import { motion } from "motion/react"
import { Check, Copy, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OutputPreviewProps {
  title: string
  content: string
  copyText?: string
  isLoading: boolean
  error: string | null
  alternativeSubjects?: string[]
  onSelectAlternativeSubject?: (subj: string) => void
  extraSection?: React.ReactNode
}

export function OutputPreview({
  title,
  content,
  copyText,
  isLoading,
  error,
  alternativeSubjects,
  onSelectAlternativeSubject,
  extraSection,
}: OutputPreviewProps) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = () => {
    const textToCopy = copyText || content
    if (!textToCopy) return
    
    copy(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col h-full rounded-xl border border-zinc-200 bg-white shadow-xs overflow-hidden dark:border-zinc-800 dark:bg-zinc-950/40 dark:backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 px-6 py-4 dark:border-zinc-800/80 dark:bg-zinc-900/30">
        <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">{title}</h3>
        {content && !isLoading && !error && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="h-8 gap-1.5 cursor-pointer dark:border-zinc-800 dark:hover:bg-zinc-800"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-500" />
                <span className="text-xs text-emerald-500 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span className="text-xs">Copy</span>
              </>
            )}
          </Button>
        )}
      </div>

      {/* Body Area */}
      <div className="flex-1 relative min-h-[300px] p-6 overflow-y-auto">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 gap-3 dark:bg-zinc-950/80">
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="rounded-full border-2 border-primary border-t-transparent size-8"
              />
              <RefreshCw className="size-3.5 absolute text-primary animate-pulse" />
            </div>
            <p className="text-xs text-muted-foreground font-medium animate-pulse">
              AI is writing the perfect copy...
            </p>
          </div>
        )}

        {error && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 max-w-md mx-auto p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive flex items-start gap-3 z-10">
            <AlertCircle className="size-5 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-sm leading-none mb-1">AI Request Failed</h4>
              <p className="text-xs text-destructive/80 leading-normal">{error}</p>
            </div>
          </div>
        )}

        {!content && !isLoading && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <div className="size-12 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400 dark:bg-zinc-900/20 dark:border-zinc-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h4 className="font-medium text-sm mt-4 text-zinc-900 dark:text-zinc-100">No output generated yet</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-[260px] leading-relaxed">
              Fill out the form on the left and click submit to generate your customized email contents.
            </p>
          </div>
        )}

        {content && !error && (
          <div className="prose prose-sm max-w-none dark:prose-invert text-zinc-800 dark:text-zinc-200">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        )}

        {/* Extra Sections (Diff tables, Grammar log table, key Takeaways, etc.) */}
        {content && !error && !isLoading && extraSection}
      </div>

      {/* Alternative Subjects list (only for Generator output) */}
      {content && alternativeSubjects && alternativeSubjects.length > 0 && !isLoading && !error && (
        <div className="border-t border-zinc-100 bg-zinc-50/20 p-5 dark:border-zinc-800/80 dark:bg-zinc-900/10">
          <h4 className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2 dark:text-zinc-400">
            Alternative Subject Lines
          </h4>
          <div className="flex flex-col gap-2">
            {alternativeSubjects.map((subj, idx) => (
              <div
                key={idx}
                className="group flex items-center justify-between border border-zinc-100 bg-white rounded-lg p-2.5 text-xs hover:border-primary/20 dark:border-zinc-800 dark:bg-zinc-950/60 dark:hover:border-zinc-700"
              >
                <span className="font-medium text-zinc-800 dark:text-zinc-200">{subj}</span>
                {onSelectAlternativeSubject && (
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onSelectAlternativeSubject(subj)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-primary cursor-pointer hover:underline"
                  >
                    Use this
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
