import type { ChoiceQuestion } from './types'

export type DraftQuestion = {
  topic: string
  status: 'needs_official_review'
  sourcesActuallyChecked: string[]
  applicableTaxYear: number | null
  playable: false
  question: ChoiceQuestion
}

const uncheckedDraft = {
  status: 'needs_official_review' as const,
  sourcesActuallyChecked: [],
  applicableTaxYear: null,
  playable: false as const,
}

export const draftQuestions: DraftQuestion[] = [
  {
    ...uncheckedDraft,
    topic: 'Einkommensteuer und Lohnsteuerabzug',
    question: {
      id: 'draft-wage-tax-relationship', lessonId: 'draft-legal-content', type: 'choice',
      prompt: 'Wie verhalten sich Einkommensteuer und Lohnsteuerabzug rechtlich zueinander?',
      answers: ['Entwurf: Aussage erst nach Quellenprüfung formulieren.', 'Entwurf: Aussage erst nach Quellenprüfung formulieren.', 'Entwurf: Aussage erst nach Quellenprüfung formulieren.'],
      correctAnswer: 0, explanation: 'Nicht spielbar: Die rechtliche Einordnung wurde mangels erreichbarer amtlicher Quelle nicht verifiziert.',
      concept: 'Rechtliche Beziehung zwischen Steuerarten', funken: 0,
    },
  },
  {
    ...uncheckedDraft,
    topic: 'Steuererklärung und Erklärungspflichten',
    question: {
      id: 'draft-tax-return-purpose', lessonId: 'draft-legal-content', type: 'choice',
      prompt: 'Wann muss eine Person eine Steuererklärung abgeben und welchem Zweck dient sie rechtlich?',
      answers: ['Entwurf: Aussage erst nach Quellenprüfung formulieren.', 'Entwurf: Aussage erst nach Quellenprüfung formulieren.', 'Entwurf: Aussage erst nach Quellenprüfung formulieren.'],
      correctAnswer: 0, explanation: 'Nicht spielbar: Zweck und Abgabepflichten können Rechtsfolgen auslösen und wurden nicht amtlich verifiziert.',
      concept: 'Steuererklärungen und mögliche Pflichten', funken: 0,
    },
  },
  {
    ...uncheckedDraft,
    topic: 'Werbungskosten und Voraussetzungen',
    question: {
      id: 'draft-advertising-expenses', lessonId: 'draft-legal-content', type: 'choice',
      prompt: 'Welche beruflichen Ausgaben sind rechtlich als Werbungskosten einzuordnen?',
      answers: ['Entwurf: Aussage erst nach Quellenprüfung formulieren.', 'Entwurf: Aussage erst nach Quellenprüfung formulieren.', 'Entwurf: Aussage erst nach Quellenprüfung formulieren.'],
      correctAnswer: 0, explanation: 'Nicht spielbar: Begriff und Voraussetzungen sind steuerrechtlich geprägt und wurden nicht amtlich verifiziert.',
      concept: 'Werbungskosten', funken: 0,
    },
  },
  {
    ...uncheckedDraft,
    topic: 'Absetzung für Abnutzung (AfA)',
    question: {
      id: 'draft-tax-depreciation', lessonId: 'draft-legal-content', type: 'choice',
      prompt: 'Wie wird die steuerliche AfA für eine konkrete Anschaffung bestimmt?',
      answers: ['Entwurf: Aussage erst nach Quellenprüfung formulieren.', 'Entwurf: Aussage erst nach Quellenprüfung formulieren.', 'Entwurf: Aussage erst nach Quellenprüfung formulieren.'],
      correctAnswer: 0, explanation: 'Nicht spielbar: Konkrete steuerliche Abschreibungsregeln wurden nicht amtlich verifiziert.',
      concept: 'Steuerliche AfA', funken: 0,
    },
  },
  {
    ...uncheckedDraft,
    topic: 'Umsatzsteuer und Einkommensteuer',
    question: {
      id: 'draft-vat-v-income-tax', lessonId: 'draft-legal-content', type: 'choice',
      prompt: 'Welche konkreten Vorgänge unterliegen in Deutschland welcher Steuerart?',
      answers: ['Entwurf: Aussage erst nach Quellenprüfung formulieren.', 'Entwurf: Aussage erst nach Quellenprüfung formulieren.', 'Entwurf: Aussage erst nach Quellenprüfung formulieren.'],
      correctAnswer: 0, explanation: 'Nicht spielbar: Abgrenzung, Anwendungsfälle und mögliche Ausnahmen wurden nicht amtlich verifiziert.',
      concept: 'Umsatzsteuer und Einkommensteuer', funken: 0,
    },
  },
  {
    ...uncheckedDraft,
    topic: 'Nebengewerbe und Anmeldungspflichten',
    question: {
      id: 'draft-side-business-obligations', lessonId: 'draft-legal-content', type: 'choice',
      prompt: 'Welche Anmeldung oder Meldung ist bei einer konkreten Nebentätigkeit erforderlich?',
      answers: ['Entwurf: Aussage erst nach Quellenprüfung formulieren.', 'Entwurf: Aussage erst nach Quellenprüfung formulieren.', 'Entwurf: Aussage erst nach Quellenprüfung formulieren.'],
      correctAnswer: 0, explanation: 'Nicht spielbar: Konkrete Pflichten hängen von Sachverhalt und geltender Rechtslage ab und wurden nicht amtlich verifiziert.',
      concept: 'Nebengewerbe und rechtliche Pflichten', funken: 0,
    },
  },
]