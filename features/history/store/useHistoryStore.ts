import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  GeneratorInput,
  GeneratorOutput,
  RewriterInput,
  RewriterOutput,
  GrammarInput,
  GrammarOutput,
  SummarizerInput,
  SummarizerOutput,
  SubjectLineInput,
  SubjectLineOutput,
} from "@/lib/ai/schemas"

export type FeatureType = "generator" | "rewriter" | "grammar" | "summarizer" | "subject-line"

export interface HistoryItem {
  id: string
  type: FeatureType
  timestamp: number
  input: GeneratorInput | RewriterInput | GrammarInput | SummarizerInput | SubjectLineInput
  output: GeneratorOutput | RewriterOutput | GrammarOutput | SummarizerOutput | SubjectLineOutput
}

interface Drafts {
  generator?: GeneratorInput
  rewriter?: RewriterInput
  grammar?: GrammarInput
  summarizer?: SummarizerInput
  "subject-line"?: SubjectLineInput
}

interface HistoryState {
  history: HistoryItem[]
  activeTab: FeatureType
  drafts: Drafts
  isHydrated: boolean
  
  // Actions
  addHistoryItem: (type: FeatureType, input: any, output: any) => void
  deleteHistoryItem: (id: string) => void
  clearHistory: () => void
  setActiveTab: (tab: FeatureType) => void
  saveDraft: (type: FeatureType, input: any) => void
  setHydrated: (state: boolean) => void
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      activeTab: "generator",
      drafts: {},
      isHydrated: false,

      addHistoryItem: (type, input, output) =>
        set((state) => ({
          history: [
            {
              id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type,
              timestamp: Date.now(),
              input,
              output,
            },
            ...state.history,
          ],
        })),

      deleteHistoryItem: (id) =>
        set((state) => ({
          history: state.history.filter((item) => item.id !== id),
        })),

      clearHistory: () => set({ history: [] }),

      setActiveTab: (activeTab) => set({ activeTab }),

      saveDraft: (type, input) =>
        set((state) => ({
          drafts: {
            ...state.drafts,
            [type]: input,
          },
        })),

      setHydrated: (isHydrated) => set({ isHydrated }),
    }),
    {
      name: "ai-email-studio-storage",
      // Only persist history and drafts, avoid persisting activeTab or hydration state to simplify
      partialize: (state) => ({
        history: state.history,
        drafts: state.drafts,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    }
  )
)
