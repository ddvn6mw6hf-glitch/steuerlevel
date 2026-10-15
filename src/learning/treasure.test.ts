import { describe, expect, it } from 'vitest'
import { createDefaultLearningData, learningStorageKey, loadLearningData, saveLearningData } from './storage'
import { bonusChallenge } from './bonusChallenge'
import { getCorrectAnswerId } from './answerChoices'
import { isCorrectAnswer } from '../quiz'
import { awardQuestionFunken, issueLearningCertificate, purchaseReward } from './treasure'

function memoryStorage() {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  }
}

describe('Schatzkammer und virtuelle Käufe', () => {
  it('zieht den Preis genau einmal vom verfügbaren Guthaben ab und lässt Lebenszeitpunkte stehen', () => {
    const data = createDefaultLearningData()
    data.progress.lifetimeEarned = 700
    data.progress.availableBalance = 500
    const bought = purchaseReward(data.progress, 'golden-funkenbeutel', '2026-10-14T10:00:00.000Z')

    expect(bought.success).toBe(true)
    if (!bought.success) return
    expect(bought.progress.availableBalance).toBe(350)
    expect(bought.progress.lifetimeEarned).toBe(700)
    expect(bought.progress.purchasedRewardIds).toEqual(['golden-funkenbeutel'])
    expect(bought.progress.purchaseHistory).toEqual([{
      id: 'golden-funkenbeutel',
      rewardId: 'golden-funkenbeutel',
      price: 150,
      purchasedAt: '2026-10-14T10:00:00.000Z',
    }])

    const duplicate = purchaseReward(bought.progress, 'golden-funkenbeutel')
    expect(duplicate).toEqual({ success: false, reason: 'already-owned' })
  })

  it('verhindert Käufe bei unzureichendem Guthaben ohne Änderungen', () => {
    const data = createDefaultLearningData()
    data.progress.lifetimeEarned = 200
    data.progress.availableBalance = 200
    const result = purchaseReward(data.progress, 'steuerdetektiv-abzeichen')

    expect(result).toEqual({ success: false, reason: 'insufficient-funds' })
    expect(data.progress.lifetimeEarned).toBe(200)
    expect(data.progress.availableBalance).toBe(200)
    expect(data.progress.purchasedRewardIds).toEqual([])
  })

  it('verwirft unbekannte Belohnungen sicher', () => {
    const data = createDefaultLearningData()
    data.progress.availableBalance = 1000

    expect(purchaseReward(data.progress, '__proto__')).toEqual({
      success: false,
      reason: 'unknown-reward',
    })
    expect(data.progress.availableBalance).toBe(1000)
  })

  it('vergibt Fragepunkte idempotent und erhöht Lebenszeit sowie Guthaben gemeinsam', () => {
    const data = createDefaultLearningData()
    const firstAward = awardQuestionFunken(data.progress, 'intro-tax-definition', 10)
    const duplicateAward = awardQuestionFunken(firstAward, 'intro-tax-definition', 10)

    expect(firstAward.lifetimeEarned).toBe(10)
    expect(firstAward.availableBalance).toBe(10)
    expect(duplicateAward).toBe(firstAward)
  })

  it('behält Kauf, Gold-Design und Kontostände nach dem lokalen Reload', () => {
    const storage = memoryStorage()
    const data = createDefaultLearningData()
    data.progress.lifetimeEarned = 500
    data.progress.availableBalance = 500
    const purchase = purchaseReward(data.progress, 'golden-funkenbeutel', '2026-10-14T12:00:00.000Z')
    expect(purchase.success).toBe(true)
    if (!purchase.success) return
    data.progress = { ...purchase.progress, activeBagSkin: 'gold' }

    saveLearningData(data, storage)
    const reloaded = loadLearningData(storage)

    expect(reloaded.progress.lifetimeEarned).toBe(500)
    expect(reloaded.progress.availableBalance).toBe(350)
    expect(reloaded.progress.purchasedRewardIds).toContain('golden-funkenbeutel')
    expect(reloaded.progress.activeBagSkin).toBe('gold')
    expect(reloaded.progress.purchaseHistory).toHaveLength(1)
    expect(JSON.parse(storage.getItem(learningStorageKey) ?? '{}').progress.activeBagSkin).toBe('gold')
  })

  it('schaltet die bezahlte Bonus-Challenge mit auswertbaren, einmalig belohnbaren Fragen frei', () => {
    const data = createDefaultLearningData()
    data.progress.purchasedRewardIds = ['papierkram-endgegner']
    expect(bonusChallenge.questions).toHaveLength(3)
    expect(bonusChallenge.questions.every((question) =>
      question.type === 'choice' &&
      question.answers.length === 3 &&
      isCorrectAnswer(question, getCorrectAnswerId(question)),
    )).toBe(true)
    expect(bonusChallenge.questions.map((question) => question.funken)).toEqual([5, 5, 5])
    expect(data.progress.purchasedRewardIds).toContain('papierkram-endgegner')
  })

  it('bereitet inoffizielle Zertifikate nur für bestandene Meilensteine vor', () => {
    const data = createDefaultLearningData()
    expect(issueLearningCertificate(data.progress, 'boss-foundations', 'Grundlagen')).toBeNull()
    data.progress.milestones['boss-foundations'] = {
      milestoneId: 'boss-foundations',
      passed: false,
      passedAt: null,
    }
    expect(issueLearningCertificate(data.progress, 'boss-foundations', 'Grundlagen')).toBeNull()
    data.progress.milestones['boss-foundations'] = {
      milestoneId: 'boss-foundations',
      passed: true,
      passedAt: '2026-10-14T10:00:00.000Z',
    }
    const certified = issueLearningCertificate(data.progress, 'boss-foundations', 'Grundlagen')
    expect(certified?.certificates[0]).toMatchObject({
      milestoneId: 'boss-foundations',
      officialRecognition: false,
      label: expect.stringContaining('Inoffizielles SteuerLevel-Lernzertifikat'),
    })
  })
})
