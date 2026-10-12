import { lessons } from './content'
import { questionBank } from './questionBank'
import { defaultPreferences } from './scenarios'
import type { LearningPreferences } from './types'

export const learningStorageKey = 'steuerlevel.learning.v1'

export type LearningProgress = {
  steuerfunken: number
  earnedQuestionIds: string[]
  completedLessonIds: string[]
  bestScores: Record<string, number>
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
const knownQuestionIds = new Set(questionBank.map((entry) => entry.question.id))

export function createDefaultLearningData(): LearningData {
  return {
    preferences: { ...defaultPreferences },
    onboardingComplete: false,
    progress: { steuerfunken: 0, earnedQuestionIds: [], completedLessonIds: [], bestScores: {} },
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

  return {
    preferences: {
      ageGroup: ageGroup as LearningPreferences['ageGroup'],
      lifeSituation: lifeSituation as LearningPreferences['lifeSituation'],
      mainInterest: mainInterest as LearningPreferences['mainInterest'],
    },
    onboardingComplete: value.onboardingComplete === true,
    progress: {
      steuerfunken: typeof oldReward === 'number' && Number.isFinite(oldReward)
        ? Math.max(0, Math.floor(oldReward))
        : 0,
      earnedQuestionIds: Array.isArray(rawProgress.earnedQuestionIds)
        ? [...new Set(rawProgress.earnedQuestionIds.filter((id): id is string => typeof id === 'string' && knownQuestionIds.has(id)))]
        : [],
      completedLessonIds: Array.isArray(rawProgress.completedLessonIds)
        ? [...new Set(rawProgress.completedLessonIds.filter((id): id is string => typeof id === 'string' && knownLessonIds.has(id)))]
        : [],
      bestScores,
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
      parsed.progress.steuerfunken === undefined &&
      typeof parsed.progress.xp === 'number'
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

export function saveLearningData(data: LearningData, storage?: KeyValueStorage): void {
  try {
    ;(storage ?? getBrowserStorage())?.setItem(learningStorageKey, JSON.stringify(data))
  } catch {
    // Storage can be unavailable or full; the active session remains usable in memory.
  }
}