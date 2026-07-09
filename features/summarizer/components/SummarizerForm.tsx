"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileText } from "lucide-react"
import { SummarizerInputSchema, SummarizerInput } from "@/lib/ai/schemas"
import { useHistoryStore } from "@/features/history/store/useHistoryStore"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface SummarizerFormProps {
  onSubmit: (data: SummarizerInput) => void
  isLoading: boolean
}

export function SummarizerForm({ onSubmit, isLoading }: SummarizerFormProps) {
  const drafts = useHistoryStore((state) => state.drafts)
  const saveDraft = useHistoryStore((state) => state.saveDraft)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<SummarizerInput>({
    resolver: zodResolver(SummarizerInputSchema),
    defaultValues: drafts.summarizer || {
      text: "",
      format: "bulletPoints",
    },
  })

  // Restore draft only once on mount
  const restoredRef = React.useRef(false)
  React.useEffect(() => {
    if (!restoredRef.current && drafts.summarizer) {
      restoredRef.current = true
      reset(drafts.summarizer)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Autosave draft (skip the initial render to avoid a save→restore loop)
  const formValues = watch()
  const skipSaveRef = React.useRef(true)
  React.useEffect(() => {
    if (skipSaveRef.current) {
      skipSaveRef.current = false
      return
    }
    saveDraft("summarizer", formValues)
  }, [formValues, saveDraft])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email body to summarize */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Email / Text to Summarize
        </label>
        <Textarea
          placeholder="Paste a long email, discussion thread, or meeting transcript to extract a clean summary, key takeaways, and action items..."
          rows={10}
          {...register("text")}
          aria-invalid={!!errors.text}
        />
        {errors.text && (
          <p className="text-xs text-destructive">{errors.text.message}</p>
        )}
      </div>

      {/* Target Format */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 font-semibold">
          Summary Style
        </label>
        <Select {...register("format")} defaultValue="bulletPoints">
          <option value="bulletPoints">📑 Bullet Points (Quick scan)</option>
          <option value="tldr">⚡ TL;DR (Single paragraph)</option>
          <option value="executiveSummary">👔 Executive Summary (Formal overview)</option>
        </Select>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-10 gap-2 cursor-pointer font-semibold shadow-xs"
      >
        <FileText className="size-4" />
        {isLoading ? "Summarizing..." : "Summarize Email"}
      </Button>
    </form>
  )
}
