import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import QuestionCard from '../components/QuestionCard'
import { lessons } from './curriculum'
import { getAnswerChoices, getCorrectAnswerId } from './answerChoices'
import { getAnswerFeedback } from './feedback'
import { defaultPreferences, getPersonalizedLearningPath } from './scenarios'
import { getLessonAvailability } from './progression'

const introLessonId = 'wer-kassiert-hier-eigentlich'

describe('Einstiegskapitel: Wer kassiert hier eigentlich?', () => {
  const introLesson = lessons.find((lesson) => lesson.id === introLessonId)

  it('steht für alle Lernprofile vor den vorhandenen Kapiteln und sperrt den nächsten Schritt', () => {
    for (const lifeSituation of ['dual-apprentice', 'university', 'employee', 'founder'] as const) {
      for (const mainInterest of ['salary', 'side-business', 'everyday'] as const) {
        const path = getPersonalizedLearningPath({ ...defaultPreferences, lifeSituation, mainInterest })
        expect(path[0].id).toBe(introLessonId)
        expect(path).toHaveLength(7)
        expect(getLessonAvailability(path, [])[1]).toBe('locked')
        expect(getLessonAvailability(path, [introLessonId])[1]).toBe('current')
      }
    }
  })

  it('enthält fünf aufbauende Steuergrundlagen mit Quellenhinweisen und ungeprüftem Fachstatus', () => {
    expect(introLesson).toBeDefined()
    expect(introLesson?.questions).toHaveLength(5)
    expect(introLesson?.questions.map((question) => question.difficulty)).toEqual([1, 1, 2, 2, 3])
    expect(new Set(introLesson?.questions.map((question) => question.concept)).size).toBe(5)
    expect(introLesson?.questions.map((question) => question.concept)).toEqual([
      'Grunddefinition einer Steuer nach § 3 Abs. 1 AO',
      'Steuern finanzieren öffentliche Aufgaben',
      'Einkommensteuer und Umsatzsteuer im Alltag unterscheiden',
      'Steuern und Sozialversicherungsbeiträge unterscheiden',
      'Mini-Boss: Abgaben im fiktiven Alltag sortieren',
    ])

    const playableQuestions = getPersonalizedLearningPath(defaultPreferences)[0].questions
    expect(playableQuestions.map((question) => question.id))
      .toEqual(introLesson?.questions.map((question) => question.id))
    for (const question of playableQuestions) {
      expect(question.teachingText).toBeTruthy()
      expect(question.retryOnIncorrect).toBe(true)
      expect(question.sources?.length).toBeGreaterThan(0)
      expect(question.tags?.verificationStatus).toBe('conceptual_unverified')
      expect(question.tags?.sources).toEqual(question.sources)
      expect(question.type).toBe('choice')
      expect(question.answers).toHaveLength(3)
      expect(new Set(question.answers).size).toBe(3)
      expect(question.answers.every((answer) => !question.teachingText?.includes(answer))).toBe(true)
    }
    expect(playableQuestions.map((question) => question.prompt)).toEqual(expect.arrayContaining([
      expect.stringContaining('Schwimmbad'),
      expect.stringContaining('Bücherei'),
      expect.stringContaining('Kassenbon'),
      expect.stringContaining('Krankenversicherung'),
      expect.stringContaining('Lampe'),
    ]))
    expect(introLesson?.questions[0].sources?.[0].title).toContain('§ 3 Abs. 1')
  })

  it('prüft in allen fünf Challenges Steuerbegriffe und mischt richtige Antworten über A, B und C', () => {
    const questions = getPersonalizedLearningPath(defaultPreferences)[0].questions
    const correctLetters = new Set(
      questions.map((question) => {
        const choices = getAnswerChoices(question)
        const correctIndex = choices.findIndex((choice) => choice.id === getCorrectAnswerId(question))
        return String.fromCharCode(65 + correctIndex)
      }),
    )

    expect(questions[0].prompt).toContain('gesetzlich')
    expect(questions[1].prompt).toContain('Steuerzahlung')
    expect(questions[2].prompt).toContain('Umsatzsteuer')
    expect(questions[3].prompt).toContain('Krankenversicherung')
    expect(questions[4].prompt).toContain('Einkommensteuer')
    expect(questions[4].prompt).toContain('Rentenversicherungsbeitrag')
    expect(correctLetters).toEqual(new Set(['A', 'B', 'C']))
  })

  it('hält die Erklärung aus der Challenge-Ansicht heraus und bietet einen optionalen Tipp', () => {
    const question = getPersonalizedLearningPath(defaultPreferences)[0].questions[0]
    const markup = renderToStaticMarkup(
      <QuestionCard
        question={question}
        questionNumber={1}
        questionCount={5}
        response={null}
        onAnswer={() => undefined}
        onContinue={() => undefined}
      />,
    )

    expect(markup).toContain(question.prompt)
    expect(markup).not.toContain(question.teachingText ?? '')
    expect(markup).toContain('Tipp anzeigen')
    expect(markup).not.toContain('QUELLENHINWEISE')
  })

  it('zeigt bei richtiger und falscher Auswahl getrennte, fachlich begründete Rückmeldungen', () => {
    const question = getPersonalizedLearningPath(defaultPreferences)[0].questions[0]
    const correctId = getCorrectAnswerId(question)
    const wrongId = getAnswerChoices(question).find((choice) => choice.id !== correctId)?.id
    expect(wrongId).toBeDefined()

    const correctMarkup = renderToStaticMarkup(
      <QuestionCard
        question={question}
        questionNumber={1}
        questionCount={5}
        response={{ value: correctId, correct: true, funkenAwarded: 10 }}
        onAnswer={() => undefined}
        onContinue={() => undefined}
      />,
    )
    const incorrectMarkup = renderToStaticMarkup(
      <QuestionCard
        question={question}
        questionNumber={1}
        questionCount={5}
        response={{ value: wrongId!, correct: false, funkenAwarded: 0 }}
        onAnswer={() => undefined}
        onContinue={() => undefined}
      />,
    )

    expect(correctMarkup).toContain(getAnswerFeedback(question, true).headline)
    expect(correctMarkup).toContain(question.explanation)
    expect(correctMarkup).toContain('Weiter')
    expect(incorrectMarkup).toContain(getAnswerFeedback(question, false).headline)
    expect(incorrectMarkup).toContain(question.explanation)
    expect(incorrectMarkup).toContain('Weiter')
  })
})
