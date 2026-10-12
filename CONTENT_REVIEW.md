# Inhaltsprüfung

Stand: 2026-10-12. Dieser Bericht dokumentiert redaktionellen Status, nicht fachliche oder steuerrechtliche Freigabe.

## Spielbare Fragebank

55 eindeutige IDs, jeweils mit `verificationStatus: conceptual_unverified`, leerer Quellenliste und ohne Steuerjahr. Die Fragen sind bewusst auf Begriffe, fiktionale Situationen und betriebswirtschaftliche Rechenmodelle ohne konkrete steuerliche Rechtsfolge begrenzt. Keine spielbare Frage ist als amtlich oder fachlich geprüft gekennzeichnet. Die früheren Profil- und Interessenfragen bleiben mit ihren bisherigen IDs erhalten.

| Level | Lektion / Thema | Spielbare Fragen | Status |
|---|---|---|---|
| Steuer-Newbie | Steuern und Geldquellen | `tax-common-purpose`, `tax-separate-money-streams`, `dual-project-context`, `uni-group-project`, `employee-payslip-lines`, `founder-test-batch`, `interest-salary-tax-purpose`, `interest-business-sources`, `interest-everyday-purpose` | conceptual_unverified |
| Steuer-Newbie | Einkommen und Abrechnung | `salary-gross`, `salary-deductions`, `dual-payslip-example`, `uni-monthly-budget`, `employee-net-planning`, `founder-remuneration-example`, `interest-salary-payslip`, `interest-business-payment-separation`, `interest-everyday-payments` | conceptual_unverified |
| Durchblicker | Verkauf, Kosten und Ergebnis | `business-revenue`, `business-profit-calculation`, `dual-bike-sale`, `dual-bike-margin`, `uni-card-sale`, `uni-card-margin`, `employee-planter-sale`, `employee-planter-margin`, `founder-bag-sale`, `founder-bag-margin`, `interest-salary-side-income`, `interest-business-stock`, `interest-everyday-saving` | conceptual_unverified |
| Durchblicker | Belege und Ausgaben | `business-costs`, `records-context`, `dual-bike-repairs`, `uni-card-fees`, `employee-planter-delivery`, `founder-bag-packaging`, `interest-salary-documents`, `interest-business-receipts`, `interest-everyday-receipt` | conceptual_unverified |
| Steuerstratege | Liquidität und Planung | `cashflow-order`, `cashflow-costs`, `cashflow-available-funds`, `interest-salary-budget`, `interest-business-cash`, `interest-everyday-refund` | conceptual_unverified |
| Steuerstratege | Ausgabe und mögliche Wirkung | `spending-not-gain`, `expense-saving-calculation`, `dual-device-choice`, `uni-book-costs`, `employee-shared-tool`, `founder-equipment-choice`, `interest-salary-planning`, `interest-business-spending`, `interest-everyday-costs` | conceptual_unverified |

Die Fragen setzen keine Steuerpflicht, Absetzbarkeit, Rückzahlung, Schwelle, Frist oder Steuerhöhe voraus. Beträge und Figuren in den Szenarien sind erfunden. Der Umsatz-/Kosten-Simulator ist ein vereinfachtes betriebswirtschaftliches Modell und berechnet keine Steuer.

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

Während dieser Umsetzung wurde versucht, amtliche Seiten auf `gesetze-im-internet.de` abzurufen. Die Verbindung schlug fehl; deshalb wurde **keine** Quelle als erfolgreich geprüft oder zitiert. Betroffene, nicht abgerufene URLs waren:

- https://www.gesetze-im-internet.de/estg/__9.html
- https://www.gesetze-im-internet.de/estg/__38.html
- https://www.gesetze-im-internet.de/estg/__7.html
- https://www.gesetze-im-internet.de/ustg_1980/__1.html

Die Prüfsuite belegt ID-Auswahl, Progression, Datenintegrität und Antwortlogik. Sie belegt keine steuerrechtliche Richtigkeit. Vor einer fachlichen Veröffentlichung müssen Rechtsbegriffe und Entwürfe anhand aktueller amtlicher Quellen und mit anwendbarem Steuerjahr geprüft werden.
