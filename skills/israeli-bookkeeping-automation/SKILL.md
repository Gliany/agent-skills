---
name: israeli-bookkeeping-automation
description: Prepare traceable bookkeeping drafts for Israeli businesses, including journal entries, transaction registers, VAT postings, supplier withholding, fixed assets, and payroll journals from approved inputs. Use for transaction-level preparation and review. Household budgeting, statutory reporting, payslip generation, and tax filing are separate workflows.
license: MIT
metadata:
  author: skills-il
  upstream-version: "1.6.2"
---

# Israeli Bookkeeping Automation

Prepare reviewable bookkeeping entries for the requested entity and period. Default to Hebrew for deliverables. Work from original documents and the entity's current ledger or export. Keep household and business records separate.

## Establish the posting basis

Confirm the entity, VAT status, bookkeeping method, recognition policy, period, currency, and chart of accounts relevant to the entry. Determine whether the entity uses double-entry or a simpler register from its applicable bookkeeping instructions and confirmed practice. VAT registration alone does not establish the bookkeeping method. Use the entity's actual כרטסת and account codes. If the mapping is missing, use proposed account names and mark the mapping pending.

Keep חשבון עסקה, חשבונית מס, קבלה, and הודעת זיכוי distinct. Separate the document issue date, date of supply or service, applicable VAT tax point, posting date, and payment date when they differ. A payment demand alone does not establish a tax invoice, VAT liability, or payment. Where the business separately recognizes revenue or a receivable, use supporting evidence and the confirmed accounting basis.

## Choose the relevant procedure

- **Sales, purchases, VAT, credits, withholding and exports.** Use [document and VAT controls](references/documents-and-vat.md) to classify the source and determine the tax and payment legs.
- **Payroll.** Use [payroll journals](references/payroll.md) to map approved payroll inputs to separate wage accrual, payments and remittances. An estimate requires confirmed inputs and period-specific official sources. Keep withholding from the payroll system or accountant as an input.
- **Fixed assets, depreciation and debt.** Use [asset and loan journals](references/assets-and-loans.md) to separate capitalization, depreciation, principal, interest and cash movements.

## Build and verify the draft

- Give each proposed entry a stable source key and locator, date, document reference and type, description, accounts, debit and credit, original currency, and any supported conversion details. Use exact decimal arithmetic. Mark missing amounts or tax treatment as unresolved. Show why an entry is held back and which evidence would clear it.
- Tie each double-entry journal's debits and credits and check that the gross amount, tax, withholding and settlement trace to the source. For a simple register verify row totals and document links against the confirmed basis. In an import batch compare counts and control totals by currency and check for existing entries, including overlaps across exports. Match on durable identifiers and transaction context, not amount alone. Keep credits and reversals linked to originals.
- Keep the source unchanged and deliver a separate review draft with held items and validation results. Preserve personal identifiers only where needed in the authorized private output. Posting to a live ledger, issuing or sending documents, requesting allocation numbers, filing, and payment require separate explicit authorization for the exact action. If a posting outcome is uncertain, inspect the destination before attempting a retry.

Adapted for Codex from the skills-il `israeli-bookkeeping-automation` 1.6.2 package.
