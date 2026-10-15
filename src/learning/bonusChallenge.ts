import { lessons } from './content'
import { questionBank } from './questionBank'
import { getConceptId } from './trainer'
import type { Lesson, Question } from './types'

function createBonusQuestion(
  sourceQuestionId: string,
  id: string,
  prompt: string,
  answers: string[],
  correctAnswer: number,
  explanation: string,
): Question {
  const source = questionBank.find((entry) => entry.question.id === sourceQuestionId)?.question
  if (!source) throw new Error(`Keine sichere Ausgangsfrage ${sourceQuestionId} für die Bonus-Challenge gefunden.`)
  return {
    ...source,
    id,
    conceptId: getConceptId(source),
    lessonId: 'bonus-paperwork-endgegner',
    prompt,
    answers,
    correctAnswer,
    explanation,
    funken: 5,
    tags: source.tags
      ? { ...source.tags, lessonId: 'bonus-paperwork-endgegner' }
      : undefined,
  }
}

export const bonusChallengeQuestions: Question[] = [
  createBonusQuestion(
    'records-context',
    'bonus-paperwork-receipt-context',
    'Auf einem fiktiven Beleg steht nur „Material“. Was hilft Lea, den Beleg später einzuordnen?',
    [
      'Den Anlass und den zugehörigen Vorgang ergänzen.',
      'Einen Verkauf dazuerfinden, damit der Beleg vollständig wirkt.',
      'Eine Rückzahlung eintragen, obwohl noch keine eingegangen ist.',
    ],
    0,
    'Ein kurzer Vermerk zum Anlass und Vorgang macht den Beleg nachvollziehbarer. Er beweist weder einen Verkauf noch eine Rückzahlung.',
  ),
  createBonusQuestion(
    'interest-everyday-refund',
    'bonus-paperwork-refund-timing',
    'Mika hat einen Einkauf storniert, aber das Geld ist noch nicht wieder auf dem Konto. Was gilt für den aktuellen Geldzufluss?',
    [
      'Die Rückzahlung ist schon mit dem Klick auf „Stornieren“ eingegangen.',
      'Der tatsächliche Geldzufluss entsteht erst, wenn die Rückzahlung wirklich eingeht.',
      'Die erwartete Rückzahlung zählt als Verkaufserlös.',
    ],
    1,
    'Eine erwartete Rückzahlung ist noch kein verfügbarer Geldzufluss. Entscheidend ist in diesem Beispiel, wann das Geld tatsächlich eingeht.',
  ),
  createBonusQuestion(
    'cashflow-order',
    'bonus-paperwork-payment-date',
    'Ein fiktiver Auftrag ist vereinbart, die Kundenzahlung kommt aber erst nächste Woche. Welche Aussage zum heutigen Kontostand ist richtig?',
    [
      'Der vereinbarte Auftrag und der spätere Zahlungseingang sind zeitlich verschiedene Ereignisse.',
      'Der vereinbarte Betrag ist schon sicher auf dem Konto.',
      'Der Auftrag ist deshalb automatisch eine bezahlte Rechnung.',
    ],
    0,
    'Ein vereinbarter Vorgang und der tatsächliche Zahlungseingang können auseinanderliegen. Eine erwartete Zahlung ist noch kein vorhandenes Guthaben.',
  ),
]

export const bonusChallenge: Lesson = {
  ...lessons[0],
  id: 'bonus-paperwork-endgegner',
  difficulty: 2,
  topic: 'Fiktive Belege und Geldflüsse',
  title: 'Der Papierkram-Endgegner',
  shortTitle: 'Papierkram-Endgegner',
  subtitle: 'Belege, Rückzahlungen und Zahlungstermine sortieren',
  icon: '▤',
  concepts: ['Belegkontext', 'tatsächlicher Geldzufluss', 'Zahlungszeitpunkt'],
  scenario: 'Eine zusätzliche fiktive Übung zu bereits eingeführten Lernkonzepten.',
  questions: bonusChallengeQuestions,
  references: { sources: [], verificationStatus: 'conceptual_unverified', taxYear: null },
}
