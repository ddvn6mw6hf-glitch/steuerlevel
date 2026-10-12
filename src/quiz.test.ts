import { describe, expect, it } from 'vitest'
import { lessons } from './learning/content'
import { defaultPreferences, getNextLessonRecommendation, orderLessonsByInterest } from './learning/scenarios'
import {
  advanceSession,
  calculateScore,
  createQuizSession,
  getSessionScore,
  isCorrectAnswer,
  isLessonComplete,
  questions,
  submitAnswer,
} from './quiz'

describe('Quiz-Auswertung', () => {
  it('erkennt richtige und falsche Antworten', () => {
    expect(isCorrectAnswer(questions[0], 0)).toBe(true)
    expect(isCorrectAnswer(questions[0], 2)).toBe(false)
  })

  it('zählt nur richtig beantwortete Fragen', () => {
    expect(calculateScore([0, 0])).toBe(2)
    expect(calculateScore([null, 2, null])).toBe(0)
  })

  it('vergibt Steuerfunken nur beim ersten richtigen Beantworten einer Frage', () => {
    const question = questions[0]
    const session = createQuizSession(lessons[0])
    const first = submitAnswer(session, question, question.correctAnswer, [])
    const replay = submitAnswer(session, question, question.correctAnswer, [question.id])

    expect(first.funkenAwarded).toBe(question.funken)
    expect(replay.funkenAwarded).toBe(0)
  })

  it('sperrt beantwortete Fragen und verhindert mehrfaches Steuerfunken', () => {
    const question = questions[0]
    const session = createQuizSession(lessons[0])
    const first = submitAnswer(session, question, question.correctAnswer, [])
    const second = submitAnswer(first.session, question, question.correctAnswer, [])

    expect(second.session).toBe(first.session)
    expect(second.funkenAwarded).toBe(0)
  })

  it('vergibt für falsche Antworten weder Punkte noch negative Funken', () => {
    const question = questions[0]
    const result = submitAnswer(createQuizSession(lessons[0]), question, 1, [])

    expect(result.session.responses[0]?.correct).toBe(false)
    expect(result.session.earnedFunken).toBe(0)
    expect(result.funkenAwarded).toBe(0)
  })

  it('erlaubt den Fortschritt erst nach einer Antwort und erkennt das Lektionsende', () => {
    const lesson = lessons[0]
    const session = createQuizSession(lesson)
    expect(advanceSession(session, lesson)).toBeNull()

    let progressed = session
    for (const question of lesson.questions) {
      progressed = submitAnswer(progressed, question, question.correctAnswer, []).session
      progressed = advanceSession(progressed, lesson) ?? progressed
    }

    expect(isLessonComplete(progressed, lesson)).toBe(true)
    expect(getSessionScore(progressed)).toBe(lesson.questions.length)
    expect(progressed.earnedFunken).toBe(lesson.questions.reduce((total, question) => total + question.funken, 0))
  })

  it('ordnet Lektionen passend zum Lerninteresse und empfiehlt eine offene Lektion', () => {
    const salaryPreferences = { ...defaultPreferences, mainInterest: 'salary' as const }
    const ordered = orderLessonsByInterest(salaryPreferences)

    expect(ordered[0].id).toBe('brutto-netto')
    expect(getNextLessonRecommendation('brutto-netto', salaryPreferences, ['brutto-netto'])?.id)
      .toBe('steuern-verstehen')
  })
})