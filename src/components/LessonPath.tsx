import { getPersonalizedLearningPath, getProfileFitExplanation } from '../learning/scenarios'
import type { LearningData } from '../learning/storage'
import type { LearningPreferences, Lesson } from '../learning/types'
import { difficultyLabels, objectiveLabels } from '../learning/labels'
import { getLessonAvailability } from '../learning/progression'
import { getLearningText } from '../learning/pedagogy'
import { getTrainerDashboard } from '../learning/trainer'

type Props = {
  data: LearningData
  onChangeProfile: () => void
  onStartLesson: (lesson: Lesson) => void
  onStartReview: () => void
  onClearReview: () => void
}

function LessonPath({ data, onChangeProfile, onStartLesson, onStartReview, onClearReview }: Props) {
  const orderedLessons = getPersonalizedLearningPath(data.preferences)
  const availability = getLessonAvailability(orderedLessons, data.progress.completedLessonIds)
  const trainer = getTrainerDashboard(data.progress)
  const completedCount = data.progress.completedLessonIds.length
  const nextIndex = Math.max(0, availability.findIndex((status) => status === 'current'))
  const nextLesson = orderedLessons[nextIndex] ?? orderedLessons[0]
  const nextQuestion = nextLesson?.questions[0]

  return (
    <main className="main-content path-page">
      <section className="home-hero">
        <p className="home-hero-kicker">KAPITEL {Math.min(nextIndex + 1, orderedLessons.length)} · {nextLesson ? difficultyLabels[nextLesson.difficulty].toUpperCase() : 'STEUER-NEWBIE'}</p>
        <h1>HEY, STEUER-HELD! <span aria-hidden="true">👋</span></h1>
        <p>Bereit, das Geheimnis hinter deinem Geld zu knacken?</p>
        <strong>Deine nächste Mission wartet!</strong>
        <span className="hero-progress">{completedCount} von {orderedLessons.length} Kapiteln geschafft</span>
      </section>

      <section className="error-trainer-card" aria-labelledby="error-trainer-title">
        <div className="error-trainer-heading">
          <span className="error-trainer-icon" aria-hidden="true">↻</span>
          <div>
            <p className="aha-label">DEIN PERSÖNLICHER WIEDERHOLUNGSPLAN</p>
            <h2 id="error-trainer-title">Dein Fehlertrainer</h2>
          </div>
        </div>
        {trainer.dueConcepts.length > 0 ? (
          <p className="error-trainer-intro">
            {trainer.dueConcepts.length} {trainer.dueConcepts.length === 1 ? 'Thema ist' : 'Themen sind'} heute zur Wiederholung fällig.
            Fehler sind hier kein Minuspunkt, sondern ein guter Hinweis fürs nächste Aha!
          </p>
        ) : (
          <p className="error-trainer-intro">Heute ist nichts fällig. Dein Kopf darf Pause machen – hier gibt es keine Lernstrafen. ✨</p>
        )}
        <div className="error-trainer-stats">
          <div><strong>{trainer.dueConcepts.length}</strong><span>heute fällig</span></div>
          <div><strong>{trainer.uncertainConcepts.length}</strong><span>noch unsicher</span></div>
          <div><strong>{trainer.recentlyStrengthened.length}</strong><span>zuletzt gefestigt</span></div>
        </div>
        {trainer.uncertainConcepts.length > 0 && (
          <div className="trainer-topic-list">
            <strong>Das übst du gerade:</strong>
            {trainer.uncertainConcepts.slice(0, 4).map(({ review, title }) => (
              <span key={review.conceptId}>{title} · {review.status === 'needs-practice' ? 'bald wieder dran' : 'geplant'}</span>
            ))}
          </div>
        )}
        {trainer.recentlyStrengthened.length > 0 && (
          <div className="trainer-topic-list trainer-strengthened">
            <strong>Frisch gefestigt:</strong>
            {trainer.recentlyStrengthened.slice(0, 3).map(({ review, title }) => (
              <span key={review.conceptId}>{title}</span>
            ))}
          </div>
        )}
        <div className="error-trainer-actions">
          <button className="primary-button" onClick={onStartReview} disabled={trainer.dueConcepts.length === 0}>
            {trainer.dueConcepts.length === 0 ? 'Keine Wiederholung fällig' : `Jetzt wiederholen · ${trainer.dueConcepts.length}`}
          </button>
          <p>Nach einem Fehler gibt es eine Wiederholung zum Abschluss, dann typischerweise nach 1 und 3 Tagen. Ein neuer Fehler setzt das Thema wieder nach vorn.</p>
          <button className="text-button" onClick={onClearReview}>Nur Fehlertrainer-Verlauf löschen</button>
          <small>Das löscht ausschließlich Versuche und Wiederholungspläne – nicht Steuerfunken, Käufe oder Kapitelabschlüsse.</small>
        </div>
      </section>

      {nextQuestion && (
        <>
          <section className="aha-card home-aha-card">
            <p className="aha-label">DEIN AHA-MOMENT</p>
            <h2>{nextLesson.id === 'wer-kassiert-hier-eigentlich' ? 'Steuern sind kein Eintrittsticket.' : nextQuestion.concept}</h2>
            <p>{getLearningText(nextQuestion)}</p>
          </section>
          <section className="challenge-teaser">
            <p className="challenge-label">NÄCHSTE CHALLENGE</p>
            <h2>Hast du's wirklich verstanden? 😏</h2>
            <p>Eine neue Situation wartet auf dich. Jetzt ohne Spickzettel!</p>
            <button className="challenge-teaser-button" onClick={() => onStartLesson(nextLesson)}>
              Lernkarte ansehen <span aria-hidden="true">→</span>
            </button>
          </section>
        </>
      )}

      <p className="fit-explanation"><span aria-hidden="true">✧</span>{getProfileFitExplanation(data.preferences)}</p>

      <section className="lesson-list" aria-label="Lektionen">
        {orderedLessons.map((lesson, index) => {
          const status = availability[index]
          const complete = status === 'completed'
          const locked = status === 'locked'
          const bestScore = data.progress.bestScores[lesson.id] ?? 0
          const availableFunken = lesson.questions.reduce(
            (sum, question) => sum + (data.progress.earnedQuestionIds.includes(question.id) ? 0 : question.funken),
            0,
          )
          const tiers = [...new Set(lesson.questions.map((question) => question.tags?.difficulty).filter((tier) => tier !== undefined))].sort()
          const objectives = [...new Set(lesson.questions.map((question) => question.tags?.objective).filter((objective) => objective !== undefined))]
          const difficultyRange = tiers.map((tier) => difficultyLabels[tier]).join('–')
          const subjectLabels = objectives.slice(0, 3).map((objective) => objectiveLabels[objective]).join(' · ')

          return (
            <button className={`lesson-row${complete ? ' lesson-complete' : ''}${locked ? ' lesson-locked' : ''}`} key={lesson.id} onClick={() => onStartLesson(lesson)} disabled={locked} aria-disabled={locked}>
              <span className="lesson-number">{complete ? <span aria-label="Abgeschlossen">✓</span> : locked ? '·' : `0${index + 1}`}</span>
              <span className="lesson-icon" aria-hidden="true">{lesson.icon}</span>
              <span className="lesson-details">
                <span className="lesson-kicker">LEKTION 0{index + 1} <span>·</span> {lesson.questions.length} FRAGEN</span>
                <strong>{lesson.title}</strong>
                <small>{lesson.topic} · {lesson.subtitle}</small>
                <span className="lesson-tags"><span>{difficultyRange}</span><span>{subjectLabels}</span></span>
                <span className="lesson-progress" aria-hidden="true"><i style={{ width: complete ? '100%' : '0%' }} /></span>
              </span>
              <span className="lesson-result">
                <strong>{complete ? `${bestScore}/${lesson.questions.length} richtig` : locked ? 'Noch gesperrt' : `bis zu ${availableFunken} Steuerfunken`}</strong>
                <span>{complete ? 'Erklärung jederzeit wiederholen' : locked ? 'Vorherige Lektion abschließen' : 'Jetzt spielbar · in deinem Tempo'}</span>
              </span>
              <span className="lesson-arrow" aria-hidden="true">→</span>
            </button>
          )
        })}
      </section>

      <section className="profile-strip">
        <div className="profile-symbol" aria-hidden="true">◉</div>
        <p><strong>Dein Lernprofil {data.progress.purchasedRewardIds.includes('steuerdetektiv-abzeichen') && <span className="detective-badge">🔎 Steuerdetektiv</span>}</strong><span>{preferenceSummary(data.preferences)}</span></p>
        <button className="text-button" onClick={onChangeProfile}>Anpassen</button>
      </section>
    </main>
  )
}

function preferenceSummary(preferences: LearningPreferences): string {
  const ages = { '18-24': '18–24', '25-34': '25–34', '35+': '35+' }
  const situations: Record<LearningPreferences['lifeSituation'], string> = {
    'dual-apprentice': 'Duales Studium / Ausbildung',
    university: 'Studium',
    employee: 'Angestellt',
    founder: 'Selbstständig / Gründung',
  }
  const interests: Record<LearningPreferences['mainInterest'], string> = {
    salary: 'Lohn & Einkommen',
    'side-business': 'Nebengewerbe',
    everyday: 'Steuern im Alltag',
  }
  return `${ages[preferences.ageGroup]} · ${situations[preferences.lifeSituation]} · ${interests[preferences.mainInterest]}`
}

export default LessonPath