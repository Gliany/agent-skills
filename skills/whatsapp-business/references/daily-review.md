# Recipient-gated daily review

Reusable workflow specification. It is not an activated schedule or authorization to access mail, delete messages, create cards or send reports. Configure recipients, timezone, delivery time, excluded days and mailbox access privately for each deployment.

## Separate the stages

1. Prepare a per-recipient review of mail received since local midnight. Verify each mailbox separately and state incomplete coverage. Move clearly authorized advertising/spam to recoverable trash; preserve receipts, evidence and important correspondence. Do not equate a failed connection with an empty inbox.
2. Initiate one private readiness question at the configured morning time: "Good morning. Ready for your daily review?" Send the report only after the same verified recipient positively answers that question. An unrelated "yes" is not sufficient. No reply retains pending items without releasing a report. "Not now" stops pending reminders.
3. Show short mail summaries and concrete next-step proposals first. Preparing work, creating a tracking card and sending externally are distinct approvals. A paid receipt may need attention without creating a recurring task. A request for an expense report might warrant proposing invoice collection and a draft for the accountant; the proposal does not execute that work.
4. Release task reminders only after the recipient requests that section. Assignments come from the owners' explicit authoritative assignee field, never inferred from card membership or topic. Send each recipient only their own tasks and private mail.

## Mobile-friendly format

Use one compact item at a time when possible. Remove internal IDs, hashes, debug labels and long mailbox URLs. Include a sender address and useful identifying detail instead. Synthetic example:

> Expense summary requested — billing@example.invalid
> Needs attention: the sender asks for last month's expense summary.
> Suggested next step: collect invoices, list missing receipts and prepare a draft. Approve preparation?

Keep unresolved mail in a cumulative ledger. Previously shown items need only a title and short description. A missing reply must never delete or silently close an item.

## Recurring tracking and card writing

Propose a card only for sustained follow-up and only create it after a separate candidate-specific approval. Search existing cards first and use existing labels. Link to the card for review; unlike long mail links, the card link is useful.

Card description template:

```text
Purpose: one or two sentences explaining the task.
Current status: what is true now.
Assignee: explicitly assigned owner, or Unassigned.
Next step: one concrete action.
Due date: confirmed date, or Not set.
```

Put subsequent decisions and meaningful updates in comments. Keep the description's current summary accurate without accumulating a technical diary. Preserve source/history privately as appropriate. Sort active tasks by the latest substantive activity; a read or technical rewrite is not progress. Unchanged tasks get a compact "Waiting" entry with the next dependency. Shopping inventories and shared calendars are ongoing household tools, not automatically open tasks.

## Reminder and transport controls

If two-hour reminders are requested, anchor them to each recipient's verified review send time. Define a daily stop time and unavailability behavior before enabling the recurrence. Never interpret silence as permission to keep escalating. Enforce excluded days in the chosen timezone both when queueing and immediately before sending. Keep send, delivered and read states distinct; reconcile unknown delivery before retrying.

## Acceptance cases

- A verified yes after the current readiness prompt releases only that recipient's mail section.
- No response, wrong sender or ambiguous yes releases nothing and preserves the ledger.
- Unavailability cancels pending reminders; excluded days produce no daily messages.
- Old unresolved mail remains visible without duplicate cards.
- A tracking candidate or preparation proposal requires its own scoped decision.
- Partial mailbox access is reported honestly; one connected mailbox cannot stand in for another.
- Duplicate inbound events and restarts do not duplicate reports, cards or sends.

This document captures the workflow principles. The production consent engine is withheld because it depends on private routing and project-specific schemas. Implement and test the transport checks in code rather than relying on this prose alone.
