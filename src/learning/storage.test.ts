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
  it('lädt Standardwerte und erhält nur Lernprofil sowie aggregierten Fortschritt', () => {
    const storage = createMemoryStorage()
    expect(loadLearningData(storage)).toEqual(createDefaultLearningData())

    const saved = {
      preferences: { ...defaultPreferences, mainInterest: 'salary' as const },
      onboardingComplete: true,
      progress: {
        steuerfunken: 15,
        earnedQuestionIds: ['salary-gross', 'founder-bag-sale'],
        completedLessonIds: ['brutto-netto'],
        bestScores: { 'brutto-netto': 2 },
      },
    }
    saveLearningData(saved, storage)

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
      },
    }))

    const migrated = loadLearningData(storage)
    const persisted = JSON.parse(storage.getItem(learningStorageKey) ?? '{}')

    expect(migrated.progress.steuerfunken).toBe(45)
    expect(migrated.progress.earnedQuestionIds).toEqual(['business-revenue', 'founder-bag-sale'])
    expect(migrated.progress.completedLessonIds).toEqual(['umsatz-gewinn'])
    expect(migrated.progress.completedLessonIds).not.toContain('steuern-verstehen')
    expect(migrated.progress.bestScores['umsatz-gewinn']).toBe(2)
    expect(persisted.progress).not.toHaveProperty('xp')
    expect(persisted.progress.steuerfunken).toBe(45)
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

    expect(loadLearningData(readOnlyStorage).progress.steuerfunken).toBe(29)
  })

  it('behält abgeschlossene Curriculum-IDs nach dem Speichern und erneuten Laden', () => {
    const storage = createMemoryStorage()
    const saved = {
      preferences: defaultPreferences,
      onboardingComplete: true,
      progress: {
        steuerfunken: 20,
        earnedQuestionIds: ['tax-common-purpose'],
        completedLessonIds: ['brutto-netto'],
        bestScores: { 'brutto-netto': 1 },
      },
    }

    saveLearningData(saved, storage)
    expect(loadLearningData(storage)).toEqual(saved)
    expect(loadLearningData(storage).progress.completedLessonIds).not.toContain('steuern-verstehen')
  })
})