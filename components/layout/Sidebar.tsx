"use client"

import * as React from "react"
import { useHistoryStore, FeatureType } from "@/features/history/store/useHistoryStore"
import { cn } from "@/lib/utils"
import { Wand2, Sparkles, CheckCheck, FileText, List, LucideIcon } from "lucide-react"

interface NavItem {
  id: FeatureType
  label: string
  description: string
  icon: LucideIcon
  colorClass: string
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "generator",
    label: "Email Generator",
    description: "Write custom emails from bullet points",
    icon: Wand2,
    colorClass: "text-violet-500",
  },
  {
    id: "rewriter",
    label: "Email Rewriter",
    description: "Adjust tone and length of drafts",
    icon: Sparkles,
    colorClass: "text-blue-500",
  },
  {
    id: "grammar",
    label: "Grammar Fixer",
    description: "Proofread and polish writing style",
    icon: CheckCheck,
    colorClass: "text-emerald-500",
  },
  {
    id: "summarizer",
    label: "Email Summarizer",
    description: "Get takeaways and action lists",
    icon: FileText,
    colorClass: "text-amber-500",
  },
  {
    id: "subject-line",
    label: "Subject Line Generator",
    description: "Craft engaging subject lines",
    icon: List,
    colorClass: "text-rose-500",
  },
]

export function Sidebar() {
  const activeTab = useHistoryStore((state) => state.activeTab)
  const setActiveTab = useHistoryStore((state) => state.setActiveTab)

  return (
    <aside className="w-full md:w-64 shrink-0 flex flex-col border-b md:border-b-0 md:border-r border-zinc-200/80 bg-zinc-50/40 p-4 dark:border-zinc-800/80 dark:bg-zinc-950/10 transition-colors">
      <div className="flex flex-col gap-1.5 w-full">
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 mb-1 dark:text-zinc-500">
          STUDIO TOOLS
        </p>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "group flex items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 cursor-pointer w-full select-none outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                isActive
                  ? "bg-white shadow-xs dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800"
                  : "hover:bg-zinc-150/40 dark:hover:bg-zinc-900/40 border border-transparent"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center rounded-lg p-1.5 transition-colors shrink-0",
                  isActive
                    ? "bg-zinc-100 dark:bg-zinc-800"
                    : "bg-transparent group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800/50"
                )}
              >
                <Icon className={cn("size-4", item.colorClass)} />
              </div>
              
              <div className="flex flex-col min-w-0">
                <span
                  className={cn(
                    "text-xs font-semibold leading-none mb-1 transition-colors",
                    isActive
                      ? "text-zinc-900 dark:text-zinc-50"
                      : "text-zinc-600 dark:text-zinc-450 group-hover:text-zinc-900 dark:group-hover:text-zinc-255"
                  )}
                >
                  {item.label}
                </span>
                <span className="text-[10px] text-muted-foreground truncate leading-none">
                  {item.description}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
