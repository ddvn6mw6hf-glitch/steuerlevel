import type { MainInterest, Question } from './types'

export const interestPools: Record<MainInterest, Question[]> = {
  salary: [
    {
      id: 'interest-salary-payslip', type: 'choice',
      prompt: 'In einer fiktiven Abrechnung steht ein Betrag vor den aufgeführten Abzügen. Welche Bezeichnung hilft, den späteren Auszahlungsbetrag davon zu unterscheiden?',
      answers: ['Brutto und Netto', 'Umsatz und Kosten', 'Kaufpreis und Verkaufspreis'],
      correctAnswer: 0,
      explanation: 'Brutto und Netto beschreiben in diesem Lernbeispiel unterschiedliche Stellen der Abrechnung. Die Übung berechnet keine echte Auszahlung.',
      concept: 'Brutto und Netto in einer Beispielabrechnung', funken: 10,
    },
    {
      id: 'interest-salary-side-income', type: 'choice',
      prompt: 'Eine Beispielperson erhält Geld aus Arbeit und verkauft zusätzlich gelegentlich selbst gestaltete Karten. Was ist die beste erste Sortierung?',
      answers: ['Beide Geldeingänge sind automatisch derselbe Begriff.', 'Die Geldquellen getrennt notieren, bevor man sie einordnet.', 'Der Kartenverkauf wird zum Nettolohn addiert.'],
      correctAnswer: 1,
      explanation: 'Verschiedene Geldquellen sollte man zuerst auseinanderhalten. Die Aufgabe trifft keine Aussage zur steuerlichen Behandlung eines konkreten Falls.',
      concept: 'Geldquellen sauber auseinanderhalten', funken: 10,
    },
    {
      id: 'interest-salary-budget', type: 'choice',
      prompt: 'Eine fiktive Person plant ihr Monatsbudget. Welche Zahl ist für die Frage „Was steht laut Beispiel nach den Abzügen zur Verfügung?“ relevant?',
      answers: ['Der Nettobetrag der vereinfachten Beispielabrechnung', 'Der Bruttobetrag vor den Beispielabzügen', 'Der Umsatz aus einem möglichen Nebenverkauf'],
      correctAnswer: 0,
      explanation: 'Für eine vereinfachte Budgetfrage ist der im Beispiel ausgewiesene Betrag nach den angenommenen Abzügen relevant. Eine echte Abrechnung kann deutlich komplexer sein.',
      concept: 'Abrechnungsbeträge für ein Budget einordnen', funken: 15,
    },
  ],
  'side-business': [
    {
      id: 'interest-business-receipts', type: 'choice',
      prompt: 'Eine fiktive Person kauft Material für ein kleines Verkaufsprojekt. Wozu ist es beim Lernen hilfreich, den Beleg aufzubewahren?',
      answers: ['Er macht aus der Ausgabe automatisch einen Gewinn.', 'Er hilft, den Einkauf später nachzuvollziehen und mit Verkäufen zu vergleichen.', 'Er garantiert die vollständige Erstattung.'],
      correctAnswer: 1,
      explanation: 'Ein Beleg kann helfen, einen Vorgang nachvollziehbar zu halten. Er verwandelt eine Ausgabe weder in Gewinn noch in eine zugesagte Erstattung.',
      concept: 'Belege als Gedächtnisstütze für Geschäftsvorgänge', funken: 10,
    },
    {
      id: 'interest-business-stock', type: 'choice',
      prompt: 'Ein kleiner Modellbau-Nebenverkauf hat noch unverkaufte Ware. Was sollte die Beispielperson zusätzlich zu den bisherigen Verkäufen notieren?',
      answers: ['Welche Ware noch vorhanden ist und welche Kosten dafür angefallen sind.', 'Nur den erhofften späteren Verkaufspreis.', 'Die Ware als bereits verdienten Gewinn.'],
      correctAnswer: 0,
      explanation: 'Eine klare Übersicht trennt bereits erfolgte Verkäufe von noch vorhandenem Material. Ein erwarteter Preis ist noch kein Verkaufserlös.',
      concept: 'Erwartete Verkäufe und bereits erfolgte Verkäufe trennen', funken: 10,
    },
    {
      id: 'interest-business-cash', type: 'choice',
      prompt: 'Ein Kunde hat ein fiktives Produkt bestellt, bezahlt aber erst nächste Woche. Welche Aussage hält Verkauf und Geldfluss am besten auseinander?',
      answers: ['Bestellung und Zahlung sind zwei verschiedene Ereignisse.', 'Das Geld ist bereits sicher auf dem Konto.', 'Kosten und Verkaufserlös gleichen sich automatisch aus.'],
      correctAnswer: 0,
      explanation: 'Eine Bestellung kann einem Verkauf zugeordnet sein, während die Zahlung noch aussteht. Der tatsächliche Geldfluss folgt erst, wenn Geld eingeht.',
      concept: 'Geschäftsvorgang und Zahlungseingang zeitlich unterscheiden', funken: 15,
    },
  ],
  everyday: [
    {
      id: 'interest-everyday-receipt', type: 'choice',
      prompt: 'Eine fiktive Person vergleicht zwei Angebote für einen Alltagskauf. Was leistet ein Beleg in dieser Lernaufgabe am ehesten?',
      answers: ['Er hält fest, was tatsächlich gekauft und bezahlt wurde.', 'Er beweist automatisch eine Steuerersparnis.', 'Er verwandelt den Einkauf in Einnahmen.'],
      correctAnswer: 0,
      explanation: 'Ein Beleg dokumentiert den Einkauf und den gezahlten Betrag. Ob daraus in irgendeinem Fall eine steuerliche Folge entsteht, wird hier nicht beurteilt.',
      concept: 'Beleg und tatsächliche Zahlung', funken: 10,
    },
    {
      id: 'interest-everyday-refund', type: 'choice',
      prompt: 'Ein fiktiver Onlinekauf wird storniert. Welche Aussage beschreibt die Geldbewegung vorsichtig?',
      answers: ['Eine erwartete Rückzahlung ist erst dann ein Geldzufluss, wenn sie tatsächlich eingeht.', 'Die Rückzahlung ist immer sofort verfügbar.', 'Der Kauf wird dadurch zu Gewinn.'],
      correctAnswer: 0,
      explanation: 'Für den persönlichen Geldfluss zählt, wann eine Zahlung tatsächlich zurückkommt. Eine erwartete Rückzahlung ist noch kein verfügbarer Kontostand.',
      concept: 'Erwartete Rückzahlung und tatsächlichen Geldzufluss unterscheiden', funken: 10,
    },
    {
      id: 'interest-everyday-costs', type: 'choice',
      prompt: 'Eine fiktive Person spart beim Kauf 12 €, gibt für die Alternative aber insgesamt 20 € aus. Was zeigt der Vergleich?',
      answers: ['„Geld gespart“ heißt nicht automatisch, dass die gesamte Entscheidung kein Geld kostet.', 'Die Person hat 12 € verdient.', 'Die 20 € werden vollständig ausgeglichen.'],
      correctAnswer: 0,
      explanation: 'Eine Ersparnis gegenüber einer Alternative ist nicht dasselbe wie ein Einnahmeüberschuss. Für den Geldfluss zählt auch der tatsächlich gezahlte Preis.',
      concept: 'Preisnachlass und tatsächlichen Ausgabenbetrag unterscheiden', funken: 15,
    },
  ],
}