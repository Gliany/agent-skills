# Monitoring, scheduled work and integration

## Establish the policy

Define the account, exact contacts/groups, VIPs, keywords or event types, inspected history window, cadence, timezone, business/quiet hours, notification destination, completion/expiry, and stop command. Reuse explicit existing choices. Ask only for missing decisions that materially affect scope. Use the user's confirmed IANA timezone and preserve daylight-saving behavior.

Separate notification permission from outbound-message permission. Automatic replies default to disabled. A standing reply policy needs eligible contacts, trigger, approved content/template, allowed hours, exceptions, escalation, maximum frequency and expiry. High-risk content requires the exact-content approval in SKILL.md. Escalate unmatched requests instead of improvising automatic replies.

## Match promises to runtime

- A one-time review is not monitoring. A scheduled poll is not continuous or real-time monitoring. A skill does not run while its host is stopped.
- When asked for a Codex schedule/reminder/monitor, discover the automation tool first and use its supported schema. Do not create a Windows service, task, daemon or gateway merely because the policy mentions one.
- Prefer an existing approved integration. For a new local worker, implementation/deployment needs its own concrete scope; establish profile ownership, local state path, locking, least privilege, retention and recovery before enabling it.
- Desktop Codex chats must not be treated as a remotely controllable runtime without a verified supported connection. Do not create a second assistant identity or modify existing gateway projects as part of ordinary WhatsApp operation.
- A UI monitor needs a reachable authenticated browser, running host and supported wake path. Browser sessions may lose authentication, network or sync. A scheduler alone does not guarantee any of these.

## State and recovery

Expose both process and WhatsApp connection state: RUNNING/STOPPED/PAUSED/ERROR and CONNECTED/AUTH_REQUIRED/DISCONNECTED/UNKNOWN. Include last successful check, heartbeat, last processed watermark, freshness threshold, scope and last error. A living process with a stale heartbeat or failed WhatsApp check is not healthy monitoring.

Maintain a minimal approved local checkpoint of processed event identifiers and alert decisions; do not persist full messages by default. Prefer stable message IDs. If only UI evidence exists, use available chat/direction/timestamp/content fingerprints cautiously: repeated identical messages and edits are possible. Mark uncertainty instead of discarding legitimate events. Serialize workers sharing a browser profile or composer.

After reconnect/restart, reconcile a bounded overlap from the last successful watermark to catch gaps. Do not replay outbound sends with unknown outcomes. Suppress repeated alerts for unchanged events; notify on meaningful incoming changes, completion, failures or required user action. If coverage is partial or a gap cannot be recovered, report it.

Start/resume only the requested scope and verify fresh successful operation. Pause/stop must affect the actual selected monitor and prevent future automated sends; check queued work and disclose any in-flight operation that could not be cancelled. Do not stop unrelated monitors or log out the account.

## Official Platform path

Use official Meta documentation and a verified existing integration for APIs. Check current permissions, account/number binding, template requirements, messaging windows, consent, limits, supported media and prices at implementation time. Do not hard-code remembered rules or assume app and API coexistence/history synchronization.

For an explicitly requested implementation, include webhook signature verification, authenticated admin controls, event deduplication, status correlation, bounded retries for safe operations, an outbox/approval boundary and recovery of uncertain outbound outcomes. Secrets belong in an approved credential store/environment and must not be echoed into chat, source, logs or documentation.

An approved live test must establish a real inbound event, an authorized outbound result, status correlation, and restart recovery before reporting end-to-end readiness. Domain verification, business review, webhook test events and local tests are separate evidence.

Official reference to consult: [Meta WhatsApp Cloud API documentation](https://developers.facebook.com/docs/whatsapp/cloud-api/overview). This URL was rate-limited during skill authoring; no current API limits or readiness claims were derived from it.
