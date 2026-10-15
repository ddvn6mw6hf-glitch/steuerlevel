import { lessons } from './content'
import type { Question } from './types'

function getIntroQuestions(): Question[] {
  const introLesson = lessons.find((lesson) => lesson.id === 'wer-kassiert-hier-eigentlich')
  if (!introLesson) throw new Error('Das Einstiegskapitel fehlt.')
  return introLesson.questions
}

const introQuestions = getIntroQuestions()

function createVariant(
  id: string,
  conceptId: string,
  prompt: string,
  answers: string[],
  correctAnswer: number,
  explanation: string,
): Question {
  const source = introQuestions.find((question) => question.conceptId === conceptId)
  if (!source) throw new Error(`Keine Ausgangsfrage für Konzept ${conceptId} gefunden.`)
  return {
    ...source,
    id,
    prompt,
    answers,
    correctAnswer,
    explanation,
    funken: 0,
    retryOnIncorrect: true,
  }
}

export const reviewVariants: Question[] = [
  createVariant(
    'review-tax-definition-townhall',
    'tax-definition',
    'Der Stadtrat verlangt aufgrund eines Gesetzes Geld für den allgemeinen Haushalt. Es wird damit keine einzelne persönliche Leistung gekauft. Welche Einordnung passt am besten?',
    [
      'Das entspricht im Grundsatz einer Steuer.',
      'Das ist ein freiwilliger Eintrittspreis für einen einzelnen Besuch.',
      'Das ist ein persönliches Guthaben, das vollständig zurückgezahlt wird.',
    ],
    0,
    'Eine Steuer ist im Grundsatz eine gesetzlich auferlegte Geldleistung ohne Anspruch auf eine bestimmte individuelle Gegenleistung. Die vollständige Definition steht in § 3 Abs. 1 AO.',
  ),
  createVariant(
    'review-public-purpose-library',
    'public-purpose-no-individual-return',
    'Jasmin nutzt die öffentliche Bücherei nicht. Was folgt daraus für ihre Steuerzahlungen?',
    [
      'Sie bekommt automatisch den Anteil für die Bücherei zurück.',
      'Sie kann daraus keine persönliche Rückzahlung ableiten; Steuern finanzieren öffentliche Aufgaben gemeinsam.',
      'Ihre Steuerzahlung wird nur für Angebote verwendet, die sie selbst besucht.',
    ],
    1,
    'Steuern tragen zur Finanzierung öffentlicher Aufgaben bei. Die Zahlung ist kein persönliches Guthaben und verspricht keine bestimmte Einzelleistung.',
  ),
  createVariant(
    'review-income-vat-bookshop',
    'taxes-in-everyday-life',
    'Jonas verdient Geld bei seiner Arbeit und kauft anschließend ein Buch. Welche Aussage ordnet Einkommensteuer und Umsatzsteuer grundsätzlich zu?',
    [
      'Einkommensteuer bezieht sich grundsätzlich auf Einkommen; Umsatzsteuer auf bestimmte Verkäufe oder Leistungen.',
      'Einkommensteuer gehört grundsätzlich zum Buchkauf; Umsatzsteuer zum Arbeitsverdienst.',
      'Beide Steuerarten beziehen sich grundsätzlich nur auf Arbeitsverdienst.',
    ],
    0,
    'Die Einkommensteuer knüpft grundsätzlich an Einkommen an. Die Umsatzsteuer betrifft gesetzlich bestimmte Lieferungen und Leistungen; bei vielen Einkäufen ist sie im Preis enthalten.',
  ),
  createVariant(
    'review-social-insurance-pension',
    'tax-vs-social-insurance-contribution',
    'Auf einer erfundenen Abrechnung stehen Einkommensteuer und ein Beitrag zur Pflegeversicherung. Was ist der grundlegende Unterschied?',
    [
      'Beides sind Steuern mit einer garantierten persönlichen Einzelleistung.',
      'Der Beitrag zur Pflegeversicherung gehört zur Sozialversicherung; die Einkommensteuer ist eine Steuer.',
      'Der Pflegeversicherungsbeitrag ist Umsatzsteuer, weil er auf einer Abrechnung steht.',
    ],
    1,
    'Ein Beitrag zur Pflegeversicherung gehört zum Sozialversicherungssystem. Die Einkommensteuer ist eine Steuer. Welche konkreten Ansprüche oder Abzüge gelten, wird hier nicht beurteilt.',
  ),
  createVariant(
    'review-everyday-three-payments',
    'taxes-in-everyday-life',
    'Enna verdient Geld bei der Arbeit und kauft danach ein Buch. Auf dem Kassenbon ist Umsatzsteuer ausgewiesen. Welche Einordnung passt?',
    [
      'Einkommensteuer bezieht sich grundsätzlich auf Einkommen; Umsatzsteuer auf bestimmte Verkäufe oder Leistungen.',
      'Einkommensteuer gehört grundsätzlich zum Buchkauf; Umsatzsteuer zum Arbeitsverdienst.',
      'Beide Steuerarten beziehen sich grundsätzlich nur auf den Arbeitsverdienst.',
    ],
    0,
    'Die Einkommensteuer knüpft grundsätzlich an Einkommen an. Die Umsatzsteuer betrifft gesetzlich bestimmte Lieferungen und Leistungen; bei vielen Einkäufen ist sie im Preis enthalten.',
  ),
  createVariant(
    'review-mini-boss-three-payments',
    'mini-boss-tax-everyday-scenario',
    'Lea bekommt Lohn, auf ihrer erfundenen Abrechnung stehen Einkommensteuer und ein Beitrag zur Pflegeversicherung. Im Laden kauft sie eine Tasse mit ausgewiesener Umsatzsteuer. Welche Zuordnung stimmt?',
    [
      'Einkommensteuer gehört zum Einkommen, der Pflegebeitrag zur Sozialversicherung und Umsatzsteuer zum Einkauf.',
      'Alle drei Beträge sind Einkommensteuer auf Leas Lohn.',
      'Der Pflegebeitrag ist Umsatzsteuer und der Kassenbon weist eine Sozialversicherungsabgabe aus.',
    ],
    0,
    'Die drei Posten gehören zu unterschiedlichen Zusammenhängen: Einkommensteuer zum Einkommen, der Pflegebeitrag zur Sozialversicherung und Umsatzsteuer zu bestimmten Verkäufen oder Leistungen. Es handelt sich um ein fiktives Lernbeispiel, keine persönliche Berechnung.',
  ),
]

export const reviewVariantByConcept = new Map(
  reviewVariants.map((question) => [question.conceptId ?? question.id, question]),
)
