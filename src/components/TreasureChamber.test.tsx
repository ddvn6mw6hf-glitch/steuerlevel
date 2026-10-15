import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import TreasureChamber from './TreasureChamber'
import FunkenBag from './FunkenBag'
import { createDefaultLearningData } from '../learning/storage'

function renderTreasure(ownedRewards: Array<'golden-funkenbeutel' | 'steuerdetektiv-abzeichen' | 'papierkram-endgegner'> = []) {
  const data = createDefaultLearningData()
  data.progress.lifetimeEarned = 800
  data.progress.availableBalance = 800
  data.progress.purchasedRewardIds = ownedRewards
  return renderToStaticMarkup(
    <TreasureChamber
      data={data}
      feedback={null}
      bonusResult={null}
      onDismissFeedback={() => undefined}
      onPurchase={() => ({ success: false, reason: 'already-owned' })}
      onToggleGoldenBag={() => undefined}
      onStartBonus={() => undefined}
      onBack={() => undefined}
    />,
  )
}

describe('Schatzkammer-Oberfläche', () => {
  it('zeigt Lebenszeitpunkte, ausgebbares Guthaben, drei feste Preise und den virtuellen Status', () => {
    const markup = renderTreasure()
    expect(markup).toContain('Deine Schatzkammer')
    expect(markup).toContain('DEIN LERN-LEBENSGESAMT')
    expect(markup).toContain('JETZT VERFÜGBAR')
    expect(markup).toContain('150 Funken')
    expect(markup).toContain('250 Funken')
    expect(markup).toContain('300 Funken')
    expect(markup).toContain('Kaufen für 150 Funken')
    expect(markup).toContain('keine Echtgeldkäufe, Werbung oder Zufallsgewinne')
    expect(markup).toContain('Lernzertifikate erst nach Bossprüfungen')
  })

  it('bietet nach dem Kauf nutzbare Aktionen statt bloßer Belohnungskarten', () => {
    const markup = renderTreasure(['golden-funkenbeutel', 'steuerdetektiv-abzeichen', 'papierkram-endgegner'])
    expect(markup).toContain('Gold-Look aktivieren')
    expect(markup).toContain('Dein Abzeichen ist dauerhaft in deinem Lernprofil sichtbar')
    expect(markup).toContain('Bonus-Challenge starten')
  })

  it('rendert den lokalen goldenen SVG-Beutel-Look', () => {
    const markup = renderToStaticMarkup(<FunkenBag points={240} golden />)
    expect(markup).toContain('funken-bag-golden')
    expect(markup).toContain('gold-gradient')
    expect(markup).toContain('Goldener Funkenbeutel')
  })
})
