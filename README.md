# AI Email Studio

AI Email Studio is a production-grade, feature-rich workspace built with **Next.js 15+ App Router**, **TypeScript**, **Tailwind CSS v4**, **Zustand**, **React Hook Form**, **Zod**, and the **OpenAI Responses API** (Structured Outputs).

It provides five key email-related productivity utilities:
1. **Email Generator**: Generates custom emails based on recipient roles, tones, lengths, and custom tags.
2. **Email Rewriter**: Rewrites original emails to adjust their style, tone, and length.
3. **Grammar Fixer**: Proofreads text, outputs a polished version, and logs a table of detailed corrections.
4. **Email Summarizer**: Compiles summaries, bullet point takeaways, and action item lists from long email threads.
5. **Subject Line Generator**: Suggests engagement-optimized subject line ideas categorized by tone and backed by psychological rationale.

---

## 🏗️ Architecture Overview

The project adheres strictly to **Clean Architecture** and **SOLID principles**:

- **Decoupled Service Layer (`lib/ai/`)**: Isolates raw AI prompting, client construction, and Zod output schemas from the user interface.
- **Type-safe Contracts (`lib/ai/schemas.ts`)**: Inputs and AI outputs are validated at runtime using Zod. No `any` type usage, ensuring absolute compile-time and runtime type-safety.
- **Feature-Based Modular Structure (`features/`)**: Form states, customized output panels, and helper components are organized logically inside feature domains (`generator`, `rewriter`, `grammar`, `summarizer`, `subject-line`, `history`).
- **Global State Management (`features/history/`)**: Integrates Zustand with localStorage persistence. Includes an autosaving drafts cache for all tools and an interactive execution logger.
- **Secure Server-side Execution**: OpenAI SDK interactions occur strictly inside Next.js Route Handlers (`/api/ai/*`). The OpenAI API key is never exposed to the client browser.

---

## 🛠️ Tech Stack & Libraries

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 & custom glassmorphism styling
- **State Store**: Zustand (with Persist Middleware)
- **Forms**: React Hook Form
- **Validators**: Zod
- **SDK**: OpenAI Node SDK (Structured Outputs API using `response_format` Zod schemas)
- **Text Utilities**: React Markdown, Remark GFM (for rich preview output)
- **Icons**: Lucide React
- **Date Utilities**: Date-fns

---

## 🚀 Setup & Installation

### 1. Clone & Install Dependencies
Ensure you have Node.js 18+ installed. Run:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory (or edit the existing one) and populate it with your OpenAI API key:
```env
OPENAI_API_KEY=your_actual_openai_api_key_here
```
> **Note**: The API client checks for the placeholder string `sk-xxxxxxxxxxxxxxxx` and alerts you on the dashboard header if the key is missing or unconfigured.

### 3. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
To build the static server and client bundle:
```bash
npm run build
```

---

## 💎 Premium Design & UX Highlights

- **Autosaving Drafts**: Forms cache text in Zustand on change, allowing you to switch between different tools without losing your work.
- **Unified Workspace & Logs**: A three-column grid layout on desktop provides immediate context: navigation, tools (form inputs and markdown preview), and execution logs side-by-side.
- **Historical Log Restoration**: Double-clicking "Restore" on any item in the history sidebar loads both its input parameters and the original AI output back into the workspace instantly.
- **Interactive Markdown Preview**: Generated emails display with formatted subjects, horizontal rules, spacing, lists, and a one-click clipboard copy feature.
- **Detailed Diff Logs**: The Grammar Fixer outputs a detailed table showing the original phrasing side-by-side with corrected segments and correction reasons.
- **Action Item Checklists**: The Summarizer automatically detects actionable tasks and renders them as checklist items.
