import { lessons } from './content'
import { interestPools } from './interestPools'
import { profilePools } from './profilePools'
import type {
  DifficultyTier,
  LearningObjective,
  LearningPreferences,
  LifeSituation,
  Lesson,
  MainInterest,
  Question,
  QuestionBankEntry,
  QuestionTags,
} from './types'

const reviewTags = {
  verificationStatus: 'needs_review',
  sources: [],
  taxYear: null,
} satisfies Pick<QuestionTags, 'verificationStatus' | 'sources' | 'taxYear'>

function inferObjective(question: Question): LearningObjective {
  if (/gross|net|brutto|netto|salary/.test(question.id)) return 'understand-gross-net'
  if (/cash|flow|geldfluss|refund|budget/.test(`${question.id} ${question.concept}`.toLowerCase())) return 'distinguish-cash-flow'
  if (/expense|spending|saving|ausgabe|steuer/.test(`${question.id} ${question.concept}`.toLowerCase())) return 'compare-spending-savings'
  if (/cost|kosten|material|repair|fees|delivery|packaging|stock/.test(`${question.id} ${question.concept}`.toLowerCase())) return 'identify-costs'
  if (question.type === 'calculation') return 'calculate-surplus'
  if (/revenue|umsatz|verkauf|sale/.test(`${question.id} ${question.concept}`.toLowerCase())) return 'distinguish-revenue'
  return 'reason-from-scenario'
}

function createEntry(
  question: Question,
  lifeSituation: LifeSituation | 'shared',
  interest: MainInterest | 'shared',
  difficulty: DifficultyTier,
  objective = inferObjective(question),
): QuestionBankEntry {
  return {
    question,
    tags: {
      lifeSituation,
      interest,
      difficulty,
      objective,
      ...reviewTags,
    },
  }
}

function getSharedEntries(): QuestionBankEntry[] {
  return lessons.flatMap((lesson) =>
    lesson.questions.map((question, index) => {
      const difficulty = (index + 1) as DifficultyTier
      return createEntry(question, 'shared', 'shared', difficulty)
    }),
  )
}

function getProfileEntries(): QuestionBankEntry[] {
  return (Object.keys(profilePools) as LifeSituation[]).flatMap((lifeSituation) =>
    profilePools[lifeSituation].questions.map((question, index) =>
      createEntry(question, lifeSituation, 'shared', (index + 1) as DifficultyTier),
    ),
  )
}

function getInterestEntries(): QuestionBankEntry[] {
  return (Object.keys(interestPools) as MainInterest[]).flatMap((interest) =>
    interestPools[interest].map((question, index) =>
      createEntry(question, 'shared', interest, (index + 1) as DifficultyTier),
    ),
  )
}

export const questionBank: QuestionBankEntry[] = [
  ...getSharedEntries(),
  ...getProfileEntries(),
  ...getInterestEntries(),
]

function questionForEntry(entry: QuestionBankEntry): Question {
  return { ...entry.question, tags: entry.tags }
}

export function selectQuestionsForPreferences(
  lesson: Lesson,
  preferences: LearningPreferences,
): Question[] {
  if (lesson.id !== 'umsatz-gewinn') {
    const sharedQuestions = lesson.questions.map((question) => {
      const entry = questionBank.find((candidate) => candidate.question.id === question.id)
      return entry ? questionForEntry(entry) : question
    })
    return sharedQuestions
  }

  const sharedCore = questionBank.find((entry) => entry.question.id === 'business-revenue')
  const profileQuestions = questionBank.filter((entry) => entry.tags.lifeSituation === preferences.lifeSituation)
  const interestQuestions = questionBank.filter((entry) => entry.tags.interest === preferences.mainInterest)
  const ageVariant: Record<LearningPreferences['ageGroup'], number> = {
    '18-24': 0,
    '25-34': 1,
    '35+': 2,
  }
  const selected = [sharedCore, ...profileQuestions, interestQuestions[ageVariant[preferences.ageGroup]]].filter(
    (entry): entry is QuestionBankEntry => entry !== undefined,
  ).sort((left, right) => left.tags.difficulty - right.tags.difficulty)

  return selected.map(questionForEntry)
}