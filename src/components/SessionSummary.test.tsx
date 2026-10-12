import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import SessionSummary from './SessionSummary'
import { getCelebrationLine, getCelebrationLineCount } from '../learning/celebration'
import { lessons } from '../learning/content'
import { defaultPreferences } from '../learning/scenarios'
import { createQuizSession, submitAnswer, advanceSession } from '../quiz'

describe('Feieransicht', () => {
  it('zeigt die tatsächliche Session-Belohnung und eine zugängliche, nicht-modale Weiter-Aktion', () => {
    const lesson = lessons[0]
    let session = createQuizSession(lesson)
    for (const question of lesson.questions) {
      session = submitAnswer(session, question, question.correctAnswer, []).session
      session = advanceSession(session, lesson) ?? session
    }

    const markup = renderToStaticMarkup(
      <SessionSummary
        lesson={lesson}
        session={session}
        totalFunken={session.earnedFunken + 40}
        preferences={defaultPreferences}
        completedLessonIds={[lesson.id]}
        onReplay={() => undefined}
        onStartNext={() => undefined}
        onBackToPath={() => undefined}
      />,
    )

    expect(markup).toContain('role="region" aria-label="Lektionsfeier"')
    expect(markup).toContain(`+${session.earnedFunken}`)
    expect(markup).toContain('Lernpunkte ohne Geldwert')
    expect(markup).toContain('Weiter:')
    expect(markup).toContain('aria-label="Zurück zum Lernpfad"')
    expect(markup).not.toContain('aria-modal="true"')
  })

  it('rotiert aus mehreren nicht-rechtlichen Lernwitzen deterministisch', () => {
    const messages = Array.from({ length: getCelebrationLineCount() }, (_, index) => getCelebrationLine(index))
    expect(new Set(messages).size).toBeGreaterThan(4)
    expect(messages.every((message) => getCelebrationLine(messages.indexOf(message)) === message)).toBe(true)
    expect(messages.join(' ')).not.toMatch(/Steuer erstattet|Finanzamt besiegt/)
  })
})