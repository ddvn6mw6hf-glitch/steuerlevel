import { questionBank } from './questionBank'
import { reviewVariantByConcept, reviewVariants } from './reviewVariants'
import type { ConceptReview, Question, QuestionAttempt, ReviewTask } from './types'

const dayInMilliseconds = 24 * 60 * 60 * 1000
const strengthenedLookbackDays = 14

export type TrainerProgress = {
  questionAttempts: QuestionAttempt[]
  conceptReviews: Record<string, ConceptReview>
}

export type TrainerDashboard = {
  dueConcepts: ConceptReview[]
  uncertainConcepts: Array<{ review: ConceptReview; title: string }>
  recentlyStrengthened: Array<{ review: ConceptReview; title: string }>
}

export function getConceptId(question: Question): string {
  if (question.conceptId) return question.conceptId
  const normalized = question.concept.toLocaleLowerCase('de-DE')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `topic-${normalized || question.id}`
}

export function recordQuestionAttempt(
  progress: TrainerProgress,
  question: Question,
  correct: boolean,
  attemptedAt = new Date().toISOString(),
  isReview = false,
): TrainerProgress {
  const conceptId = getConceptId(question)
  const previous = progress.conceptReviews[conceptId]
  const attemptNumber = progress.questionAttempts
    .filter((attempt) => attempt.questionId === question.id)
    .length + 1
  const attemptedAtMs = Date.parse(attemptedAt)
  const lastReviewedAt = previous?.lastReviewedAt ?? null
  let nextReview: ConceptReview

  if (!correct) {
    nextReview = {
      conceptId,
      attempts: (previous?.attempts ?? 0) + 1,
      correctReviewCount: 0,
      lastAttemptAt: attemptedAt,
      lastReviewedAt: attemptedAt,
      nextDueAt: attemptedAt,
      status: 'needs-practice',
      lastQuestionId: question.id,
    }
  } else if (previous && previous.status !== 'clear' && previous.status !== 'strengthened') {
    const isDue = previous.nextDueAt === null || attemptedAtMs >= Date.parse(previous.nextDueAt)
    const correctReviewCount = isDue ? previous.correctReviewCount + 1 : previous.correctReviewCount
    const status = correctReviewCount >= 3 ? 'strengthened' : 'scheduled'
    const delayInDays = correctReviewCount === 1 ? 1 : 3
    nextReview = {
      conceptId,
      attempts: previous.attempts + 1,
      correctReviewCount,
      lastAttemptAt: attemptedAt,
      lastReviewedAt: isDue ? attemptedAt : previous.lastReviewedAt,
      nextDueAt: status === 'strengthened'
        ? null
        : isDue
          ? new Date(attemptedAtMs + delayInDays * dayInMilliseconds).toISOString()
          : previous.nextDueAt,
      status,
      lastQuestionId: question.id,
    }
  } else {
    nextReview = {
      conceptId,
      attempts: (previous?.attempts ?? 0) + 1,
      correctReviewCount: 0,
      lastAttemptAt: attemptedAt,
      lastReviewedAt,
      nextDueAt: null,
      status: previous?.status === 'strengthened' ? 'strengthened' : 'clear',
      lastQuestionId: question.id,
    }
  }

  const attempt: QuestionAttempt = {
    questionId: question.id,
    conceptId,
    correct,
    attemptedAt,
    attemptNumber,
    isReview,
    repeatStatus: nextReview.status,
    lastPracticedAt: attemptedAt,
  }

  return {
    questionAttempts: [...progress.questionAttempts, attempt],
    conceptReviews: { ...progress.conceptReviews, [conceptId]: nextReview },
  }
}

function questionTitle(review: ConceptReview): string {
  const question = [...questionBank.map((entry) => entry.question), ...reviewVariants]
    .find((candidate) => candidate.id === review.lastQuestionId)
  return question?.concept ?? review.conceptId
}

export function getTrainerDashboard(
  progress: TrainerProgress,
  now = new Date(),
): TrainerDashboard {
  const nowMs = now.getTime()
  const reviews = Object.values(progress.conceptReviews)
  const dueConcepts = reviews
    .filter((review) =>
      (review.status === 'needs-practice' || review.status === 'scheduled') &&
      review.nextDueAt !== null &&
      Date.parse(review.nextDueAt) <= nowMs,
    )
    .sort((left, right) => Date.parse(left.nextDueAt ?? '') - Date.parse(right.nextDueAt ?? ''))
  const uncertainConcepts = reviews
    .filter((review) => review.status === 'needs-practice' || review.status === 'scheduled')
    .sort((left, right) => Date.parse(right.lastAttemptAt) - Date.parse(left.lastAttemptAt))
    .map((review) => ({ review, title: questionTitle(review) }))
  const recentlyStrengthened = reviews
    .filter((review) =>
      review.status === 'strengthened' &&
      review.lastReviewedAt !== null &&
      nowMs - Date.parse(review.lastReviewedAt) <= strengthenedLookbackDays * dayInMilliseconds,
    )
    .sort((left, right) => Date.parse(right.lastReviewedAt ?? '') - Date.parse(left.lastReviewedAt ?? ''))
    .map((review) => ({ review, title: questionTitle(review) }))

  return { dueConcepts, uncertainConcepts, recentlyStrengthened }
}

export function createReviewTasks(
  dueConcepts: ConceptReview[],
): ReviewTask[] {
  return dueConcepts.map((review) => {
    const variant = reviewVariantByConcept.get(review.conceptId)
    const existingAlternative = questionBank
      .map((entry) => entry.question)
      .find((question) => getConceptId(question) === review.conceptId && question.id !== review.lastQuestionId)
    const candidate = variant?.id !== review.lastQuestionId
      ? variant
      : existingAlternative
    const originalQuestion = questionBank
      .map((entry) => entry.question)
      .find((question) => question.id === review.lastQuestionId)
    const question = candidate ?? originalQuestion
    if (!question) throw new Error(`Keine Wiederholungsfrage für Konzept ${review.conceptId} gefunden.`)
    return {
      conceptId: review.conceptId,
      question,
      isAlternative: question.id !== review.lastQuestionId,
    }
  })
}

export function clearTrainerProgress<T extends TrainerProgress>(progress: T): T {
  return { ...progress, questionAttempts: [], conceptReviews: {} }
}
