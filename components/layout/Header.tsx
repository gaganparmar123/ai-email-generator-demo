"use client"

import * as React from "react"
import { Sun, Moon, Sparkles, Key, AlertTriangle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [theme, setTheme] = React.useState<"light" | "dark">("light")
  const [apiKeyConfigured, setApiKeyConfigured] = React.useState<boolean | null>(null)

  // Initialize theme and query API key status on mount
  React.useEffect(() => {
    // Theme initialization
    const root = window.document.documentElement
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      root.classList.add("dark")
      setTheme("dark")
    } else {
      root.classList.remove("dark")
      setTheme("light")
    }

    // Fetch API status
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => setApiKeyConfigured(data.isConfigured))
      .catch(() => setApiKeyConfigured(false))
  }, [])

  const toggleTheme = () => {
    const root = window.document.documentElement
    if (theme === "light") {
      root.classList.add("dark")
      localStorage.setItem("theme", "dark")
      setTheme("dark")
    } else {
      root.classList.remove("dark")
      localStorage.setItem("theme", "light")
      setTheme("light")
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80 transition-colors">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        
        {/* Title / Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center rounded-lg bg-linear-to-tr from-violet-600 to-indigo-500 p-1.5 shadow-md shadow-violet-500/20 text-white">
            <Sparkles className="size-4" />
          </div>
          <span className="font-bold text-base bg-linear-to-r from-zinc-900 to-zinc-700 bg-clip-text text-transparent dark:from-zinc-100 dark:to-zinc-300">
            AI Email Studio
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Gemini API Key Status Indicator */}
          {apiKeyConfigured === null ? (
            <div className="h-6 w-24 bg-zinc-100 dark:bg-zinc-850 rounded animate-pulse" />
          ) : apiKeyConfigured ? (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30">
              <CheckCircle2 className="size-3.5" />
              API Connected
            </div>
          ) : (
            <div
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-250 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30 cursor-help"
              title="GEMINI_API_KEY is not set in .env.local"
            >
              <AlertTriangle className="size-3.5 animate-pulse" />
              API Key Missing
            </div>
          )}

          {/* Theme Switcher Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="size-8 rounded-lg cursor-pointer dark:border-zinc-850 dark:hover:bg-zinc-900"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="size-4 text-zinc-650" />
            ) : (
              <Sun className="size-4 text-zinc-350" />
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
