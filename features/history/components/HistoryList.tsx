"use client"

import * as React from "react"
import { useHistoryStore, HistoryItem, FeatureType } from "../store/useHistoryStore"
import { formatDistanceToNow } from "date-fns"
import { Trash2, FolderOpen, History, Clock, FileText, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface HistoryListProps {
  onLoadItem: (item: HistoryItem) => void
}

export function HistoryList({ onLoadItem }: HistoryListProps) {
  const history = useHistoryStore((state) => state.history)
  const clearHistory = useHistoryStore((state) => state.clearHistory)
  const deleteHistoryItem = useHistoryStore((state) => state.deleteHistoryItem)
  const isHydrated = useHistoryStore((state) => state.isHydrated)

  // Avoid SSR hydration mismatch by rendering a skeleton until client hydration completes
  if (!isHydrated) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-24 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-20 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  // Get a readable label for the feature type
  const getFeatureLabel = (type: FeatureType) => {
    switch (type) {
      case "generator":
        return "Generator"
      case "rewriter":
        return "Rewriter"
      case "grammar":
        return "Grammar Fix"
      case "summarizer":
        return "Summary"
      case "subject-line":
        return "Subject Lines"
    }
  }

  // Get the primary input preview snippet
  const getInputPreview = (item: HistoryItem) => {
    if (item.type === "generator") {
      return (item.input as any).prompt || ""
    } else if (item.type === "rewriter") {
      return (item.input as any).originalText || ""
    } else if (item.type === "grammar") {
      return (item.input as any).text || ""
    } else if (item.type === "summarizer") {
      return (item.input as any).text || ""
    } else if (item.type === "subject-line") {
      return (item.input as any).emailBody || ""
    }
    return ""
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
          <History className="size-4 text-zinc-500" />
          Execution Logs
        </h3>
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="xs"
            onClick={clearHistory}
            className="text-xs text-destructive hover:bg-destructive/10 cursor-pointer"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* List items */}
      {history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl min-h-[160px]">
          <Clock className="size-6 text-zinc-300 dark:text-zinc-700 mb-2" />
          <p className="text-xs font-medium text-zinc-500">No logs found</p>
          <p className="text-[10px] text-muted-foreground mt-1 max-w-[200px] leading-relaxed">
            Your generated emails and tool executions will be logged here for quick retrieval.
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[500px] sm:max-h-none">
          {history.map((item) => {
            const preview = getInputPreview(item)
            const dateStr = formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })
            
            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between border border-zinc-150 rounded-xl p-3.5 bg-zinc-50/50 hover:bg-white hover:border-primary/20 dark:border-zinc-800/80 dark:bg-zinc-950/20 dark:hover:bg-zinc-900/10 dark:hover:border-zinc-700 transition-all shadow-2xs hover:shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {getFeatureLabel(item.type)}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                      <Clock className="size-3" />
                      {dateStr}
                    </span>
                  </div>
                  
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed pr-6">
                    {preview}
                  </p>
                </div>

                <div className="mt-3.5 flex items-center justify-end gap-1.5 border-t border-zinc-150/40 dark:border-zinc-850/50 pt-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => onLoadItem(item)}
                    className="h-7 text-xs font-semibold gap-1 text-primary cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    title="Load back into workspace"
                  >
                    <FolderOpen className="size-3" />
                    Restore
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => deleteHistoryItem(item.id)}
                    className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10 cursor-pointer"
                    title="Delete log"
                  >
                    <Trash2 className="size-3" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
