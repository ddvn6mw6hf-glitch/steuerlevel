import type { LifeSituation, Question } from './types'
import { profilePools } from './profilePools'

type ExclusiveProfileQuestions = {
  scenario: string
  questions: Question[]
}

const authoredProfileQuestionBank: Record<LifeSituation, ExclusiveProfileQuestions> = {
  'dual-apprentice': {
    scenario: 'Mira probiert neben ihrem dualen Lernalltag ein kleines Fahrradprojekt aus. Alle Personen und Beträge sind erfunden.',
    questions: [
      {
        id: 'dual-project-context', lessonId: 'steuern-verstehen', type: 'choice',
        prompt: 'Mira vergleicht eine private Ausgabe mit Material für ihr Fahrradprojekt. Was ist ein sinnvoller erster Sortierschritt?',
        answers: ['Anlass und Zusammenhang getrennt notieren.', 'Beide Ausgaben automatisch als Projektkosten zusammenfassen.', 'Die private Ausgabe als Verkaufserlös zählen.'], correctAnswer: 0,
        explanation: 'Der Anlass hilft, private und projektbezogene Vorgänge nicht zu vermischen. Die Bezeichnung allein entscheidet keine steuerliche Behandlung; die anderen Antworten ziehen unbelegte Schlüsse.',
        concept: 'Privaten und projektbezogenen Kontext unterscheiden', funken: 10,
      },
      {
        id: 'dual-payslip-example', lessonId: 'brutto-netto', type: 'choice',
        prompt: 'Mira plant mit einer fiktiven Ausbildungsabrechnung. Welche Beträge sollte sie getrennt lesen?',
        answers: ['Den Betrag vor und den Betrag nach den ausdrücklich gezeigten Abzügen.', 'Den Fahrrad-Einkauf und den Verkauf.', 'Projektumsatz und privaten Kontostand.'], correctAnswer: 0,
        explanation: 'Die Beispielabrechnung unterscheidet einen Betrag vor und nach den angezeigten Abzügen. Die anderen Paare stammen aus anderen Zusammenhängen und beantworten die Abrechnungsfrage nicht.',
        concept: 'Abrechnungsbeträge im Ausbildungskontext', funken: 10,
      },
      {
        id: 'dual-bike-resale-plan', lessonId: 'umsatz-gewinn', type: 'choice',
        prompt: 'Mira überlegt, ein zweites gebrauchtes Fahrrad aufzubereiten. Welche Frage hilft ihr, den bisherigen Versuch zu bewerten?',
        answers: ['Welche Verkaufserlöse und welche Projektkosten tatsächlich angefallen sind.', 'Wie sie den gesamten Verkaufspreis als Gewinn ausgeben kann.', 'Ob die Kosten den Verkaufserlös rückwirkend erhöhen.'], correctAnswer: 0,
        explanation: 'Tatsächliche Erlöse und Kosten getrennt zu betrachten liefert eine erste betriebswirtschaftliche Übersicht. Ein Verkaufspreis ist nicht automatisch Gewinn; Kosten erhöhen den Erlös nicht.',
        concept: 'Ein zweites Projekt mit Erlösen und Kosten bewerten', funken: 10,
      },
      {
        id: 'dual-material-receipt', lessonId: 'belege-und-kosten', type: 'choice',
        prompt: 'Auf Miras Baumarktbeleg steht nur „Material“. Welche Ergänzung macht den Beleg für ihr Lernprojekt verständlicher?',
        answers: ['Wofür das Material gekauft wurde und welchem Projekt es zugeordnet ist.', 'Einen erhofften Verkaufspreis.', 'Eine vermutete Rückzahlung.'], correctAnswer: 0,
        explanation: 'Ein kurzer, sachlicher Projektbezug hilft beim späteren Wiedererkennen. Ein erwarteter Verkauf ist noch kein Erlös; ein Beleg verspricht keine Rückzahlung.',
        concept: 'Beleg und Projektkontext verbinden', funken: 10,
      },
      {
        id: 'dual-project-payment', lessonId: 'geldfluss-und-entscheidungen', type: 'choice',
        prompt: 'Ein Käufer sagt Mira die Zahlung für das Fahrrad erst am Wochenende zu. Was zählt für ihren heutigen Kassenstand?',
        answers: ['Nur Geld, das tatsächlich schon eingegangen ist.', 'Den zugesagten Betrag so behandeln, als wäre er bereits verfügbar.', 'Die erwartete Zahlung als bezahlte Rechnung verbuchen.'], correctAnswer: 0,
        explanation: 'Eine Zusage und ein tatsächlicher Zahlungseingang liegen zeitlich auseinander. Der Kassenstand beschreibt verfügbares Geld; die anderen Antworten verwechseln Erwartung und Zahlung.',
        concept: 'Zahlungszeitpunkt im Nebenprojekt', funken: 10,
      },
      {
        id: 'dual-device-choice', lessonId: 'ausgaben-steuerersparnis', type: 'choice',
        prompt: 'Mira erwägt ein Werkzeug, das sie auch privat nutzen könnte. Was kann sie zunächst sachlich festhalten?',
        answers: ['Kaufpreis, Nutzung und Zusammenhang mit dem Projekt.', 'Dass der gesamte Kaufpreis sicher zurückkommt.', 'Dass der Kauf bereits ein Projekterlös ist.'], correctAnswer: 0,
        explanation: 'Nutzung und Zusammenhang sind hilfreiche Tatsachen, ohne eine steuerliche Einordnung vorwegzunehmen. Eine Ausgabe ist kein Erlös und garantiert keine Erstattung.',
        concept: 'Gemischte Nutzung als offene Einzelfallfrage erkennen', funken: 10,
      },
    ],
  },
  university: {
    scenario: 'Noah organisiert neben dem Studium ein fiktives Lernkarten-Projekt mit einem Campusstand. Alle Personen und Beträge sind erfunden.',
    questions: [
      {
        id: 'uni-group-project', lessonId: 'steuern-verstehen', type: 'choice',
        prompt: 'Noah arbeitet in einem Uni-Projekt mit zwei Kommilitoninnen. Welche Übersicht verhindert am ehesten Verwechslungen?',
        answers: ['Wer welchen Betrag für welchen gemeinsamen Zweck beigesteuert hat.', 'Alle Beiträge als Noahs persönlichen Gewinn zählen.', 'Gruppenkosten mit privaten Einkäufen zusammenfassen.'], correctAnswer: 0,
        explanation: 'Eine Zuordnung nach Person und Anlass macht gemeinsame Vorgänge nachvollziehbarer. Ein Gruppenbeitrag ist nicht automatisch persönlicher Gewinn; private Einkäufe gehören in einen anderen Zusammenhang.',
        concept: 'Gemeinsame Projektmittel zuordnen', funken: 10,
      },
      {
        id: 'uni-monthly-budget', lessonId: 'brutto-netto', type: 'choice',
        prompt: 'Noah stellt für ein fiktives Monatsbudget einen Abrechnungsbetrag neben einen privaten Nebenverdienst. Was ist sinnvoll?',
        answers: ['Quelle und Bedeutung beider Beträge einzeln festhalten.', 'Beide Beträge als dasselbe Netto bezeichnen.', 'Den Nebenverdienst ohne Kontext vom Bruttobetrag abziehen.'], correctAnswer: 0,
        explanation: 'Abrechnungsbetrag und weiterer Geldeingang haben unterschiedliche Quellen. Sie für ein Budget nebeneinanderzustellen ist sinnvoll; sie ohne Kontext gleichzusetzen oder zu verrechnen nicht.',
        concept: 'Einkommensquellen im Studienalltag trennen', funken: 10,
      },
      {
        id: 'uni-card-batch', lessonId: 'umsatz-gewinn', type: 'choice',
        prompt: 'Noah erwägt eine zweite Auflage seiner Lernkarten. Welche Information hilft, die erste Auflage realistisch zu vergleichen?',
        answers: ['Tatsächliche Verkäufe und die dafür angefallenen Materialkosten.', 'Nur die geplante Stückzahl der zweiten Auflage.', 'Die noch unverkauften Sets als bereits erhaltenes Geld.'], correctAnswer: 0,
        explanation: 'Tatsächliche Verkäufe und angefallene Materialkosten sind beobachtbare Größen. Planung und Lagerbestand können wichtig sein, sind aber keine bereits eingegangenen Verkaufserlöse.',
        concept: 'Projektauflagen mit realisierten Beträgen vergleichen', funken: 10,
      },
      {
        id: 'uni-campus-fees', lessonId: 'belege-und-kosten', type: 'choice',
        prompt: 'Noah bezahlt fiktive Standkosten für einen Campusmarkt. Was dokumentiert er für seine Projektübersicht am besten?',
        answers: ['Betrag, Zahlungszeitpunkt und den Bezug zum Campusstand.', 'Nur den erwarteten Erlös aus dem nächsten Markt.', 'Die Standkosten als zusätzlichen Verkauf.'], correctAnswer: 0,
        explanation: 'Betrag, Zeitpunkt und Anlass beschreiben den Vorgang nachvollziehbar. Ein erwarteter Erlös ist noch kein Zahlungseingang, und Kosten sind keine Verkäufe.',
        concept: 'Projektkosten nachvollziehbar einordnen', funken: 10,
      },
      {
        id: 'uni-campus-payment', lessonId: 'geldfluss-und-entscheidungen', type: 'choice',
        prompt: 'Der Campusmarkt zahlt Noahs Verkaufserlös gesammelt am Folgetag aus. Was zeigt sein heutiger verfügbarer Kassenbestand?',
        answers: ['Den Betrag, der bis jetzt tatsächlich eingegangen ist.', 'Den erwarteten Auszahlungsbetrag plus heutiges Bargeld.', 'Den Umsatz abzüglich aller zukünftigen Ausgaben.'], correctAnswer: 0,
        explanation: 'Der heutige Bestand zählt tatsächlich verfügbare Mittel. Eine spätere Sammelauszahlung kann zum Verkauf gehören, ist aber noch kein heutiger Zahlungseingang.',
        concept: 'Spätere Abrechnung im Campusprojekt', funken: 10,
      },
      {
        id: 'uni-book-costs', lessonId: 'ausgaben-steuerersparnis', type: 'choice',
        prompt: 'Noah kauft ein Buch, das er für ein Seminar und in seiner Freizeit lesen möchte. Was kann er zunächst festhalten?',
        answers: ['Die unterschiedlichen Nutzungszwecke.', 'Dass der gesamte Kaufpreis sicher erstattet wird.', 'Das Buch als Projektverkauf.'], correctAnswer: 0,
        explanation: 'Die unterschiedliche Nutzung ist zunächst eine sachliche Information. Ob daraus eine steuerliche Folge entsteht, hängt von weiteren Regeln und Umständen ab; die anderen Antworten behaupten eine automatische Wirkung.',
        concept: 'Private und studienbezogene Verwendung unterscheiden', funken: 10,
      },
    ],
  },
  employee: {
    scenario: 'Samira vergleicht eine fiktive Gehaltsabrechnung mit einem kleinen Kräuterkasten-Projekt in ihrer Freizeit.',
    questions: [
      {
        id: 'employee-payslip-lines', lessonId: 'steuern-verstehen', type: 'choice',
        prompt: 'Samira vergleicht eine fiktive Abrechnung mit einem Projektkonto. Was sollte sie zuerst getrennt halten?',
        answers: ['Abrechnungspositionen und Projektbewegungen.', 'Beide Konten als Umsatz bezeichnen.', 'Alle Abzüge als private Einkaufskosten verbuchen.'], correctAnswer: 0,
        explanation: 'Abrechnungspositionen und Projektbewegungen stammen aus verschiedenen Zusammenhängen. Sie zu vermischen erschwert das Verständnis; die Antwort trifft keine Aussage über eine konkrete steuerliche Behandlung.',
        concept: 'Gehaltsabrechnung und Projektkonto auseinanderhalten', funken: 10,
      },
      {
        id: 'employee-net-planning', lessonId: 'brutto-netto', type: 'choice',
        prompt: 'Samira plant mit einer fiktiven Gehaltsabrechnung. Welche Information eignet sich für ein erstes Monatsbudget?',
        answers: ['Der dort nach den ausgewiesenen Abzügen stehende Beispielbetrag, getrennt von privaten Ausgaben.', 'Den Bruttobetrag als garantiert verfügbares Bargeld.', 'Den Umsatz ihres Kräuterkasten-Projekts.'], correctAnswer: 0,
        explanation: 'Für ein vereinfachtes Budget ist der ausgewiesene Beispielbetrag nach den dargestellten Abzügen ein Startpunkt. Brutto ist nicht gleich verfügbarer Kontostand; Projektumsatz ist eine andere Quelle.',
        concept: 'Abrechnungswert und verfügbares Budget unterscheiden', funken: 10,
      },
      {
        id: 'employee-planter-plan', lessonId: 'umsatz-gewinn', type: 'choice',
        prompt: 'Samira überlegt, weitere Kräuterkästen zu bauen. Welche Beobachtung hilft, den ersten Markt einzuschätzen?',
        answers: ['Wie viele Kästen tatsächlich verkauft wurden und welche Kosten anfielen.', 'Nur wie viele sie gern verkaufen würde.', 'Den gesamten Verkaufspreis als Gewinn behandeln.'], correctAnswer: 0,
        explanation: 'Tatsächliche Verkäufe und angefallene Kosten geben eine nachvollziehbare erste Übersicht. Wunschmengen sind noch keine Verkäufe, und Umsatz ist nicht automatisch Gewinn.',
        concept: 'Freizeitprojekt anhand tatsächlicher Verkäufe beurteilen', funken: 10,
      },
      {
        id: 'employee-delivery-note', lessonId: 'belege-und-kosten', type: 'choice',
        prompt: 'Samira bezahlt eine fiktive Lieferung für ihr Freizeitprojekt. Welche Notiz hält den Vorgang am klarsten fest?',
        answers: ['Betrag, Anlass und Zahlungsdatum.', 'Nur den möglichen Verkaufspreis.', 'Eine behauptete Steuererstattung.'], correctAnswer: 0,
        explanation: 'Betrag, Anlass und Datum helfen, die Ausgabe später wiederzuerkennen. Ein möglicher Verkaufspreis ist nicht die Ausgabe; eine Erstattung lässt sich daraus nicht ableiten.',
        concept: 'Lieferkosten einem Vorgang zuordnen', funken: 10,
      },
      {
        id: 'employee-invoice-timing', lessonId: 'geldfluss-und-entscheidungen', type: 'choice',
        prompt: 'Samira stellt einem fiktiven Kunden eine Rechnung, die später bezahlt wird. Was bedeutet das für ihre kurzfristige Planung?',
        answers: ['Den Zahlungstermin beachten und den Eingang nicht vorwegnehmen.', 'Die Rechnung sofort als verfügbares Bargeld zählen.', 'Die Rechnung als bereits bezahlte Ausgabe buchen.'], correctAnswer: 0,
        explanation: 'Eine offene Rechnung und verfügbares Geld sind nicht dasselbe. Für kurzfristige Planung zählt der tatsächliche Zahlungseingang; die anderen Antworten nehmen eine Zahlung vorweg.',
        concept: 'Offene Rechnung und Liquidität', funken: 10,
      },
      {
        id: 'employee-shared-tool', lessonId: 'ausgaben-steuerersparnis', type: 'choice',
        prompt: 'Samira erwägt ein Werkzeug für ihr Projekt, das auch im Haushalt genutzt werden könnte. Was hält sie zunächst sachlich fest?',
        answers: ['Anschaffung, Nutzungsbereiche und tatsächliche Zahlungen.', 'Den Kaufpreis als sicheren Rückfluss.', 'Das Werkzeug als zusätzlichen Umsatz.'], correctAnswer: 0,
        explanation: 'Nutzung und Zahlung zu dokumentieren hält Fakten fest, ohne eine Rechtsfolge vorwegzunehmen. Eine Ausgabe ist weder Umsatz noch garantierter Rückfluss.',
        concept: 'Gemischte Nutzung sachlich dokumentieren', funken: 10,
      },
    ],
  },
  founder: {
    scenario: 'Alex testet fiktiv eine kleine Serie Fahrradtaschen und plant Verkäufe, Kosten und Zahlungszeitpunkte.',
    questions: [
      {
        id: 'founder-test-batch', lessonId: 'steuern-verstehen', type: 'choice',
        prompt: 'Alex vergleicht eine kleine und eine größere Testserie. Welche Frage hilft vor einer Entscheidung am ehesten?',
        answers: ['Welche Verkäufe sind erfolgt, welche Beträge bezahlt und welche Kosten noch offen?', 'Welche erhofften Verkäufe sind bereits sicher eingegangen?', 'Wie lässt sich jede Ausgabe automatisch vollständig zurückholen?'], correctAnswer: 0,
        explanation: 'Erfolgte Verkäufe, bezahlte Kosten und offene Beträge ergeben eine sachliche Entscheidungsgrundlage. Erwartungen sind nicht sicher eingegangen, und Ausgaben werden nicht automatisch ersetzt.',
        concept: 'Mit realisierten und erwarteten Beträgen planen', funken: 10,
      },
      {
        id: 'founder-remuneration-example', lessonId: 'brutto-netto', type: 'choice',
        prompt: 'Alex vergleicht eine geplante persönliche Auszahlung mit einem Betrag aus einer früheren Beispielabrechnung. Was ist vorsichtig?',
        answers: ['Herkunft und Bedeutung der beiden Beträge getrennt kennzeichnen.', 'Beide Werte automatisch als denselben Nettolohn behandeln.', 'Die geplante Auszahlung als bereits eingegangenen Umsatz werten.'], correctAnswer: 0,
        explanation: 'Die Herkunft bestimmt, welche Frage ein Betrag beantwortet. Planung, Abrechnungswert und tatsächlich eingegangener Projektbetrag dürfen nicht ohne Kontext gleichgesetzt werden.',
        concept: 'Persönliche Planung und Projektzahlen auseinanderhalten', funken: 10,
      },
      {
        id: 'founder-bag-batch', lessonId: 'umsatz-gewinn', type: 'choice',
        prompt: 'Alex erwägt eine zweite Serie Fahrradtaschen. Welche Auswertung ist für den Vergleich nützlicher als nur die Stückzahl?',
        answers: ['Verkaufserlöse, Materialkosten und noch vorhandener Bestand.', 'Nur die geplante Produktionsmenge.', 'Den erhofften Umsatz als bereits erzielten Gewinn.'], correctAnswer: 0,
        explanation: 'Erlöse, Kosten und Bestand beleuchten unterschiedliche Teile des Versuchs. Eine Planung ist noch kein Verkauf, und ein erhoffter Umsatz ist noch kein Ergebnis.',
        concept: 'Testserien mit Verkauf, Kosten und Bestand vergleichen', funken: 10,
      },
      {
        id: 'founder-packaging-record', lessonId: 'belege-und-kosten', type: 'choice',
        prompt: 'Alex bezahlt fiktive Verpackungen für den Versand. Was dokumentiert den Vorgang am nachvollziehbarsten?',
        answers: ['Beleg, Betrag und Zuordnung zur jeweiligen Testserie.', 'Den später erhofften Verkaufspreis.', 'Die Ausgabe als zusätzlichen Umsatz.'], correctAnswer: 0,
        explanation: 'Beleg, Betrag und Projektzuordnung helfen, den Aufwand später zu verstehen. Ein erwarteter Verkauf ist kein eingegangener Erlös; eine Ausgabe ist kein Umsatz.',
        concept: 'Verpackungskosten einer Testserie zuordnen', funken: 10,
      },
      {
        id: 'founder-order-payment', lessonId: 'geldfluss-und-entscheidungen', type: 'choice',
        prompt: 'Alex nimmt eine fiktive Vorbestellung an; Herstellungskosten werden sofort fällig, bezahlt wird später. Was ist wichtig?',
        answers: ['Den Zeitpunkt des möglichen Eingangs und den der Kosten getrennt planen.', 'Die Vorbestellung sofort als Bargeld behandeln.', 'Kosten ignorieren, weil ein Verkauf geplant ist.'], correctAnswer: 0,
        explanation: 'Eingänge und Ausgänge können zu unterschiedlichen Zeitpunkten stattfinden. Für kurzfristige Zahlungsfähigkeit sind beide Termine wichtig; eine Vorbestellung ersetzt keinen tatsächlichen Eingang.',
        concept: 'Zahlungszeitpunkte im Gründungsexperiment planen', funken: 10,
      },
      {
        id: 'founder-equipment-choice', lessonId: 'ausgaben-steuerersparnis', type: 'choice',
        prompt: 'Alex erwägt eine langlebige Maschine für ein fiktives Projekt. Welche Aussage ist ohne Prüfung steuerlicher Regeln angemessen?',
        answers: ['Anschaffung und Nutzung dokumentieren; die steuerliche Einordnung nicht allein aus dem Kauf ableiten.', 'Der Kaufpreis kommt sicher vollständig zurück.', 'Die Maschine ist automatisch zusätzlicher Umsatz.'], correctAnswer: 0,
        explanation: 'Eine längere Nutzung ist eine sachliche Information, aber die konkrete steuerliche Behandlung hängt von Regeln und Umständen ab. Die anderen Antworten behaupten automatische Wirkungen.',
        concept: 'Langlebige Anschaffung als offene Einzelfallfrage erkennen', funken: 10,
      },
    ],
  },
}

