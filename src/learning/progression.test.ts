import { describe, expect, it } from 'vitest'
import { lessons } from './curriculum'
import { defaultPreferences, getPersonalizedLearningPath } from './scenarios'
import { getLessonAvailability, getNextLesson } from './progression'

describe('Progressiver Lernpfad', () => {
  it('öffnet zunächst nur den ersten Schritt und danach jeweils genau den nächsten', () => {
    const path = getPersonalizedLearningPath(defaultPreferences)
    expect(getLessonAvailability(path, [])).toEqual([
      'current', 'locked', 'locked', 'locked', 'locked', 'locked',
    ])

    expect(getLessonAvailability(path, [path[0].id])).toEqual([
      'completed', 'current', 'locked', 'locked', 'locked', 'locked',
    ])
    expect(getNextLesson(path, [path[0].id])?.id).toBe(path[1].id)
  })

  it('erlaubt Wiederholung und verlangt keine volle Punktzahl zum Freischalten', () => {
    const path = getPersonalizedLearningPath(defaultPreferences)
    const savedLowScore = { [path[0].id]: 0 }
    const completed = Object.keys(savedLowScore)
    const access = getLessonAvailability(path, completed)

    expect(access[0]).toBe('completed')
    expect(access[1]).toBe('current')
    expect(getNextLesson(path, completed)?.id).toBe(path[1].id)
  })

  it('markiert nur die drei bisherigen gleichnamigen Lektionen als bestehende Abschlüsse', () => {
    const legacyCompleted = ['brutto-netto', 'umsatz-gewinn', 'ausgaben-steuerersparnis']
    const access = getLessonAvailability(lessons, legacyCompleted)

    expect(lessons.filter((_, index) => access[index] === 'completed').map((lesson) => lesson.id))
      .toEqual(legacyCompleted)
    expect(lessons.find((_, index) => access[index] === 'current')?.id).toBe('steuern-verstehen')
  })

  it('lässt nach Abschluss aller Schritte alle Lektionen für Replay offen', () => {
    const access = getLessonAvailability(lessons, lessons.map((lesson) => lesson.id))
    expect(access).toEqual(Array(lessons.length).fill('completed'))
    expect(getNextLesson(lessons, lessons.map((lesson) => lesson.id))).toBeNull()
  })
})