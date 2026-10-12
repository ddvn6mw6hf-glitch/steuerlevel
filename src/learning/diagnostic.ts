import { lessons } from './curriculum'
import { getLessonForPreferences } from './scenarios'
import type { LearningPreferences, LifeSituation } from './types'

const lifeSituations: LifeSituation[] = ['dual-apprentice', 'university', 'employee', 'founder']

export function formatProfileQuestionDiagnostic(preferences: LearningPreferences): string {
  return lifeSituations.map((lifeSituation) => {
    const profile = { ...preferences, lifeSituation }
    const selections = lessons.map((lesson) => {
      const selected = getLessonForPreferences(lesson, profile)
      const questions = selected.questions.map((question) => question.id).join(', ')
      return `  ${lesson.topic}: ${questions}`
    })
    const uniqueIds = lessons.flatMap((lesson) => getLessonForPreferences(lesson, profile).questions)
      .filter((question) => question.tags?.lifeSituation === lifeSituation)
      .map((question) => question.id)
    return `${lifeSituation} (${uniqueIds.length} exklusive Fragen)\n${selections.join('\n')}`
  }).join('\n\n')
}

export function printProfileQuestionDiagnostic(
  preferences: LearningPreferences,
  write: (output: string) => void = (output) => console.info(output),
): void {
  write(formatProfileQuestionDiagnostic(preferences))
}
