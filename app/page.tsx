"use client"

import * as React from "react"
import { Toaster, toast } from "sonner"
import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { useHistoryStore, HistoryItem, FeatureType } from "@/features/history/store/useHistoryStore"

// Feature UI Components
import { GeneratorForm } from "@/features/generator/components/GeneratorForm"
import { GeneratorOutput } from "@/features/generator/components/GeneratorOutput"
import { RewriterForm } from "@/features/rewriter/components/RewriterForm"
import { RewriterOutput } from "@/features/rewriter/components/RewriterOutput"
import { GrammarForm } from "@/features/grammar/components/GrammarForm"
import { GrammarOutput } from "@/features/grammar/components/GrammarOutput"
import { SummarizerForm } from "@/features/summarizer/components/SummarizerForm"
import { SummarizerOutput } from "@/features/summarizer/components/SummarizerOutput"
import { SubjectLineForm } from "@/features/subject-line/components/SubjectLineForm"
import { SubjectLineOutput } from "@/features/subject-line/components/SubjectLineOutput"
import { HistoryList } from "@/features/history/components/HistoryList"

// Typings from schema
import {
  GeneratorInput,
  GeneratorOutput as GeneratorOutputType,
  RewriterInput,
  RewriterOutput as RewriterOutputType,
  GrammarInput,
  GrammarOutput as GrammarOutputType,
  SummarizerInput,
  SummarizerOutput as SummarizerOutputType,
  SubjectLineInput,
  SubjectLineOutput as SubjectLineOutputType,
} from "@/lib/ai/schemas"

