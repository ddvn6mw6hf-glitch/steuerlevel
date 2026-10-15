import { describe, expect, it } from 'vitest'
import { defaultPreferences } from './scenarios'
import {
  createDefaultLearningData,
  learningStorageKey,
  loadLearningData,
  saveLearningData,
} from './storage'

function createMemoryStorage() {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  }
}

describe('Lernfortschritt lokal speichern', () => {
  it('lädt Standardwerte und erhält Lernprofil, Punktestand und lokale Zusatzdaten', () => {
    const storage = createMemoryStorage()
    expect(loadLearningData(storage)).toEqual(createDefaultLearningData())

    const saved = createDefaultLearningData()
    saved.preferences = { ...defaultPreferences, mainInterest: 'salary' }
    saved.onboardingComplete = true
    saved.progress.lifetimeEarned = 300
    saved.progress.availableBalance = 50
    saved.progress.earnedQuestionIds = ['salary-gross', 'founder-bag-sale']
    saved.progress.completedLessonIds = ['brutto-netto']
    saved.progress.bestScores = { 'brutto-netto': 2 }
    saved.progress.purchasedRewardIds = ['steuerdetektiv-abzeichen']
    saved.progress.purchaseHistory = [{
      id: 'steuerdetektiv-abzeichen',
      rewardId: 'steuerdetektiv-abzeichen',
      price: 250,
      purchasedAt: '2026-10-14T10:00:00.000Z',
    }]
    saved.progress.milestones = {
      'foundations-test': { milestoneId: 'foundations-test', passed: false, passedAt: null },
    }
    expect(saveLearningData(saved, storage)).toBe(true)

    expect(loadLearningData(storage)).toEqual(saved)
    expect(JSON.parse(storage.getItem(learningStorageKey) ?? '{}')).toEqual(saved)
  })

  it('verwirft beschädigte oder unbekannte gespeicherte Werte', () => {
    const storage = createMemoryStorage()
    storage.setItem(learningStorageKey, '{broken')
    expect(loadLearningData(storage)).toEqual(createDefaultLearningData())

    storage.setItem(learningStorageKey, JSON.stringify({
      preferences: { ageGroup: '17', lifeSituation: 'unknown', mainInterest: 'salary' },
      progress: {},
    }))
    expect(loadLearningData(storage)).toEqual(createDefaultLearningData())
  })

  it('migriert vorhandene XP verlustfrei zu Steuerfunken und behält abgeschlossenen Fortschritt', () => {
    const storage = createMemoryStorage()
    storage.setItem(learningStorageKey, JSON.stringify({
      preferences: defaultPreferences,
      onboardingComplete: true,
      progress: {
        xp: 45,
        earnedQuestionIds: ['business-revenue', 'founder-bag-sale'],
        completedLessonIds: ['umsatz-gewinn'],
        bestScores: { 'umsatz-gewinn': 2 },
        questionAttempts: [],
        conceptReviews: {},
      },
    }))

    const migrated = loadLearningData(storage)
    const persisted = JSON.parse(storage.getItem(learningStorageKey) ?? '{}')

    expect(migrated.progress.lifetimeEarned).toBe(45)
    expect(migrated.progress.availableBalance).toBe(45)
    expect(migrated.progress.earnedQuestionIds).toEqual(['business-revenue', 'founder-bag-sale'])
    expect(migrated.progress.completedLessonIds).toEqual(['umsatz-gewinn'])
    expect(migrated.progress.completedLessonIds).not.toContain('steuern-verstehen')
    expect(migrated.progress.bestScores['umsatz-gewinn']).toBe(2)
    expect(persisted.progress).not.toHaveProperty('xp')
    expect(persisted.progress).not.toHaveProperty('steuerfunken')
    expect(persisted.progress.lifetimeEarned).toBe(45)
    expect(persisted.progress.availableBalance).toBe(45)
  })

  it('behält migrierte Punkte auch wenn localStorage nicht beschreibbar ist', () => {
    const legacyValue = JSON.stringify({
      preferences: defaultPreferences,
      onboardingComplete: true,
      progress: { xp: 29, earnedQuestionIds: [], completedLessonIds: [], bestScores: {} },
    })
    const readOnlyStorage = {
      getItem: () => legacyValue,
      setItem: () => { throw new Error('Storage is read-only') },
    }

    expect(loadLearningData(readOnlyStorage).progress.lifetimeEarned).toBe(29)
    expect(loadLearningData(readOnlyStorage).progress.availableBalance).toBe(29)
    expect(saveLearningData(createDefaultLearningData(), readOnlyStorage)).toBe(false)
  })

  it('behält abgeschlossene Curriculum-IDs nach dem Speichern und erneuten Laden', () => {
    const storage = createMemoryStorage()
    const saved = createDefaultLearningData()
    saved.preferences = defaultPreferences
    saved.onboardingComplete = true
    saved.progress.lifetimeEarned = 20
    saved.progress.availableBalance = 20
    saved.progress.earnedQuestionIds = ['tax-common-purpose']
    saved.progress.completedLessonIds = ['brutto-netto']
    saved.progress.bestScores = { 'brutto-netto': 1 }

    expect(saveLearningData(saved, storage)).toBe(true)
    expect(loadLearningData(storage)).toEqual(saved)
    expect(loadLearningData(storage).progress.completedLessonIds).not.toContain('steuern-verstehen')
  })

  it('migriert ältere Fortschritte ohne Fehlerverlauf und behält den vorhandenen Punktestand', () => {
    const storage = createMemoryStorage()
    storage.setItem(learningStorageKey, JSON.stringify({
      preferences: defaultPreferences,
      onboardingComplete: true,
      progress: {
        steuerfunken: 65,
        earnedQuestionIds: ['salary-gross'],
        completedLessonIds: ['brutto-netto'],
        bestScores: { 'brutto-netto': 1 },
      },
    }))

    const migrated = loadLearningData(storage)
    expect(migrated.progress.lifetimeEarned).toBe(65)
    expect(migrated.progress.availableBalance).toBe(65)
    expect(migrated.progress.completedLessonIds).toEqual(['brutto-netto'])
    expect(migrated.progress.questionAttempts).toEqual([])
    expect(migrated.progress.conceptReviews).toEqual({})
  })
})