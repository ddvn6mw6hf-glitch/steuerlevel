import { describe, expect, it } from 'vitest'
import { lessons } from './content'
import { defaultPreferences, getFictionalScenario, getLessonForPreferences, getProfileFitExplanation, orderLessonsByInterest } from './scenarios'
import { difficultyLabels } from './labels'
import { questionBank } from './questionBank'

describe('Personalisierte Lernbeispiele', () => {
  it('wählt eine fiktive Person passend zu Altersgruppe und Lebenssituation', () => {
    const scenario = getFictionalScenario({
      ...defaultPreferences,
      ageGroup: '35+',
      lifeSituation: 'founder',
    }, lessons[0])

    expect(scenario).toContain('Alex')
    expect(scenario).toContain('46-jährige')
    expect(scenario).toContain('gründungsinteressierte Person')
  })

  it('stellt die Themen in der für das Interesse passenden Reihenfolge bereit', () => {
    const salaryPath = orderLessonsByInterest({ ...defaultPreferences, mainInterest: 'salary' })
    const everydayPath = orderLessonsByInterest({ ...defaultPreferences, mainInterest: 'everyday' })

    expect(salaryPath[0].id).toBe('brutto-netto')
    expect(everydayPath[0].id).toBe('ausgaben-steuerersparnis')
  })

  it('hält pro Lektion Felder für spätere Quellen- und Jahresprüfung bereit', () => {
    expect(lessons.every((lesson) =>
      lesson.references.sources.length === 0 &&
      lesson.references.verificationStatus === 'needs_review' &&
      lesson.references.taxYear === null,
    )).toBe(true)
  })

  it('enthält kurze Lektionen mit mindestens einer interaktiven Euro-Rechnung', () => {
    expect(lessons.every((lesson) =>
      lesson.questions.length >= 3 &&
      lesson.questions.length <= 5 &&
      lesson.questions.some((question) => question.type === 'calculation'),
    )).toBe(true)
  })

  it('liefert vier unterschiedliche Fünf-Fragen-Szenarien mit drei exklusiven Fragen', () => {
    const lifeSituations = ['dual-apprentice', 'university', 'employee', 'founder'] as const
    const selectedLessons = lifeSituations.map((lifeSituation) =>
      getLessonForPreferences(lessons[0], { ...defaultPreferences, lifeSituation }),
    )
    const questionSets = selectedLessons.map((lesson) => lesson.questions.map((question) => question.id).join('|'))

    expect(questionBank).toHaveLength(30)
    expect(new Set(questionSets).size).toBe(4)
    selectedLessons.forEach((lesson, index) => {
      const lifeSituation = lifeSituations[index]
      expect(lesson.questions).toHaveLength(5)
      expect(lesson.questions.filter((question) => question.tags?.lifeSituation === lifeSituation)).toHaveLength(3)
      expect(lesson.questions.some((question) => question.type === 'calculation')).toBe(true)
    })
    expect(selectedLessons[0].questions.filter((question) => selectedLessons[1].questions.some((candidate) => candidate.id === question.id))).toHaveLength(2)
  })

  it('ändert bei gleicher Lebenssituation die tatsächlichen Fragen nach Interesse', () => {
    const salary = getLessonForPreferences(lessons[0], { ...defaultPreferences, mainInterest: 'salary' })
    const everyday = getLessonForPreferences(lessons[0], { ...defaultPreferences, mainInterest: 'everyday' })
    const salaryIds = salary.questions.map((question) => question.id)
    const everydayIds = everyday.questions.map((question) => question.id)

    expect(salaryIds).not.toEqual(everydayIds)
    expect(salaryIds.filter((id) => everydayIds.includes(id))).toHaveLength(4)
    expect(salaryIds).toContain('interest-salary-payslip')
    expect(everydayIds).toContain('interest-everyday-receipt')
  })

  it('ordnet die kuratierte Geschäftslektion von Steuer-Newbie bis Steuerstratege', () => {
    const lesson = getLessonForPreferences(lessons[0], defaultPreferences)
    const tiers = lesson.questions.map((question) => question.tags?.difficulty)

    expect(tiers).toEqual([1, 1, 1, 2, 3])
    expect(difficultyLabels[1]).toBe('Steuer-Newbie')
    expect(difficultyLabels[2]).toBe('Durchblicker')
    expect(difficultyLabels[3]).toBe('Steuerstratege')
  })

  it('hält alle Bankfragen für die redaktionelle Prüfung zurück', () => {
    expect(questionBank.every(({ tags }) =>
      tags.verificationStatus === 'needs_review' &&
      tags.sources.length === 0 &&
      tags.taxYear === null &&
      Boolean(tags.objective),
    )).toBe(true)
  })

  it('ändert den Szenariokontext auch bei gleicher Lebenssituation je nach Interesse', () => {
    const lesson = lessons[0]
    const sideBusiness = getFictionalScenario({ ...defaultPreferences, mainInterest: 'side-business' }, lesson)
    const salary = getFictionalScenario({ ...defaultPreferences, mainInterest: 'salary' }, lesson)

    expect(sideBusiness).not.toBe(salary)
    expect(sideBusiness).toContain('Nebengewerbe')
    expect(salary).toContain('Lohn und Einkommen')
  })

  it('variiert fiktive Alltagsbeispiele nach Alter, ohne Rechtsaussagen abzuleiten', () => {
    const young = getLessonForPreferences(lessons[0], { ...defaultPreferences, ageGroup: '18-24' })
    const older = getLessonForPreferences(lessons[0], { ...defaultPreferences, ageGroup: '35+' })

    expect(young.questions.map((question) => question.id)).not.toEqual(older.questions.map((question) => question.id))
    expect(older.questions.map((question) => question.tags?.difficulty)).toEqual([1, 1, 2, 3, 3])
    expect(older.questions.map((question) => question.prompt).join(' ')).not.toMatch(/steuerpflichtig|Berechtigung|Schwelle/)
  })

  it('erklärt, wie Situation und Interesse die Lektionsempfehlung prägen', () => {
    const explanation = getProfileFitExplanation({ ...defaultPreferences, mainInterest: 'everyday' })
    expect(explanation).toContain('duales Studium oder Ausbildung')
    expect(explanation).toContain('Ausgaben und möglichen Steuerwirkungen')
  })
})