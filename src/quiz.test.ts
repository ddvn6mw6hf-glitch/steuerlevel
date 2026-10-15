import { describe, expect, it } from 'vitest'
import { lessons } from './learning/content'
import { questionBank } from './learning/questionBank'
import { defaultPreferences, getNextLessonRecommendation, orderLessonsByInterest } from './learning/scenarios'
import { getAnswerChoices, getCorrectAnswerId } from './learning/answerChoices'
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
  it('mischt Antworten stabil und verteilt richtige Antworten auf A, B und C', () => {
    const positions = new Set<number>()
    for (const { question } of questionBank) {
      if (question.type !== 'choice') continue
      const choices = getAnswerChoices(question)
      const correctId = getCorrectAnswerId(question)
      expect(getAnswerChoices(question)).toEqual(choices)
      positions.add(choices.findIndex((choice) => choice.id === correctId))
    }

    expect(positions).toEqual(new Set([0, 1, 2]))
  })

  it('bewertet Antworten anhand stabiler IDs statt anhand ihrer Position', () => {
    for (const { question } of questionBank) {
      if (question.type !== 'choice') continue
      const choices = getAnswerChoices(question)
      const correctId = getCorrectAnswerId(question)
      expect(isCorrectAnswer(question, correctId)).toBe(true)
      for (const choice of choices) {
        expect(isCorrectAnswer(question, choice.id)).toBe(choice.id === correctId)
      }
    }
  })

  it('zählt nur richtig beantwortete Fragen', () => {
    const firstAnswer = getCorrectAnswerId(questions[0])
    const secondAnswer = getCorrectAnswerId(questions[1])
    expect(calculateScore([firstAnswer, secondAnswer])).toBe(2)
    expect(calculateScore([null, 'not-a-valid-answer', null])).toBe(0)
  })

  it('vergibt Steuerfunken nur beim ersten richtigen Beantworten einer Frage', () => {
    const question = questions[0]
    const session = createQuizSession(lessons[0])
    const correctAnswer = getCorrectAnswerId(question)
    const first = submitAnswer(session, question, correctAnswer, [])
    const replay = submitAnswer(session, question, correctAnswer, [question.id])

    expect(first.funkenAwarded).toBe(question.funken)
    expect(replay.funkenAwarded).toBe(0)
  })

  it('sperrt beantwortete Fragen und verhindert mehrfaches Steuerfunken', () => {
    const question = questions[0]
    const session = createQuizSession(lessons[0])
    const correctAnswer = getCorrectAnswerId(question)
    const first = submitAnswer(session, question, correctAnswer, [])
    const second = submitAnswer(first.session, question, correctAnswer, [])

    expect(second.session).toBe(first.session)
    expect(second.funkenAwarded).toBe(0)
  })

  it('vergibt für falsche Antworten weder Punkte noch negative Funken', () => {
    const question = questions[0]
    const wrongAnswer = getAnswerChoices(question).find((choice) => choice.id !== getCorrectAnswerId(question))?.id
    expect(wrongAnswer).toBeDefined()
    const result = submitAnswer(createQuizSession(lessons[0]), question, wrongAnswer!, [])

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
      progressed = submitAnswer(progressed, question, getCorrectAnswerId(question), []).session
      progressed = advanceSession(progressed, lesson) ?? progressed
    }

    expect(isLessonComplete(progressed, lesson)).toBe(true)
    expect(getSessionScore(progressed)).toBe(lesson.questions.length)
    expect(progressed.earnedFunken).toBe(lesson.questions.reduce((total, question) => total + question.funken, 0))
  })

  it('ordnet Lektionen passend zum Lerninteresse und empfiehlt eine offene Lektion', () => {
    const salaryPreferences = { ...defaultPreferences, mainInterest: 'salary' as const }
    const ordered = orderLessonsByInterest(salaryPreferences)

    expect(ordered[0].id).toBe('wer-kassiert-hier-eigentlich')
    expect(getNextLessonRecommendation('brutto-netto', salaryPreferences, ['brutto-netto'])?.id)
      .toBe('wer-kassiert-hier-eigentlich')
  })
})