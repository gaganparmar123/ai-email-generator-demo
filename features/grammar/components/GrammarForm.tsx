"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { CheckCheck } from "lucide-react"
import { GrammarInputSchema, GrammarInput } from "@/lib/ai/schemas"
import { useHistoryStore } from "@/features/history/store/useHistoryStore"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

interface GrammarFormProps {
  onSubmit: (data: GrammarInput) => void
  isLoading: boolean
}

export function GrammarForm({ onSubmit, isLoading }: GrammarFormProps) {
  const drafts = useHistoryStore((state) => state.drafts)
  const saveDraft = useHistoryStore((state) => state.saveDraft)

  const defaultValues: GrammarInput = React.useMemo(() => {
    return (
      drafts.grammar || {
        text: "",
      }
    )
  }, [drafts.grammar])

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<GrammarInput>({
    resolver: zodResolver(GrammarInputSchema),
    defaultValues,
  })

  // Reset form when drafts update (external restoration)
  React.useEffect(() => {
    if (drafts.grammar) {
      reset(drafts.grammar)
    }
  }, [drafts.grammar, reset])

  // Autosave draft
  const formValues = watch()
  React.useEffect(() => {
    saveDraft("grammar", formValues)
  }, [formValues, saveDraft])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Original Text */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Text to Check & Correct
        </label>
        <Textarea
          placeholder="Paste your email paragraphs here. Grammar Fixer will clean up spelling, punctuation, styling, and tone issues..."
          rows={10}
          {...register("text")}
          aria-invalid={!!errors.text}
        />
        {errors.text && (
          <p className="text-xs text-destructive">{errors.text.message}</p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-10 gap-2 cursor-pointer font-semibold shadow-xs"
      >
        <CheckCheck className="size-4" />
        {isLoading ? "Checking Grammar..." : "Check & Fix Grammar"}
      </Button>
    </form>
  )
}
