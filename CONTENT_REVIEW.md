# Inhaltsprüfung

Stand: 2026-10-14. Dieser Bericht dokumentiert redaktionellen Status, nicht fachliche oder steuerrechtliche Freigabe. Die aktuelle Überarbeitung hat keine externen Webseiten abgerufen.

## Spielbare Fragebank

60 eindeutige IDs, jeweils mit `verificationStatus: conceptual_unverified` und ohne Steuerjahr. Die 55 bisherigen Fragen behalten ihre leeren Quellenlisten und bisherigen IDs. Die fünf neuen Fragen des Einstiegskapitels enthalten Quellenhinweise auf amtliche Texte, die in dieser Umsetzung nicht abgerufen oder fachlich geprüft wurden. Keine spielbare Frage ist als amtlich oder fachlich geprüft gekennzeichnet.

| Level | Lektion / Thema | Spielbare Fragen | Status |
|---|---|---|---|
| Steuer-Newbie | Wer kassiert hier eigentlich? | `intro-tax-definition`, `intro-tax-purpose`, `intro-tax-everyday`, `intro-income-vat`, `intro-tax-social-contributions` | conceptual_unverified; Quellenhinweise gespeichert, nicht geprüft |
| Steuer-Newbie | Steuern und Geldquellen | `tax-common-purpose`, `tax-separate-money-streams`, `dual-project-context`, `uni-group-project`, `employee-payslip-lines`, `founder-test-batch`, `interest-salary-tax-purpose`, `interest-business-sources`, `interest-everyday-purpose` | conceptual_unverified |
| Steuer-Newbie | Einkommen und Abrechnung | `salary-gross`, `salary-deductions`, `dual-payslip-example`, `uni-monthly-budget`, `employee-net-planning`, `founder-remuneration-example`, `interest-salary-payslip`, `interest-business-payment-separation`, `interest-everyday-payments` | conceptual_unverified |
| Durchblicker | Verkauf, Kosten und Ergebnis | `business-revenue`, `business-profit-calculation`, `dual-bike-sale`, `dual-bike-margin`, `uni-card-sale`, `uni-card-margin`, `employee-planter-sale`, `employee-planter-margin`, `founder-bag-sale`, `founder-bag-margin`, `interest-salary-side-income`, `interest-business-stock`, `interest-everyday-saving` | conceptual_unverified |
| Durchblicker | Belege und Ausgaben | `business-costs`, `records-context`, `dual-bike-repairs`, `uni-card-fees`, `employee-planter-delivery`, `founder-bag-packaging`, `interest-salary-documents`, `interest-business-receipts`, `interest-everyday-receipt` | conceptual_unverified |
| Steuerstratege | Liquidität und Planung | `cashflow-order`, `cashflow-costs`, `cashflow-available-funds`, `interest-salary-budget`, `interest-business-cash`, `interest-everyday-refund` | conceptual_unverified |
| Steuerstratege | Ausgabe und mögliche Wirkung | `spending-not-gain`, `expense-saving-calculation`, `dual-device-choice`, `uni-book-costs`, `employee-shared-tool`, `founder-equipment-choice`, `interest-salary-planning`, `interest-business-spending`, `interest-everyday-costs` | conceptual_unverified |

Die Fragen setzen keine Steuerpflicht, Absetzbarkeit, Rückzahlung, Schwelle, Frist oder Steuerhöhe voraus. Beträge und Figuren in den Szenarien sind erfunden. Der Umsatz-/Kosten-Simulator ist ein vereinfachtes betriebswirtschaftliches Modell und berechnet keine Steuer.

Die fünf Fragen des Einstiegskapitels enthalten pro Frage `sources` sowie den Feldwert `tags.verificationStatus: conceptual_unverified`. Sie verweisen auf § 3 AO, § 2 EStG, § 1 UStG, § 1 SGB IV und die Steuer-Übersichtsseite des BMF. Diese Quellen wurden für die Änderung nicht abgerufen; die Verweise dokumentieren Rechercheziele, keine Quellenprüfung oder fachliche Freigabe. Der Lerninhalt ist allgemeine Bildung, keine individuelle Steuerberatung.

Die fünf Lernziele bauen in dieser Reihenfolge aufeinander auf: Grundidee nach § 3 Abs. 1 AO; Finanzierung öffentlicher Aufgaben ohne Anspruch auf eine konkrete persönliche Einzelleistung; Einkommensteuer und Umsatzsteuer im Alltag; Abgrenzung zu Sozialversicherungsbeiträgen; kombinierter Mini-Boss mit Gehalt und Einkauf. Die Fragen sind auf die fiktiven Situationen und drei Antwortmöglichkeiten je Challenge abgestimmt. Alle fünf bleiben ungeprüft.

## Entwürfe außerhalb des Spiels

Diese Fragen sind in `src/learning/draftQuestions.ts` als `needs_official_review`, `playable: false`, ohne Quellen und ohne Steuerjahr markiert. Sie werden von der spielbaren Question Bank nicht importiert:

| Thema | Frage-ID | Status | Tatsächlich geprüfte Quellen |
|---|---|---|---|
| Einkommensteuer und Lohnsteuerabzug | `draft-wage-tax-relationship` | needs_official_review | keine |
| Zweck und mögliche Pflicht einer Steuererklärung | `draft-tax-return-purpose` | needs_official_review | keine |
| Werbungskosten und Voraussetzungen | `draft-advertising-expenses` | needs_official_review | keine |
| Steuerliche AfA | `draft-tax-depreciation` | needs_official_review | keine |
| Umsatzsteuer und Einkommensteuer | `draft-vat-v-income-tax` | needs_official_review | keine |
| Nebengewerbe und Anmeldungspflichten | `draft-side-business-obligations` | needs_official_review | keine |

## Quellenstatus

Ein früherer Projektstand verzeichnete fehlgeschlagene Abrufversuche amtlicher Seiten; diese Historie ist keine Quellenprüfung. Für die aktuelle Überarbeitung wurden keine Webseiten abgerufen. Deshalb ist **keine** Quelle als erfolgreich geprüft oder zitiert. Als Recherchehinweise für andere Inhalte des Projekts waren folgende URLs notiert:

- https://www.gesetze-im-internet.de/estg/__9.html
- https://www.gesetze-im-internet.de/estg/__38.html
- https://www.gesetze-im-internet.de/estg/__7.html
- https://www.gesetze-im-internet.de/ustg_1980/__1.html

Die Prüfsuite belegt ID-Auswahl, Progression, Datenintegrität und Antwortlogik. Sie belegt keine steuerrechtliche Richtigkeit. Vor einer fachlichen Veröffentlichung müssen Rechtsbegriffe und Entwürfe anhand aktueller amtlicher Quellen und mit anwendbarem Steuerjahr geprüft werden.
