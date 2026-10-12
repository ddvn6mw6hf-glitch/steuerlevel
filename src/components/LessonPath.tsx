import { getLessonForPreferences, getProfileFitExplanation, orderLessonsByInterest } from '../learning/scenarios'
import type { LearningData } from '../learning/storage'
import type { LearningPreferences, Lesson } from '../learning/types'
import FunkenMark from './FunkenMark'
import { difficultyLabels, objectiveLabels } from '../learning/labels'

type Props = {
  data: LearningData
  onChangeProfile: () => void
  onStartLesson: (lesson: Lesson) => void
}

function LessonPath({ data, onChangeProfile, onStartLesson }: Props) {
  const orderedLessons = orderLessonsByInterest(data.preferences)
    .map((lesson) => getLessonForPreferences(lesson, data.preferences))
  const completedCount = data.progress.completedLessonIds.length

  return (
    <main className="main-content path-page">
      <section className="path-heading">
        <div>
          <p className="eyebrow">DEIN LERNPFAD <span className="eyebrow-divider">/</span> 3 KURZE LEKTIONEN</p>
          <h1>Steuerwissen, <span>Schritt für Schritt.</span></h1>
          <p className="intro-copy">Wähle eine Lektion, sammle Wissen und komm jederzeit wieder.</p>
        </div>
        <div className="path-overview">
          <FunkenMark />
          <strong>{data.progress.steuerfunken} <small>Steuerfunken</small></strong>
          <div className="path-progress-copy">
            <span>{completedCount} von {orderedLessons.length} abgeschlossen</span>
            <small>Reine Lernpunkte ohne Geldwert</small>
          </div>
        </div>
      </section>

      <p className="fit-explanation"><span aria-hidden="true">✧</span>{getProfileFitExplanation(data.preferences)}</p>

      <section className="lesson-list" aria-label="Lektionen">
        {orderedLessons.map((lesson, index) => {
          const complete = data.progress.completedLessonIds.includes(lesson.id)
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
            <button className={`lesson-row${complete ? ' lesson-complete' : ''}`} key={lesson.id} onClick={() => onStartLesson(lesson)}>
              <span className="lesson-number">{complete ? <span aria-label="Abgeschlossen">✓</span> : `0${index + 1}`}</span>
              <span className="lesson-icon" aria-hidden="true">{lesson.icon}</span>
              <span className="lesson-details">
                <span className="lesson-kicker">LEKTION 0{index + 1} <span>·</span> {lesson.questions.length} FRAGEN</span>
                <strong>{lesson.title}</strong>
                <small>{lesson.subtitle}</small>
                <span className="lesson-tags"><span>{difficultyRange}</span><span>{subjectLabels}</span></span>
                <span className="lesson-progress" aria-hidden="true"><i style={{ width: complete ? '100%' : '0%' }} /></span>
              </span>
              <span className="lesson-result">
                <strong>{complete ? `${bestScore}/${lesson.questions.length} richtig` : `bis zu ${availableFunken} Steuerfunken`}</strong>
                <span>{complete ? 'Erklärung jederzeit wiederholen' : 'In deinem Tempo'}</span>
              </span>
              <span className="lesson-arrow" aria-hidden="true">→</span>
            </button>
          )
        })}
      </section>

      <section className="profile-strip">
        <div className="profile-symbol" aria-hidden="true">◉</div>
        <p><strong>Dein Lernprofil</strong><span>{preferenceSummary(data.preferences)}</span></p>
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