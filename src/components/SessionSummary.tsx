import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { getNextLessonRecommendation } from '../learning/scenarios'
import type { LearningPreferences, Lesson, QuizSession } from '../learning/types'
import { getSessionScore } from '../quiz'
import FunkenMark from './FunkenMark'
import { getCelebrationLine, getCelebrationLineCount } from '../learning/celebration'

type Props = {
  lesson: Lesson
  session: QuizSession
  totalFunken: number
  preferences: LearningPreferences
  completedLessonIds: string[]
  onReplay: () => void
  onStartNext: (lesson: Lesson) => void
  onBackToPath: () => void
}

function SessionSummary({ lesson, session, totalFunken, preferences, completedLessonIds, onReplay, onStartNext, onBackToPath }: Props) {
  const score = getSessionScore(session)
  const nextLesson = getNextLessonRecommendation(lesson.id, preferences, completedLessonIds)
  const [celebrationLine] = useState(() => getCelebrationLine(Math.floor(Math.random() * getCelebrationLineCount())))
  const continueRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    continueRef.current?.focus()
  }, [])

  function closeOnEscape(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') onBackToPath()
  }

  function closeFromBackdrop(event: MouseEvent<HTMLDivElement>) {
    if (!(event.target instanceof Element) || !event.target.closest('.celebration-dialog')) onBackToPath()
  }

  return (
    <div className="celebration-backdrop" onClick={closeFromBackdrop} onKeyDown={closeOnEscape}>
      <div className="confetti-layer" aria-hidden="true">
        {Array.from({ length: 96 }, (_, index) => (
          <i key={index} className="confetti-piece" style={{ left: `${(index * 37) % 100}%`, animationDelay: `${(index % 9) * 0.08}s`, animationDuration: `${2.3 + (index % 6) * 0.12}s` }} />
        ))}
      </div>
      <section className="celebration-dialog" role="region" aria-label="Lektionsfeier">
        <div className="celebration-topline"><span>LEKTION ABGESCHLOSSEN</span><button className="celebration-close" aria-label="Zurück zum Lernpfad" onClick={onBackToPath}>×</button></div>
        <div className="celebration-character" aria-hidden="true">
          <span className="character-spark">✧</span><span className="character-eye character-eye-left" /><span className="character-eye character-eye-right" /><span className="character-smile" /><span className="character-arm" /><span className="character-point">☝</span>
        </div>
        <p className="celebration-eyebrow">{lesson.shortTitle.toUpperCase()} · LEVEL GESCHAFFT</p>
        <h1 id="celebration-title">DURCHBLICK<br /><span>FREIGESCHALTET!</span></h1>
        <p className="celebration-joke">{celebrationLine}</p>
        <p className="celebration-description" id="celebration-description">Du hast {lesson.title.toLowerCase()} abgeschlossen. {lesson.concepts.join(' · ')} gehören jetzt zu deinem Lern-Toolkit.</p>
        <div className="celebration-rewards">
          <div className="celebration-main-reward"><span>IN DIESER LEKTION</span><strong>+{session.earnedFunken}</strong><small><FunkenMark small /> STEUERFUNKEN</small></div>
          <div><span>DEIN GESAMTSTAND</span><strong><FunkenMark small /> {totalFunken}</strong><small>Steuerfunken</small></div>
          <div><span>DEINE ANTWORTEN</span><strong>{score}<small> / {lesson.questions.length}</small></strong><small>richtig</small></div>
        </div>
        <p className="funken-disclaimer">Steuerfunken sind Lernpunkte ohne Geldwert. Die Feier gilt deinem Lernfortschritt, nicht einer echten Steuerwirkung.</p>
        <div className="celebration-concepts"><span>MITGENOMMEN</span>{lesson.concepts.map((concept) => <span className="concept-chip" key={concept}>{concept}</span>)}</div>
        <details className="celebration-review">
          <summary>Erklärungen dieser Lektion ansehen <span aria-hidden="true">＋</span></summary>
          {lesson.questions.map((question, index) => (
            <div className="celebration-review-item" key={question.id}>
              <strong>Frage {index + 1}: {question.concept}</strong>
              <p>{question.explanation}</p>
            </div>
          ))}
        </details>
        <div className="celebration-actions">
          <button ref={continueRef} className="primary-button" onClick={nextLesson ? () => onStartNext(nextLesson) : onBackToPath}>
            {nextLesson ? `Weiter: ${nextLesson.shortTitle}` : 'Zurück zum Lernpfad'} <span aria-hidden="true">→</span>
          </button>
          <button className="text-button" onClick={onReplay}>Lektion wiederholen <span aria-hidden="true">↻</span></button>
        </div>
      </section>
    </div>
  )
}

export default SessionSummary