const legacyLessonIds = ['umsatz-gewinn', 'umsatz-gewinn', 'belege-und-kosten']

const legacyCalculationOptions: Record<string, string[]> = {
  'dual-bike-margin': ['95 €', '215 €', '310 €'],
  'uni-card-margin': ['44 €', '28 €', '72 €'],
  'employee-planter-margin': ['51 €', '45 €', '96 €'],
  'founder-bag-margin': ['140 €', '90 €', '230 €'],
}

const replacedAuthoredQuestions: Record<LifeSituation, string[]> = {
  'dual-apprentice': ['dual-bike-resale-plan', 'dual-material-receipt', 'dual-project-payment'],
  university: ['uni-card-batch', 'uni-campus-fees', 'uni-campus-payment'],
  employee: ['employee-planter-plan', 'employee-delivery-note', 'employee-invoice-timing'],
  founder: ['founder-bag-batch', 'founder-packaging-record', 'founder-order-payment'],
}

function preserveLegacyQuestion(question: Question, lessonId: string): Question {
  if (question.type === 'calculation') {
    const { calculation: _calculation, ...base } = question
    return {
      ...base,
      lessonId,
      type: 'choice',
      answers: legacyCalculationOptions[question.id],
      correctAnswer: 0,
      explanation: `${question.explanation} Die anderen Beträge sind die genannten Einzelwerte, nicht die Differenz.`,
    }
  }
  return { ...question, lessonId }
}

export const profileQuestionBank: Record<LifeSituation, ExclusiveProfileQuestions> = Object.fromEntries(
  (Object.keys(authoredProfileQuestionBank) as LifeSituation[]).map((lifeSituation) => {
    const authored = authoredProfileQuestionBank[lifeSituation]
    const legacy = profilePools[lifeSituation].questions.map((question, index) =>
      preserveLegacyQuestion(question, legacyLessonIds[index]),
    )
    const additional = authored.questions.filter((question) =>
      !replacedAuthoredQuestions[lifeSituation].includes(question.id),
    )
    return [lifeSituation, { ...authored, questions: [...legacy, ...additional] }]
  }),
) as Record<LifeSituation, ExclusiveProfileQuestions>
