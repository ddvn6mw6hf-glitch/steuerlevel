export type AgeGroup = '18-24' | '25-34' | '35+'
export type LifeSituation = 'dual-apprentice' | 'university' | 'employee' | 'founder'
export type MainInterest = 'salary' | 'side-business' | 'everyday'
export type DifficultyTier = 1 | 2 | 3
export type LearningObjective =
  | 'understand-purpose'
  | 'sort-income'
  | 'distinguish-revenue'
  | 'identify-costs'
  | 'calculate-surplus'
  | 'distinguish-cash-flow'
  | 'understand-gross-net'
  | 'compare-spending-savings'
  | 'keep-records'
  | 'understand-depreciation'
  | 'distinguish-tax-types'
  | 'reason-from-scenario'

export type LearningPreferences = {
  ageGroup: AgeGroup
  lifeSituation: LifeSituation
  mainInterest: MainInterest
}

export type Calculation = {
  prompt: string
  values: Array<{ label: string; amount: number }>
  operation: 'subtract'
}

type QuestionBase = {
  id: string
  conceptId?: string
  lessonId?: string
  prompt: string
  teachingText?: string
  explanation: string
  concept: string
  funken: number
  difficulty?: DifficultyTier
  objective?: LearningObjective
  retryOnIncorrect?: boolean
  answers: string[]
  answerIds?: string[]
  correctAnswerId?: string
  calculation?: Calculation
  sources?: LearningSource[]
  tags?: QuestionTags
}

export type ChoiceQuestion = QuestionBase & {
  type: 'choice'
  correctAnswer: number
}

export type CalculationQuestion = QuestionBase & {
  type: 'calculation'
  correctAnswer: number
}

export type Question = ChoiceQuestion | CalculationQuestion

export type QuestionTags = {
  lessonId: string
  lifeSituation: LifeSituation | 'shared'
  interest: MainInterest | 'shared'
  difficulty: DifficultyTier
  objective: LearningObjective
  verificationStatus: 'conceptual_unverified' | 'needs_official_review' | 'source_checked'
  sources: LearningSource[]
  taxYear: number | null
}

export type QuestionBankEntry = {
  question: Question
  tags: QuestionTags
}

export type Lesson = {
  id: string
  difficulty: DifficultyTier
  topic: string
  title: string
  shortTitle: string
  subtitle: string
  icon: string
  concepts: string[]
  scenario: string
  questions: Question[]
  references: {
    sources: Array<{ title: string; url: string }>
    verificationStatus: 'conceptual_unverified' | 'needs_official_review' | 'source_checked'
    taxYear: number | null
  }
}

export type QuestionResponse = {
  value: number | string
  correct: boolean
  funkenAwarded: number
}

export type LearningSource = {
  title: string
  url: string
  taxYear?: number
}

export type QuizSession = {
  questionIndex: number
  responses: Array<QuestionResponse | null>
  earnedFunken: number
}

export type ReviewStatus = 'needs-practice' | 'scheduled' | 'strengthened' | 'clear'

export type QuestionAttempt = {
  questionId: string
  conceptId: string
  correct: boolean
  attemptedAt: string
  attemptNumber: number
  isReview: boolean
  repeatStatus: ReviewStatus
  lastPracticedAt: string
}

export type ConceptReview = {
  conceptId: string
  attempts: number
  correctReviewCount: number
  lastAttemptAt: string
  lastReviewedAt: string | null
  nextDueAt: string | null
  status: ReviewStatus
  lastQuestionId: string
}

export type ReviewTask = {
  conceptId: string
  question: Question
  isAlternative: boolean
}

export type MilestoneRecord = {
  milestoneId: string
  passed: boolean
  passedAt: string | null
}

export type LearningCertificate = {
  milestoneId: string
  issuedAt: string
  label: string
  officialRecognition: false
}

export type RewardId = 'golden-funkenbeutel' | 'steuerdetektiv-abzeichen' | 'papierkram-endgegner'

export type RewardPurchase = {
  id: RewardId
  rewardId: RewardId
  price: number
  purchasedAt: string
}