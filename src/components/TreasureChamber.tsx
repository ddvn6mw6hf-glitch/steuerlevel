import type { LearningData } from '../learning/storage'
import { rewardCatalog, type PurchaseResult } from '../learning/treasure'
import type { RewardId } from '../learning/types'
import FunkenBag from './FunkenBag'

type Props = {
  data: LearningData
  feedback: string | null
  bonusResult: number | null
  onDismissFeedback: () => void
  onPurchase: (rewardId: RewardId) => PurchaseResult
  onToggleGoldenBag: (active: boolean) => void
  onStartBonus: () => void
  onBack: () => void
}

const rewards = Object.entries(rewardCatalog) as Array<[RewardId, (typeof rewardCatalog)[RewardId]]>

function TreasureChamber({
  data,
  feedback,
  bonusResult,
  onDismissFeedback,
  onPurchase,
  onToggleGoldenBag,
  onStartBonus,
  onBack,
}: Props) {
  const purchased = new Set(data.progress.purchasedRewardIds)

  return (
    <main className="main-content treasure-page">
      <button className="back-link" onClick={onBack}><span aria-hidden="true">←</span> Lernpfad</button>
      <section className="treasure-hero">
        <div>
          <p className="home-hero-kicker">DEIN VIRTUELLER LERN-SCHATZ</p>
          <h1>Deine Schatzkammer <span aria-hidden="true">✨</span></h1>
          <p>Du entscheidest, wofür du deine verdienten Steuerfunken ausgibst.</p>
        </div>
        <FunkenBag points={data.progress.availableBalance} golden={data.progress.activeBagSkin === 'gold'} />
      </section>

      <section className="treasure-balances" aria-label="Steuerfunken-Übersicht">
        <div><span>DEIN LERN-LEBENSGESAMT</span><strong>{data.progress.lifetimeEarned}</strong><small>jemals verdient · sinkt nicht durch Käufe</small></div>
        <div><span>JETZT VERFÜGBAR</span><strong>{data.progress.availableBalance}</strong><small>virtuelle Punkte zum Ausgeben</small></div>
      </section>
      <p className="treasure-disclaimer">Steuerfunken sind rein virtuelle Lernpunkte ohne Geldwert. Sie sind niemals auszahlbar. Es gibt keine Echtgeldkäufe, Werbung oder Zufallsgewinne.</p>

      {feedback && (
        <div className="purchase-feedback" role="status" aria-live="polite">
          <strong>{feedback}</strong>
          <button className="text-button" onClick={onDismissFeedback} aria-label="Meldung schließen">×</button>
        </div>
      )}
      {bonusResult !== null && (
        <div className="purchase-feedback bonus-result" role="status">
          <strong>ENDGEGNER GESCHAFFT! {bonusResult} von 3 Aufgaben richtig. Dein Wissen zahlt sich aus – zumindest in Steuerfunken. 😎</strong>
          <button className="text-button" onClick={onStartBonus}>Bonus-Challenge noch einmal spielen</button>
        </div>
      )}

      <section className="treasure-rewards" aria-label="Virtuelle Belohnungen">
        {rewards.map(([rewardId, reward]) => {
          const owned = purchased.has(rewardId)
          const affordable = data.progress.availableBalance >= reward.price
          const status = owned ? 'Gekauft' : affordable ? 'Kaufbar' : 'Gesperrt'
          return (
            <article className={`treasure-reward-card treasure-reward-${rewardId}${owned ? ' reward-owned' : ''}`} key={rewardId}>
              <div className="reward-card-topline"><span className={`reward-status${owned ? ' reward-status-owned' : ''}`}>{status}</span><span>{reward.price} Funken</span></div>
              <div className="reward-card-icon" aria-hidden="true">
                {rewardId === 'golden-funkenbeutel'
                  ? <FunkenBag points={data.progress.availableBalance} golden />
                  : rewardId === 'steuerdetektiv-abzeichen' ? '🔎' : '▤'}
              </div>
              <h2>{reward.title}</h2>
              <p>{reward.description}</p>
              {owned && rewardId === 'golden-funkenbeutel' && (
                <button className="reward-action-button" onClick={() => onToggleGoldenBag(data.progress.activeBagSkin !== 'gold')}>
                  {data.progress.activeBagSkin === 'gold' ? 'Gold-Look deaktivieren' : 'Gold-Look aktivieren'}
                </button>
              )}
              {owned && rewardId === 'steuerdetektiv-abzeichen' && (
                <p className="reward-active-note">Dein Abzeichen ist dauerhaft in deinem Lernprofil sichtbar.</p>
              )}
              {owned && rewardId === 'papierkram-endgegner' && (
                <button className="reward-action-button" onClick={onStartBonus}>Bonus-Challenge starten <span aria-hidden="true">→</span></button>
              )}
              {!owned && (
                <>
                  <p className="reward-remaining">
                    {affordable
                      ? `Bei Kauf verbleiben ${data.progress.availableBalance - reward.price} Steuerfunken.`
                      : `Noch ${reward.price - data.progress.availableBalance} Steuerfunken nötig.`}
                  </p>
                  <button
                    className="reward-action-button"
                    disabled={!affordable}
                    onClick={() => onPurchase(rewardId)}
                  >
                    {affordable ? `Kaufen für ${reward.price} Funken` : 'Noch nicht genug Funken'}
                  </button>
                </>
              )}
            </article>
          )
        })}
      </section>

      <section className="certificate-preparation">
        <span aria-hidden="true">🏅</span>
        <div>
          <h2>Lernzertifikate erst nach Bossprüfungen</h2>
          <p>Punkte und Käufe schalten kein Zertifikat frei. Die technische Grundlage erlaubt später ein klar inoffizielles SteuerLevel-Lernzertifikat nur für eine tatsächlich bestandene Meilensteinprüfung.</p>
        </div>
      </section>

      <section className="purchase-history">
        <h2>Deine Käufe</h2>
        {data.progress.purchaseHistory.length === 0 ? (
          <p>Noch nichts gekauft. Deine Funken bleiben verfügbar, bis du dich entscheidest.</p>
        ) : (
          <ul>
            {data.progress.purchaseHistory.map((purchase) => (
              <li key={purchase.id}>
                <span>{rewardCatalog[purchase.rewardId].title}</span>
                <strong>−{purchase.price} Funken</strong>
                <time dateTime={purchase.purchasedAt}>{new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium' }).format(new Date(purchase.purchasedAt))}</time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export default TreasureChamber
