import { lessons } from './learning/content'
import type { Lesson, Question, QuizSession } from './learning/types'

export type { Question } from './learning/types'

// Preserve the initial lesson export for existing callers.
export const questions = lessons[0].questions

export function isCorrectAnswer(question: Question, answer: number): boolean {
  return answer === question.correctAnswer
}

export function calculateScore(
  answers: Array<number | null>,
  quizQuestions: Question[] = questions,
): number {
  return answers.reduce<number>((score, answer, index) => {
    if (answer !== null && quizQuestions[index] && isCorrectAnswer(quizQuestions[index], answer)) {
      return score + 1
    }
    return score
  }, 0)
}

export function createQuizSession(lesson: Lesson): QuizSession {
  return { questionIndex: 0, responses: lesson.questions.map(() => null), earnedFunken: 0 }
}

export function submitAnswer(
  session: QuizSession,
  question: Question,
  answer: number,
  previouslyEarnedQuestionIds: string[],
): { session: QuizSession; funkenAwarded: number } {
  if (session.responses[session.questionIndex] !== null) return { session, funkenAwarded: 0 }

  const correct = isCorrectAnswer(question, answer)
  const funkenAwarded = correct && !previouslyEarnedQuestionIds.includes(question.id) ? question.funken : 0
  const responses = session.responses.map((response, index) =>
    index === session.questionIndex ? { value: answer, correct, funkenAwarded } : response,
  )

  return {
    session: { ...session, responses, earnedFunken: session.earnedFunken + funkenAwarded },
    funkenAwarded,
  }
}

export function advanceSession(session: QuizSession, lesson: Lesson): QuizSession | null {
  if (session.questionIndex >= lesson.questions.length) return null
  if (session.responses[session.questionIndex] === null) return null
  return { ...session, questionIndex: session.questionIndex + 1 }
}

export function isLessonComplete(session: QuizSession, lesson: Lesson): boolean {
  return session.questionIndex >= lesson.questions.length
}

export function getSessionScore(session: QuizSession): number {
  return session.responses.filter((response) => response?.correct).length
}