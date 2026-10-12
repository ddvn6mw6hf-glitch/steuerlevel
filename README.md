# SteuerLevel

SteuerLevel v4 ist ein deutschsprachiges Lernspiel mit sechs Lektionen auf drei Niveaustufen. Die spielbare typisierte Fragebank enthält 55 eindeutige konzeptionelle Fragen: 13 gemeinsame Kernfragen, 24 profil-exklusive Fragen (sechs je Lebenssituation) und 18 Interessenfragen. Vorhandene Profil- und Interessenfragen samt IDs wurden beibehalten.

Beim optionalen Startprofil wählt man eine Altersgruppe, Lebenssituation und ein Lernthema. Diese Angaben wählen passende fiktive Beispiele und werden zusammen mit Steuerfunken und abgeschlossenem Lernfortschritt ausschließlich lokal im Browser gespeichert. Ältere XP-Gesamtstände werden bei der nächsten Ladung verlustfrei migriert. Steuerfunken sind Lernpunkte ohne Geldwert. Es gibt keine Konten, Analyse, externen APIs oder echten Steuerberechnungen.

## Starten

```sh
npm install
npm run dev -- --host 0.0.0.0
```

## Prüfen

```sh
npm test
npm run build
```

Die sechs Lektionen liegen in `src/learning/curriculum.ts`; exklusive Profile liegen in `src/learning/profileQuestionBank.ts`, Interessenfragen in `src/learning/interestQuestionBank.ts`, die Auswahl in `src/learning/questionBank.ts`. Spielbare Fragen sind als `conceptual_unverified` gekennzeichnet und enthalten keine konkreten Pflichten, Schwellen, Fristen oder Abzugsansprüche. Rechtlich konkrete Entwürfe sind in `src/learning/draftQuestions.ts` als `needs_official_review` markiert und nicht spielbar. Der vollständige Prüfstatus steht in [CONTENT_REVIEW.md](CONTENT_REVIEW.md). Die Funktion `printProfileQuestionDiagnostic` in `src/learning/diagnostic.ts` gibt die Frage-IDs und Themen für alle vier Profile aus.

## Profile ausprobieren

Im Startprofil lassen sich vier Lebenssituationen und drei Interessen durchschalten. Jede Situation erhält sechs exklusive Fragen: Fahrradprojekt für dual Studierende/Auszubildende, Campus-Lernkarten für Studierende, Kräuterkästen für Angestellte und Fahrradtaschen für Gründungsinteressierte. Interessen ändern die tatsächlich gewählten Frage-IDs und Lernziele. Das Alter ändert nur die fiktive Szene, nicht die Frageauswahl oder eine steuerliche Einordnung.

Fragen werden als Steuer-Newbie, Durchblicker und Steuerstratege markiert. Richtig beantwortete Fragen geben einmalig Steuerfunken; falsche Antworten ziehen nichts ab. Beim Abschluss zeigt eine eigene Feier den tatsächlichen Zuwachs. Das Konfetti läuft zeitlich begrenzt und wird bei reduzierter Bewegung abgeschaltet. Tests belegen Programmverhalten, nicht steuerrechtliche Richtigkeit.

In „Umsatz & Gewinn“ lässt sich „Was wäre, wenn?“ öffnen: Umsatz und Kosten sind per Regler verstellbar; das Ergebnis wird unmittelbar angezeigt. Es ist keine Steuerberechnung.