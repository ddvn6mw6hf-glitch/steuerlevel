import type { Question } from './types'

type FeedbackCopy = { headline: string; detail: string }

const feedbackByConcept: Record<string, { correct: string[]; incorrect: string[] }> = {
  sales: {
    correct: [
      'STEUERFALLE ENTSCHÄRFT! 💥',
      'Dein Zukunfts-Ich feiert dich! 😎',
      'Das Finanzamt hat einen neuen Endgegner: deinen Durchblick.',
      'Mehr Durchblick, weniger Steuerchaos!',
    ],
    incorrect: [
      'UPS! STEUERFALLE! 🫣',
      'Autsch, da hat dich die Bürokratie kurz ausgetrickst.',
      'Kein Drama. Jetzt weißt du, worauf es ankommt.',
      'Auch Steuerprofis haben mal klein angefangen.',
    ],
  },
  costs: {
    correct: [
      'STEUERFALLE ENTSCHÄRFT! 💥',
      'Dein Zukunfts-Ich feiert dich! 😎',
      'Das Finanzamt hat einen neuen Endgegner: deinen Durchblick.',
      'Mehr Durchblick, weniger Steuerchaos!',
    ],
    incorrect: [
      'UPS! STEUERFALLE! 🫣',
      'Autsch, da hat dich die Bürokratie kurz ausgetrickst.',
      'Kein Drama. Jetzt weißt du, worauf es ankommt.',
      'Auch Steuerprofis haben mal klein angefangen.',
    ],
  },
  salary: {
    correct: [
      'STEUERFALLE ENTSCHÄRFT! 💥',
      'Dein Zukunfts-Ich feiert dich! 😎',
      'Das Finanzamt hat einen neuen Endgegner: deinen Durchblick.',
      'Mehr Durchblick, weniger Steuerchaos!',
    ],
    incorrect: [
      'UPS! STEUERFALLE! 🫣',
      'Autsch, da hat dich die Bürokratie kurz ausgetrickst.',
      'Kein Drama. Jetzt weißt du, worauf es ankommt.',
      'Auch Steuerprofis haben mal klein angefangen.',
    ],
  },
  cash: {
    correct: [
      'STEUERFALLE ENTSCHÄRFT! 💥',
      'Dein Zukunfts-Ich feiert dich! 😎',
      'Das Finanzamt hat einen neuen Endgegner: deinen Durchblick.',
      'Mehr Durchblick, weniger Steuerchaos!',
    ],
    incorrect: [
      'UPS! STEUERFALLE! 🫣',
      'Autsch, da hat dich die Bürokratie kurz ausgetrickst.',
      'Kein Drama. Jetzt weißt du, worauf es ankommt.',
      'Auch Steuerprofis haben mal klein angefangen.',
    ],
  },
  tax: {
    correct: [
      'ABGABEN-DURCHBLICK FREIGESCHALTET! ✨',
      'Sauber sortiert – der Steuerknoten wird kleiner!',
      'Volltreffer: Du trennst jetzt die Geldposten!',
    ],
    incorrect: [
      'Fast sortiert – schau noch einmal auf den Anlass.',
      'Kleiner Steuerknoten! Die Begründung hilft dir beim Entwirren.',
      'Kein Drama: Bei Abgaben kommt es darauf an, wozu sie gehören.',
    ],
  },
  records: {
    correct: [
      'BELEG-DURCHBLICK! Der Papierkram ist sortiert. 🧾',
      'Sauber notiert – dein Zukunfts-Ich findet das wieder!',
      'Aha! Ein bisschen Kontext macht den Beleg lesbar.',
    ],
    incorrect: [
      'Fast gefunden! Ein Beleg braucht den passenden Anlass.',
      'Kein Drama: Ergänze, wozu der Beleg gehört.',
      'Der Beleg ist kein Orakel – der Vorgang zählt dazu.',
    ],
  },
  profit: {
    correct: [
      'STEUERFALLE ENTSCHÄRFT! 💥',
      'Dein Zukunfts-Ich feiert dich! 😎',
      'Das Finanzamt hat einen neuen Endgegner: deinen Durchblick.',
      'Mehr Durchblick, weniger Steuerchaos!',
    ],
    incorrect: [
      'UPS! STEUERFALLE! 🫣',
      'Autsch, da hat dich die Bürokratie kurz ausgetrickst.',
      'Kein Drama. Jetzt weißt du, worauf es ankommt.',
      'Auch Steuerprofis haben mal klein angefangen.',
    ],
  },
}

const learningMomentByConcept: Record<keyof typeof feedbackByConcept, string> = {
  sales: 'Umsatz zählt Verkäufe; Kosten werden erst danach betrachtet.',
  costs: 'Kosten mindern den Überschuss, sie ändern nicht rückwirkend den Verkauf.',
  salary: 'Brutto steht vor den gezeigten Abzügen, Netto danach.',
  cash: 'Eine Ausgabe und eine mögliche Steuerwirkung sind getrennte Geldbewegungen.',
  tax: 'Achte darauf, wodurch die Zahlung entsteht und ob sie zu einer Steuer oder einem Versicherungssystem gehört.',
  records: 'Ein Beleg wird mit Anlass und Vorgang nachvollziehbar; er verspricht keine Rückzahlung.',
  profit: 'Vergleiche Erlöse und Kosten; weitere Kosten können das Ergebnis noch ändern.',
}

function getConceptGroup(question: Question): keyof typeof feedbackByConcept {
  const description = `${question.id} ${question.concept}`.toLowerCase()
  if (/brutto|netto|abrechnung|abzug|salary/.test(description)) return 'salary'
  if (/intro-tax|intro-income|steuer|sozialversicherung|rentenversicherung|krankenversicherung/.test(description)) return 'tax'
  if (/cash|flow|geldfluss|geldzufluss|zahlung|refund|ausgabe|entlastung|spending|expense/.test(description)) return 'cash'
  if (/beleg|dokument|receipt|record|papierkram/.test(description)) return 'records'
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