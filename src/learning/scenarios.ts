import { lessons } from './content'
import { profilePools } from './profilePools'
import { selectQuestionsForPreferences } from './questionBank'
import type { LearningPreferences, Lesson } from './types'

export const defaultPreferences: LearningPreferences = {
  ageGroup: '18-24',
  lifeSituation: 'dual-apprentice',
  mainInterest: 'side-business',
}

const fictionalProfiles = {
  'dual-apprentice': { name: 'Mira', ages: { '18-24': 21, '25-34': 28, '35+': 38 }, role: 'Person im dualen Studium oder in Ausbildung' },
  university: { name: 'Noah', ages: { '18-24': 22, '25-34': 30, '35+': 39 }, role: 'Person im Studium' },
  employee: { name: 'Samira', ages: { '18-24': 23, '25-34': 31, '35+': 42 }, role: 'angestellte Person' },
  founder: { name: 'Alex', ages: { '18-24': 24, '25-34': 32, '35+': 46 }, role: 'gründungsinteressierte Person' },
} satisfies Record<LearningPreferences['lifeSituation'], { name: string; ages: Record<LearningPreferences['ageGroup'], number>; role: string }>

const interestLessonOrder: Record<LearningPreferences['mainInterest'], string[]> = {
  'side-business': ['umsatz-gewinn', 'belege-und-kosten', 'geldfluss-und-entscheidungen', 'steuern-verstehen', 'brutto-netto', 'ausgaben-steuerersparnis'],
  salary: ['brutto-netto', 'steuern-verstehen', 'geldfluss-und-entscheidungen', 'umsatz-gewinn', 'belege-und-kosten', 'ausgaben-steuerersparnis'],
  everyday: ['steuern-verstehen', 'belege-und-kosten', 'ausgaben-steuerersparnis', 'brutto-netto', 'umsatz-gewinn', 'geldfluss-und-entscheidungen'],
}

export function orderLessonsByInterest(
  preferences: LearningPreferences,
  availableLessons: Lesson[] = lessons,
): Lesson[] {
  const order = interestLessonOrder[preferences.mainInterest]
  return [...availableLessons].sort((left, right) =>
    left.difficulty - right.difficulty || order.indexOf(left.id) - order.indexOf(right.id),
  )
}

export function getFictionalScenario(preferences: LearningPreferences, lesson: Lesson): string {
  const profile = fictionalProfiles[preferences.lifeSituation]
  const age = profile.ages[preferences.ageGroup]
  const selectedStory = lesson.id === 'umsatz-gewinn'
    ? profilePools[preferences.lifeSituation].scenario
    : lesson.scenario.replaceAll('{name}', profile.name)
  const interestContext: Record<LearningPreferences['mainInterest'], string> = {
    salary: 'Dein Schwerpunkt Lohn und Einkommen stellt diesen fiktiven Verkauf neben einen ebenfalls erfundenen Monatsverdienst; die Übung vergleicht nur Begriffe.',
    'side-business': 'Dein Schwerpunkt Nebengewerbe rückt Verkaufserlöse, betriebliche Kosten und den rechnerischen Überschuss in den Vordergrund.',
    everyday: 'Dein Alltagsschwerpunkt betrachtet den Verkauf als kleine Geldentscheidung mit getrennten Ein- und Ausgaben, ohne steuerliche Einordnung.',
  }
  return `${profile.name} ist eine fiktive ${age}-jährige ${profile.role}. ${selectedStory} ${interestContext[preferences.mainInterest]}`
}

export function getLessonForPreferences(lesson: Lesson, preferences: LearningPreferences): Lesson {
  return { ...lesson, questions: selectQuestionsForPreferences(lesson, preferences) }
}

export function getPersonalizedLearningPath(preferences: LearningPreferences): Lesson[] {
  return orderLessonsByInterest(preferences).map((lesson) => getLessonForPreferences(lesson, preferences))
}

export function getProfileFitExplanation(preferences: LearningPreferences): string {
  const situationLabels: Record<LearningPreferences['lifeSituation'], string> = {
    'dual-apprentice': 'duales Studium oder Ausbildung',
    university: 'Studium',
    employee: 'Angestelltsein',
    founder: 'Selbstständigkeit oder Gründung',
  }
  const interestExplanations: Record<LearningPreferences['mainInterest'], string> = {
    salary: 'Deine Auswahl verändert konkrete Abrechnungs- und Geldflussfragen im Lernpfad.',
    'side-business': 'Deine Auswahl verändert konkrete Verkaufs-, Kosten- und Belegfragen im Lernpfad.',
    everyday: 'Deine Auswahl verändert konkrete Alltags-, Zahlungs- und Ausgabenfragen im Lernpfad.',
  }
  return `Die Beispiele orientieren sich an deiner Auswahl „${situationLabels[preferences.lifeSituation]}“. ${interestExplanations[preferences.mainInterest]}`
}

export function getNextLessonRecommendation(
  currentLessonId: string,
  preferences: LearningPreferences,
  completedLessonIds: string[],
): Lesson | null {
  const ordered = orderLessonsByInterest(preferences)
  return ordered.find((lesson) => lesson.id !== currentLessonId && !completedLessonIds.includes(lesson.id)) ?? null
}