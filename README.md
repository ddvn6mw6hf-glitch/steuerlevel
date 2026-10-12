# SteuerLevel

SteuerLevel v4 ist ein deutschsprachiges Lernspiel mit drei Themen: Umsatz und Gewinn, Brutto und Netto sowie Ausgaben und mögliche Steuerwirkungen. Die typisierte Fragebank enthält 30 Einträge: neun gemeinsame Kernfragen, zwölf exklusive Lebenssituationsfragen und neun interessenspezifische Varianten. Die Geschäftslektion stellt pro Profil fünf passende Fragen.

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

Die gemeinsame Themenstruktur liegt in `src/learning/content.ts`; profilspezifische Fragen stehen in `src/learning/profilePools.ts`, Interessenvarianten in `src/learning/interestPools.ts` und Tags/Selektion in `src/learning/questionBank.ts`. Jede Frage hat ein Lernziel, Profil-/Interessen-Tags, Level 1–3, Quellenfeld, Steuerjahr und Prüfstatus `needs_review`. Es wurden keine Steuerrechtsquellen erfunden oder fachliche Prüfungen behauptet.

## Profile ausprobieren

Im Startprofil lassen sich vier Lebenssituationen und drei Interessen durchschalten. Die Geschäftslektion teilt nur den Einstieg und eine Interessenfrage; drei Fragen sind je Profil exklusiv: Fahrradverkauf bei dual Studierenden/Auszubildenden, Lernkarten bei Studierenden, Kräuterkästen bei Angestellten und Fahrradtaschen bei Gründungsinteressierten. Jede Variante enthält eine Rechenaufgabe. Das Interesse ändert die Frage-ID, den vorgeschlagenen Lektionsstart und die Rahmung der Geschichte. Die Altersgruppe wählt nur eine passende fiktionale Variante.

Fragen werden als Steuer-Newbie, Durchblicker und Steuerstratege markiert. Richtig beantwortete Fragen geben einmalig Steuerfunken; falsche Antworten ziehen nichts ab. Beim Abschluss zeigt eine eigene Feier den tatsächlichen Zuwachs. Das Konfetti läuft zeitlich begrenzt und wird bei reduzierter Bewegung abgeschaltet.

In „Umsatz & Gewinn“ lässt sich „Was wäre, wenn?“ öffnen: Umsatz und Kosten sind per Regler verstellbar; das Ergebnis wird unmittelbar angezeigt. Es ist keine Steuerberechnung.