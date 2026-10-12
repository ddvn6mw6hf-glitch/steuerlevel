import type { DifficultyTier, LearningObjective } from './types'

export const difficultyLabels: Record<DifficultyTier, string> = {
  1: 'Steuer-Newbie',
  2: 'Durchblicker',
  3: 'Steuerstratege',
}

export const objectiveLabels: Record<LearningObjective, string> = {
  'distinguish-revenue': 'Umsatz',
  'identify-costs': 'Kosten',
  'calculate-surplus': 'Überschuss',
  'distinguish-cash-flow': 'Geldfluss',
  'understand-gross-net': 'Brutto & Netto',
  'compare-spending-savings': 'Ausgaben & Wirkung',
  'reason-from-scenario': 'Szenario-Entscheidung',
}