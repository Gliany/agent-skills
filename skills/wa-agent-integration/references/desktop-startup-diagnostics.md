# Desktop, background runtime and browser access

This is a diagnostic method from a local integration investigation, not an official product configuration recipe or a confirmed browser fix.

## Distinguish the connections

A desktop window, a background App Server, a mailbox worker, a WhatsApp client and a Chrome extension can have separate lifecycles. A healthy WhatsApp connection does not prove general browser-tab access. An installed extension or registered native host does not prove a working connection to the active chat runtime.

In the investigated implementation, a startup launcher supplied `CODEX_APP_SERVER_WS_URL` and `CODEX_APP_SERVER_FORCE_CLI` to attach Desktop to a separately running local App Server. These are historical implementation observations, not stable public APIs. A mailbox worker explicitly waited for Desktop to attach to that server. Removing the launcher could therefore pause mail processing. The shared connection was observed; its causal role in the browser failure was not established. A separate profile-permission error was also observed.

## Read-only investigation first

1. Inventory scheduled tasks, Startup entries, launcher scripts and active processes. Record process start times so reopening a window is not mistaken for restarting the process. Keep account identifiers, process arguments containing secrets and raw logs private.
2. Trace the launcher to the exact executable and per-launch environment changes. Inspect service readiness separately from Desktop attachment. Do not infer attachment from the visible window title.
3. Check the extension's own connection status and the supported browser tool's tab inventory. Compare these with native-host registration and bounded recent errors. Do not alter browser profile files to bypass a permission error.
4. Trace dependent workers before changing startup. A "waiting for Desktop" condition is a dependency, not a harmless health message. Preserve writer ownership so multiple runtimes do not claim the same chat.
5. When active work can safely stop, compare a normal desktop launch with the custom launch using a fresh chat and the same browser profile. Record success/failure for each service separately. Do not call the custom launch the cause unless the comparison supports it.

## Repair and reboot acceptance

Choose the smallest evidence-supported change. Prefer a supported connection path. Do not patch application bundles, globally disable permissions or blindly remove worker checks. Launch background helpers hidden, with bounded retries and explicit health states; reserve visible windows for interactive apps. A blank PowerShell window warrants checking its parent and launch arguments before closing anything.

Back up the exact task definitions and changed scripts privately. Test normal start, repeated start without duplicate processes, delayed network readiness, worker reconnect, browser inventory, mailbox coverage and WhatsApp intake. Test actual reboot recovery separately when authorized; a successful manual launch is not reboot proof. Keep a rollback that restores the previous task definitions and scripts without replaying pending external actions. Publish only sanitized findings, never private task exports or runtime logs.
