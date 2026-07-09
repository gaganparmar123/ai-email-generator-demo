"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, X, List } from "lucide-react"
import { SubjectLineInputSchema, SubjectLineInput } from "@/lib/ai/schemas"
import { useHistoryStore } from "@/features/history/store/useHistoryStore"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface SubjectLineFormProps {
  onSubmit: (data: SubjectLineInput) => void
  isLoading: boolean
}

export function SubjectLineForm({ onSubmit, isLoading }: SubjectLineFormProps) {
  const drafts = useHistoryStore((state) => state.drafts)
  const saveDraft = useHistoryStore((state) => state.saveDraft)

  // Keywords local tag input
  const [keywordInput, setKeywordInput] = React.useState("")

  const defaultValues: SubjectLineInput = React.useMemo(() => {
    return (
      drafts["subject-line"] || {
        emailBody: "",
        keywords: [],
        count: 5,
      }
    )
  }, [drafts])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<SubjectLineInput>({
    resolver: zodResolver(SubjectLineInputSchema),
    defaultValues,
  })

  // Reset form when drafts update (external restoration)
  React.useEffect(() => {
    const d = drafts["subject-line"]
    if (d) {
      reset(d)
    }
  }, [drafts, reset])

  // Autosave draft
  const formValues = watch()
  React.useEffect(() => {
    saveDraft("subject-line", formValues)
  }, [formValues, saveDraft])

  // Keywords tags helpers
  const addKeyword = () => {
    const trimmed = keywordInput.trim()
    if (!trimmed) return
    const currentKeywords = formValues.keywords || []
    if (!currentKeywords.includes(trimmed)) {
      setValue("keywords", [...currentKeywords, trimmed])
    }
    setKeywordInput("")
  }

  const removeKeyword = (indexToRemove: number) => {
    const currentKeywords = formValues.keywords || []
    setValue(
      "keywords",
      currentKeywords.filter((_, idx) => idx !== indexToRemove)
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addKeyword()
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email Body */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Email Body
        </label>
        <Textarea
          placeholder="Paste the entire email body for which you want to generate subject lines..."
          rows={8}
          {...register("emailBody")}
          aria-invalid={!!errors.emailBody}
        />
        {errors.emailBody && (
          <p className="text-xs text-destructive">{errors.emailBody.message}</p>
        )}
      </div>

      {/* Keywords (optional) */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Focus Keywords / Themes (Optional)
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="e.g. Discount, Urgent, Invitation"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={addKeyword}
            className="cursor-pointer shrink-0"
          >
            <Plus className="size-4" />
          </Button>
        </div>

        {/* Tags */}
        {formValues.keywords && formValues.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5 p-2 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-950/20">
            {formValues.keywords.map((kw, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs text-zinc-800 dark:text-zinc-200 border border-zinc-200/50 dark:border-zinc-700/50"
              >
                {kw}
                <button
                  type="button"
                  onClick={() => removeKeyword(index)}
                  className="rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 p-0.5 text-zinc-500 cursor-pointer"
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Count Select */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 font-semibold">
          Number of Options
        </label>
        <Select
          {...register("count", { valueAsNumber: true })}
          defaultValue={5}
        >
          <option value={3}>3 Options</option>
          <option value={5}>5 Options</option>
          <option value={7}>7 Options</option>
          <option value={10}>10 Options</option>
        </Select>
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-10 gap-2 cursor-pointer font-semibold shadow-xs"
      >
        <List className="size-4" />
        {isLoading ? "Generating Subject Lines..." : "Generate Subject Lines"}
      </Button>
    </form>
  )
}
