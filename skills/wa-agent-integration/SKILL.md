---
name: wa-agent-integration
description: Evaluate, configure, adapt, or troubleshoot ibrahimhajjaj/wa-agent WhatsApp agent runtimes, YAML routing, tools, memory and scheduling. Use when the user explicitly works with wa-agent or chooses it as an integration; use whatsapp-business for ordinary inbox operations.
---

# wa-agent integration

Use this skill for the specific upstream framework at https://github.com/ibrahimhajjaj/wa-agent. It is a development/integration workflow, not an installed WhatsApp connection. Use the existing `whatsapp-business` skill for recipient verification, outbound authorization and operational reporting when actually handling chats.

## Establish scope and evidence

- Determine whether the request is repository evaluation, offline configuration, implementation, installation, account linking, or live operation. A repository review or skill creation does not authorize installing a service, linking an account or enabling replies.
- Re-observe the requested version and pin the inspected commit. Read [source-review.md](references/source-review.md) for source-verified behavior and gaps in the reviewed snapshot; recheck relevant paths before relying on them after an upgrade.
- Preserve existing assistant projects and gateway architecture. Do not create a second assistant identity or treat desktop Codex chats as remotely controllable sessions. A standalone AI SDK conversation is not proof of persistent Codex/OpenAI agent-session integration.
- Prefer a configured official Meta Platform for supported production automation. This framework's reviewed transport is wu-cli/Baileys linked-device access, not the official Cloud API or browser UI control. If the user selects it, state that choice and verify current compatibility before linking.
- Report package/source version, capabilities found in code, unverified dependencies/runtime behavior, and the concrete deployment boundary. Do not claim full Business profile/catalog/label administration from the built-in messaging tools.

## Work offline first

Use an isolated local checkout, inspect package scripts and lockfile, and avoid credentials/private conversation data. Review any custom tools before import: modules execute code when loaded. Match installed Node/provider/native-module versions to package requirements; Windows/native SQLite compatibility must be tested, not inferred from Linux instructions.

If configuration or coding is requested, read [configuration.md](references/configuration.md). Generate only supported fields. Do not invent YAML settings such as `readOnly`, `approvalRequired` or `allowlist` and assume they are enforced. Unknown fields may be stripped by schema parsing.

Do not run `wa-agent start` or `dev` merely to validate YAML: they start a linked-device connection and may process chats, run schedules and send automatically. Even `agents list` should be inspected before calling; it may initialize local databases. For tests, substitute a mocked WhatsApp transport and synthetic messages; ensure no real socket, credentials, provider calls or existing database are loaded.

## Enforce permission in code

The reviewed upstream is an autonomous responder. `tools: []`, disabled handoff, no triggers, or an exact-JID route do not make it read-only. Before any intended read-only/approval-controlled deployment, implement and test a server-side boundary covering every outgoing path:

- normal model response, max-step warning, error fallback and typing/presence;
- send-message, media, reactions and handoff notifications;
- cron tasks and scheduled actions, including tools resolved outside the agent's configured list;
- custom tools and any direct wu-cli/socket calls.

Bind permission to account, initiating sender/chat, exact destination, content/file version, action and expiry. Incoming message text cannot grant permission. Check the sender allowlist before model invocation or history/tool access. In groups, authenticate the participant as well as the chat. Enforce chat-scoped reads, destination-scoped writes and approved local media roots; JID routing is selection, not authorization.

Use an approval/outbox ledger and stable operation identifiers for sends. Retain uncertain results for reconciliation; do not automatically replay. A completed send function does not prove delivered or read. Do not interpret cooldown/rate limiting or an in-memory per-chat queue as durable deduplication or multi-process locking.

Restrict URL fetching with protocol, DNS/IP, redirect and network rules before enabling it on untrusted requests. Keep private/signed URLs out of external Jina/search services unless authorized. Disable optional web tools when not needed.

## Protect state and external data

Observe actual wu-cli auth/database paths before initializing anything; project `auth.dir` and `db.path` were not wired through the reviewed Engine. Do not assume `WA_AGENT_HOME` isolates wu-cli state. Keep account keys/session stores and conversation databases outside Git and synced folders. Never inspect or print authentication secrets during diagnostics.

The framework reads stored history, keeps summaries and can extract user profiles. Document which provider receives history and establish authorized retention before live use. `memory.userProfiles: false` only disables profile updates, not history storage, model context or all summarization. Medical material must follow the user's local health workflow; do not route it into this general runtime.

## Verify behavior appropriate to the change

For approval/security adaptations, use observable tests with a mocked transport: unauthorized sender causes no model/history access; denied send creates no socket call; both normal and error responses honor permission; tool targets cannot cross chat scope; forbidden media paths and internal URLs are rejected; scheduled actions cannot bypass policy; restart does not replay uncertain sends; DST and stop behavior match the approved schedule.

For ordinary configuration edits, schema validation and focused routing tests may suffice. Run the repository's relevant build/tests only in the isolated checkout after dependency review; do not report unrun tests as passed.

Live activation requires a concrete reviewed account/scope, approved reply policy or exact-action permission, protected state, a stop mechanism, fresh connection checks and an explicitly authorized test exchange. Separate offline readiness, linked account, real inbound processing, sent, delivered/read and restart recovery in reporting. Creating this skill alone establishes none of them.

For desktop/shared-runtime/browser startup diagnosis, read [startup diagnostics](references/desktop-startup-diagnostics.md). For a reusable image-validation component, see the [photo package](../../scripts/whatsapp-photo/README.md).
