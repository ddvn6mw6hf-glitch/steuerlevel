export type BusinessSimulationResult = {
  revenue: number
  costs: number
  cashReceived: number
  profitBeforeTax: number
  netCashFlow: number
}

function normalizeEuroAmount(amount: number): number {
  return Number.isFinite(amount) ? Math.max(0, Math.round(amount)) : 0
}

export function calculateBusinessSimulation(
  revenue: number,
  costs: number,
  cashReceived = revenue,
): BusinessSimulationResult {
  const safeRevenue = normalizeEuroAmount(revenue)
  const safeCosts = normalizeEuroAmount(costs)
  const safeCashReceived = Math.min(safeRevenue, normalizeEuroAmount(cashReceived))
  return {
    revenue: safeRevenue,
    costs: safeCosts,
    cashReceived: safeCashReceived,
    profitBeforeTax: safeRevenue - safeCosts,
    netCashFlow: safeCashReceived - safeCosts,
  }
}