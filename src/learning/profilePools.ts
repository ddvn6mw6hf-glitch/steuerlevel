import type { LifeSituation, Question } from './types'

type ProfilePool = {
  scenario: string
  questions: Question[]
}

export const profilePools: Record<LifeSituation, ProfilePool> = {
  'dual-apprentice': {
    scenario: 'Mira repariert in diesem erfundenen Wochenendprojekt ein gebrauchtes Fahrrad und verkauft es weiter.',
    questions: [
      {
        id: 'dual-bike-sale', type: 'choice',
        prompt: 'Mira verkauft ihr repariertes Fahrrad für 310 €. Was ist der Umsatz aus diesem Verkauf?',
        answers: ['310 €', '95 € nach dem Einkauf', 'Der Betrag nach sämtlichen Kosten'],
        correctAnswer: 0,
        explanation: 'Der Verkauf zählt mit 310 € zum Umsatz dieses Beispiels. Der Einkauf und weitere Kosten werden getrennt betrachtet, wenn du den Überschuss berechnest.',
        concept: 'Verkauf und Umsatz', funken: 10,
      },
      {
        id: 'dual-bike-margin', type: 'calculation',
        prompt: 'Wie viel bleibt nach dem Einkauf, aber vor weiteren Kosten?',
        answers: [], calculation: { prompt: 'Verkaufspreis minus Fahrradkauf', values: [{ label: 'Verkauf', amount: 310 }, { label: 'Einkauf', amount: 215 }], operation: 'subtract' },
        correctAnswer: 95,
        explanation: '310 € minus 215 € ergeben 95 €. Das ist ein Zwischenstand vor Reparaturmaterial oder anderen möglichen Kosten, nicht automatisch der endgültige Gewinn.',
        concept: 'Überschuss vor weiteren Kosten', funken: 15,
      },
      {
        id: 'dual-bike-repairs', type: 'choice',
        prompt: 'Mira kauft zusätzlich für 24 € Ersatzteile. Was bleibt nach diesen beiden Kostenposten übrig?',
        answers: ['71 € vor möglichen weiteren Kosten', '95 €, denn Ersatzteile ändern den Verkauf nicht', '334 €'],
        correctAnswer: 0,
        explanation: 'Vom Zwischenstand 95 € gehen 24 € Ersatzteile ab: 71 €. Der Umsatz bleibt 310 €; der rechnerische Überschuss und der Verkauf sind verschiedene Größen.',
        concept: 'Kosten senken den Überschuss, nicht rückwirkend den Verkaufspreis', funken: 10,
      },
    ],
  },
  university: {
    scenario: 'Noah gestaltet für ein fiktives Uni-Projekt wiederverwendbare Lernkarten-Sets und verkauft sie beim Campusmarkt.',
    questions: [
      {
        id: 'uni-card-sale', type: 'choice',
        prompt: 'Noah verkauft vier Lernkarten-Sets zu je 18 €. Was ist der Umsatz aus diesen Verkäufen?',
        answers: ['72 €', '44 € nach Materialkosten', 'Nur das Geld, das nach allen Ausgaben übrig ist'],
        correctAnswer: 0,
        explanation: 'Vier Verkäufe zu je 18 € ergeben 72 € Umsatz. Materialkosten werden erst beim Ermitteln des Überschusses berücksichtigt.',
        concept: 'Verkauf und Umsatz', funken: 10,
      },
      {
        id: 'uni-card-margin', type: 'calculation',
        prompt: 'Noah hat 72 € eingenommen und 28 € für Material bezahlt. Wie viel bleibt vor weiteren Kosten?',
        answers: [], calculation: { prompt: 'Verkaufserlöse minus Materialkosten', values: [{ label: 'Verkäufe', amount: 72 }, { label: 'Material', amount: 28 }], operation: 'subtract' },
        correctAnswer: 44,
        explanation: '72 € minus 28 € ergeben 44 €. Das ist nur der rechnerische Stand nach diesen Materialkosten; weitere Kosten könnten ihn verändern.',
        concept: 'Überschuss vor weiteren Kosten', funken: 15,
      },
      {
        id: 'uni-card-fees', type: 'choice',
        prompt: 'Für den fiktiven Markt fallen zusätzlich 9 € Standkosten an. Welche Rechnung ist sinnvoll?',
        answers: ['44 € minus 9 € = 35 € vor weiteren Kosten', 'Der Umsatz wird dadurch zu 63 €', 'Die Standkosten erhöhen den Umsatz auf 81 €'],
        correctAnswer: 0,
        explanation: 'Die Standkosten sind ein zusätzlicher Kostenposten. Sie ändern nicht die 72 € Verkaufserlöse, sondern verringern den Überschuss von 44 € auf 35 €.',
        concept: 'Zusätzliche Kosten und Umsatz auseinanderhalten', funken: 10,
      },
    ],
  },
  employee: {
    scenario: 'Samira baut in einer fiktiven Freizeitidee kleine Kräuterkästen und verkauft sie auf einem Nachbarschaftsmarkt.',
    questions: [
      {
        id: 'employee-planter-sale', type: 'choice',
        prompt: 'Samira verkauft drei Kräuterkästen für je 32 €. Wie hoch ist der Umsatz aus den Verkäufen?',
        answers: ['96 €', '51 € nach den Holzkosten', 'Der Betrag nach möglichen Steuerwirkungen'],
        correctAnswer: 0,
        explanation: 'Drei Verkäufe zu je 32 € ergeben 96 € Umsatz. Holz und andere Ausgaben werden davon getrennt betrachtet.',
        concept: 'Verkauf und Umsatz', funken: 10,
      },
      {
        id: 'employee-planter-margin', type: 'calculation',
        prompt: 'Samira hat 96 € Verkaufserlöse und 45 € Materialkosten. Wie hoch ist der Zwischenstand?',
        answers: [], calculation: { prompt: 'Verkaufserlöse minus Materialkosten', values: [{ label: 'Verkäufe', amount: 96 }, { label: 'Material', amount: 45 }], operation: 'subtract' },
        correctAnswer: 51,
        explanation: '96 € minus 45 € ergeben 51 € vor weiteren Kosten. Das Beispiel berechnet keine Steuer und sagt nichts über eine echte Nebentätigkeit aus.',
        concept: 'Überschuss vor weiteren Kosten', funken: 15,
      },
      {
        id: 'employee-planter-delivery', type: 'choice',
        prompt: 'Eine fiktive Lieferung kostet weitere 8 €. Was passiert mit dem bisherigen Zwischenstand?',
        answers: ['Er sinkt auf 43 €, während die Verkaufserlöse 96 € bleiben.', 'Die Verkaufserlöse steigen auf 104 €.', 'Die Kosten werden automatisch zurückerstattet.'],
        correctAnswer: 0,
        explanation: '51 € minus 8 € Lieferkosten ergeben 43 € vor weiteren Kosten. Der Verkaufserlös bleibt in dieser Übung 96 €; Ausgaben werden nicht automatisch erstattet.',
        concept: 'Kosten und mögliche Steuerwirkungen sind keine Verkaufserlöse', funken: 10,
      },
    ],
  },
  founder: {
    scenario: 'Alex testet in einem rein fiktiven Gründungsexperiment eine kleine Serie wiederverwendbarer Fahrradtaschen.',
    questions: [
      {
        id: 'founder-bag-sale', type: 'choice',
        prompt: 'Alex verkauft fünf Fahrradtaschen zu je 46 €. Was ergibt sich als Umsatz aus diesen Verkäufen?',
        answers: ['230 €', '140 € nach Produktionskosten', 'Nur der Betrag nach möglichen Steuerwirkungen'],
        correctAnswer: 0,
        explanation: 'Fünf Verkäufe zu je 46 € ergeben 230 € Umsatz. Die Produktionskosten sind ein eigener Rechenschritt.',
        concept: 'Verkauf und Umsatz', funken: 10,
      },
      {
        id: 'founder-bag-margin', type: 'calculation',
        prompt: 'Die kleine Testserie bringt 230 € ein; Material kostet 90 €. Was bleibt vor weiteren Kosten?',
        answers: [], calculation: { prompt: 'Verkaufserlöse minus Material für die Testserie', values: [{ label: 'Verkäufe', amount: 230 }, { label: 'Material', amount: 90 }], operation: 'subtract' },
        correctAnswer: 140,
        explanation: '230 € minus 90 € ergeben 140 € vor weiteren Kosten. Das ist ein vereinfachter Zwischenstand, keine Aussage über den steuerlichen Gewinn.',
        concept: 'Überschuss vor weiteren Kosten', funken: 15,
      },
      {
        id: 'founder-bag-packaging', type: 'choice',
        prompt: 'Alex gibt weitere 18 € für Verpackungen aus. Welche Aussage bleibt richtig?',
        answers: ['Der Zwischenstand sinkt auf 122 €; der Umsatz aus den Verkäufen bleibt 230 €.', 'Die Verpackungskosten werden zum Umsatz addiert.', 'Die 18 € machen den Verkauf automatisch profitabler.'],
        correctAnswer: 0,
        explanation: '140 € minus 18 € ergeben 122 € vor weiteren Kosten. Umsatz und Ergebnis nach Kosten bleiben unterschiedliche Größen; eine steuerliche Wirkung wird nicht berechnet.',
        concept: 'Kosten senken den Überschuss, nicht den erzielten Verkaufspreis', funken: 10,
      },
    ],
  },
}