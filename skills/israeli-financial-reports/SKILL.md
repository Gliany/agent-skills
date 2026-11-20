---
name: israeli-financial-reports
description: Draft financial statements and VAT summaries for Israeli businesses from bookkeeping records. Use for profit and loss, balance sheets, trial balances, cash flow statements, annual or comparative reporting, and Form 6111 working papers. Household finance, tax submission, payroll, and bank reconciliation are separate workflows.
license: MIT
metadata:
  author: skills-il
  upstream-version: "1.4.2"
---

# Israeli Financial Reports

Prepare an unaudited business draft for management or the accountant. Default to Hebrew and NIS presentation when appropriate, with bilingual labels or PDF, XLSX, or CSV when requested. Keep household records and other entities outside the reporting perimeter unless the user identifies specific business entries with supporting evidence. Preserve private source files and work in separate outputs.

## Establish scope and evidence

Confirm the entity, VAT registration (עוסק פטור or עוסק מורשה, as applicable), income-tax track, reporting dates, audience, accounting basis, currency, and requested reports. Treat בעל עסק זעיר as a separate income-tax question from VAT registration. For financial statements confirm the applicable accounting framework and any closing adjustments with the accountant if unclear. Use the source dates and entity's confirmed rules, including for a historical report.

Use the posted journal or adjusted trial balance, chart of accounts, opening and closing balances, and supporting documents relevant to the requested report. Retain a traceable mapping from source files and rows to each total. Use exact decimal arithmetic, preserve source currency, and separate blanks, unsupported items, and estimates from verified amounts. A cash receipt or bank deposit can support cash movement without establishing revenue or VAT treatment. Keep חשבון עסקה, חשבונית מס, קבלה, and מסמך זיכוי distinct.

## Route by deliverable

- **Financial statements and comparisons.** Read [statement controls](references/statement-controls.md). Check that the trial balance ties before deriving formal statements. Reconcile totals across the requested statements and label differences or absent evidence. An unresolved imbalance blocks a complete set, even if a limited management summary is possible.
- **VAT summary or tax working papers.** Read [Israeli reporting checks](references/israeli-reporting.md). Verify the applicable rules from primary sources for the entity and period before relying on rates, thresholds, due dates, or filing classifications. Where evidence is missing, report supported amounts and list unresolved items separately. Label an incomplete result as such.

## Deliver

Use the Hebrew labels מאזן בוחן, דוח רווח והפסד, מאזן, and דוח תזרים מזומנים as applicable. Show dates, currency, accounting basis, scope, controls performed, differences, and items for accountant review. Check RTL and the rendering of dates, numbers, and negative values in exported Hebrew documents. In Excel and CSV keep amount fields numeric. For statutory work use a label such as `טיוטה לא מבוקרת לעיון רו״ח`. Preparing the draft does not authorize sending, document issuance, portal submission, payment, audit sign-off, or representation.

Adapted from the skills-il `israeli-financial-reports` 1.4.2 package for Codex.
