# Configuration and CLI guidance

Read current `src/config/schema.ts`, `loader.ts`, `cli/index.ts` and runtime/tool paths before generating executable configuration. Reviewed schema supports:

- Project: version=1, agents.dir, auth.dir, db.path, log.level, webSearch(provider/apiKey), fetchUrl(provider/apiKey).
- Agent: name, description, llm(provider/model/temperature/maxTokens/baseUrl), personality, tools, routing, memory, triggers, handoff, maxSteps, cooldownMs, rateLimitPerWindow.
- LLM providers: anthropic, openai, ollama. Choose a currently available model for the actual installed provider; README model examples are not verified recommendations.
- Routing types: jid, group, keyword, default. Prefer exact approved JIDs and explicit participant authorization. Do not add catch-all routing for a scoped test.
- Memory: conversationWindow, summarizeAfter, userProfiles. Set userProfiles=false unless extraction is requested; verify history and summaries separately.
- Triggers: cron schedule, action, target, payload. No schema timezone or authorization field in this snapshot. Enforce those requirements in implementation rather than adding unsupported YAML fields.
- Handoff: enabled, escalateTo, conditions. Configured prose conditions do not prove deterministic enforcement; check tool and middleware code.

Do not ship a runnable "safe read-only" YAML: reviewed upstream automatically sends regardless of tool list. An offline sample, if requested, must be clearly marked non-runnable until the send/approval boundary is implemented and tested.

README commands are `wa-agent init <name>`, `start`, `dev`, `agents list`. Inspect the actual selected version before use. Do not run an unpinned `npx wa-agent` to review a repository; it executes a separately resolved package. Pin versions and inspect lifecycle scripts before an authorized installation. Keep secrets in protected environment/credential storage, never inline in YAML or PM2 files; `${VAR}` is a reference, not a secret store.

Custom-tool loader currently expects a callable factory exported as default, filename-matching named export or createTool. Verify Node's .ts import support/build output for the installed environment. Review each module before load; top-level code executes during import. Never offer shell/code tools to incoming users without a separate constrained authorization design.

For a deployment request, record exact version/lockfile, isolated auth/database location, account identity, allowlist and group-participant rules, provider/data policy, approval/outbox design, schedule timezone, operating costs, stop behavior and recovery plan. Complete offline preparation before requesting any missing live activation authorization. Do not replace an existing assistant runtime merely because this framework has its own memory/routing.
