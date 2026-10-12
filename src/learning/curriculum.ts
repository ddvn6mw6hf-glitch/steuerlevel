import type { Lesson } from './types'

const conceptualReview = {
  sources: [],
  verificationStatus: 'conceptual_unverified' as const,
  taxYear: null,
}

export const lessons: Lesson[] = [
  {
    id: 'steuern-verstehen', difficulty: 1, topic: 'Steuern und Geldquellen',
    title: 'Steuern im Überblick', shortTitle: 'Steuern verstehen',
    subtitle: 'Gemeinsame Aufgaben und Geldquellen auseinanderhalten', icon: '◎',
    concepts: ['öffentliche Aufgaben', 'Geldquellen', 'Begriffe'],
    scenario: 'Eine fiktive Lerngruppe sortiert Begriffe rund um Geld und gemeinsame Aufgaben.',
    references: conceptualReview,
    questions: [
      {
        id: 'tax-common-purpose', lessonId: 'steuern-verstehen', type: 'choice',
        prompt: 'Wofür sind Steuern im Allgemeinen da?',
        answers: [
          'Sie helfen, gemeinsame öffentliche Aufgaben zu finanzieren.',
          'Sie sind persönliche Sparguthaben, die automatisch zurückkommen.',
          'Sie sind dasselbe wie der Verkaufserlös eines Betriebs.',
        ],
        correctAnswer: 0,
        explanation: 'Im Allgemeinen tragen Steuern zur Finanzierung gemeinsamer öffentlicher Aufgaben bei. Sie sind kein persönliches Sparkonto und kein Verkaufserlös. Diese einfache Erklärung legt keine einzelnen Zuständigkeiten oder Regeln fest.',
        concept: 'Steuern als Beitrag zu gemeinsamen Aufgaben', funken: 10,
      },
      {
        id: 'tax-separate-money-streams', lessonId: 'steuern-verstehen', type: 'choice',
        prompt: 'Eine Person bekommt Geld aus Arbeit, verkauft einen alten Stuhl und bezahlt eine Rechnung. Was hilft beim Sortieren?',
        answers: [
          'Jeden Vorgang getrennt nach Quelle und Anlass notieren.',
          'Alle Eingänge als Gewinn zusammenzählen.',
          'Annehmen, dass jeder Geldeingang dasselbe bedeutet.',
        ],
        correctAnswer: 0,
        explanation: 'Geld aus Arbeit, ein einzelner Verkauf und eine bezahlte Rechnung sind verschiedene Vorgänge. Eine getrennte Notiz hilft, sie nicht zu verwechseln; ein Eingang allein zeigt noch nicht, ob daraus ein Gewinn entstanden ist.',
        concept: 'Geldquellen und Vorgänge auseinanderhalten', funken: 10,
      },
    ],
  },
  {
    id: 'brutto-netto', difficulty: 1, topic: 'Einkommen und Abrechnung',
    title: 'Brutto ist nicht Netto', shortTitle: 'Brutto & Netto',
    subtitle: 'Eine fiktive Abrechnung lesen, ohne echte Beträge abzuleiten', icon: '＝',
    concepts: ['Brutto', 'Abzüge im Beispiel', 'Netto'],
    scenario: '{name} schaut sich eine vereinfachte Beispielabrechnung an. Die Zahlen sind erfunden.',
    references: conceptualReview,
    questions: [
      {
        id: 'salary-gross', lessonId: 'brutto-netto', type: 'choice',
        prompt: 'Auf einer fiktiven Abrechnung steht ein Betrag vor den dort gezeigten Abzügen. Was beschreibt „Brutto“ in diesem Beispiel?',
        answers: [
          'Den Betrag vor den aufgeführten Abzügen.',
          'Immer exakt den Betrag, der auf einem Konto ankommt.',
          'Den Betrag nach allen denkbaren persönlichen Ausgaben.',
        ],
        correctAnswer: 0,
        explanation: 'In dieser Beispielabrechnung bezeichnet Brutto den Betrag vor den aufgeführten Abzügen. Der Kontoeingang ist nicht automatisch identisch; private Ausgaben liegen nochmals außerhalb der Abrechnung.',
        concept: 'Bruttobetrag vor den Abzügen im Beispiel', funken: 10,
      },
      {
        id: 'salary-deductions', lessonId: 'brutto-netto', type: 'choice',
        prompt: 'Eine Beispielabrechnung zeigt einen Bruttobetrag und mehrere Abzüge. Welche Aussage erklärt „Netto“ hier am vorsichtigsten?',
        answers: [
          'Den im Beispiel nach den aufgeführten Abzügen verbleibenden Betrag.',
          'Den Betrag vor allen Abzügen.',
          'Den Betrag, den eine Person nach Miete und Einkäufen übrig hat.',
        ],
        correctAnswer: 0,
        explanation: 'Für diese vereinfachte Darstellung ist Netto der Betrag nach den ausdrücklich gezeigten Abzügen. Das ist nicht dasselbe wie verfügbares Geld nach privaten Lebenshaltungskosten; die Aufgabe berechnet keine echte Lohnabrechnung.',
        concept: 'Nettobetrag im Kontext einer vereinfachten Abrechnung', funken: 10,
      },
    ],
  },
  {
    id: 'umsatz-gewinn', difficulty: 2, topic: 'Verkauf, Kosten und Ergebnis',
    title: 'Umsatz ist nicht Gewinn', shortTitle: 'Umsatz & Gewinn',
    subtitle: 'Verkäufe, Kosten und einen vereinfachten Überschuss trennen', icon: '↗',
    concepts: ['Umsatz', 'Kosten', 'Gewinn als vereinfachter Begriff'],
    scenario: '{name} bearbeitet einen fiktiven kleinen Verkauf. Alle Beträge sind nur ein Rechenbeispiel.',
    references: conceptualReview,
    questions: [
      {
        id: 'business-revenue', lessonId: 'umsatz-gewinn', type: 'choice',
        prompt: 'Ein Fahrrad wird fiktiv für 260 € verkauft. Was ist der Umsatz aus genau diesem Verkauf?',
        answers: [
          '260 € Verkaufserlös, bevor Kosten betrachtet werden.',
          '80 €, weil das Ergebnis immer schon nach Kosten angegeben wird.',
          '180 €, weil das der Einkaufspreis ist.',
        ],
        correctAnswer: 0,
        explanation: 'Der Verkaufserlös in diesem Beispiel beträgt 260 €. Die 180 € Einkaufskosten sind ein anderer Vorgang; 80 € wäre nur die Differenz dieser beiden Beträge und noch kein vollständiges Ergebnis nach allen möglichen Kosten.',
        concept: 'Umsatz aus einem Verkauf', funken: 10,
      },
      {
        id: 'business-profit-calculation', lessonId: 'umsatz-gewinn', type: 'choice',
        prompt: 'Das Fahrrad kostete fiktiv 180 € im Einkauf und wurde für 260 € verkauft. Welcher Zwischenstand ergibt sich vor weiteren Kosten?',
        answers: ['80 €', '260 €', '440 €'],
        correctAnswer: 0,
        explanation: '260 € Verkauf minus 180 € Einkauf ergeben 80 €. Das ist eine vereinfachte Differenz vor weiteren Kosten, nicht automatisch ein steuerlicher Gewinn. 260 € wäre der Verkauf allein; 440 € addiert statt zu vergleichen.',
        concept: 'Erlös minus genannte Kosten als Zwischenstand', funken: 15,
      },
    ],
  },
  {
    id: 'belege-und-kosten', difficulty: 2, topic: 'Belege und Ausgaben',
    title: 'Belege erzählen den Zusammenhang', shortTitle: 'Belege & Kosten',
    subtitle: 'Einen Vorgang später nachvollziehen können', icon: '▤',
    concepts: ['Beleg', 'Ausgabe', 'Zusammenhang'],
    scenario: '{name} ordnet Belege zu einem fiktiven Projekt. Daraus wird keine Aussage zu einer Nachweispflicht abgeleitet.',
    references: conceptualReview,
    questions: [
      {
        id: 'business-costs', lessonId: 'belege-und-kosten', type: 'choice',
        prompt: 'Welche Aussage trennt einen Verkauf und seine möglichen Kosten am sorgfältigsten?',
        answers: [
          'Kosten können den vereinfachten Überschuss mindern, während der vereinbarte Verkaufserlös ein eigener Betrag bleibt.',
          'Kosten werden zum Umsatz hinzugezählt.',
          'Kosten ändern rückwirkend den vereinbarten Verkaufspreis.',
        ],
        correctAnswer: 0,
        explanation: 'Verkaufserlös und Kosten beschreiben verschiedene Seiten eines Vorgangs. In einer einfachen Überschussrechnung werden genannte Kosten vom Erlös unterschieden; sie machen den Verkaufspreis nicht rückwirkend größer oder kleiner.',
        concept: 'Verkaufserlös und Kosten getrennt dokumentieren', funken: 10,
      },
      {
        id: 'records-context', lessonId: 'belege-und-kosten', type: 'choice',
        prompt: 'Auf einem Beleg steht nur „Material“. Was würde die fiktive Person ergänzend notieren, damit sie den Projektbezug später besser versteht?',
        answers: [
          'Wofür das Material gekauft wurde und welchem Vorgang es zugeordnet ist.',
          'Einen beliebigen Verkaufspreis, auch wenn noch nichts verkauft wurde.',
          'Eine angenommene Steuererstattung.',
        ],
        correctAnswer: 0,
        explanation: 'Ein kurzer Kontext wie Projekt und Anlass hilft, den Beleg einer Ausgabe zuzuordnen. Ein erwarteter Verkauf ist noch kein Erlös, und ein Beleg verspricht keine Erstattung.',
        concept: 'Beleg und Anlass zusammen nachvollziehbar halten', funken: 10,
      },
    ],
  },
  {
    id: 'geldfluss-und-entscheidungen', difficulty: 3, topic: 'Liquidität und Planung',
    title: 'Ergebnis ist nicht Kontostand', shortTitle: 'Geldfluss & Planung',
    subtitle: 'Zahlungseingang, offene Beträge und Ergebnis unterscheiden', icon: '↝',
    concepts: ['Liquidität', 'Zahlungszeitpunkt', 'Ergebnis'],
    scenario: '{name} vergleicht fiktive Verkäufe, Zahlungen und Kosten in einer Planungsübung.',
    references: conceptualReview,
    questions: [
      {
        id: 'cashflow-order', lessonId: 'geldfluss-und-entscheidungen', type: 'choice',
        prompt: 'Ein fiktiver Verkauf ist vereinbart, die Zahlung soll aber erst nächste Woche eingehen. Was gilt für den heutigen Kontostand?',
        answers: [
          'Der vereinbarte Verkauf und der tatsächliche Zahlungseingang sind zeitlich verschiedene Ereignisse.',
          'Das Geld ist bereits sicher auf dem Konto.',
          'Der Verkauf wird dadurch automatisch zu einer bezahlten Ausgabe.',
        ],
        correctAnswer: 0,
        explanation: 'Ein Verkauf und ein späterer Zahlungseingang können zeitlich auseinanderliegen. Für die unmittelbare Liquidität zählt, was tatsächlich verfügbar ist; eine erwartete Zahlung ist nicht dasselbe wie vorhandenes Guthaben.',
        concept: 'Vorgang und Zahlungseingang zeitlich trennen', funken: 10,
      },
      {
        id: 'cashflow-costs', lessonId: 'geldfluss-und-entscheidungen', type: 'choice',
        prompt: 'Eine Person weist einen vereinfachten Überschuss aus, hat aber eine größere Rechnung noch nicht bezahlt. Welche Beobachtung ist sinnvoll?',
        answers: [
          'Ergebnis und tatsächliche Zahlungsfähigkeit können wegen des Zeitpunkts auseinanderliegen.',
          'Ein positiver Überschuss bedeutet immer, dass jede Rechnung schon bezahlt ist.',
          'Der Kontostand ist dasselbe wie der Verkaufserlös.',
        ],
        correctAnswer: 0,
        explanation: 'Ein vereinfachtes Ergebnis vergleicht Beträge; Liquidität betrachtet verfügbare Zahlungen zu einem Zeitpunkt. Eine offene Rechnung kann deshalb wichtig sein, auch wenn eine rechnerische Differenz positiv aussieht.',
        concept: 'Liquidität ist nicht automatisch gleich Ergebnis', funken: 10,
      },
      {
        id: 'cashflow-available-funds', lessonId: 'geldfluss-und-entscheidungen', type: 'choice',
        prompt: 'Eine fiktive Person hat heute Geld verfügbar und erwartet nächste Woche eine Zahlung. Wie plant sie eine heute fällige Ausgabe am vorsichtigsten?',
        answers: [
          'Mit dem heute verfügbaren Betrag planen und den späteren Eingang getrennt notieren.',
          'Die erwartete Zahlung so behandeln, als sei sie schon eingegangen.',
          'Den geplanten Verkauf mit dem heutigen Kontostand gleichsetzen.',
        ],
        correctAnswer: 0,
        explanation: 'Für eine heutige Zahlung ist das heute verfügbare Geld relevant. Eine erwartete spätere Zahlung kann separat geplant werden, ist aber noch kein heutiger Kassenbestand.',
        concept: 'Verfügbare Mittel und erwartete Eingänge trennen', funken: 10,
      },
    ],
  },
  {
    id: 'ausgaben-steuerersparnis', difficulty: 3, topic: 'Ausgabe und mögliche Wirkung',
    title: 'Ausgabe ist kein Gewinn', shortTitle: 'Ausgaben einordnen',
    subtitle: 'Geldabfluss von möglicher steuerlicher Wirkung trennen', icon: '↘',
    concepts: ['Ausgabe', 'mögliche Wirkung', 'Geldabfluss'],
    scenario: '{name} vergleicht in einem fiktiven Beispiel eine Ausgabe mit einer nur angenommenen möglichen Wirkung.',
    references: conceptualReview,
    questions: [
      {
        id: 'spending-not-gain', lessonId: 'ausgaben-steuerersparnis', type: 'choice',
        prompt: 'Eine fiktive Person kauft etwas für ein Projekt. Was folgt aus der Ausgabe allein?',
        answers: [
          'Zunächst ist Geld abgeflossen; eine mögliche spätere Wirkung ist ein anderer Vorgang.',
          'Die Person hat automatisch einen Gewinn in gleicher Höhe erzielt.',
          'Der volle Kaufpreis wird sicher zurückgezahlt.',
        ],
        correctAnswer: 0,
        explanation: 'Eine Zahlung ist zunächst ein Geldabfluss. Sie ist nicht automatisch Gewinn oder eine garantierte Erstattung; ob eine steuerliche Wirkung besteht, wird in diesem Lernbeispiel nicht beurteilt.',
        concept: 'Ausgabe und mögliche Steuerersparnis auseinanderhalten', funken: 10,
      },
      {
        id: 'expense-saving-calculation', lessonId: 'ausgaben-steuerersparnis', type: 'choice',
        prompt: 'Nur als fiktives Rechenmodell: Bei 90 € Ausgabe und einer angenommenen möglichen Entlastung von 12 €, welche Nettobelastung ergibt die Subtraktion?',
        answers: ['78 €', '12 €', '102 €'],
        correctAnswer: 0,
        explanation: '90 € minus 12 € ergeben 78 €. Die 12 € sind ausdrücklich nur eine erfundene Rechengröße, keine Aussage über Absetzbarkeit, Anspruch oder tatsächliche Steuerersparnis.',
        concept: 'Eine mögliche Wirkung ersetzt nicht automatisch die Ausgabe', funken: 15,
      },
    ],
  },
]
