import { describe, expect, it } from 'vitest'
import { lessons } from './curriculum'
import { draftQuestions } from './draftQuestions'
import { formatProfileQuestionDiagnostic } from './diagnostic'
import { difficultyLabels } from './labels'
import { questionBank } from './questionBank'
import { defaultPreferences, getFictionalScenario, getPersonalizedLearningPath, getProfileFitExplanation } from './scenarios'
import type { LifeSituation, MainInterest } from './types'

const profiles: LifeSituation[] = ['dual-apprentice', 'university', 'employee', 'founder']
const interests: MainInterest[] = ['salary', 'side-business', 'everyday']

describe('Profilbasierter Lernpfad', () => {
  it('enthält mindestens 36 eindeutige spielbare Fragen mit je 3–4 Antworten', () => {
    const ids = questionBank.map(({ question }) => question.id)
    expect(new Set(ids).size).toBeGreaterThanOrEqual(36)
    expect(questionBank).toHaveLength(54)
    expect(questionBank.every(({ question }) =>
      question.type === 'choice' &&
      question.answers.length >= 3 && question.answers.length <= 4 &&
      question.correctAnswer >= 0 && question.correctAnswer < question.answers.length &&
      question.explanation.trim().length > 40,
    )).toBe(true)
  })

  it('enthält mindestens sechs nur für das jeweilige Profil ausgewählte Fragen', () => {
    const exclusiveIds = profiles.map((lifeSituation) => {
      const path = getPersonalizedLearningPath({ ...defaultPreferences, lifeSituation })
      return path.flatMap((lesson) => lesson.questions)
        .filter((question) => question.tags?.lifeSituation === lifeSituation)
        .map((question) => question.id)
    })

    expect(exclusiveIds.map((ids) => ids.length)).toEqual([6, 6, 6, 6])
    for (let left = 0; left < exclusiveIds.length; left += 1) {
      for (let right = left + 1; right < exclusiveIds.length; right += 1) {
        expect(exclusiveIds[left].some((id) => exclusiveIds[right].includes(id))).toBe(false)
      }
    }
  })

  it('ändert zwischen Angestellten- und Gründungsprofil mehrere Frage-IDs und Themen', () => {
    const employeePath = getPersonalizedLearningPath({ ...defaultPreferences, lifeSituation: 'employee' })
    const founderPath = getPersonalizedLearningPath({ ...defaultPreferences, lifeSituation: 'founder' })
    const employeeQuestions = employeePath.flatMap((lesson) => lesson.questions)
    const founderQuestions = founderPath.flatMap((lesson) => lesson.questions)
    const founderIds = new Set(founderQuestions.map((question) => question.id))

    expect(employeeQuestions.filter((question) => !founderIds.has(question.id))).toHaveLength(6)
    expect(new Set(employeeQuestions.map((question) => question.concept)))
      .not.toEqual(new Set(founderQuestions.map((question) => question.concept)))
  })

  it('ändert bei gleichem Profil die Interessenfragen-IDs und Lernziele', () => {
    const selections = interests.map((mainInterest) => {
      const path = getPersonalizedLearningPath({ ...defaultPreferences, mainInterest })
      return path.flatMap((lesson) => lesson.questions)
        .filter((question) => question.tags?.interest === mainInterest)
    })

    expect(selections.map((questions) => questions.map((question) => question.id))).toEqual([
      expect.arrayContaining(['interest-salary-tax-purpose', 'interest-salary-planning']),
      expect.arrayContaining(['interest-business-sources', 'interest-business-spending']),
      expect.arrayContaining(['interest-everyday-purpose', 'interest-everyday-costs']),
    ])
    expect(new Set(selections.map((questions) => questions.map((question) => question.concept).join('|'))).size).toBe(3)
  })

  it('liefert sechs Lektionen mit je vier Fragen und ohne Duplikate im Lernpfad', () => {
    profiles.forEach((lifeSituation) => {
      interests.forEach((mainInterest) => {
        const path = getPersonalizedLearningPath({ ...defaultPreferences, lifeSituation, mainInterest })
        const ids = path.flatMap((lesson) => lesson.questions.map((question) => question.id))

        expect(path).toHaveLength(6)
        expect(path.every((lesson) => lesson.questions.length === 4)).toBe(true)
        expect(new Set(ids).size).toBe(ids.length)
      })
    })
  })

  it('sortiert in zwei Lektionen je Stufe von Newbie bis Steuerstratege', () => {
    expect(lessons.map((lesson) => lesson.difficulty)).toEqual([1, 1, 2, 2, 3, 3])
    expect(difficultyLabels).toEqual({ 1: 'Steuer-Newbie', 2: 'Durchblicker', 3: 'Steuerstratege' })
    const path = getPersonalizedLearningPath(defaultPreferences)
    expect(path.map((lesson) => lesson.difficulty)).toEqual([1, 1, 2, 2, 3, 3])
  })

  it('ändert mit dem Alter nur die fiktive Szene, nicht Fragen oder steuerliche Einordnung', () => {
    const young = { ...defaultPreferences, ageGroup: '18-24' as const }
    const older = { ...defaultPreferences, ageGroup: '35+' as const }
    expect(getFictionalScenario(young, lessons[0])).not.toBe(getFictionalScenario(older, lessons[0]))
    expect(getPersonalizedLearningPath(young).flatMap((lesson) => lesson.questions.map((question) => question.id)))
      .toEqual(getPersonalizedLearningPath(older).flatMap((lesson) => lesson.questions.map((question) => question.id)))
  })

  it('behält frühere passende Abschlüsse bei und führt neue Lektionen nicht als abgeschlossen ein', () => {
    const oldCompleted = ['brutto-netto', 'umsatz-gewinn', 'ausgaben-steuerersparnis']
    const newLessonIds = lessons.filter((lesson) => !oldCompleted.includes(lesson.id)).map((lesson) => lesson.id)
    expect(lessons.filter((lesson) => oldCompleted.includes(lesson.id))).toHaveLength(3)
    expect(newLessonIds).toEqual(['steuern-verstehen', 'belege-und-kosten', 'geldfluss-und-entscheidungen'])
    expect(newLessonIds.some((id) => oldCompleted.includes(id))).toBe(false)
  })

  it('hält rechtlich konkrete Inhalte außerhalb der spielbaren Bank, bis amtliche Prüfung möglich ist', () => {
    const playableIds = new Set(questionBank.map(({ question }) => question.id))
    expect(draftQuestions.length).toBeGreaterThanOrEqual(5)
    expect(draftQuestions.every((entry) =>
      entry.status === 'needs_official_review' &&
      entry.playable === false &&
      entry.sourcesActuallyChecked.length === 0 &&
      entry.applicableTaxYear === null &&
      !playableIds.has(entry.question.id),
    )).toBe(true)
    expect(questionBank.every(({ tags }) =>
      tags.verificationStatus === 'conceptual_unverified' && tags.sources.length === 0 && tags.taxYear === null,
    )).toBe(true)
  })

  it('erklärt die Profilpassung und gibt einen Entwicklerbericht mit IDs und Themen aus', () => {
    expect(getProfileFitExplanation({ ...defaultPreferences, mainInterest: 'everyday' })).toContain('Alltags')
    const diagnostic = formatProfileQuestionDiagnostic({ ...defaultPreferences, mainInterest: 'salary' })
    for (const profile of profiles) expect(diagnostic).toContain(profile)
    expect(diagnostic).toContain('employee-planter-plan')
    expect(diagnostic).toContain('founder-bag-batch')
    expect(diagnostic).toContain('Einkommen und Abrechnung')
  })
})
