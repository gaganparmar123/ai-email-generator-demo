"use client"

import * as React from "react"
import { GeneratorOutput as GeneratorOutputType } from "@/lib/ai/schemas"
import { OutputPreview } from "@/features/shared/components/OutputPreview"

interface GeneratorOutputProps {
  output: GeneratorOutputType | null
  isLoading: boolean
  error: string | null
}

export function GeneratorOutput({ output, isLoading, error }: GeneratorOutputProps) {
  const [selectedSubject, setSelectedSubject] = React.useState<string>("")

  // Sync selected subject with the generated output
  React.useEffect(() => {
    if (output) {
      setSelectedSubject(output.subject)
    } else {
      setSelectedSubject("")
    }
  }, [output])

  const handleSelectAlternative = (subject: string) => {
    setSelectedSubject(subject)
  }

  // Format the visual display of the email output in markdown
  const formattedMarkdown = React.useMemo(() => {
    if (!output) return ""
    return `**Subject:** ${selectedSubject}

***

${output.greeting}

${output.body}

${output.signOff}`
  }, [output, selectedSubject])

  // Plain text for copying without markdown formatting characters
  const plainTextCopy = React.useMemo(() => {
    if (!output) return ""
    return `Subject: ${selectedSubject}

${output.greeting}

${output.body}

${output.signOff}`
  }, [output, selectedSubject])

  return (
    <OutputPreview
      title="Generated Email Output"
      content={formattedMarkdown}
      copyText={plainTextCopy}
      isLoading={isLoading}
      error={error}
      alternativeSubjects={output?.alternativeSubjects}
      onSelectAlternativeSubject={handleSelectAlternative}
    />
  )
}
