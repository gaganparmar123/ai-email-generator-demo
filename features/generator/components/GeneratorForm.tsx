"use client"

import * as React from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, X, Wand2 } from "lucide-react"
import { GeneratorInputSchema, GeneratorInput } from "@/lib/ai/schemas"
import { useHistoryStore } from "@/features/history/store/useHistoryStore"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface GeneratorFormProps {
  onSubmit: (data: GeneratorInput) => void
  isLoading: boolean
}

export function GeneratorForm({ onSubmit, isLoading }: GeneratorFormProps) {
  const drafts = useHistoryStore((state) => state.drafts)
  const saveDraft = useHistoryStore((state) => state.saveDraft)
  
  // Tag input local state
  const [tagInput, setTagInput] = React.useState("")

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<GeneratorInput>({
    resolver: zodResolver(GeneratorInputSchema),
    defaultValues: drafts.generator || {
      recipient: "",
      tone: "professional",
      length: "medium",
      prompt: "",
      keyPoints: [],
    },
  })

  // Restore draft only once on mount — avoids the reset→watch→saveDraft→reset loop
  const restoredRef = React.useRef(false)
  React.useEffect(() => {
    if (!restoredRef.current && drafts.generator) {
      restoredRef.current = true
      reset(drafts.generator)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Watch form values and save as draft
  // skipSaveRef prevents writing back immediately after a restore
  const formValues = watch()
  const skipSaveRef = React.useRef(true) // skip the very first render
  React.useEffect(() => {
    if (skipSaveRef.current) {
      skipSaveRef.current = false
      return
    }
    saveDraft("generator", formValues)
  }, [formValues, saveDraft])

  // Key points tags array helper
  const addKeyPoint = () => {
    const trimmed = tagInput.trim()
    if (!trimmed) return
    const currentPoints = formValues.keyPoints || []
    if (!currentPoints.includes(trimmed)) {
      setValue("keyPoints", [...currentPoints, trimmed])
    }
    setTagInput("")
  }

  const removeKeyPoint = (indexToRemove: number) => {
    const currentPoints = formValues.keyPoints || []
    setValue(
      "keyPoints",
      currentPoints.filter((_, idx) => idx !== indexToRemove)
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addKeyPoint()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Recipient */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Recipient Name / Role
        </label>
        <Input
          placeholder="e.g. Jane Doe, Hiring Manager, Dev Team"
          {...register("recipient")}
          aria-invalid={!!errors.recipient}
        />
        {errors.recipient && (
          <p className="text-xs text-destructive">{errors.recipient.message}</p>
        )}
      </div>

      {/* Tone & Length */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Tone</label>
          <Select {...register("tone")} defaultValue="professional">
            <option value="professional">💼 Professional</option>
            <option value="friendly">😊 Friendly</option>
            <option value="urgent">🚨 Urgent</option>
            <option value="apologetic">🙇 Apologetic</option>
            <option value="direct">🎯 Direct</option>
            <option value="sales">📈 Sales</option>
          </Select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Length</label>
          <Select {...register("length")} defaultValue="medium">
            <option value="short">Short (1-2 paragraphs)</option>
            <option value="medium">Medium (3-4 paragraphs)</option>
            <option value="long">Long (Detailed/Comprehensive)</option>
          </Select>
        </div>
      </div>

      {/* Prompt / Purpose */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          What is the email about?
        </label>
        <Textarea
          placeholder="e.g. Requesting a follow-up on my job application, negotiating project deadlines, or asking for feedback on the website design."
          rows={4}
          {...register("prompt")}
          aria-invalid={!!errors.prompt}
        />
        {errors.prompt && (
          <p className="text-xs text-destructive">{errors.prompt.message}</p>
        )}
      </div>

      {/* Dynamic Key Points Tags Input */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Specific Points to Include (Optional)
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="Type a point and press enter or click '+'"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={addKeyPoint}
            className="cursor-pointer shrink-0"
          >
            <Plus className="size-4" />
          </Button>
        </div>

        {/* Tags Container */}
        {formValues.keyPoints && formValues.keyPoints.length > 0 && (
          <div className="flex flex-wrap gap-1.5 p-2 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-950/20">
            {formValues.keyPoints.map((point, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs text-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50"
              >
                {point}
                <button
                  type="button"
                  onClick={() => removeKeyPoint(index)}
                  className="rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 p-0.5 text-zinc-500 cursor-pointer"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-10 gap-2 cursor-pointer font-semibold shadow-xs"
      >
        <Wand2 className="size-4" />
        {isLoading ? "Generating Email..." : "Generate Email"}
      </Button>
    </form>
  )
}
