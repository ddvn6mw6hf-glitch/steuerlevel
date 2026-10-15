import type { LearningObjective, Question } from './types'

const learningCopy: Record<LearningObjective, string> = {
  'understand-purpose': 'Achte bei einem Geldbetrag zuerst darauf, wer ihn erhebt und welchem Zweck er dient.',
  'sort-income': 'Unterscheide die Herkunft eines Betrags von der Frage, wofür er später verwendet wird.',
  'distinguish-revenue': 'Ein Verkaufserlös und das Ergebnis nach Abzug von Kosten sind zwei verschiedene Größen.',
  'identify-costs': 'Betrachte Ausgaben als eigene Beträge, getrennt von den Einnahmen eines Vorhabens.',
  'calculate-surplus': 'Vergleiche die genannten Einnahmen und Ausgaben Schritt für Schritt.',
  'distinguish-cash-flow': 'Achte darauf, ob Geld nur erwartet, zugesagt oder bereits tatsächlich gezahlt wurde.',
  'understand-gross-net': 'Eine Beispielabrechnung zeigt Beträge an unterschiedlichen Stellen einer Rechnung.',
  'compare-spending-savings': 'Eine Ausgabe und eine mögliche spätere Wirkung sind nicht dasselbe.',
  'keep-records': 'Ein Beleg hilft dabei, einen Vorgang mit Anlass, Betrag und Zeitpunkt nachzuvollziehen.',
  'understand-depreciation': 'Bei einer langlebigen Anschaffung lohnt es sich, Kauf und Nutzung auseinanderzuhalten.',
  'distinguish-tax-types': 'Zahlungen lassen sich nach Anlass und ihrer Rolle im jeweiligen Beispiel unterscheiden.',
  'reason-from-scenario': 'Lies die Situation genau und ordne die genannten Beträge nach ihrer jeweiligen Rolle.',
}

const hintCopy: Record<LearningObjective, string> = {
  'understand-purpose': 'Schau auf den Anlass der Zahlung und darauf, ob dafür eine bestimmte Einzelleistung genannt wird.',
  'sort-income': 'Ordne zuerst jede Zahlung ihrer Quelle zu.',
  'distinguish-revenue': 'Trenne den Verkaufspreis von den Kosten und vom Ergebnis.',
  'identify-costs': 'Suche nach Beträgen, die für Material, Leistung oder andere Ausgaben anfallen.',
  'calculate-surplus': 'Notiere die Werte getrennt und führe dann den gefragten Rechenschritt aus.',
  'distinguish-cash-flow': 'Prüfe, was schon gezahlt wurde und was noch offen oder nur geplant ist.',
  'understand-gross-net': 'Vergleiche die Positionen vor und nach den in der Beispielabrechnung genannten Abzügen.',
  'compare-spending-savings': 'Ein möglicher Effekt macht den ursprünglichen Kaufpreis nicht automatisch rückgängig.',
  'keep-records': 'Achte darauf, welche Informationen den Vorgang später nachvollziehbar machen.',
  'understand-depreciation': 'Betrachte getrennt, was angeschafft wurde und wie lange es verwendet werden soll.',
  'distinguish-tax-types': 'Vergleiche, worauf sich die Zahlung im jeweiligen Beispiel bezieht.',
  'reason-from-scenario': 'Markiere die entscheidenden Angaben, bevor du die Antwort auswählst.',
}

export function getLearningText(question: Question): string {
  return question.teachingText ?? learningCopy[question.objective ?? 'reason-from-scenario']
}

export function getQuestionHint(question: Question): string {
  return question.teachingText ?? hintCopy[question.objective ?? 'reason-from-scenario']
}
