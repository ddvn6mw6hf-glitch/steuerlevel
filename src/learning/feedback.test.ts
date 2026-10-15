import { describe, expect, it } from 'vitest'
import { lessons } from './content'
import { profilePools } from './profilePools'
import { getAnswerFeedback } from './feedback'
import { interestPools } from './interestPools'

describe('Konzeptbezogenes Feedback', () => {
  it('verbindet Umsatz- und Kostenfeedback mit dem jeweiligen Lernkonzept', () => {
    const sale = profilePools['dual-apprentice'].questions[0]
    const costs = profilePools['dual-apprentice'].questions[2]

    expect(getAnswerFeedback(sale, false).detail).toMatch(/Umsatz|Verkauf|Verkaufserlös/)
    expect(getAnswerFeedback(costs, false).detail).toMatch(/Kosten|Überschuss|Spalten/)
  })

  it('bietet unterschiedliche, deterministische positive Rückmeldungen', () => {
    const first = getAnswerFeedback(profilePools['dual-apprentice'].questions[0], true)
    const second = getAnswerFeedback(lessons[1].questions[0], true)

    expect(first.headline).not.toBe(second.headline)
    expect(getAnswerFeedback(profilePools['dual-apprentice'].questions[0], true)).toEqual(first)
  })

  it('erkennt Zeitpunkte von Zahlungen als Geldfluss-Lernziel', () => {
    expect(getAnswerFeedback(interestPools['side-business'][2], false).detail)
      .toMatch(/Geldfluss|Zahlung|Ausgabe|Geldabfluss/)
  })
})