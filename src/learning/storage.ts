import { lessons } from './content'
import { legacyQuestionIds, questionBank } from './questionBank'
import { defaultPreferences } from './scenarios'
import { reviewVariants } from './reviewVariants'
import { bonusChallengeQuestions } from './bonusChallenge'
import { rewardCatalog } from './treasure'
import type {
  ConceptReview,
  LearningCertificate,
  LearningPreferences,
  MilestoneRecord,
  QuestionAttempt,
  RewardId,
  RewardPurchase,
  ReviewStatus,
} from './types'

export const learningStorageKey = 'steuerlevel.learning.v1'

export type LearningProgress = {
  lifetimeEarned: number
  availableBalance: number
  earnedQuestionIds: string[]
  completedLessonIds: string[]
  bestScores: Record<string, number>
  questionAttempts: QuestionAttempt[]
  conceptReviews: Record<string, ConceptReview>
  purchasedRewardIds: RewardId[]
  purchaseHistory: RewardPurchase[]
  activeBagSkin: 'default' | 'gold'
  milestones: Record<string, MilestoneRecord>
  certificates: LearningCertificate[]
}

export type LearningData = {
  preferences: LearningPreferences
  onboardingComplete: boolean
  progress: LearningProgress
}

type KeyValueStorage = Pick<Storage, 'getItem' | 'setItem'>

const ageGroups = ['18-24', '25-34', '35+']
const lifeSituations = ['dual-apprentice', 'university', 'employee', 'founder']
const interests = ['salary', 'side-business', 'everyday']
const knownLessonIds = new Set(lessons.map((lesson) => lesson.id))
const knownQuestionIds = new Set([
  ...questionBank.map((entry) => entry.question.id),
  ...reviewVariants.map((question) => question.id),
  ...bonusChallengeQuestions.map((question) => question.id),
  ...legacyQuestionIds,
])
const knownRewardIds = new Set(Object.keys(rewardCatalog))
const reviewStatuses: ReviewStatus[] = ['needs-practice', 'scheduled', 'strengthened', 'clear']

