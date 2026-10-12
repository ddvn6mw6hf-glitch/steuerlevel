import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import LessonPath from './LessonPath'
import { createDefaultLearningData } from '../learning/storage'
import { getPersonalizedLearningPath } from '../learning/scenarios'

function renderPath(completedLessonIds: string[] = []) {
  const data = createDefaultLearningData()
  data.onboardingComplete = true
  data.progress.completedLessonIds = completedLessonIds
  return renderToStaticMarkup(
    <LessonPath data={data} onChangeProfile={() => undefined} onStartLesson={() => undefined} />,
  )
}

describe('Freigaben im bestehenden Lernpfad', () => {
  it('zeigt nur die erste offene Lektion als aktuell spielbar', () => {
    const markup = renderPath()
    const path = getPersonalizedLearningPath(createDefaultLearningData().preferences)

    expect(markup.match(/class="lesson-row/g)).toHaveLength(path.length)
    expect(markup.match(/aria-disabled="true"/g)).toHaveLength(path.length - 1)
    expect(markup).toContain('Jetzt spielbar')
    expect(markup).toContain('Vorherige Lektion abschließen')
  })

  it('hält abgeschlossene Lektionen anklickbar und sperrt alle späteren', () => {
    const firstLessonId = getPersonalizedLearningPath(createDefaultLearningData().preferences)[0].id
    const markup = renderPath([firstLessonId])

    expect(markup).toContain('Erklärung jederzeit wiederholen')
    expect(markup.match(/aria-disabled="true"/g)).toHaveLength(4)
    expect(markup.match(/class="lesson-row lesson-complete"/g)).toHaveLength(1)
  })
})
