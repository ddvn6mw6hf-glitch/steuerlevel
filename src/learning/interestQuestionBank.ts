import type { MainInterest, Question } from './types'
import { interestPools } from './interestPools'

const authoredInterestQuestions: Record<MainInterest, Question[]> = {
  salary: [
    {
      id: 'interest-salary-tax-purpose', lessonId: 'steuern-verstehen', type: 'choice',
      prompt: 'Eine fiktive Person sieht auf einer Abrechnung mehrere Zeilen. Was hilft ihr beim Lernen am meisten?',
      answers: ['Zeilen nach ihrer Bezeichnung und Funktion getrennt betrachten.', 'Alle Zeilen als denselben Nettobetrag behandeln.', 'Abzüge als private Einkäufe sortieren.'], correctAnswer: 0,
      explanation: 'Eine Abrechnung wird verständlicher, wenn unterschiedliche Zeilen getrennt betrachtet werden. Die anderen Antworten setzen verschiedene Dinge gleich; aus der Übung folgt keine Rechtsauskunft.',
      concept: 'Abrechnungszeilen lesen', funken: 10,
    },
    {
      id: 'interest-salary-gross-net', lessonId: 'brutto-netto', type: 'choice',
      prompt: 'Eine Beispielabrechnung zeigt Brutto und einen späteren Auszahlungsbetrag. Welche Rechnung beschreibt den dargestellten Ablauf?',
      answers: ['Der angezeigte spätere Betrag folgt nach den in diesem Beispiel gezeigten Abzügen.', 'Brutto ist immer genau der Kontoeingang.', 'Netto ist der Betrag nach Miete und Lebensmitteleinkauf.'], correctAnswer: 0,
      explanation: 'Die Aufgabe bezieht sich nur auf die dargestellten Abzüge. Private Ausgaben liegen danach; Brutto und Kontoeingang sind nicht automatisch dasselbe.',
      concept: 'Abrechnung und Haushaltsbudget unterscheiden', funken: 10,
    },
    {
      id: 'interest-salary-side-income', lessonId: 'umsatz-gewinn', type: 'choice',
      prompt: 'Eine Person bekommt Geld aus Arbeit und verkauft gelegentlich selbst gestaltete Karten. Was ist der beste erste Sortierschritt?',
      answers: ['Die Quellen getrennt notieren, bevor sie verglichen werden.', 'Beide Eingänge automatisch als denselben Lohn bezeichnen.', 'Den Kartenverkauf zum Nettolohn addieren und als ein Vorgang behandeln.'], correctAnswer: 0,
      explanation: 'Die Geldquellen haben unterschiedliche Anlässe. Sie erst zu trennen hilft beim Verständnis; die anderen Optionen vermischen Lohn, Verkauf und private Planung.',
      concept: 'Arbeitseinkommen und Verkaufserlös nicht vermischen', funken: 10,
    },
    {
      id: 'interest-salary-documents', lessonId: 'belege-und-kosten', type: 'choice',
      prompt: 'Eine fiktive Person bewahrt eine Abrechnung und einen Kassenbon auf. Was ist eine gute Sortierung?',
      answers: ['Beide Dokumente getrennt nach Quelle und Anlass ablegen.', 'Den Kassenbon als Lohnabrechnung behandeln.', 'Die Abrechnung als Beleg für einen privaten Einkauf verwenden.'], correctAnswer: 0,
      explanation: 'Unterschiedliche Dokumente belegen unterschiedliche Vorgänge. Sie getrennt zu halten vermeidet Verwechslungen; eine Bezeichnung ersetzt nicht den tatsächlichen Inhalt.',
      concept: 'Abrechnung und Einkaufsbeleg zuordnen', funken: 10,
    },
    {
      id: 'interest-salary-budget-flow', lessonId: 'geldfluss-und-entscheidungen', type: 'choice',
      prompt: 'Ein Abrechnungsbetrag wird erst am Monatsende überwiesen. Was sollte eine Person für einen heutigen Kontostand berücksichtigen?',
      answers: ['Ob die Überweisung tatsächlich schon eingegangen ist.', 'Den erwarteten Betrag bereits als vorhandenes Guthaben zählen.', 'Den Bruttobetrag als frei verfügbares Bargeld behandeln.'], correctAnswer: 0,
      explanation: 'Ein erwarteter Zahlungstermin und ein heutiger Kontostand sind zeitlich verschieden. Der Kontostand beschreibt tatsächlich verfügbare Mittel, nicht einen geplanten oder vorgelagerten Betrag.',
      concept: 'Zahlungszeitpunkt beim Monatsbudget', funken: 10,
    },
    {
      id: 'interest-salary-planning', lessonId: 'ausgaben-steuerersparnis', type: 'choice',
      prompt: 'Eine Person vergleicht einen Betrag aus einer fiktiven Abrechnung mit einer privaten Ausgabe. Was vermeidet einen Denkfehler?',
      answers: ['Abrechnungsbetrag und private Ausgabe als getrennte Größen betrachten.', 'Die private Ausgabe als automatische Verringerung jeder Abrechnungszeile ansehen.', 'Aus der Ausgabe einen sicheren Geldrückfluss ableiten.'], correctAnswer: 0,
      explanation: 'Abrechnung und private Haushaltsentscheidung gehören zu unterschiedlichen Rechenschritten. Eine Ausgabe führt nicht automatisch zu einer Erstattung oder zu einer bestimmten Abrechnungsänderung.',
      concept: 'Haushaltsausgabe und Abrechnungswert trennen', funken: 10,
    },
  ],
  'side-business': [
    {
      id: 'interest-business-sources', lessonId: 'steuern-verstehen', type: 'choice',
      prompt: 'Eine Person startet ein kleines Verkaufsprojekt neben einer anderen Geldquelle. Was ist beim Sortieren der ersten Beträge sinnvoll?',
      answers: ['Projektvorgänge mit eigenem Anlass getrennt festhalten.', 'Jeden Eingang automatisch als Verkauf zählen.', 'Private und projektbezogene Zahlungen zu einer Zahl zusammenziehen.'], correctAnswer: 0,
      explanation: 'Ein eigener Projektüberblick bewahrt den Zusammenhang einzelner Vorgänge. Nicht jeder Geldeingang stammt aus einem Verkauf; das Zusammenziehen verschleiert die Quelle.',
      concept: 'Projektvorgänge nach Quelle sortieren', funken: 10,
    },
    {
      id: 'interest-business-payment-separation', lessonId: 'brutto-netto', type: 'choice',
      prompt: 'Ein fiktiver Auftraggeber überweist den Betrag für ein Projekt getrennt von einer privaten Abrechnung. Was sollte in der Übersicht passieren?',
      answers: ['Die beiden Zahlungsvorgänge nach ihrer Quelle getrennt erfassen.', 'Beide als Nettolohn benennen.', 'Den Projektbetrag ohne Zahlungseingang als Kontostand notieren.'], correctAnswer: 0,
      explanation: 'Eine private Abrechnung und eine Projektzahlung haben unterschiedliche Kontexte. Die Zahlung sollte als Projektvorgang erfasst werden, sobald sie tatsächlich eingeht; sie ist nicht automatisch Lohn.',
      concept: 'Projektzahlung und Abrechnung unterscheiden', funken: 10,
    },
    {
      id: 'interest-business-stock', lessonId: 'umsatz-gewinn', type: 'choice',
      prompt: 'Ein kleiner Modellbau-Nebenverkauf hat noch unverkaufte Ware. Was sollte die Übersicht neben bisherigen Verkäufen enthalten?',
      answers: ['Welche Ware noch vorhanden ist und welche Kosten dafür angefallen sind.', 'Nur den erhofften späteren Verkaufspreis.', 'Die Ware als bereits verdienten Gewinn.'], correctAnswer: 0,
      explanation: 'Eine Übersicht trennt tatsächliche Verkäufe von vorhandenem Bestand und Kosten. Ein erhoffter Preis ist noch kein Erlös; unverkaufte Ware ist nicht automatisch verdienter Gewinn.',
      concept: 'Bestand und tatsächliche Verkäufe auseinanderhalten', funken: 10,
    },
    {
      id: 'interest-business-receipts', lessonId: 'belege-und-kosten', type: 'choice',
      prompt: 'Eine Person kauft Material für ein kleines Verkaufsprojekt. Wozu ist ein Beleg beim späteren Lernen hilfreich?',
      answers: ['Er hilft, den Einkauf nachzuvollziehen und mit dem Projekt zu verbinden.', 'Er macht aus der Ausgabe automatisch einen Gewinn.', 'Er garantiert eine vollständige Rückzahlung.'], correctAnswer: 0,
      explanation: 'Ein Beleg kann helfen, einen Einkauf und seinen Zusammenhang wiederzuerkennen. Er verwandelt die Ausgabe weder in Gewinn noch in eine zugesagte Erstattung.',
      concept: 'Belege als Projektnachvollzug', funken: 10,
    },
    {
      id: 'interest-business-order-flow', lessonId: 'geldfluss-und-entscheidungen', type: 'choice',
      prompt: 'Ein Kunde hat ein fiktives Produkt bestellt, bezahlt aber erst nächste Woche. Welche Aussage trennt Verkauf und Geldfluss?',
      answers: ['Bestellung und Zahlung sind zwei verschiedene Ereignisse.', 'Das Geld ist bereits sicher auf dem Konto.', 'Kosten und Verkaufserlös gleichen sich automatisch aus.'], correctAnswer: 0,
      explanation: 'Eine Bestellung kann zu einem Verkauf gehören, während die Zahlung noch aussteht. Der tatsächliche Geldfluss folgt erst mit dem Eingang; offene Kosten gleichen sich nicht automatisch aus.',
      concept: 'Geschäftsvorgang und Zahlungseingang trennen', funken: 10,
    },
    {
      id: 'interest-business-spending', lessonId: 'ausgaben-steuerersparnis', type: 'choice',
      prompt: 'Eine Gründerin erwägt ein teureres Gerät, weil es die Arbeit erleichtern könnte. Welche Überlegung ist unabhängig von Steuerfragen sinnvoll?',
      answers: ['Preis, erwartete Nutzung und verfügbares Geld gemeinsam abwägen.', 'Annehmen, die Ausgabe koste nachher nichts.', 'Das Gerät als sofortige Einnahme verbuchen.'], correctAnswer: 0,
      explanation: 'Eine wirtschaftliche Entscheidung kann Preis, Nutzen und verfügbares Geld vergleichen, ohne eine steuerliche Wirkung vorauszusetzen. Eine Ausgabe bleibt zunächst ein Geldabfluss, kein Erlös.',
      concept: 'Projektentscheidung ohne angenommene Steuerwirkung', funken: 10,
    },
  ],
  everyday: [
    {
      id: 'interest-everyday-purpose', lessonId: 'steuern-verstehen', type: 'choice',
      prompt: 'Beim Lernen über Geld sieht eine Person mehrere unterschiedliche Zahlungsvorgänge. Was macht eine Übersicht verständlicher?',
      answers: ['Für jeden Betrag Quelle und Anlass notieren.', 'Jede Bewegung als Einkommen bezeichnen.', 'Ausgaben und Einnahmen ohne Datum zusammenwerfen.'], correctAnswer: 0,
      explanation: 'Quelle, Anlass und Zeitpunkt helfen, verschiedene Vorgänge zu unterscheiden. Die anderen Optionen geben Zahlungen ungeachtet ihres Zusammenhangs denselben Namen.',
      concept: 'Alltägliche Geldbewegungen benennen', funken: 10,
    },
    {
      id: 'interest-everyday-payments', lessonId: 'brutto-netto', type: 'choice',
      prompt: 'Eine Person vergleicht einen Abrechnungsbetrag mit dem Guthaben auf ihrem Konto. Was kann erklären, warum die Zahlen nicht gleich sind?',
      answers: ['Zwischen Abrechnung und Kontostand können weitere Buchungen oder Zeitpunkte liegen.', 'Der Kontostand muss immer dem Bruttobetrag entsprechen.', 'Private Ausgaben sind bereits Teil des Bruttobetrags.'], correctAnswer: 0,
      explanation: 'Abrechnung und Kontostand beschreiben unterschiedliche Informationsstände. Zeitpunkt und andere Buchungen können eine Rolle spielen; die anderen Antworten setzen sie fälschlich gleich.',
      concept: 'Abrechnungswert und Kontostand unterscheiden', funken: 10,
    },
    {
      id: 'interest-everyday-saving', lessonId: 'umsatz-gewinn', type: 'choice',
      prompt: 'Eine fiktive Person verkauft ein gebrauchtes Möbelstück und kauft später ein anderes. Was hält die Vorgänge am klarsten auseinander?',
      answers: ['Verkaufserlös und neuen Kauf als zwei getrennte Geldbewegungen notieren.', 'Den Verkauf automatisch als Gewinn behandeln.', 'Den neuen Kaufpreis zum Verkaufserlös addieren.'], correctAnswer: 0,
      explanation: 'Verkauf und späterer Kauf sind zwei getrennte Bewegungen. Ein Verkaufserlös allein zeigt nicht alle Kosten oder den gesamten finanziellen Vorteil; Addieren beantwortet die Frage nicht.',
      concept: 'Verkauf und späteren Kauf getrennt betrachten', funken: 10,
    },
    {
      id: 'interest-everyday-receipt', lessonId: 'belege-und-kosten', type: 'choice',
      prompt: 'Eine Person vergleicht zwei Angebote für einen Alltagskauf. Was leistet ein Beleg in dieser Lernaufgabe am ehesten?',
      answers: ['Er hält fest, was tatsächlich gekauft und bezahlt wurde.', 'Er beweist automatisch eine Steuerersparnis.', 'Er verwandelt den Einkauf in Einnahmen.'], correctAnswer: 0,
      explanation: 'Ein Beleg dokumentiert den Einkauf und den gezahlten Betrag. Ob daraus eine steuerliche Folge entsteht, wird hier nicht beurteilt; ein Einkauf wird nicht zu Einnahmen.',
      concept: 'Beleg und tatsächliche Zahlung', funken: 10,
    },
    {
      id: 'interest-everyday-refund', lessonId: 'geldfluss-und-entscheidungen', type: 'choice',
      prompt: 'Ein fiktiver Onlinekauf wird storniert. Wann ist eine erwartete Rückzahlung ein tatsächlicher Geldzufluss?',
      answers: ['Wenn sie tatsächlich eingeht.', 'Sobald die Stornierung abgeschickt wurde.', 'Sobald der ursprüngliche Kauf geplant wurde.'], correctAnswer: 0,
      explanation: 'Eine erwartete Rückzahlung ist noch kein verfügbarer Kontostand. Erst der tatsächliche Eingang verändert den Geldfluss; die anderen Zeitpunkte beschreiben Erwartungen oder Anträge.',
      concept: 'Erwartete und tatsächliche Rückzahlung unterscheiden', funken: 10,
    },
    {
      id: 'interest-everyday-costs', lessonId: 'ausgaben-steuerersparnis', type: 'choice',
      prompt: 'Eine Person spart gegenüber einer Alternative 12 €, gibt für die gewählte Möglichkeit aber insgesamt 20 € aus. Was zeigt der Vergleich?',
      answers: ['„Geld gespart“ bedeutet nicht automatisch, dass keine Ausgabe entstanden ist.', 'Die Person hat 12 € verdient.', 'Die 20 € werden vollständig ausgeglichen.'], correctAnswer: 0,
      explanation: 'Ein Preisvorteil im Vergleich ist kein zusätzlicher Einnahmeüberschuss. Für den Geldfluss zählt auch, was tatsächlich bezahlt wurde; es folgt keine automatische Erstattung.',
      concept: 'Preisvorteil und tatsächliche Ausgabe trennen', funken: 10,
    },
  ],
}

const legacyInterestLessons: Record<MainInterest, string[]> = {
  salary: ['brutto-netto', 'umsatz-gewinn', 'geldfluss-und-entscheidungen'],
  'side-business': ['belege-und-kosten', 'umsatz-gewinn', 'geldfluss-und-entscheidungen'],
  everyday: ['belege-und-kosten', 'geldfluss-und-entscheidungen', 'ausgaben-steuerersparnis'],
}

export const interestQuestionBank: Record<MainInterest, Question[]> = Object.fromEntries(
  (Object.keys(authoredInterestQuestions) as MainInterest[]).map((interest) => {
    const legacy = interestPools[interest].map((question, index) => ({
      ...question,
      lessonId: legacyInterestLessons[interest][index],
    }))
    const legacyIds = new Set(legacy.map((question) => question.id))
    const legacyLessonIds = new Set(legacy.map((question) => question.lessonId))
    const newQuestions = authoredInterestQuestions[interest].filter((question) =>
      !legacyIds.has(question.id) && !legacyLessonIds.has(question.lessonId ?? ''),
    )
    return [interest, [...legacy, ...newQuestions]]
  }),
) as Record<MainInterest, Question[]>