export function createDefaultLearningData(): LearningData {
  return {
    preferences: { ...defaultPreferences },
    onboardingComplete: false,
    progress: {
      lifetimeEarned: 0,
      availableBalance: 0,
      earnedQuestionIds: [],
      completedLessonIds: [],
      bestScores: {},
      questionAttempts: [],
      conceptReviews: {},
      purchasedRewardIds: [],
      purchaseHistory: [],
      activeBagSkin: 'default',
      milestones: {},
      certificates: [],
    },
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function normalizeLearningData(value: unknown): LearningData {
  const defaults = createDefaultLearningData()
  if (!isRecord(value)) return defaults

  const rawPreferences = value.preferences
  const rawProgress = value.progress
  if (!isRecord(rawPreferences) || !isRecord(rawProgress)) return defaults

  const { ageGroup, lifeSituation, mainInterest } = rawPreferences
  if (
    !ageGroups.includes(String(ageGroup)) ||
    !lifeSituations.includes(String(lifeSituation)) ||
    !interests.includes(String(mainInterest))
  ) return defaults

  const rawBestScores = isRecord(rawProgress.bestScores) ? rawProgress.bestScores : {}
  const bestScores = Object.fromEntries(
    Object.entries(rawBestScores).filter(
      ([lessonId, score]) => knownLessonIds.has(lessonId) && Number.isInteger(score) && Number(score) >= 0,
    ),
  ) as Record<string, number>

  const oldReward = rawProgress.steuerfunken ?? rawProgress.xp
  const legacyBalance = typeof oldReward === 'number' && Number.isFinite(oldReward)
    ? Math.max(0, Math.floor(oldReward))
    : 0
  const rawLifetimeEarned = typeof rawProgress.lifetimeEarned === 'number' &&
    Number.isFinite(rawProgress.lifetimeEarned) && rawProgress.lifetimeEarned >= 0
    ? Math.floor(rawProgress.lifetimeEarned)
    : null
  const rawAvailableBalance = typeof rawProgress.availableBalance === 'number' &&
    Number.isFinite(rawProgress.availableBalance) && rawProgress.availableBalance >= 0
    ? Math.floor(rawProgress.availableBalance)
    : null
  const lifetimeEarned = rawLifetimeEarned ?? rawAvailableBalance ?? legacyBalance
  const availableBalance = rawAvailableBalance ?? rawLifetimeEarned ?? legacyBalance
  const questionAttempts = Array.isArray(rawProgress.questionAttempts)
    ? rawProgress.questionAttempts.filter((attempt): attempt is QuestionAttempt =>
      isRecord(attempt) &&
      typeof attempt.questionId === 'string' && knownQuestionIds.has(attempt.questionId) &&
      typeof attempt.conceptId === 'string' &&
      typeof attempt.correct === 'boolean' &&
      typeof attempt.attemptedAt === 'string' && Number.isFinite(Date.parse(attempt.attemptedAt)) &&
      Number.isInteger(attempt.attemptNumber) && Number(attempt.attemptNumber) > 0 &&
      typeof attempt.isReview === 'boolean' &&
      typeof attempt.repeatStatus === 'string' && reviewStatuses.includes(attempt.repeatStatus as ReviewStatus) &&
      typeof attempt.lastPracticedAt === 'string' && Number.isFinite(Date.parse(attempt.lastPracticedAt)),
    )
    : []
  const conceptReviews = isRecord(rawProgress.conceptReviews)
    ? Object.fromEntries(
      Object.entries(rawProgress.conceptReviews).filter(
        (entry): entry is [string, ConceptReview] => {
          const [conceptId, review] = entry
          return isRecord(review) &&
            conceptId === review.conceptId &&
            Number.isInteger(review.attempts) && Number(review.attempts) >= 0 &&
            Number.isInteger(review.correctReviewCount) && Number(review.correctReviewCount) >= 0 &&
            typeof review.lastAttemptAt === 'string' && Number.isFinite(Date.parse(review.lastAttemptAt)) &&
            (review.lastReviewedAt === null || (typeof review.lastReviewedAt === 'string' && Number.isFinite(Date.parse(review.lastReviewedAt)))) &&
            (review.nextDueAt === null || (typeof review.nextDueAt === 'string' && Number.isFinite(Date.parse(review.nextDueAt)))) &&
            typeof review.status === 'string' && reviewStatuses.includes(review.status as ReviewStatus) &&
            typeof review.lastQuestionId === 'string' && knownQuestionIds.has(review.lastQuestionId)
        },
      ),
    )
    : {}
  const purchaseHistory = Array.isArray(rawProgress.purchaseHistory)
    ? rawProgress.purchaseHistory.filter((purchase): purchase is RewardPurchase =>
      isRecord(purchase) &&
      typeof purchase.id === 'string' && knownRewardIds.has(purchase.id) &&
      purchase.id === purchase.rewardId &&
      Number.isInteger(purchase.price) && Number(purchase.price) > 0 &&
      typeof purchase.purchasedAt === 'string' && Number.isFinite(Date.parse(purchase.purchasedAt)),
    )
    : []
  const purchasedRewardIds = [...new Set([
    ...(Array.isArray(rawProgress.purchasedRewardIds)
      ? rawProgress.purchasedRewardIds.filter((id): id is RewardId => typeof id === 'string' && knownRewardIds.has(id))
      : []),
    ...purchaseHistory.map((purchase) => purchase.rewardId),
  ])]
  const milestones = isRecord(rawProgress.milestones)
    ? Object.fromEntries(Object.entries(rawProgress.milestones).filter(
      (entry): entry is [string, MilestoneRecord] => {
        const [milestoneId, milestone] = entry
        return isRecord(milestone) &&
          milestoneId === milestone.milestoneId &&
          typeof milestone.passed === 'boolean' &&
          (milestone.passedAt === null || (typeof milestone.passedAt === 'string' && Number.isFinite(Date.parse(milestone.passedAt))))
      },
    ))
    : {}
  const certificates = Array.isArray(rawProgress.certificates)
    ? rawProgress.certificates.filter((certificate): certificate is LearningCertificate =>
      isRecord(certificate) &&
      typeof certificate.milestoneId === 'string' &&
      typeof certificate.issuedAt === 'string' && Number.isFinite(Date.parse(certificate.issuedAt)) &&
      typeof certificate.label === 'string' &&
      certificate.officialRecognition === false,
    )
    : []
  const activeBagSkin = rawProgress.activeBagSkin === 'gold' &&
    purchasedRewardIds.includes('golden-funkenbeutel')
    ? 'gold'
    : 'default'

  return {
    preferences: {
      ageGroup: ageGroup as LearningPreferences['ageGroup'],
      lifeSituation: lifeSituation as LearningPreferences['lifeSituation'],
      mainInterest: mainInterest as LearningPreferences['mainInterest'],
    },
    onboardingComplete: value.onboardingComplete === true,
    progress: {
      lifetimeEarned,
      availableBalance,
      earnedQuestionIds: Array.isArray(rawProgress.earnedQuestionIds)
        ? [...new Set(rawProgress.earnedQuestionIds.filter((id): id is string => typeof id === 'string' && knownQuestionIds.has(id)))]
        : [],
      completedLessonIds: Array.isArray(rawProgress.completedLessonIds)
        ? [...new Set(rawProgress.completedLessonIds.filter((id): id is string => typeof id === 'string' && knownLessonIds.has(id)))]
        : [],
      bestScores,
      questionAttempts,
      conceptReviews,
      purchasedRewardIds,
      purchaseHistory: [...new Map(purchaseHistory.map((purchase) => [purchase.id, purchase])).values()],
      activeBagSkin,
      milestones,
      certificates,
    },
  }
}

function getBrowserStorage(): KeyValueStorage | undefined {
  try {
    return typeof window === 'undefined' ? undefined : window.localStorage
  } catch {
    return undefined
  }
}

export function loadLearningData(storage?: KeyValueStorage): LearningData {
  try {
    const targetStorage = storage ?? getBrowserStorage()
    const serialized = targetStorage?.getItem(learningStorageKey)
    if (!serialized) return createDefaultLearningData()

    const parsed = JSON.parse(serialized) as unknown
    const normalized = normalizeLearningData(parsed)
    if (
      isRecord(parsed) &&
      isRecord(parsed.progress) &&
      (
        parsed.progress.steuerfunken !== undefined ||
        parsed.progress.xp !== undefined ||
        parsed.progress.lifetimeEarned === undefined ||
        parsed.progress.availableBalance === undefined ||
        parsed.progress.questionAttempts === undefined ||
        parsed.progress.purchasedRewardIds === undefined
      )
    ) {
      try {
        targetStorage?.setItem(learningStorageKey, JSON.stringify(normalized))
      } catch {
        // Keep the migrated value available for this session if storage is read-only or full.
      }
    }
    return normalized
  } catch {
    return createDefaultLearningData()
  }
}

export function saveLearningData(data: LearningData, storage?: KeyValueStorage): boolean {
  try {
    const targetStorage = storage ?? getBrowserStorage()
    if (!targetStorage) return false
    targetStorage.setItem(learningStorageKey, JSON.stringify(data))
    return true
  } catch {
    return false
  }
}