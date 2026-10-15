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
    <LessonPath
      data={data}
      onChangeProfile={() => undefined}
      onStartLesson={() => undefined}
      onStartReview={() => undefined}
      onClearReview={() => undefined}
    />,
  )
}

describe('Freigaben im bestehenden Lernpfad', () => {
  it('zeigt den neuen Hero-, Aha- und Challenge-Bereich vor den Lektionen', () => {
    const markup = renderPath()

    expect(markup).toContain('KAPITEL 1 · STEUER-NEWBIE')
    expect(markup).toContain('HEY, STEUER-HELD!')
    expect(markup).toContain('DEIN AHA-MOMENT')
    expect(markup).toContain('Steuern sind kein Eintrittsticket.')
    expect(markup).toContain('NÄCHSTE CHALLENGE')
    expect(markup).toContain("Hast du&#x27;s wirklich verstanden?")
  })

  it('zeigt nur die erste offene Lektion als aktuell spielbar', () => {
    const markup = renderPath()
    const path = getPersonalizedLearningPath(createDefaultLearningData().preferences)

    expect(markup.match(/class="lesson-row/g)).toHaveLength(path.length)
    expect(markup.match(/aria-disabled="true"/g)).toHaveLength(path.length - 1)
    expect(markup).toContain('Jetzt spielbar')
    expect(markup).toContain('Vorherige Lektion abschließen')
  })

  it('zeigt den transparenten Fehlertrainer und trennt dessen Verlauf vom Lernfortschritt', () => {
    const markup = renderPath()
    expect(markup).toContain('Dein Fehlertrainer')
    expect(markup).toContain('Heute ist nichts fällig')
    expect(markup).toContain('Nur Fehlertrainer-Verlauf löschen')
    expect(markup).toContain('nicht Steuerfunken, Käufe oder Kapitelabschlüsse')
  })

  it('hält abgeschlossene Lektionen anklickbar und sperrt alle späteren', () => {
    const firstLessonId = getPersonalizedLearningPath(createDefaultLearningData().preferences)[0].id
    const markup = renderPath([firstLessonId])

    expect(markup).toContain('Erklärung jederzeit wiederholen')
    expect(markup.match(/aria-disabled="true"/g)).toHaveLength(5)
    expect(markup.match(/class="lesson-row lesson-complete"/g)).toHaveLength(1)
  })
})
