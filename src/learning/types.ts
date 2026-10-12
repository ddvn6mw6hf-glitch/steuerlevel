export type AgeGroup = '18-24' | '25-34' | '35+'
export type LifeSituation = 'dual-apprentice' | 'university' | 'employee' | 'founder'
export type MainInterest = 'salary' | 'side-business' | 'everyday'
export type DifficultyTier = 1 | 2 | 3
export type LearningObjective =
  | 'distinguish-revenue'
  | 'identify-costs'
  | 'calculate-surplus'
  | 'distinguish-cash-flow'
  | 'understand-gross-net'
  | 'compare-spending-savings'
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
  prompt: string
  explanation: string
  concept: string
  funken: number
  answers: string[]
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
  lifeSituation: LifeSituation | 'shared'
  interest: MainInterest | 'shared'
  difficulty: DifficultyTier
  objective: LearningObjective
  verificationStatus: 'needs_review' | 'qualified_reviewed'
  sources: LearningSource[]
  taxYear: number | null
}

export type QuestionBankEntry = {
  question: Question
  tags: QuestionTags
}

export type Lesson = {
  id: string
  title: string
  shortTitle: string
  subtitle: string
  icon: string
  concepts: string[]
  scenario: string
  questions: Question[]
  references: {
    sources: Array<{ title: string; url: string }>
    verificationStatus: 'needs_review' | 'qualified_reviewed'
    taxYear: number | null
  }
}

export type QuestionResponse = {
  value: number
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