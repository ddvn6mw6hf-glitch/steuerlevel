import { describe, expect, it } from 'vitest'
import { calculateBusinessSimulation } from './simulation'

describe('Fiktive Umsatz-Kosten-Simulation', () => {
  it('berechnet Umsatz minus Kosten als Ergebnis vor möglichen Steuerwirkungen', () => {
    expect(calculateBusinessSimulation(260, 180, 220)).toEqual({
      revenue: 260,
      costs: 180,
      cashReceived: 220,
      profitBeforeTax: 80,
      netCashFlow: 40,
    })
  })

  it('zeigt ein negatives Ergebnis, wenn Kosten den Umsatz übersteigen', () => {
    const result = calculateBusinessSimulation(90, 120, 60)
    expect(result.profitBeforeTax).toBe(-30)
    expect(result.netCashFlow).toBe(-60)
  })

  it('normalisiert negative, ungültige und nicht ganze Eingaben', () => {
    expect(calculateBusinessSimulation(-5, Number.NaN)).toEqual({
      revenue: 0,
      costs: 0,
      cashReceived: 0,
      profitBeforeTax: 0,
      netCashFlow: 0,
    })
    expect(calculateBusinessSimulation(12.6, 3.2).profitBeforeTax).toBe(10)
    expect(calculateBusinessSimulation(100, 20, 150).cashReceived).toBe(100)
  })
})