"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Sparkles } from "lucide-react"
import { RewriterInputSchema, RewriterInput } from "@/lib/ai/schemas"
import { useHistoryStore } from "@/features/history/store/useHistoryStore"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface RewriterFormProps {
  onSubmit: (data: RewriterInput) => void
  isLoading: boolean
}

export function RewriterForm({ onSubmit, isLoading }: RewriterFormProps) {
  const drafts = useHistoryStore((state) => state.drafts)
  const saveDraft = useHistoryStore((state) => state.saveDraft)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RewriterInput>({
    resolver: zodResolver(RewriterInputSchema),
    defaultValues: drafts.rewriter || {
      originalText: "",
      tone: "professional",
      lengthAdjustment: "same",
      extraInstructions: "",
    },
  })

  // Restore draft only once on mount
  const restoredRef = React.useRef(false)
  React.useEffect(() => {
    if (!restoredRef.current && drafts.rewriter) {
      restoredRef.current = true
      reset(drafts.rewriter)
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
    saveDraft("rewriter", formValues)
  }, [formValues, saveDraft])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Original Email */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Original Email
        </label>
        <Textarea
          placeholder="Paste the email or draft you want to rewrite here..."
          rows={6}
          {...register("originalText")}
          aria-invalid={!!errors.originalText}
        />
        {errors.originalText && (
          <p className="text-xs text-destructive">{errors.originalText.message}</p>
        )}
      </div>

      {/* Tone & Length adjustment */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Target Tone</label>
          <Select {...register("tone")} defaultValue="professional">
            <option value="professional">💼 Professional</option>
            <option value="friendly">😊 Friendly</option>
            <option value="empathetic">❤️ Empathetic</option>
            <option value="persuasive">📣 Persuasive</option>
            <option value="assertive">⚡ Assertive</option>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Length</label>
          <Select {...register("lengthAdjustment")} defaultValue="same">
            <option value="shorter">Shorter (Concise)</option>
            <option value="same">Keep same length</option>
            <option value="longer">Longer (Elaborate)</option>
          </Select>
        </div>
      </div>

      {/* Custom instructions */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Custom Instructions (Optional)
        </label>
        <Textarea
          placeholder="e.g. Make it sound less apologetic, mention the quarterly report, or ask for a meeting on Tuesday."
          rows={3}
          {...register("extraInstructions")}
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-10 gap-2 cursor-pointer font-semibold shadow-xs"
      >
        <Sparkles className="size-4" />
        {isLoading ? "Rewriting Email..." : "Rewrite Email"}
      </Button>
    </form>
  )
}
