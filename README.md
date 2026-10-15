# SteuerLevel v10

SteuerLevel ist ein deutschsprachiges Lernspiel mit sieben Lektionen auf drei Niveaustufen. Das Einstiegskapitel „Wer kassiert hier eigentlich?“ erklärt nacheinander die Grundidee einer Steuer (§ 3 Abs. 1 AO), öffentliche Aufgaben und fehlende individuelle Gegenleistung, Einkommensteuer und Umsatzsteuer im Alltag, den Unterschied zu Sozialversicherungsbeiträgen und kombiniert diese Begriffe in einem fiktiven Mini-Boss-Alltag. Es steht vor den bisherigen sechs Lektionen. Die spielbare typisierte Fragebank enthält 60 eindeutige konzeptionelle Fragen: 18 gemeinsame Kernfragen, 24 profil-exklusive Fragen (sechs je Lebenssituation) und 18 Interessenfragen. Vorhandene Lektionen, Profil- und Interessenfragen samt IDs sowie gespeicherter Lernfortschritt bleiben erhalten.

Die Lernansicht zeigt Konzept und Beispiel zuerst; die Challenge mit Antwortmöglichkeiten erscheint erst nach „Challenge starten“. Ein optionaler Tipp ist getrennt von der Frage abrufbar. Antwortoptionen werden pro Frage stabil gemischt und anhand stabiler Antwort-IDs ausgewertet. Der Funkenbeutel ist eine inline gezeichnete SVG-Illustration; Steuerfunken sind weiterhin reine Lernpunkte ohne Geldwert.

Beim optionalen Startprofil wählt man eine Altersgruppe, Lebenssituation und ein Lernthema. Diese Angaben wählen passende fiktive Beispiele und werden ausschließlich lokal im Browser gespeichert. Der Fehlertrainer führt Frageversuche und Konzept-Wiederholungen, bietet nach Fehlern eine Wiederholung und plant bei Erfolg weitere Übungen nach einem und drei Tagen. Ein lokaler Verlauf lässt sich löschen, ohne Punkte oder Kapitelabschlüsse zu löschen.

Die Schatzkammer bietet drei freiwillige, virtuelle Käufe: Goldener Funkenbeutel (150), Steuerdetektiv-Abzeichen (250) und Bonus-Challenge „Der Papierkram-Endgegner“ (300 Steuerfunken). Lebenszeitverdienst und ausgebbares Guthaben werden getrennt geführt; Käufe verringern das Guthaben, nicht den Lebenszeitverdienst. Bestehende XP- oder Steuerfunkenstände werden ohne erneutes Aufsummieren bereits beantworteter Fragen migriert. Steuerfunken sind Lernpunkte ohne Geldwert und niemals auszahlbar. Es gibt keine Konten, Analyse, externen APIs, Echtgeldkäufe oder echten Steuerberechnungen.

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

Die sieben Lektionen liegen in `src/learning/curriculum.ts`; exklusive Profile liegen in `src/learning/profileQuestionBank.ts`, Interessenfragen in `src/learning/interestQuestionBank.ts`, die Auswahl in `src/learning/questionBank.ts`. Spielbare Fragen sind als `conceptual_unverified` gekennzeichnet und enthalten keine konkreten Freibeträge, Steuersätze, Pflichten, Schwellen, Fristen oder individuellen Empfehlungen. Die fünf Fragen des neuen Einstiegskapitels enthalten amtliche Quellenhinweise und bleiben ausdrücklich ungeprüft. Rechtlich konkrete Entwürfe sind in `src/learning/draftQuestions.ts` als `needs_official_review` markiert und nicht spielbar. Der vollständige Prüfstatus steht in [CONTENT_REVIEW.md](CONTENT_REVIEW.md). Die Funktion `printProfileQuestionDiagnostic` in `src/learning/diagnostic.ts` gibt die Frage-IDs und Themen für alle vier Profile aus.

## Profile ausprobieren

Im Startprofil lassen sich vier Lebenssituationen und drei Interessen durchschalten. Jede Situation erhält sechs exklusive Fragen: Fahrradprojekt für dual Studierende/Auszubildende, Campus-Lernkarten für Studierende, Kräuterkästen für Angestellte und Fahrradtaschen für Gründungsinteressierte. Interessen ändern die tatsächlich gewählten Frage-IDs und Lernziele. Das Alter ändert nur die fiktive Szene, nicht die Frageauswahl oder eine steuerliche Einordnung.

Fragen werden als Steuer-Newbie, Durchblicker und Steuerstratege markiert. Richtig beantwortete Fragen geben einmalig Steuerfunken; Wiederholungen geben keine unbegrenzten Punkte. Beim Abschluss zeigt eine eigene Feier den tatsächlichen Zuwachs. Das Konfetti läuft zeitlich begrenzt und wird bei reduzierter Bewegung abgeschaltet. Besondere Lernzertifikate können nur an bestandene Meilensteinprüfungen gebunden werden und sind ausdrücklich inoffiziell. Tests belegen Programmverhalten, nicht steuerrechtliche Richtigkeit.

In „Umsatz & Gewinn“ lässt sich „Was wäre, wenn?“ öffnen: Umsatz und Kosten sind per Regler verstellbar; das Ergebnis wird unmittelbar angezeigt. Es ist keine Steuerberechnung.