import { useRef, useState } from 'react'
import LessonPath from './components/LessonPath'
import Onboarding from './components/Onboarding'
import QuestionCard from './components/QuestionCard'
import SessionSummary from './components/SessionSummary'
import { getFictionalScenario, getLessonForPreferences } from './learning/scenarios'
import { loadLearningData, saveLearningData, type LearningData } from './learning/storage'
import type { LearningPreferences, Lesson, QuizSession, RewardId, ReviewTask } from './learning/types'
import { advanceSession, createQuizSession, getSessionScore, isLessonComplete, submitAnswer } from './quiz'
import BusinessSimulation from './components/BusinessSimulation'
import FunkenBag from './components/FunkenBag'
import { getLearningText } from './learning/pedagogy'
import { clearTrainerProgress, createReviewTasks, getTrainerDashboard, recordQuestionAttempt } from './learning/trainer'
import { lessons } from './learning/content'
import TreasureChamber from './components/TreasureChamber'
import { bonusChallenge } from './learning/bonusChallenge'
import { awardQuestionFunken, purchaseReward, type PurchaseResult } from './learning/treasure'

function App() {
  const [initialData] = useState<LearningData>(() => loadLearningData())
  const [data, setData] = useState<LearningData>(initialData)
  const dataRef = useRef(initialData)
  const [view, setView] = useState<'onboarding' | 'path' | 'lesson' | 'summary' | 'trainer' | 'treasure' | 'bonus'>(() =>
    initialData.onboardingComplete ? 'path' : 'onboarding',
  )
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [session, setSession] = useState<QuizSession | null>(null)
  const [lessonStep, setLessonStep] = useState<'learn' | 'challenge'>('learn')
  const [reviewTasks, setReviewTasks] = useState<ReviewTask[]>([])
  const [purchaseFeedback, setPurchaseFeedback] = useState<string | null>(null)
  const [bonusResult, setBonusResult] = useState<number | null>(null)
  const [storageWarning, setStorageWarning] = useState(false)
  const answerGuard = useRef<string | null>(null)

  function persist(update: (current: LearningData) => LearningData): boolean {
    const next = update(dataRef.current)
    dataRef.current = next
    const saved = saveLearningData(next)
    setStorageWarning(!saved)
    setData(next)
    return saved
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
    answerGuard.current = null
    setReviewTasks([])
    setActiveLesson(personalizedLesson)
    setSession(createQuizSession(personalizedLesson))
    setLessonStep('learn')
    setView('lesson')
  }

  function answerQuestion(answer: number | string) {
    if (!activeLesson || !session) return
    const question = activeLesson.questions[session.questionIndex]
    if (!question) return
    const attemptKey = `${view}:${activeLesson.id}:${session.questionIndex}`
    if (answerGuard.current === attemptKey || session.responses[session.questionIndex] !== null) return
    answerGuard.current = attemptKey

    const isReview = view === 'trainer'
    const previousQuestionIds = isReview
      ? [...data.progress.earnedQuestionIds, question.id]
      : data.progress.earnedQuestionIds
    const result = submitAnswer(session, question, answer, previousQuestionIds)
    setSession(result.session)
    persist((current) => {
      const trainerProgress = recordQuestionAttempt(
        current.progress,
        question,
        result.session.responses[session.questionIndex]?.correct ?? false,
        new Date().toISOString(),
        isReview,
      )
      const withTrainerAttempt = { ...current.progress, ...trainerProgress }
      return {
        ...current,
        progress: awardQuestionFunken(withTrainerAttempt, question.id, result.funkenAwarded),
      }
    })
  }

  function continueLesson() {
    if (!activeLesson || !session) return
    const nextSession = advanceSession(session, activeLesson)
    if (!nextSession) return
    setSession(nextSession)

    if (view === 'trainer') {
      if (isLessonComplete(nextSession, activeLesson)) {
        setView('path')
        setActiveLesson(null)
        setReviewTasks([])
        setSession(null)
      }
      return
    }

    if (view === 'bonus') {
      if (isLessonComplete(nextSession, activeLesson)) {
        setBonusResult(getSessionScore(nextSession))
        setView('treasure')
        setActiveLesson(null)
        setSession(null)
      }
      return
    }

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
    } else {
      setLessonStep('learn')
    }
  }

  function startChallenge() {
    setLessonStep('challenge')
  }

  function returnToPath() {
    if (view === 'bonus') {
      setView('treasure')
      setSession(null)
      setActiveLesson(null)
      return
    }
    setView('path')
    setSession(null)
    setActiveLesson(null)
    setReviewTasks([])
  }

  function startReview() {
    const dueConcepts = getTrainerDashboard(data.progress).dueConcepts
    const tasks = createReviewTasks(dueConcepts)
    if (tasks.length === 0) return
    const trainerLesson: Lesson = {
      ...lessons[0],
      id: 'error-trainer-session',
      title: 'Dein Fehlertrainer',
      shortTitle: 'Wiederholungsrunde',
      topic: 'Gezieltes Üben',
      questions: tasks.map((task) => task.question),
    }
    answerGuard.current = null
    setReviewTasks(tasks)
    setActiveLesson(trainerLesson)
    setSession(createQuizSession(trainerLesson))
    setView('trainer')
  }

  function clearReview() {
    if (!window.confirm('Nur den Fehlertrainer-Verlauf löschen? Steuerfunken, Käufe und Kapitelabschlüsse bleiben erhalten.')) return
    persist((current) => ({
      ...current,
      progress: clearTrainerProgress(current.progress),
    }))
  }

  function buyReward(rewardId: RewardId): PurchaseResult {
    const purchasedAt = new Date().toISOString()
    const result = purchaseReward(dataRef.current.progress, rewardId, purchasedAt)
    if (!result.success) {
      setPurchaseFeedback(result.reason === 'insufficient-funds'
        ? 'Nicht genug Funken? Kein Problem. Wissen tanken, später wiederkommen!'
        : result.reason === 'already-owned'
          ? 'Diese Belohnung gehört dir bereits – sie bleibt dauerhaft freigeschaltet.'
          : 'Diese Belohnung ist nicht verfügbar.')
      return result
    }
    const saved = persist((current) => {
      const currentResult = purchaseReward(current.progress, rewardId, purchasedAt)
      return currentResult.success ? { ...current, progress: currentResult.progress } : current
    })
    const successMessage = rewardId === 'golden-funkenbeutel'
      ? 'KAUF ABGESCHLOSSEN! Dein Funkenbeutel hat jetzt Goldstatus – aktiviere den Look, wann du magst! ✨'
      : rewardId === 'steuerdetektiv-abzeichen'
        ? 'KAUF ABGESCHLOSSEN! Dein Steuerdetektiv-Abzeichen ist jetzt in deinem Profil sichtbar! ✨'
        : 'KAUF ABGESCHLOSSEN! Der Papierkram-Endgegner wartet in deiner Schatzkammer! ✨'
    setPurchaseFeedback(saved
      ? successMessage
      : `${successMessage} Achtung: Speichern im Browser ist fehlgeschlagen; der Kauf gilt nur bis zum Schließen dieser Sitzung.`)
    return result
  }

  function setGoldenBagActive(active: boolean) {
    if (!dataRef.current.progress.purchasedRewardIds.includes('golden-funkenbeutel')) return
    persist((current) => ({
      ...current,
      progress: { ...current.progress, activeBagSkin: active ? 'gold' : 'default' },
    }))
  }

  function startBonusChallenge() {
    if (!dataRef.current.progress.purchasedRewardIds.includes('papierkram-endgegner')) return
    const bonusLesson = { ...bonusChallenge, questions: bonusChallenge.questions }
    answerGuard.current = null
    setBonusResult(null)
    setActiveLesson(bonusLesson)
    setSession(createQuizSession(bonusLesson))
    setView('bonus')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#start" aria-label="SteuerLevel Startseite" onClick={(event) => { event.preventDefault(); view === 'onboarding' ? finishOnboarding() : returnToPath() }}>
          <span className="brand-mark" aria-hidden="true">S</span>
          <span>Steuer<span className="brand-light">Level</span></span>
        </a>
        <div className="topbar-tools">
          {view !== 'onboarding' && (
            <button className="treasure-nav-button" onClick={() => { setPurchaseFeedback(null); setView('treasure') }}>
              <FunkenBag points={data.progress.availableBalance} golden={data.progress.activeBagSkin === 'gold'} />
              <span>Schatzkammer · {data.progress.availableBalance} Funken</span>
            </button>
          )}
          {!['onboarding', 'lesson', 'trainer', 'bonus'].includes(view) && <button className="topbar-profile" onClick={() => setView('onboarding')}>Lernprofil anpassen</button>}
        </div>
      </header>
      {storageWarning && (
        <p className="storage-warning" role="alert">
          Der Browser konnte deinen lokalen Lernstand nicht speichern. Diese Sitzung bleibt nutzbar, aber Änderungen – auch Käufe – können nach dem Neuladen fehlen.
        </p>
      )}

      {view === 'onboarding' && <Onboarding preferences={data.preferences} onChange={updatePreferences} onContinue={finishOnboarding} onSkip={finishOnboarding} />}
      {view === 'path' && <LessonPath data={data} onChangeProfile={() => setView('onboarding')} onStartLesson={startLesson} onStartReview={startReview} onClearReview={clearReview} />}
      {view === 'treasure' && (
        <TreasureChamber
          data={data}
          feedback={purchaseFeedback}
          bonusResult={bonusResult}
          onDismissFeedback={() => setPurchaseFeedback(null)}
          onPurchase={buyReward}
          onToggleGoldenBag={setGoldenBagActive}
          onStartBonus={startBonusChallenge}
          onBack={returnToPath}
        />
      )}
      {(view === 'lesson' || view === 'trainer' || view === 'bonus') && activeLesson && session && !isLessonComplete(session, activeLesson) && (
        <main className="main-content lesson-page">
          <button className="back-link" onClick={returnToPath}><span aria-hidden="true">←</span> {view === 'trainer' ? 'Startseite' : view === 'bonus' ? 'Schatzkammer' : 'Lernpfad'}</button>
          <section className="lesson-heading">
            <span className="lesson-icon lesson-heading-icon" aria-hidden="true">{activeLesson.icon}</span>
            <div><p className="eyebrow">{activeLesson.shortTitle.toUpperCase()}</p><h1>{activeLesson.title}</h1></div>
          </section>
          {view === 'trainer' ? (
            <p className="scenario-note">Dein Fehlertrainer greift unsichere Themen lokal auf. Wiederholungen bringen keine zusätzlichen Steuerfunken.</p>
          ) : view === 'bonus' ? (
            <p className="scenario-note">Drei fiktive Aufgaben zu bereits eingeführten Konzepten. Steuerfunken bleiben virtuelle Lernpunkte ohne Geldwert.</p>
          ) : <p className="scenario-note">
            <span aria-hidden="true">✳</span>
            {activeLesson.id === 'wer-kassiert-hier-eigentlich'
              ? 'Allgemeine Bildung zu Steuergrundlagen – keine individuelle Steuerberatung. Quellenhinweise sind hinterlegt, aber fachlich noch nicht geprüft.'
              : getFictionalScenario(data.preferences, activeLesson)}
          </p>}
          {view === 'trainer' ? (
            <>
              <p className="trainer-task-note">
                {reviewTasks[session.questionIndex]?.isAlternative
                  ? `Andere Frage zum gleichen Konzept: ${activeLesson.questions[session.questionIndex].concept}.`
                  : `Für „${activeLesson.questions[session.questionIndex].concept}“ gibt es hier keine andere passende Frage – du wiederholst die ursprüngliche Aufgabe.`}
              </p>
              <QuestionCard
                key={`${activeLesson.id}-${session.questionIndex}`}
                question={activeLesson.questions[session.questionIndex]}
                questionNumber={session.questionIndex + 1}
                questionCount={activeLesson.questions.length}
                response={session.responses[session.questionIndex]}
                onAnswer={answerQuestion}
                onContinue={continueLesson}
                contextLabel="FEHLERTRAINER · WIEDERHOLUNG OHNE EXTRA-PUNKTE"
              />
            </>
          ) : view === 'bonus' ? (
            <QuestionCard
              key={`${activeLesson.id}-${session.questionIndex}`}
              question={activeLesson.questions[session.questionIndex]}
              questionNumber={session.questionIndex + 1}
              questionCount={activeLesson.questions.length}
              response={session.responses[session.questionIndex]}
              onAnswer={answerQuestion}
              onContinue={continueLesson}
              contextLabel="FREIGESCHALTETE BONUS-CHALLENGE · FUNKEN EINMALIG VERDIENBAR"
            />
          ) : lessonStep === 'learn' ? (
            <>
              <section className="aha-card lesson-learning-card" aria-labelledby="lesson-aha-title">
                <p className="aha-label">DEIN AHA-MOMENT · SCHRITT {session.questionIndex + 1} VON {activeLesson.questions.length}</p>
                <h2 id="lesson-aha-title">{activeLesson.questions[session.questionIndex].concept}</h2>
                <p>{getLearningText(activeLesson.questions[session.questionIndex])}</p>
                <div className="lesson-example">
                  <strong>BEISPIEL AUS DEINEM LERNKONTEXT</strong>
                  <p>{getFictionalScenario(data.preferences, activeLesson)}</p>
                </div>
                {activeLesson.questions[session.questionIndex].sources && (
                  <aside className="learning-sources" aria-label="Quellenhinweise">
                    <span>QUELLENHINWEISE · NICHT FACHLICH GEPRÜFT</span>
                    <ul>
                      {activeLesson.questions[session.questionIndex].sources?.map((source) => (
                        <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></li>
                      ))}
                    </ul>
                  </aside>
                )}
                <button className="primary-button challenge-start-button" onClick={startChallenge}>Challenge starten <span aria-hidden="true">→</span></button>
              </section>
              {activeLesson.id === 'umsatz-gewinn' && <BusinessSimulation />}
            </>
          ) : (
            <>
              <QuestionCard
                key={`${activeLesson.id}-${session.questionIndex}`}
                question={activeLesson.questions[session.questionIndex]}
                questionNumber={session.questionIndex + 1}
                questionCount={activeLesson.questions.length}
                response={session.responses[session.questionIndex]}
                onAnswer={answerQuestion}
                onContinue={continueLesson}
              />
            </>
          )}
        </main>
      )}
      {view === 'summary' && activeLesson && session && (
        <SessionSummary
          lesson={activeLesson}
          session={session}
          totalFunken={data.progress.lifetimeEarned}
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