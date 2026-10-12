import type { Lesson } from './types'

const verification = {
  sources: [],
  verificationStatus: 'needs_review' as const,
  taxYear: null,
}

export const lessons: Lesson[] = [
  {
    id: 'umsatz-gewinn',
    title: 'Umsatz ist nicht Gewinn',
    shortTitle: 'Umsatz & Gewinn',
    subtitle: 'Verkäufe, Kosten und was am Ende übrig bleibt',
    icon: '↗',
    concepts: ['Umsatz', 'Einnahmen', 'Kosten', 'Gewinn'],
    scenario:
      '{name} bereitet in einem fiktiven Beispiel ein Fahrrad auf und verkauft es. Alle Beträge dienen nur als Rechenbeispiel.',
    references: verification,
    questions: [
      {
        id: 'business-revenue',
        type: 'choice',
        prompt: 'Ein Fahrrad wird für 260 € verkauft. Was ist in diesem Beispiel der Umsatz aus diesem Verkauf?',
        answers: ['260 €', '80 € nach Abzug des Einkaufspreises', '180 € Einkaufskosten'],
        correctAnswer: 0,
        explanation:
          'Der Verkaufspreis von 260 € ist der Umsatz aus diesem Verkauf. Die 180 € Einkaufskosten sind davon getrennt; erst wenn Kosten berücksichtigt werden, lässt sich ein Gewinn ermitteln.',
        concept: 'Umsatz bezeichnet hier den Wert des Verkaufs, nicht den Betrag nach Kosten.',
        funken: 10,
      },
      {
        id: 'business-profit-calculation',
        type: 'calculation',
        prompt: 'Wie viel bleibt vor weiteren Kosten übrig?',
        answers: [],
        calculation: {
          prompt: 'Verkaufspreis minus Einkaufspreis',
          values: [
            { label: 'Verkauf', amount: 260 },
            { label: 'Einkauf', amount: 180 },
          ],
          operation: 'subtract',
        },
        correctAnswer: 80,
        explanation:
          '260 € Verkauf minus 180 € Einkauf ergeben 80 €. Das ist nur der Überschuss vor weiteren möglichen Kosten, nicht automatisch der endgültige Gewinn.',
        concept: 'Kosten mindern den Überschuss; weitere Kosten können das Ergebnis verändern.',
        funken: 15,
      },
      {
        id: 'business-costs',
        type: 'choice',
        prompt: 'Welche Aussage unterscheidet Umsatz und Einnahmen am sorgfältigsten?',
        answers: [
          'Umsatz bezieht sich auf Verkäufe; „Einnahmen“ kann je nach Zusammenhang weiter gefasst sein. Gewinn berücksichtigt zusätzlich Kosten.',
          'Umsatz und Einnahmen bedeuten immer dasselbe wie Gewinn.',
          'Jeder Geldeingang ist automatisch Umsatz aus einem Verkauf.',
        ],
        correctAnswer: 0,
        explanation:
          'Umsatz ordnet hier den Wert von Verkäufen ein. „Einnahmen“ kann im allgemeinen Sprachgebrauch weitere Zuflüsse bezeichnen. Die genaue Einordnung hängt vom Zusammenhang ab; weder Begriff ist automatisch gleichbedeutend mit Gewinn oder tatsächlichem Geldfluss.',
        concept: 'Umsatz, Einnahmen und tatsächliche Geldbewegungen sind nicht austauschbare Begriffe.',
        funken: 10,
      },
    ],
  },
  {
    id: 'brutto-netto',
    title: 'Brutto ist nicht Netto',
    shortTitle: 'Brutto & Netto',
    subtitle: 'Eine fiktive Abrechnung besser einordnen',
    icon: '＝',
    concepts: ['Brutto', 'Abzüge', 'Netto'],
    scenario:
      '{name} schaut sich eine vereinfachte Beispielabrechnung an. Die Zahlen sind erfunden und keine echte Lohnberechnung.',
    references: verification,
    questions: [
      {
        id: 'salary-gross',
        type: 'choice',
        prompt: 'Auf einer Beispielabrechnung steht ein Bruttobetrag. Was beschreibt er?',
        answers: [
          'Den Betrag vor den in der Abrechnung aufgeführten Abzügen',
          'Immer genau den Betrag, der auf dem Konto ankommt',
          'Den Betrag nach allen Abzügen',
        ],
        correctAnswer: 0,
        explanation:
          'Brutto bezeichnet hier den Betrag vor den Abzügen. Netto ist der verbleibende Betrag nach den in der Abrechnung ausgewiesenen Abzügen.',
        concept: 'Brutto liegt vor, Netto nach den dargestellten Abzügen.',
        funken: 10,
      },
      {
        id: 'salary-net-calculation',
        type: 'calculation',
        prompt: 'Wie hoch ist der vereinfachte Auszahlungsbetrag in diesem erfundenen Beispiel?',
        answers: [],
        calculation: {
          prompt: 'Beispiel-Brutto minus ausdrücklich erfundene Gesamtabzüge',
          values: [
            { label: 'Beispiel-Brutto', amount: 2100 },
            { label: 'Fiktive Abzüge', amount: 475 },
          ],
          operation: 'subtract',
        },
        correctAnswer: 1625,
        explanation:
          '2.100 € minus 475 € ergeben 1.625 €. Das ist nur eine Rechenübung: Eine echte Nettoabrechnung lässt sich daraus nicht ableiten und kann weitere individuelle Faktoren enthalten.',
        concept: 'Netto ist der verbleibende Betrag nach den berücksichtigten Abzügen.',
        funken: 15,
      },
      {
        id: 'salary-deductions',
        type: 'choice',
        prompt: 'Warum sind Brutto und Netto in einer Abrechnung unterschiedlich?',
        answers: [
          'Weil der Nettobetrag nach den aufgeführten Abzügen verbleibt.',
          'Weil Brutto und Netto zwei Wörter für denselben Betrag sind.',
          'Weil das Netto immer höher als das Brutto ist.',
        ],
        correctAnswer: 0,
        explanation:
          'Die Abrechnung zeigt Abzüge zwischen Brutto und Netto. Welche Positionen gelten und wie sie berechnet werden, wird hier bewusst nicht beurteilt.',
        concept: 'Eine Abrechnung ordnet den Weg vom Brutto zum Netto nachvollziehbar auf.',
        funken: 10,
      },
    ],
  },
  {
    id: 'ausgaben-steuerersparnis',
    title: 'Ausgabe ist kein Gewinn',
    shortTitle: 'Ausgaben & Steuer',
    subtitle: 'Mögliche Entlastung von echtem Geldfluss unterscheiden',
    icon: '↘',
    concepts: ['Ausgaben', 'mögliche Steuerersparnis', 'Geldfluss'],
    scenario:
      '{name} sortiert eine Ausgabe und eine nur beispielhaft angenommene mögliche Entlastung. Daraus folgt keine Aussage zur tatsächlichen Absetzbarkeit.',
    references: verification,
    questions: [
      {
        id: 'spending-not-gain',
        type: 'choice',
        prompt: 'Eine Person gibt Geld für etwas aus, das möglicherweise steuerlich relevant ist. Was folgt daraus sicher?',
        answers: [
          'Die Ausgabe wird vollständig erstattet.',
          'Die Ausgabe kostet zunächst Geld; eine mögliche Entlastung ist davon zu unterscheiden.',
          'Die Ausgabe wird automatisch zum Gewinn.',
        ],
        correctAnswer: 1,
        explanation:
          'Eine Ausgabe ist zunächst ein Geldabfluss. Eine mögliche Steuerersparnis ist weder eine automatische Erstattung noch gleich hoch wie die Ausgabe.',
        concept: 'Eine Ausgabe macht nicht automatisch reicher.',
        funken: 10,
      },
      {
        id: 'expense-saving-calculation',
        type: 'calculation',
        prompt: 'In einem rein fiktiven Rechenmodell: Wie viel bleibt als Nettobelastung?',
        answers: [],
        calculation: {
          prompt: 'Ausgabe minus nur beispielhaft angenommene mögliche Entlastung',
          values: [
            { label: 'Ausgabe', amount: 90 },
            { label: 'Fiktive Entlastung', amount: 12 },
          ],
          operation: 'subtract',
        },
        correctAnswer: 78,
        explanation:
          '90 € Ausgabe minus 12 € nur beispielhaft angenommene Entlastung lassen 78 € Nettobelastung. Die 12 € sind keine echte Steuerberechnung oder Zusage.',
        concept: 'Eine mögliche Entlastung kann einen Teil ausgleichen, nicht automatisch die gesamte Ausgabe.',
        funken: 15,
      },
      {
        id: 'expense-cash-flow',
        type: 'choice',
        prompt: 'Was sagt der Geldfluss im Beispiel mit 90 € Ausgabe und möglicher Entlastung von 12 €?',
        answers: [
          'Es fließen nur 78 € ab, weil die mögliche Entlastung sofort die Zahlung ersetzt.',
          'Die Ausgabe beträgt 90 €; die mögliche Entlastung von 12 € ist ein getrennter, unsicherer Vorgang.',
          'Die Person hat durch die Ausgabe 90 € verdient.',
        ],
        correctAnswer: 1,
        explanation:
          'Die Zahlung von 90 € und eine mögliche spätere Entlastung sind zwei getrennte Geldbewegungen. Zeitpunkt und tatsächliche steuerliche Wirkung werden hier nicht vorausgesetzt.',
        concept: 'Cashflow berücksichtigt tatsächliche Ein- und Auszahlungen, einschließlich ihres Zeitpunkts.',
        funken: 10,
      },
    ],
  },
]