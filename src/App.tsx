import { useState } from 'react'
import LessonPath from './components/LessonPath'
import Onboarding from './components/Onboarding'
import QuestionCard from './components/QuestionCard'
import SessionSummary from './components/SessionSummary'
import { getFictionalScenario, getLessonForPreferences } from './learning/scenarios'
import { loadLearningData, saveLearningData, type LearningData } from './learning/storage'
import type { LearningPreferences, Lesson, QuizSession } from './learning/types'
import { advanceSession, createQuizSession, getSessionScore, isLessonComplete, submitAnswer } from './quiz'
import BusinessSimulation from './components/BusinessSimulation'
import FunkenMark from './components/FunkenMark'

function App() {
  const [initialData] = useState<LearningData>(() => loadLearningData())
  const [data, setData] = useState<LearningData>(initialData)
  const [view, setView] = useState<'onboarding' | 'path' | 'lesson' | 'summary'>(() =>
    initialData.onboardingComplete ? 'path' : 'onboarding',
  )
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [session, setSession] = useState<QuizSession | null>(null)

  function persist(update: (current: LearningData) => LearningData) {
    const next = update(data)
    saveLearningData(next)
    setData(next)
  }

  function finishOnboarding() {
    persist((current) => ({ ...current, onboardingComplete: true }))
    setView('path')
  }

  function updatePreferences(preferences: LearningPreferences) {
    persist((current) => ({ ...current, preferences }))
  }

  function startLesson(lesson: Lesson) {
    const personalizedLesson = getLessonForPreferences(lesson, data.preferences)
    setActiveLesson(personalizedLesson)
    setSession(createQuizSession(personalizedLesson))
    setView('lesson')
  }

  function answerQuestion(answer: number) {
    if (!activeLesson || !session) return
    const question = activeLesson.questions[session.questionIndex]
    if (!question) return

    const result = submitAnswer(session, question, answer, data.progress.earnedQuestionIds)
    setSession(result.session)
    if (result.funkenAwarded > 0) {
      persist((current) => ({
        ...current,
        progress: {
          ...current.progress,
          steuerfunken: current.progress.steuerfunken + result.funkenAwarded,
          earnedQuestionIds: [...current.progress.earnedQuestionIds, question.id],
        },
      }))
    }
  }

  function continueLesson() {
    if (!activeLesson || !session) return
    const nextSession = advanceSession(session, activeLesson)
    if (!nextSession) return
    setSession(nextSession)

    if (isLessonComplete(nextSession, activeLesson)) {
      const score = getSessionScore(nextSession)
      persist((current) => ({
        ...current,
        progress: {
          ...current.progress,
          completedLessonIds: current.progress.completedLessonIds.includes(activeLesson.id)
            ? current.progress.completedLessonIds
            : [...current.progress.completedLessonIds, activeLesson.id],
          bestScores: {
            ...current.progress.bestScores,
            [activeLesson.id]: Math.max(current.progress.bestScores[activeLesson.id] ?? 0, score),
          },
        },
      }))
      setView('summary')
    }
  }

  function returnToPath() {
    setView('path')
    setSession(null)
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#start" aria-label="SteuerLevel Startseite" onClick={(event) => { event.preventDefault(); view === 'onboarding' ? finishOnboarding() : returnToPath() }}>
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>Steuer<span className="brand-light">Level</span></span>
        </a>
        <div className="topbar-tools">
          <span className="topbar-funken"><FunkenMark small /> {data.progress.steuerfunken} Steuerfunken</span>
          {view !== 'onboarding' && view !== 'lesson' && <button className="topbar-profile" onClick={() => setView('onboarding')}>Lernprofil anpassen</button>}
        </div>
      </header>

      {view === 'onboarding' && <Onboarding preferences={data.preferences} onChange={updatePreferences} onContinue={finishOnboarding} onSkip={finishOnboarding} />}
      {view === 'path' && <LessonPath data={data} onChangeProfile={() => setView('onboarding')} onStartLesson={startLesson} />}
      {view === 'lesson' && activeLesson && session && !isLessonComplete(session, activeLesson) && (
        <main className="main-content lesson-page">
          <button className="back-link" onClick={returnToPath}><span aria-hidden="true">←</span> Lernpfad</button>
          <section className="lesson-heading">
            <span className="lesson-icon lesson-heading-icon" aria-hidden="true">{activeLesson.icon}</span>
            <div><p className="eyebrow">{activeLesson.shortTitle.toUpperCase()}</p><h1>{activeLesson.title}</h1></div>
          </section>
          <p className="scenario-note"><span aria-hidden="true">✳</span>{getFictionalScenario(data.preferences, activeLesson)}</p>
          <QuestionCard
            key={`${activeLesson.id}-${session.questionIndex}`}
            question={activeLesson.questions[session.questionIndex]}
            questionNumber={session.questionIndex + 1}
            questionCount={activeLesson.questions.length}
            response={session.responses[session.questionIndex]}
            onAnswer={answerQuestion}
            onContinue={continueLesson}
          />
          {activeLesson.id === 'umsatz-gewinn' && <BusinessSimulation />}
          <div className="lesson-session-funken"><FunkenMark small /> {session.earnedFunken} Steuerfunken in dieser Runde</div>
        </main>
      )}
      {view === 'summary' && activeLesson && session && (
        <SessionSummary
          lesson={activeLesson}
          session={session}
          totalFunken={data.progress.steuerfunken}
          preferences={data.preferences}
          completedLessonIds={data.progress.completedLessonIds}
          onReplay={() => startLesson(activeLesson)}
          onStartNext={startLesson}
          onBackToPath={returnToPath}
        />
      )}

      <footer className="disclaimer">
        <span className="disclaimer-mark" aria-hidden="true">i</span>
        <p><strong>SteuerLevel ist ein Lernangebot.</strong> Alle Beispiele sind fiktiv und vereinfacht; Steuerfunken sind Lernpunkte ohne Geldwert. Dies ist keine individuelle Steuerberatung.</p>
      </footer>
    </div>
  )
}

export default App