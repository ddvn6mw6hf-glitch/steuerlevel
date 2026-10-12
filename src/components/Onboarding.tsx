import type { LearningPreferences } from '../learning/types'

type Props = {
  preferences: LearningPreferences
  onChange: (preferences: LearningPreferences) => void
  onContinue: () => void
  onSkip: () => void
}

function Onboarding({ preferences, onChange, onContinue, onSkip }: Props) {
  function updatePreference<Key extends keyof LearningPreferences>(
    key: Key,
    value: LearningPreferences[Key],
  ) {
    onChange({ ...preferences, [key]: value })
  }

  return (
    <main className="main-content onboarding-page">
      <section className="onboarding-intro">
        <p className="eyebrow">DEIN START BEI STEUERLEVEL</p>
        <h1>Was möchtest du <span>besser verstehen?</span></h1>
        <p className="intro-copy">Ein paar freiwillige Angaben helfen uns, passende fiktive Lernbeispiele auszuwählen.</p>
      </section>

      <form className="onboarding-form" onSubmit={(event) => { event.preventDefault(); onContinue() }}>
        <label className="preference-field">
          <span className="field-number">01</span>
          <span className="field-copy"><strong>Welche Altersgruppe passt?</strong><small>Nur für passende Beispielpersonen.</small></span>
          <select value={preferences.ageGroup} onChange={(event) => updatePreference('ageGroup', event.target.value as LearningPreferences['ageGroup'])}>
            <option value="18-24">18–24 Jahre</option>
            <option value="25-34">25–34 Jahre</option>
            <option value="35+">35 Jahre oder älter</option>
          </select>
        </label>
        <label className="preference-field">
          <span className="field-number">02</span>
          <span className="field-copy"><strong>Was beschreibt deine Situation am ehesten?</strong><small>Wir verwenden sie nur für den Lernkontext.</small></span>
          <select value={preferences.lifeSituation} onChange={(event) => updatePreference('lifeSituation', event.target.value as LearningPreferences['lifeSituation'])}>
            <option value="dual-apprentice">Duales Studium oder Ausbildung</option>
            <option value="university">Studium</option>
            <option value="employee">Angestellt</option>
            <option value="founder">Selbstständig oder gründungsinteressiert</option>
          </select>
        </label>
        <label className="preference-field">
          <span className="field-number">03</span>
          <span className="field-copy"><strong>Womit möchtest du anfangen?</strong><small>Dein Interesse bestimmt die Reihenfolge der Lektionen.</small></span>
          <select value={preferences.mainInterest} onChange={(event) => updatePreference('mainInterest', event.target.value as LearningPreferences['mainInterest'])}>
            <option value="salary">Grundlagen zu Lohn und Einkommen</option>
            <option value="side-business">Kleines Nebengewerbe</option>
            <option value="everyday">Steuern im Alltag</option>
          </select>
        </label>
        <div className="onboarding-actions">
          <button className="primary-button" type="submit">Lernpfad ansehen <span aria-hidden="true">→</span></button>
          <button className="text-button" type="button" onClick={onSkip}>Jetzt überspringen</button>
        </div>
      </form>
      <p className="privacy-note"><span aria-hidden="true">◈</span> Deine Auswahl und dein Lernfortschritt bleiben lokal auf diesem Gerät. Es werden keine persönlichen Finanzdaten abgefragt.</p>
    </main>
  )
}

export default Onboarding