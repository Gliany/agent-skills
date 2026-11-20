# Recovery and continuity checks

Use for handoffs, interrupted work, manual compression or native compaction. A portable state record is readable evidence; native compacted machine state may be opaque. They are not interchangeable.

## Compact handoff

Scale the format to the task; preserve these meanings rather than filling boilerplate:

- **Objective and scope:** current outcome, owning project and explicit non-goals.
- **Confirmed decisions:** decision, source/version/date and rationale that affects continuation. Separate pending proposals and superseded decisions.
- **Open work:** remaining tasks, dependencies and acceptance criteria.
- **Constraints and authority:** safety, privacy, compatibility, approvals already granted/pending and prohibited actions.
- **Artifacts:** canonical paths/sections or accessible links and material revision/hash when available; no full histories or secrets.
- **Blockers/uncertainty:** missing evidence/access, contradictions and what would resolve them.
- **Verification:** what actually ran, outcome, scope, failures and unperformed checks. A plan or passing structural check is not integration success.
- **Next permitted action:** concrete action supported by current authority, with a relevant stop/approval condition.

Do not duplicate every source detail. Preserve enough information inline for a recipient to recognize and respect material constraints, plus a path to retrieve task-specific detail. A source pointer without access or without signaling an important restriction may not be sufficient. If the handoff must stand alone, include all material invariants; don't silently assume the next session can recover omitted files.

## Reconcile and continue

Check the relevant owner records and current task instructions before treating a summary as confirmed. Resolve conflicting claims by authority, date, version and applicability, not summary recency. Do not promote a proposed deployment or unverified test into an approved/completed decision. If sources are missing, keep status unknown and name the missing check; do not probe unrelated private data.

Recheck drift-prone state such as current files, active blockers and verification results when cheap and material. Keep stable decisions with provenance. Repeated approval reminders may express distinct scopes, recipients or action types; retaining only a generic approval sentence can broaden authority.

Test the continuation with original and reduced state under equivalent tools/model/permissions. Inspect the downstream task output and proposed action, not just summary size. Include a case where seemingly duplicate information adds a critical qualifier; reject the smaller context if that qualifier is lost. Preserve failed attempts and distinguish static coverage from actual continuation evidence.

## Mechanism compatibility

- Manual summaries are inspectable authored artifacts; trimming removes history and may lose earlier state.
- Codex CLI /compact and app-server thread compaction are runtime operations; use only a supported, authorized surface and verify completion/lifecycle plus subsequent task behavior.
- Responses API compaction produces a canonical window with opaque items. Follow its current contract; don't rewrite encrypted state or copy API parameters into Codex configuration.
- SDK session compression/trimming and Memory require that integration. Reusable memory is a reviewed aid, not a second fact database or a grant to store sensitive data.
- Resume/fork/thread selection can restore a conversation surface; it does not prove fresh source state, shared artifact access or preserved authority. Do not switch or create user chats merely because a handoff pattern mentions them.
