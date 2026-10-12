import type { DifficultyTier, LearningObjective } from './types'

export const difficultyLabels: Record<DifficultyTier, string> = {
  1: 'Steuer-Newbie',
  2: 'Durchblicker',
  3: 'Steuerstratege',
}

export const objectiveLabels: Record<LearningObjective, string> = {
  'understand-purpose': 'Steuern & Aufgaben',
  'sort-income': 'Geldquellen',
  'distinguish-revenue': 'Umsatz',
  'identify-costs': 'Kosten',
  'calculate-surplus': 'Überschuss',
  'distinguish-cash-flow': 'Geldfluss',
  'understand-gross-net': 'Brutto & Netto',
  'compare-spending-savings': 'Ausgaben & Wirkung',
  'keep-records': 'Belege',
  'understand-depreciation': 'Nutzung über Zeit',
  'distinguish-tax-types': 'Steuerarten',
  'reason-from-scenario': 'Szenario-Entscheidung',
}