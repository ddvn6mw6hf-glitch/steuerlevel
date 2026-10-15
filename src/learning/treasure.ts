import type { LearningProgress } from './storage'
import type { LearningCertificate, RewardId, RewardPurchase } from './types'

export const rewardCatalog = {
  'golden-funkenbeutel': {
    title: 'Goldener Funkenbeutel',
    description: 'Schalte den goldenen Beutel-Look frei und aktiviere ihn nach dem Kauf.',
    price: 150,
  },
  'steuerdetektiv-abzeichen': {
    title: 'Steuerdetektiv-Abzeichen',
    description: 'Zeige dein Abzeichen sichtbar in deinem persönlichen Lernprofil.',
    price: 250,
  },
  'papierkram-endgegner': {
    title: 'Bonus-Challenge: Der Papierkram-Endgegner',
    description: 'Schalte drei zusätzliche, fiktive Aufgaben zu Belegen und Geldflüssen frei.',
    price: 300,
  },
} satisfies Record<RewardId, { title: string; description: string; price: number }>

export type PurchaseResult =
  | { success: true; purchase: RewardPurchase; progress: LearningProgress }
  | { success: false; reason: 'already-owned' | 'insufficient-funds' | 'unknown-reward' }

export function purchaseReward(
  progress: LearningProgress,
  rewardId: string,
  purchasedAt = new Date().toISOString(),
): PurchaseResult {
  if (!Object.prototype.hasOwnProperty.call(rewardCatalog, rewardId)) return { success: false, reason: 'unknown-reward' }
  const id = rewardId as RewardId
  if (progress.purchasedRewardIds.includes(id)) return { success: false, reason: 'already-owned' }
  const reward = rewardCatalog[id]
  if (progress.availableBalance < reward.price) return { success: false, reason: 'insufficient-funds' }

  const purchase: RewardPurchase = { id, rewardId: id, price: reward.price, purchasedAt }
  return {
    success: true,
    purchase,
    progress: {
      ...progress,
      availableBalance: progress.availableBalance - reward.price,
      purchasedRewardIds: [...progress.purchasedRewardIds, id],
      purchaseHistory: [...progress.purchaseHistory, purchase],
    },
  }
}

export function awardQuestionFunken(
  progress: LearningProgress,
  questionId: string,
  amount: number,
): LearningProgress {
  if (progress.earnedQuestionIds.includes(questionId) || amount <= 0) return progress
  return {
    ...progress,
    lifetimeEarned: progress.lifetimeEarned + amount,
    availableBalance: progress.availableBalance + amount,
    earnedQuestionIds: [...progress.earnedQuestionIds, questionId],
  }
}

export function issueLearningCertificate(
  progress: LearningProgress,
  milestoneId: string,
  label: string,
  issuedAt = new Date().toISOString(),
): LearningProgress | null {
  const milestone = progress.milestones[milestoneId]
  if (!milestone?.passed || progress.certificates.some((certificate) => certificate.milestoneId === milestoneId)) return null
  const certificate: LearningCertificate = {
    milestoneId,
    issuedAt,
    label: `Inoffizielles SteuerLevel-Lernzertifikat: ${label}`,
    officialRecognition: false,
  }
  return { ...progress, certificates: [...progress.certificates, certificate] }
}
