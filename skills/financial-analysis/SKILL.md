---
name: financial-analysis
description: Analyze Israeli household finances from bank, credit-card, loan, savings, and goal data. Use for income-versus-expense reviews, cash-flow gaps, expense classification, installments, debts, emergency funds, house-purchase targets, and practical improvement plans. Do not use for business tax filing or selecting specific investment products.
---

# Financial Analysis

Analyze household finances as a cash-flow and decision system. Default to Hebrew, Israeli shekels, and Israeli household terminology unless the user requests otherwise.

## Core rules

- Never invent an amount, category, balance, interest rate, installment count, or income source. Mark unclear items as `נדרש לבדיקה` and state what evidence would resolve them.
- Separate verified actuals, user-confirmed facts, calculated results, estimates, assumptions, and recommendations.
- Preserve an audit trail to the source file, account/card, date, merchant, amount, and source row when available.
- Prevent double counting. Credit-card transaction detail explains the bank's card settlement; it is not an additional cash expense. Treat internal transfers, savings transfers, loan principal, refunds, and incoming non-income transfers separately.
- Distinguish transaction date, billing date, and bank settlement date. For installments, track both the monthly charge and the remaining committed balance when the source provides it.
- Do not label a charge fraudulent, duplicated, unnecessary, or discretionary without evidence. Use `חשד`, `דורש אישור`, or `לא מסווג` until resolved.
- External contact, cancellation, purchase, transfer, or account change requires the user's explicit authorization immediately before execution.

## Workflow

1. Define the analysis period, household scope, accounts, cards, currencies, and available source coverage.
2. Normalize transactions and retain source identifiers. Reconcile card detail to bank settlements before calculating household totals.
3. Classify income as regular, irregular, refund, or non-income receipt. Classify outflows by economic meaning and by fixed/variable/essential status.
4. Calculate the sustainable monthly position from regular income. Show irregular income separately so it cannot hide a recurring deficit.
5. Review recurring charges, installments, loans, savings, childcare, emergency liquidity, and stated goals.
6. Identify open questions and anomalies with specific evidence and a concrete next action.
7. Build an improvement plan that separates expense reductions, debt actions, income growth, and goal funding. Quantify each recommendation and avoid relying on unreceived income.

Read [Israeli household model](references/israeli-household-model.md) when calculating metrics, classifying Israeli household transactions, or building a savings, emergency-fund, or home-purchase plan.

## Required output

Lead with a concise status:

- regular monthly income;
- monthly cash commitments;
- sustainable surplus or gap;
- irregular income and its effect;
- current savings pace;
- the largest verified expense groups;
- data coverage and unresolved items;
- the next three actions in priority order.

Then provide the detail needed for the user's decision. Keep confirmed problems separate from classification work. A large count of unknown merchants is a data-quality queue, not evidence of improper charges.

For a financial goal, show the target, current dedicated balance, time horizon, return assumption, required monthly contribution, existing monthly surplus or deficit, and total monthly improvement required. Provide scenarios only when they help the decision.

For spreadsheet creation or editing, also use the available spreadsheet skill and preserve the workbook's source, calculation, output, and audit separation.
