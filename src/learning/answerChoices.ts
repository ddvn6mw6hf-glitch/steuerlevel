import type { Question } from './types'

export type AnswerChoice = { id: string; text: string }

function hash(value: string): number {
  let result = 2166136261
  for (const character of value) {
    result ^= character.charCodeAt(0)
    result = Math.imul(result, 16777619)
  }
  return result >>> 0
}

export function getAnswerIds(question: Question): string[] {
  if (question.answerIds?.length === question.answers.length) return question.answerIds

  const occurrences = new Map<string, number>()
  return question.answers.map((text) => {
    const normalized = text.trim()
    const occurrence = occurrences.get(normalized) ?? 0
    occurrences.set(normalized, occurrence + 1)
    return `${question.id}-choice-${hash(normalized).toString(36)}-${occurrence}`
  })
}

export function getCorrectAnswerId(question: Question): string {
  if (question.correctAnswerId) return question.correctAnswerId
  const ids = getAnswerIds(question)
  const correctIndex = question.correctAnswer
  const answerId = ids[correctIndex]
  if (!answerId) throw new Error(`Frage ${question.id} hat keine gültige richtige Antwort.`)
  return answerId
}

export function getAnswerChoices(question: Question): AnswerChoice[] {
  const choices = question.answers.map((text, index) => ({
    id: getAnswerIds(question)[index],
    text,
  }))

  return choices.sort((left, right) => {
    const order = hash(`${question.id}:${left.id}`) - hash(`${question.id}:${right.id}`)
    return order || left.id.localeCompare(right.id)
  })
}
