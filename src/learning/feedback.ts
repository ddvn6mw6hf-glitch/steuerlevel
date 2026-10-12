import type { Question } from './types'

type FeedbackCopy = { headline: string; detail: string }

const feedbackByConcept: Record<string, { correct: string[]; incorrect: string[] }> = {
  sales: {
    correct: [
      'Kassenbon-Klarheit: Der Verkauf zählt zum Umsatz. ✨',
      'Umsatz sitzt. Dein Taschenrechner darf kurz durchatmen. 🧮',
      'Sauber sortiert: Verkaufserlös ist noch nicht der Gewinn. 💡',
    ],
    incorrect: [
      'Kleiner Perspektivwechsel: Umsatz zählt den Verkauf, nicht das, was nach Kosten übrig bleibt.',
      'Der Verkaufspreis ist erst der Anfang der Rechnung. Kosten kommen danach ins Bild.',
      'Fast am Ziel: Trenne zuerst den Verkaufserlös von den Ausgaben.',
    ],
  },
  costs: {
    correct: [
      'Kosten im Blick, Ergebnis im Griff. 🎯',
      'Gute Rechnung: Kosten knabbern am Überschuss, nicht am Verkaufspreis. 🧾',
      'Taschenrechner nickt anerkennend. Das passiert nicht oft. 🧮',
    ],
    incorrect: [
      'Der hilfreiche Dreh: Kosten verändern den Überschuss, nicht den ursprünglichen Verkauf.',
      'Denk an zwei Spalten: Verkäufe hier, Kosten dort. Erst danach vergleichst du sie.',
      'Nicht der Verkauf ändert sich, sondern das, was nach den Kosten übrig bleibt.',
    ],
  },
  salary: {
    correct: [
      'Brutto vor, Netto nach den Beispiel-Abzügen. Sitzt! 🎯',
      'Abrechnungs-Kompass aktiviert. 🧭',
      'Das passt: Du hast genau auf die gezeigten Abzüge geschaut. 🔎',
    ],
    incorrect: [
      'Auf der Beispielabrechnung liegt Brutto vor den aufgeführten Abzügen, Netto danach.',
      'Hier hilft die Reihenfolge: erst Brutto, dann die angenommenen Abzüge, dann Netto.',
      'Schau auf die Rechenschritte der Beispielabrechnung, nicht auf einen pauschalen Betrag.',
    ],
  },
  cash: {
    correct: [
      'Geldfluss mit Weitblick: Zahlung und mögliche Entlastung bleiben getrennt. 🌊',
      'Gut sortiert: Eine Ausgabe bleibt erst einmal ein Geldabfluss. 🧾',
      'Finanzblick sitzt: möglich heißt nicht garantiert. 🔎',
    ],
    incorrect: [
      'Wichtige Trennung: Die Ausgabe kostet Geld; eine mögliche Entlastung ist weder sicher noch gleich hoch.',
      'Eine Ausgabe ist keine Erstattung. Eine mögliche spätere Wirkung bleibt ein eigener, unsicherer Schritt.',
      'Sortiere erst den echten Geldabfluss und dann eine mögliche steuerliche Wirkung.',
    ],
  },
  profit: {
    correct: [
      'Überschuss gefunden. Weitere Kosten könnten das Ergebnis noch verändern.',
      'Rechenschritt sitzt: Das Ergebnis gilt vor den noch nicht berücksichtigten Kosten.',
      'Gute Zwischenbilanz: Du hast Erlöse und Kosten sauber verglichen.',
    ],
    incorrect: [
      'Ein Überschuss entsteht erst, wenn du die genannten Kosten vom Verkaufserlös abziehst.',
      'Rechne Erlöse minus Kosten. Das Ergebnis bleibt ein Zwischenstand, falls weitere Kosten dazukommen.',
      'Hier zählt die Differenz zwischen Verkauf und Kosten, nicht eine mögliche Steuerwirkung.',
    ],
  },
}

const learningMomentByConcept: Record<keyof typeof feedbackByConcept, string> = {
  sales: 'Umsatz zählt Verkäufe; Kosten werden erst danach betrachtet.',
  costs: 'Kosten mindern den Überschuss, sie ändern nicht rückwirkend den Verkauf.',
  salary: 'Brutto steht vor den gezeigten Abzügen, Netto danach.',
  cash: 'Eine Ausgabe und eine mögliche Steuerwirkung sind getrennte Geldbewegungen.',
  profit: 'Vergleiche Erlöse und Kosten; weitere Kosten können das Ergebnis noch ändern.',
}

function getConceptGroup(question: Question): keyof typeof feedbackByConcept {
  const description = `${question.id} ${question.concept}`.toLowerCase()
  if (/brutto|netto|abrechnung|abzug|salary/.test(description)) return 'salary'
  if (/steuer|cash|flow|geldfluss|geldzufluss|zahlung|refund|ausgabe|entlastung|spending|expense/.test(description)) return 'cash'
  if (/kosten|material|delivery|fees|repair|packaging/.test(description)) return 'costs'
  if (/umsatz|verkauf|sale|revenue/.test(description)) return 'sales'
  return 'profit'
}

function stableIndex(id: string, length: number): number {
  return [...id].reduce((sum, character) => sum + character.charCodeAt(0), 0) % length
}

export function getAnswerFeedback(question: Question, correct: boolean): FeedbackCopy {
  const groupName = getConceptGroup(question)
  const group = feedbackByConcept[groupName]
  const messages = correct ? group.correct : group.incorrect
  return {
    headline: messages[stableIndex(question.id, messages.length)],
    detail: correct ? question.explanation : `${learningMomentByConcept[groupName]} ${question.explanation}`,
  }
}