import { lessons } from './content'
import { profilePools } from './profilePools'
import { selectLearningPath, selectQuestionsForPreferences } from './questionBank'
import { getNextLesson } from './progression'
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

const profileTopics: Record<LearningPreferences['lifeSituation'], Record<string, string>> = {
  'dual-apprentice': {
    'steuern-verstehen': 'Lernalltag und Projektbeträge',
    'brutto-netto': 'Fiktive Ausbildungsabrechnung',
    'umsatz-gewinn': 'Fahrrad-Nebenprojekt',
    'belege-und-kosten': 'Material im Lernprojekt',
    'geldfluss-und-entscheidungen': 'Zahlung nach dem Verkauf',
    'ausgaben-steuerersparnis': 'Werkzeug und private Nutzung',
  },
  university: {
    'steuern-verstehen': 'Gemeinsame Studienprojekte',
    'brutto-netto': 'Studienbudget und Abrechnung',
    'umsatz-gewinn': 'Lernkarten am Campus',
    'belege-und-kosten': 'Campusstand und Projektkosten',
    'geldfluss-und-entscheidungen': 'Sammelauszahlung am Campus',
    'ausgaben-steuerersparnis': 'Seminarbuch und private Nutzung',
  },
  employee: {
    'steuern-verstehen': 'Gehaltsabrechnung und Freizeitprojekt',
    'brutto-netto': 'Monatsbudget aus Beispielabrechnung',
    'umsatz-gewinn': 'Kräuterkästen am Nachbarschaftsmarkt',
    'belege-und-kosten': 'Lieferung fürs Freizeitprojekt',
    'geldfluss-und-entscheidungen': 'Offene Projekt-Rechnung',
    'ausgaben-steuerersparnis': 'Werkzeug mit gemischter Nutzung',
  },
  founder: {
    'steuern-verstehen': 'Testserie und Projektplanung',
    'brutto-netto': 'Private Auszahlung und Projektbeträge',
    'umsatz-gewinn': 'Fahrradtaschen in Testserien',
    'belege-und-kosten': 'Verpackung je Testserie',
    'geldfluss-und-entscheidungen': 'Vorbestellung und Zahlungstermine',
    'ausgaben-steuerersparnis': 'Langlebige Projektanschaffung',
  },
}

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
  return {
    ...lesson,
    topic: profileTopics[preferences.lifeSituation][lesson.id] ?? lesson.topic,
    questions: selectQuestionsForPreferences(lesson, preferences),
  }
}

export function getPersonalizedLearningPath(preferences: LearningPreferences): Lesson[] {
  const ordered = orderLessonsByInterest(preferences)
  return selectLearningPath(preferences, ordered).map((lesson) => ({
    ...lesson,
    topic: profileTopics[preferences.lifeSituation][lesson.id] ?? lesson.topic,
  }))
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
  const path = getPersonalizedLearningPath(preferences)
  const completed = completedLessonIds.includes(currentLessonId)
    ? completedLessonIds
    : [...completedLessonIds, currentLessonId]
  return getNextLesson(path, completed)
}