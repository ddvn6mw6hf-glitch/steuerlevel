import { lessons } from './curriculum'
import { interestQuestionBank } from './interestQuestionBank'
import { profileQuestionBank } from './profileQuestionBank'
import type {
  DifficultyTier,
  LearningObjective,
  LearningPreferences,
  Lesson,
  Question,
  QuestionBankEntry,
  QuestionTags,
} from './types'

const conceptualReview = {
  verificationStatus: 'conceptual_unverified',
  sources: [],
  taxYear: null,
} satisfies Pick<QuestionTags, 'verificationStatus' | 'sources' | 'taxYear'>

function inferObjective(question: Question): LearningObjective {
  const description = `${question.id} ${question.concept}`.toLowerCase()
  if (/brutto|netto|abrechnung|salary/.test(description)) return 'understand-gross-net'
  if (/cash|flow|zahlung|liquid|geldfluss|refund/.test(description)) return 'distinguish-cash-flow'
  if (/ausgabe|saving|expense|steuerersparnis/.test(description)) return 'compare-spending-savings'
  if (/beleg|dokument|receipt|record/.test(description)) return 'keep-records'
  if (/umsatz|verkauf|sale|revenue/.test(description)) return 'distinguish-revenue'
  if (/kosten|cost|material|expense/.test(description)) return 'identify-costs'
  if (/steuer|purpose|gemeinsam/.test(description)) return 'understand-purpose'
  return 'reason-from-scenario'
}

function lessonDifficulty(lessonId: string): DifficultyTier {
  return lessons.find((lesson) => lesson.id === lessonId)?.difficulty ?? 1
}

function createEntry(
  question: Question,
  lessonId: string,
  lifeSituation: QuestionTags['lifeSituation'],
  interest: QuestionTags['interest'],
  difficulty = lessonDifficulty(lessonId),
): QuestionBankEntry {
  const objective = inferObjective(question)
  return {
    question: { ...question, lessonId },
    tags: { lessonId, lifeSituation, interest, difficulty, objective, ...conceptualReview },
  }
}

const coreEntries = lessons.flatMap((lesson) =>
  lesson.questions.map((question) => createEntry(question, lesson.id, 'shared', 'shared')),
)

const profileEntries = Object.entries(profileQuestionBank).flatMap(([lifeSituation, pool]) =>
  pool.questions.map((question) => {
    const lessonId = question.lessonId
    if (!lessonId) throw new Error(`Profilfrage ${question.id} hat keine lessonId.`)
    return createEntry(question, lessonId, lifeSituation as QuestionTags['lifeSituation'], 'shared')
  }),
)

const interestEntries = Object.entries(interestQuestionBank).flatMap(([interest, questions]) =>
  questions.map((question) => {
    const lessonId = question.lessonId
    if (!lessonId) throw new Error(`Interessenfrage ${question.id} hat keine lessonId.`)
    return createEntry(question, lessonId, 'shared', interest as QuestionTags['interest'])
  }),
)

export const questionBank: QuestionBankEntry[] = [...coreEntries, ...profileEntries, ...interestEntries]
  .filter((entry) => entry.tags.verificationStatus === 'conceptual_unverified')

export const legacyQuestionIds = [
  'business-revenue', 'business-profit-calculation', 'business-costs',
  'salary-gross', 'salary-net-calculation', 'salary-deductions',
  'spending-not-gain', 'expense-saving-calculation', 'expense-cash-flow',
  'dual-bike-sale', 'dual-bike-margin', 'dual-bike-repairs',
  'uni-card-sale', 'uni-card-margin', 'uni-card-fees',
  'employee-planter-sale', 'employee-planter-margin', 'employee-planter-delivery',
  'founder-bag-sale', 'founder-bag-margin', 'founder-bag-packaging',
  'interest-salary-payslip', 'interest-salary-side-income', 'interest-salary-budget',
  'interest-business-receipts', 'interest-business-stock', 'interest-business-cash',
  'interest-everyday-receipt', 'interest-everyday-refund', 'interest-everyday-costs',
]

export function selectQuestionsForPreferences(
  lesson: Lesson,
  preferences: LearningPreferences,
): Question[] {
  const selected = questionBank.filter((entry) =>
    entry.tags.lessonId === lesson.id &&
    (entry.tags.lifeSituation === 'shared' || entry.tags.lifeSituation === preferences.lifeSituation) &&
    (entry.tags.interest === 'shared' || entry.tags.interest === preferences.mainInterest),
  )

  const uniqueById = new Map(selected.map((entry) => [entry.question.id, entry]))
  return [...uniqueById.values()]
    .sort((left, right) => left.tags.difficulty - right.tags.difficulty || left.question.id.localeCompare(right.question.id))
    .map((entry) => ({ ...entry.question, tags: entry.tags }))
}

export function selectLearningPath(
  preferences: LearningPreferences,
  availableLessons: Lesson[] = lessons,
): Lesson[] {
  return [...availableLessons]
    .sort((left, right) => left.difficulty - right.difficulty)
    .map((lesson) => ({ ...lesson, questions: selectQuestionsForPreferences(lesson, preferences) }))
    .filter((lesson) => lesson.questions.length >= 4 && lesson.questions.length <= 6)
}
