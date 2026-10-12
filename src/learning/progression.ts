import type { Lesson } from './types'

export type LessonAvailability = 'completed' | 'current' | 'locked'

export function getLessonAvailability(
  lessons: Lesson[],
  completedLessonIds: string[],
): LessonAvailability[] {
  const completed = new Set(completedLessonIds)
  const firstIncomplete = lessons.findIndex((lesson) => !completed.has(lesson.id))

  return lessons.map((lesson, index) => {
    if (completed.has(lesson.id)) return 'completed'
    if (index === firstIncomplete) return 'current'
    return 'locked'
  })
}

export function getNextLesson(
  lessons: Lesson[],
  completedLessonIds: string[],
): Lesson | null {
  const availability = getLessonAvailability(lessons, completedLessonIds)
  const nextIndex = availability.findIndex((status) => status === 'current')
  return nextIndex === -1 ? null : lessons[nextIndex]
}