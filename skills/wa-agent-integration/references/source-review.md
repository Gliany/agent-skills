# Reviewed upstream behavior

Reviewed 2026-10-12 from source commit `31dd8a72f9a2eb5a2e906d39b3d0fdcba4c38846`; package.json version `0.1.1`. This was a static source inspection. Dependencies were not installed, tests were not run, and no account was linked. Revalidate before deployment; transitive wu-cli behavior was not inspected.

Source: [pinned repository](https://github.com/ibrahimhajjaj/wa-agent/tree/31dd8a72f9a2eb5a2e906d39b3d0fdcba4c38846).

## Useful distinction

This is a Node.js autonomous-agent engine with YAML configuration, AI SDK tool loops, wu-cli/Baileys transport, per-chat queues, routing, history/summary/profile memory, scheduled tools and human handoff. It complements an operator skill as a possible implementation substrate. The inspected built-ins do not implement broad Business account/catalog/label administration. The package declares Node >=20 and Baileys `^7.0.0-rc.9`; actual dependency resolution/build compatibility remains untested.

## Decisions changed by source inspection

| Source path | Observed implementation | Operational implication |
|---|---|---|
| `src/agent/agent.ts` | Direct `sendText` for final model text, max-step warning and error fallback; typing indicator on entry | Removing send-message from tools does not disable outbound communication; a text-only prompt is not an approval boundary |
| `src/tools/builtin/send-message.ts` | Optional arbitrary `to`; arbitrary `mediaPath`; direct sendText/sendMedia | Add destination and filesystem authorization before exposing to untrusted requests |
| `src/tools/builtin/search-messages.ts` | Defaults to current chat but accepts another chatJid; returns message bodies | Routing does not prevent cross-chat disclosure |
| `src/middleware/filter.ts` and `src/runtime/engine.ts` | Pipeline filters own/broadcast/unknown-empty messages and checks handoff | No sender authorization gate was found in this pipeline; exact routing alone does not authenticate group participants |
| `src/triggers/scheduler.ts` | Resolves `[task.action]` directly, outside configured agent tools; invokes execute on stored payload | Scheduler needs its own permission and input-validation boundary; removing a tool from the agent list is insufficient |
| `src/triggers/scheduler.ts` | Tool errors are caught; then one-shot deleted or recurrence advanced | A failed scheduled send can be consumed without retry; no confirmed-send ledger was observed here |
| `src/triggers/scheduler.ts` | Cron parser called with schedule only; timer every 60 seconds | No explicit timezone passed here; verify host-timezone/DST and timing requirements |
| `src/runtime/engine.ts` | stop stops timer then drains all chat queues | Stop may finish queued processing/sends before disconnect; it is not an immediate outbound kill switch |
| `src/config/schema.ts` and `src/runtime/engine.ts` | auth.dir/db.path accepted in project schema; Engine calls wu-cli loadConfig() without those values | These project fields do not establish isolation in this Engine; inspect underlying path behavior |
| `src/config/paths.ts` | Declares WA_AGENT_HOME | Its presence alone does not prove connection/database isolation |
| `src/tools/builtin/handoff.ts` | Sets handoff state, then sends chat summary to operator and confirmation to customer | Handoff sends/discloses externally; it is not merely an internal pause |
| `src/tools/builtin/fetch-url.ts` | local fetch of model-provided URL; Jina forwards URL to r.jina.ai | No network allowlist in this tool; protect internal targets/redirects and private URL disclosure |
| `src/tools/registry.ts` | Imports .ts/.js modules and expects callable factory; built-in names resolved before custom | README's defineTool example does not match this observed loader contract; same-name custom tools cannot override built-ins here |
| `src/cli/init.ts` | Scaffolds catch-all route, send/web tools, profile extraction enabled and older model example | Do not deploy generated defaults as a restricted monitoring configuration |
| `src/config/loader.ts` | Undefined environment interpolation becomes empty string with warning | Validate required secrets' presence without printing values; missing values are not a safe configured integration |

## Review limits

README advertises features and MIT licensing, but the inspected root has no standalone LICENSE file. Do not copy upstream source into a distributed skill package without resolving licensing material. This skill contains original operating guidance and links to source, not bundled upstream code.

No full vulnerability/dependency audit, runtime compatibility assessment, Windows service installation, model-provider verification or live WhatsApp test was performed. Findings above describe concrete code paths, not a claim that any user's account is compromised.
