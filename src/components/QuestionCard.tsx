import { useEffect, useRef, useState, type FormEvent } from 'react'
import { isCorrectAnswer } from '../quiz'
import type { Question, QuestionResponse } from '../learning/types'
import { getAnswerFeedback } from '../learning/feedback'
import FunkenMark from './FunkenMark'
import { difficultyLabels, objectiveLabels } from '../learning/labels'

type Props = {
  question: Question
  questionNumber: number
  questionCount: number
  response: QuestionResponse | null
  onAnswer: (value: number) => void
  onContinue: () => void
}

function QuestionCard({ question, questionNumber, questionCount, response, onAnswer, onContinue }: Props) {
  const [calculationValue, setCalculationValue] = useState('')
  const questionRef = useRef<HTMLHeadingElement>(null)
  const feedbackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (response) feedbackRef.current?.focus()
    else questionRef.current?.focus()
  }, [question.id, response])

  function submitCalculation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (calculationValue.trim() === '') return
    const value = Number(calculationValue)
    if (Number.isFinite(value)) onAnswer(value)
  }

  return (
    <section className="question-stage" aria-live="polite">
      <div className="question-stage-meta">
        <span>FRAGE {questionNumber} <span className="meta-divider">/</span> {questionCount}</span>
        <span className="question-reward"><FunkenMark small /> {question.funken} Steuerfunken</span>
      </div>
      <div className="progress-track question-progress" role="progressbar" aria-label="Fortschritt in dieser Lektion" aria-valuemin={0} aria-valuemax={questionCount} aria-valuenow={questionNumber - 1}>
        <span style={{ width: `${((questionNumber - 1) / questionCount) * 100}%` }} />
      </div>
      {question.tags && (
        <div className="question-taxonomy">
          <span>{difficultyLabels[question.tags.difficulty]}</span>
          <span>{objectiveLabels[question.tags.objective]}</span>
        </div>
      )}
      <h2 className="question-title" ref={questionRef} tabIndex={-1}>{question.prompt}</h2>

      {question.type === 'calculation' && question.calculation && (
        <div className="calculation-panel">
          <span className="calculation-caption">FIKTIVE EURO-RECHNUNG</span>
          <p>{question.calculation.prompt}</p>
          <div className="calculation-values">
            {question.calculation.values.map((item, index) => (
              <span className="calculation-value" key={item.label}>
                <small>{item.label}</small>
                <strong>{new Intl.NumberFormat('de-DE').format(item.amount)} €</strong>
                {index === 0 && <i aria-hidden="true">−</i>}
              </span>
            ))}
            <span className="calculation-equals" aria-hidden="true">=</span>
            {response ? (
              <span className="calculation-result"><small>Dein Ergebnis</small><strong>{new Intl.NumberFormat('de-DE').format(response.value)} €</strong></span>
            ) : (
              <label className="calculation-input-wrap">
                <small>Dein Ergebnis</small>
                <span><input autoComplete="off" inputMode="numeric" min="0" onChange={(event) => setCalculationValue(event.target.value)} step="1" type="number" value={calculationValue} aria-label="Ergebnis in Euro" /><b>€</b></span>
              </label>
            )}
          </div>
        </div>
      )}

      {question.type === 'choice' && (
        <div className="answer-list answer-list-large">
          {question.answers.map((answer, index) => {
            const selected = response?.value === index
            const correct = isCorrectAnswer(question, index)
            const resultClass = response
              ? correct ? ' answer-correct' : selected ? ' answer-incorrect' : ''
              : ''
            return (
              <button
                aria-pressed={selected}
                className={`answer-option${resultClass}${selected ? ' answer-selected' : ''}`}
                aria-disabled={response !== null}
                key={answer}
                onClick={() => { if (!response) onAnswer(index) }}
              >
                <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
                <span>{answer}</span>
                {response && correct && <span className="answer-check" aria-label="Richtig">✓</span>}
                {response && selected && !correct && <span className="answer-check" aria-label="Deine Auswahl">×</span>}
                {response?.correct && selected && response.funkenAwarded > 0 && (
                  <span className="reward-float" aria-live="polite"><FunkenMark small /> +{response.funkenAwarded} Funken</span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {question.type === 'calculation' && !response && (
        <form className="calculation-actions" onSubmit={submitCalculation}>
          <button className="primary-button" disabled={calculationValue.trim() === ''} type="submit">Ergebnis prüfen <span aria-hidden="true">→</span></button>
        </form>
      )}

      {response && (
        <div className={`feedback lesson-feedback${response.correct ? ' feedback-correct' : ''}`} role="status" aria-live="polite">
          {response.correct ? (
            <div ref={feedbackRef} tabIndex={-1} className="answer-feedback answer-feedback-correct">
              <div className="answer-feedback-orbit" aria-hidden="true">✦</div>
              <p className="answer-feedback-kicker">GEDANKE GETROFFEN</p>
              <strong className="answer-feedback-title">{getAnswerFeedback(question, true).headline}</strong>
              <span className="answer-feedback-reward">
                {response.funkenAwarded > 0
                  ? <><FunkenMark small /> +{response.funkenAwarded} Steuerfunken</>
                  : 'Steuerfunken für diese Frage schon gesammelt'}
              </span>
            </div>
          ) : (
            <div ref={feedbackRef} tabIndex={-1} className="answer-feedback answer-feedback-wrong">
              <span className="answer-feedback-orbit" aria-hidden="true">↗</span>
              <p className="answer-feedback-kicker">GUTER FUND IM LERNMODUS</p>
              <strong className="answer-feedback-title">Steuerfalle entdeckt.</strong>
              <span className="answer-feedback-subtitle">Kein Abzug. Schau auf den entscheidenden Unterschied:</span>
            </div>
          )}
          <p className="answer-feedback-explanation">{getAnswerFeedback(question, response.correct).detail}</p>
          <button className="primary-button continue-button" onClick={onContinue}>
            {questionNumber === questionCount ? 'Zur Zusammenfassung' : 'Weiter'}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </section>
  )
}

export default QuestionCard