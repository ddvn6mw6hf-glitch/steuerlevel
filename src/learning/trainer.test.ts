import { describe, expect, it } from 'vitest'
import { lessons } from './content'
import { createReviewTasks, getTrainerDashboard, recordQuestionAttempt } from './trainer'
import type { QuestionAttempt } from './types'

const introQuestions = lessons[0].questions

describe('Intelligenter Fehlertrainer', () => {
  it('legt nach einer falschen Antwort einen sofort fälligen Konzept-Wiederholungsbedarf an', () => {
    const failed = recordQuestionAttempt(
      { questionAttempts: [], conceptReviews: {} },
      introQuestions[0],
      false,
      '2026-10-14T10:00:00.000Z',
    )

    expect(failed.questionAttempts).toEqual([expect.objectContaining({
      questionId: introQuestions[0].id,
      conceptId: 'tax-definition',
      correct: false,
      attemptNumber: 1,
      isReview: false,
      repeatStatus: 'needs-practice',
      lastPracticedAt: '2026-10-14T10:00:00.000Z',
    })])
    expect(failed.conceptReviews['tax-definition'].nextDueAt).toBe('2026-10-14T10:00:00.000Z')
    expect(getTrainerDashboard(failed, new Date('2026-10-14T10:01:00.000Z')).dueConcepts).toHaveLength(1)
  })

  it('bietet eine andere Frage desselben Konzepts an und kennzeichnet sie transparent', () => {
    const failed = recordQuestionAttempt(
      { questionAttempts: [], conceptReviews: {} },
      introQuestions[0],
      false,
      '2026-10-14T10:00:00.000Z',
    )
    const [task] = createReviewTasks(getTrainerDashboard(failed, new Date('2026-10-14T11:00:00.000Z')).dueConcepts)

    expect(task.isAlternative).toBe(true)
    expect(task.question.id).not.toBe(introQuestions[0].id)
    expect(task.question.conceptId).toBe('tax-definition')
    expect(task.question.prompt).not.toBe(introQuestions[0].prompt)
    expect(task.question.sources).toEqual(introQuestions[0].sources)
  })

  it('verschiebt richtige Wiederholungen erst auf morgen, dann auf drei Tage und festigt spaced', () => {
    const firstFailure = recordQuestionAttempt(
      { questionAttempts: [], conceptReviews: {} },
      introQuestions[0],
      false,
      '2026-10-14T10:00:00.000Z',
    )
    const firstSuccess = recordQuestionAttempt(
      firstFailure,
      introQuestions[0],
      true,
      '2026-10-14T11:00:00.000Z',
      true,
    )
    expect(firstSuccess.conceptReviews['tax-definition'].status).toBe('scheduled')
    expect(firstSuccess.conceptReviews['tax-definition'].nextDueAt).toBe('2026-10-15T11:00:00.000Z')
    expect(getTrainerDashboard(firstSuccess, new Date('2026-10-15T10:59:59.000Z')).dueConcepts).toHaveLength(0)

    const secondSuccess = recordQuestionAttempt(
      firstSuccess,
      introQuestions[0],
      true,
      '2026-10-15T11:00:00.000Z',
      true,
    )
    expect(secondSuccess.conceptReviews['tax-definition'].nextDueAt).toBe('2026-10-18T11:00:00.000Z')

    const finalSuccess = recordQuestionAttempt(
      secondSuccess,
      introQuestions[0],
      true,
      '2026-10-18T11:00:00.000Z',
      true,
    )
    expect(finalSuccess.conceptReviews['tax-definition'].status).toBe('strengthened')
    expect(finalSuccess.conceptReviews['tax-definition'].nextDueAt).toBeNull()
    expect(getTrainerDashboard(finalSuccess, new Date('2026-10-18T12:00:00.000Z')).recentlyStrengthened).toHaveLength(1)
  })

  it('setzt nach erneutem Fehler die Konzeptfälligkeit wieder auf sofort', () => {
    const spacedSuccess = recordQuestionAttempt(
      recordQuestionAttempt(
        recordQuestionAttempt(
          { questionAttempts: [], conceptReviews: {} },
          introQuestions[0],
          false,
          '2026-10-14T10:00:00.000Z',
        ),
        introQuestions[0],
        true,
        '2026-10-14T11:00:00.000Z',
        true,
      ),
      introQuestions[0],
      false,
      '2026-10-14T12:00:00.000Z',
      true,
    )

    expect(spacedSuccess.conceptReviews['tax-definition']).toMatchObject({
      status: 'needs-practice',
      correctReviewCount: 0,
      nextDueAt: '2026-10-14T12:00:00.000Z',
    })
    expect(spacedSuccess.questionAttempts.at(-1)?.attemptNumber).toBe(3)
  })

  it('speichert die vollständige Historie über einen Storage-Roundtrip', async () => {
    const { createDefaultLearningData, learningStorageKey, loadLearningData, saveLearningData } = await import('./storage')
    const storageValues = new Map<string, string>()
    const storage = {
      getItem: (key: string) => storageValues.get(key) ?? null,
      setItem: (key: string, value: string) => storageValues.set(key, value),
    }
    const data = createDefaultLearningData()
    const progress = recordQuestionAttempt(
      data.progress,
      introQuestions[0],
      false,
      '2026-10-14T10:00:00.000Z',
    )
    data.progress = { ...data.progress, ...progress }

    saveLearningData(data, storage)
    const loaded = loadLearningData(storage)
    const persistedAttempts = loaded.progress.questionAttempts as QuestionAttempt[]

    expect(persistedAttempts).toHaveLength(1)
    expect(persistedAttempts[0].attemptedAt).toBe('2026-10-14T10:00:00.000Z')
    expect(loaded.progress.conceptReviews['tax-definition'].status).toBe('needs-practice')
    expect(JSON.parse(storageValues.get(learningStorageKey) ?? '{}').progress.questionAttempts).toHaveLength(1)
  })
})
