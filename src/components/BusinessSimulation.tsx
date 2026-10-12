import { useState } from 'react'
import { calculateBusinessSimulation } from '../learning/simulation'

const formatEuro = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 })

function BusinessSimulation() {
  const [revenue, setRevenue] = useState(260)
  const [costs, setCosts] = useState(180)
  const [cashReceived, setCashReceived] = useState(220)
  const result = calculateBusinessSimulation(revenue, costs, cashReceived)

  return (
    <details className="business-simulation">
      <summary>
        <span className="simulation-sign" aria-hidden="true">↗</span>
        <span><strong>Was wäre, wenn?</strong><small>Verkauf und Kosten selbst verändern</small></span>
        <span className="simulation-toggle" aria-hidden="true">＋</span>
      </summary>
      <div className="simulation-body">
        <p className="simulation-label">FIKTIVE MINI-SIMULATION · ALLE BETRÄGE SIND ERFUNDEN</p>
        <div className="simulation-sliders">
          <label>
            <span><strong>Verkaufserlöse / Umsatz</strong><output>{formatEuro.format(result.revenue)} €</output></span>
            <input aria-label="Fiktiver Umsatz in Euro" max="600" min="0" onChange={(event) => {
              const amount = Number(event.target.value)
              setRevenue(amount)
              setCashReceived((current) => Math.min(current, amount))
            }} step="5" type="range" value={result.revenue} />
          </label>
          <label>
            <span><strong>Fiktive bezahlte Kosten</strong><output>{formatEuro.format(result.costs)} €</output></span>
            <input aria-label="Fiktive Kosten in Euro" max="600" min="0" onChange={(event) => setCosts(Number(event.target.value))} step="5" type="range" value={result.costs} />
          </label>
          <label>
            <span><strong>Davon bereits eingegangen</strong><output>{formatEuro.format(result.cashReceived)} €</output></span>
            <input aria-label="Fiktive bereits eingegangene Zahlung in Euro" max={result.revenue} min="0" onChange={(event) => setCashReceived(Number(event.target.value))} step="5" type="range" value={result.cashReceived} />
          </label>
        </div>
        <div className="simulation-results" aria-live="polite">
          <div><span>Umsatz</span><strong>{formatEuro.format(result.revenue)} €</strong></div>
          <div><span>Kosten</span><strong>−{formatEuro.format(result.costs)} €</strong></div>
          <div className={result.profitBeforeTax < 0 ? 'simulation-negative' : ''}>
            <span>Vereinfachter Gewinn vor möglichen Steuerwirkungen</span>
            <strong>{formatEuro.format(result.profitBeforeTax)} €</strong>
          </div>
          <div className={result.netCashFlow < 0 ? 'simulation-negative' : ''}>
            <span>Geldfluss: eingegangen minus gezahlt</span>
            <strong>{formatEuro.format(result.netCashFlow)} €</strong>
          </div>
        </div>
        <p className="simulation-disclaimer">Gewinn hier = Umsatz minus gewählte Kosten; Geldfluss hier = tatsächlich eingegangenes Geld minus bezahlte Kosten. Mögliche Steuerersparnisse sind nicht eingerechnet und keine Erstattung. Alles ist fiktiv und keine Steuerberechnung.</p>
      </div>
    </details>
  )
}

export default BusinessSimulation