export default function Home() {
  const activeTab = useHistoryStore((state) => state.activeTab)
  const setActiveTab = useHistoryStore((state) => state.setActiveTab)
  const addHistoryItem = useHistoryStore((state) => state.addHistoryItem)
  const saveDraft = useHistoryStore((state) => state.saveDraft)

  // ----------------------------------------------------
  // LOCAL STATES FOR EACH FEATURE OUTPUT/LOADER/ERROR
  // ----------------------------------------------------
  const [genState, setGenState] = React.useState<{
    output: GeneratorOutputType | null
    isLoading: boolean
    error: string | null
  }>({ output: null, isLoading: false, error: null })

  const [rewriteState, setRewriteState] = React.useState<{
    output: RewriterOutputType | null
    isLoading: boolean
    error: string | null
  }>({ output: null, isLoading: false, error: null })

  const [grammarState, setGrammarState] = React.useState<{
    output: GrammarOutputType | null
    isLoading: boolean
    error: string | null
  }>({ output: null, isLoading: false, error: null })

  const [sumState, setSumState] = React.useState<{
    output: SummarizerOutputType | null
    isLoading: boolean
    error: string | null
  }>({ output: null, isLoading: false, error: null })

  const [subjState, setSubjState] = React.useState<{
    output: SubjectLineOutputType | null
    isLoading: boolean
    error: string | null
  }>({ output: null, isLoading: false, error: null })

  // ----------------------------------------------------
  // RESTORE HISTORY ITEM HANDLER
  // ----------------------------------------------------
  const handleRestoreItem = React.useCallback((item: HistoryItem) => {
    setActiveTab(item.type)
    
    // 1. Save inputs to drafts to let the forms load them reactive-ly
    saveDraft(item.type, item.input)

    // 2. Load the output directly back into the state for rendering
    switch (item.type) {
      case "generator":
        setGenState({ output: item.output as GeneratorOutputType, isLoading: false, error: null })
        break
      case "rewriter":
        setRewriteState({ output: item.output as RewriterOutputType, isLoading: false, error: null })
        break
      case "grammar":
        setGrammarState({ output: item.output as GrammarOutputType, isLoading: false, error: null })
        break
      case "summarizer":
        setSumState({ output: item.output as SummarizerOutputType, isLoading: false, error: null })
        break
      case "subject-line":
        setSubjState({ output: item.output as SubjectLineOutputType, isLoading: false, error: null })
        break
    }
    
    toast.success("Loaded history log back into workspace.")
  }, [setActiveTab, saveDraft])

  // ----------------------------------------------------
  // SUBMIT API CALL HANDLERS
  // ----------------------------------------------------
  const handleGenerateSubmit = async (data: GeneratorInput) => {
    setGenState({ output: null, isLoading: true, error: null })
    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || "Generation request failed.")
      }

      setGenState({ output: result, isLoading: false, error: null })
      addHistoryItem("generator", data, result)
      toast.success("Email generated successfully!")
    } catch (err: any) {
      setGenState({ output: null, isLoading: false, error: err.message })
      toast.error(err.message || "Failed to generate email.")
    }
  }

  const handleRewriteSubmit = async (data: RewriterInput) => {
    setRewriteState({ output: null, isLoading: true, error: null })
    try {
      const response = await fetch("/api/ai/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Rewriting request failed.")
      }

      setRewriteState({ output: result, isLoading: false, error: null })
      addHistoryItem("rewriter", data, result)
      toast.success("Email rewritten successfully!")
    } catch (err: any) {
      setRewriteState({ output: null, isLoading: false, error: err.message })
      toast.error(err.message || "Failed to rewrite email.")
    }
  }

  const handleGrammarSubmit = async (data: GrammarInput) => {
    setGrammarState({ output: null, isLoading: true, error: null })
    try {
      const response = await fetch("/api/ai/grammar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Grammar check request failed.")
      }

      setGrammarState({ output: result, isLoading: false, error: null })
      addHistoryItem("grammar", data, result)
      toast.success("Grammar proofreading completed!")
    } catch (err: any) {
      setGrammarState({ output: null, isLoading: false, error: err.message })
      toast.error(err.message || "Failed to check grammar.")
    }
  }

  const handleSummarizeSubmit = async (data: SummarizerInput) => {
    setSumState({ output: null, isLoading: true, error: null })
    try {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Summarization request failed.")
      }

      setSumState({ output: result, isLoading: false, error: null })
      addHistoryItem("summarizer", data, result)
      toast.success("Email summarization completed!")
    } catch (err: any) {
      setSumState({ output: null, isLoading: false, error: err.message })
      toast.error(err.message || "Failed to summarize email.")
    }
  }

  const handleSubjectSubmit = async (data: SubjectLineInput) => {
    setSubjState({ output: null, isLoading: true, error: null })
    try {
      const response = await fetch("/api/ai/subject-line", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Subject generation failed.")
      }

      setSubjState({ output: result, isLoading: false, error: null })
      addHistoryItem("subject-line", data, result)
      toast.success("Subject lines generated successfully!")
    } catch (err: any) {
      setSubjState({ output: null, isLoading: false, error: err.message })
      toast.error(err.message || "Failed to generate subject lines.")
    }
  }

  // ----------------------------------------------------
  // WORKSPACE VIEW SWITCHER
  // ----------------------------------------------------
  const renderWorkspace = () => {
    switch (activeTab) {
      case "generator":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full items-start">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950/40">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-150 mb-4 uppercase tracking-wider">
                Generate Custom Email
              </h2>
              <GeneratorForm onSubmit={handleGenerateSubmit} isLoading={genState.isLoading} />
            </div>
            <div className="h-full min-h-[450px]">
              <GeneratorOutput
                output={genState.output}
                isLoading={genState.isLoading}
                error={genState.error}
              />
            </div>
          </div>
        )
      case "rewriter":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full items-start">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950/40">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-150 mb-4 uppercase tracking-wider">
                Rewrite & Polish Email
              </h2>
              <RewriterForm onSubmit={handleRewriteSubmit} isLoading={rewriteState.isLoading} />
            </div>
            <div className="h-full min-h-[450px]">
              <RewriterOutput
                output={rewriteState.output}
                isLoading={rewriteState.isLoading}
                error={rewriteState.error}
              />
            </div>
          </div>
        )
      case "grammar":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full items-start">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950/40">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-150 mb-4 uppercase tracking-wider">
                Grammar Check & Edit
              </h2>
              <GrammarForm onSubmit={handleGrammarSubmit} isLoading={grammarState.isLoading} />
            </div>
            <div className="h-full min-h-[450px]">
              <GrammarOutput
                output={grammarState.output}
                isLoading={grammarState.isLoading}
                error={grammarState.error}
              />
            </div>
          </div>
        )
      case "summarizer":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full items-start">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950/40">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-150 mb-4 uppercase tracking-wider">
                Summarize Conversations
              </h2>
              <SummarizerForm onSubmit={handleSummarizeSubmit} isLoading={sumState.isLoading} />
            </div>
            <div className="h-full min-h-[450px]">
              <SummarizerOutput
                output={sumState.output}
                isLoading={sumState.isLoading}
                error={sumState.error}
              />
            </div>
          </div>
        )
      case "subject-line":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full items-start">
            <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-2xs dark:border-zinc-800 dark:bg-zinc-950/40">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-150 mb-4 uppercase tracking-wider">
                Subject Line suggestions
              </h2>
              <SubjectLineForm onSubmit={handleSubjectSubmit} isLoading={subjState.isLoading} />
            </div>
            <div className="h-full min-h-[450px]">
              <SubjectLineOutput
                output={subjState.output}
                isLoading={subjState.isLoading}
                error={subjState.error}
              />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-900 transition-colors font-sans antialiased text-zinc-900 dark:text-zinc-100">
      <Toaster position="bottom-right" richColors />
      <Header />
      
      {/* Studio Workbench Area */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6 overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar />
        
        {/* Middle Active Workspace */}
        <main className="flex-1 min-w-0">
          {renderWorkspace()}
        </main>
        
        {/* Right Session Logs History */}
        <aside className="w-full md:w-72 shrink-0 border-t md:border-t-0 md:border-l border-zinc-200/80 p-4 md:pl-6 md:pt-0 dark:border-zinc-800/80 dark:bg-transparent">
          <HistoryList onLoadItem={handleRestoreItem} />
        </aside>
      </div>
    </div>
  )
}
