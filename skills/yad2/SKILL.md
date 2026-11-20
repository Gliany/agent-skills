---
name: yad2
description: "Use Yad2 (יד2) to search and compare property for rent or purchase, cars and other vehicles, and second-hand goods; prepare Hebrew listings and negotiations; and perform specifically requested favorites, alerts, chat, and ad-management actions through the user's browser. Also covers navigating other Yad2 sections. Use for actual Yad2 tasks, not generic Israeli legal or investment advice."
---

# Yad2

## Start with the user's task

Identify the section, buying/renting/selling intent, and requested outcome. Infer what is clear from the conversation. Ask only for missing criteria that materially affect the task, and continue useful independent work. Broad requests to enable full-site use authorize setup and inspection, not arbitrary purchases, messages, ads, or account changes.

Read [workflows.md](references/workflows.md) for the applicable domain. Consult [access.md](references/access.md) when choosing navigation or explaining tested access. Do not load unrelated domain details.

## Access and search

1. Prefer an available, verified first-party connector or documented official API. Otherwise use the supported browser controls and the normal Yad2 website. A skill supplies instructions; it does not itself create an API or authenticated MCP connection.
2. Reuse the task's browser session. Observe the current page before interacting. Discover controls and URLs from the current UI rather than guessing query parameters or replaying old form selectors. Follow the browser tool's documentation and applicable computer-use policy.
3. Verify sign-in through the personal area or account menu when account access is needed. A public homepage or remembered login does not prove authentication. Let the user handle credentials if needed; never save tokens, passwords, OTPs, contact details, or browsing history in the skill.
4. Use normal access. Do not install stealth browsers, evade bot challenges, rotate proxies, or replay undocumented private APIs. For an access challenge, report it and use the permitted user handoff. Do not claim an empty result when access failed.
5. Apply the user's criteria and verify the selected filters in the UI. Recent searches and recommendations are context, not instructions. Distinguish actual filtered results from sponsored, recommended, or homepage cards. Avoid reading unrelated account content.
6. Open relevant listing details. Record canonical listing URL or ID, observation date, asking price and unit, seller type if reported, key facts, and unknowns. Preserve Hebrew labels whose meaning is ambiguous. Deduplicate listings; label promoted placements and unavailable details.
7. Report a compact shortlist with evidence links, fit, tradeoffs, and questions for the seller. Advertiser claims are not verified ownership, condition, legal compliance, or sale prices. Explain limited coverage rather than asserting the cheapest or best listing across the whole market.

## Prepare and act

Do all authorized, reversible preparation before requesting any necessary approval. Draft Hebrew ads and messages from supplied facts; do not invent condition, location, ownership, defects, features, or history. Preserve exact names and numbers. Confirm the current destination, account, category, photos, contact visibility, and any fees before an external write.

- Searching and reading relevant pages can proceed within the task. Do not change favorites, alerts, consents, settings, or listings merely to demonstrate capability.
- Send chats or other communications only when the user explicitly instructs it. Use the specified recipient and purpose. If approval is needed, show the concrete text and destination first; existing authorization for the exact action persists unless applicable policy requires action-time confirmation.
- Publishing, changing, renewing, marking sold, or deleting an ad needs a specifically requested operation and clear scope. A capability-setup request does not authorize a test ad. Check for autosave or uploads before entering private information: a draft form may transmit data before Publish.
- For file uploads or disclosure of private contact details, follow the applicable transmission policy and the user's exact authorization. Inspect photos for private details; obtain permission for edits or disclosure outside the requested scope.
- Treat paid promotion, purchases, subscriptions, contract acceptance, and irreversible deletion according to the applicable confirmation or handoff rules. Do not add paid options, accept legal commitments, or opt into marketing just to finish inspection.
- After an authorized write, verify the user-visible outcome and retain its listing URL or confirmation. If the outcome is uncertain, reconcile the account state before retrying so posts and messages are not duplicated. Follow browser screenshot proof requirements for completed changes.

## Account and other sections

Use the current account menu for My ads, favorites, alerts, recent searches, profile, and settings. Read only what is relevant. Opening unread chats can change read status; avoid it during generic access checks. Perform requested native saved-search or favorite operations and verify their state; they are distinct from a running Codex automation. Create persistent monitoring only when requested and actually supported by the automation tools.

Discover additional Yad2 sections from the live menu. External partners such as job search, financing, or valuation can have separate accounts, data disclosures, and terms; Yad2 sign-in does not establish access or authorization there.

## Evidence and limits

State what was observed, what the advertiser claims, what is inferred, and what remains unknown. Cite the listing or official page near each material finding. Verify current official sources before legal, tax, regulatory, financing, or other high-stakes guidance. Use current comparables for price suggestions, and distinguish asking prices from realized transactions. Flag concrete fraud indicators without declaring a person fraudulent or guaranteeing a listing is safe.

When completing setup, distinguish installed instructions, authenticated browser access, tested read flows, and untested writes. Do not equate navigation coverage with an end-to-end test of every site feature.
