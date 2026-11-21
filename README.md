# agent-skills
A curated collection of custom AI agent skills and scripts, with reusable workflows, references, usage instructions, and verification checks.

A curated collection of 20 custom skills and local adaptations, with required references and four helper script files. Browse [the catalog](CATALOG.md) and [provenance and licensing](PROVENANCE.md).

Use the [Codex backup handoff prompt](prompts/codex-backup-handoff.md) to preserve a chat and its project code in a private backup and add authorized reusable files to this public collection.

Use the [project knowledge sharing prompt](prompts/share-project-knowledge.md) in the chat that owns a project to publish reusable code and instructions after checking for duplicates and removing personal information.

## Install and use

Copy an individual `skills/<name>` folder into your agent's supported skill directory. For a Codex installation that uses `%USERPROFILE%\.codex\skills`, a new skill can be copied as follows. Resolve any existing installation before copying; do not overwrite it silently.

```powershell
$skillSource = Join-Path (Get-Location) 'skills/context-compressor'
$skillDestination = Join-Path $env:USERPROFILE '.codex/skills/context-compressor'
if (Test-Path -LiteralPath $skillDestination) { throw 'Review the existing skill before installing.' }
Copy-Item -LiteralPath $skillSource -Destination $skillDestination -Recurse
```

Invoke `$context-compressor` with the task, or use another skill from the catalog. This collection does not install tools, grant account access, activate automations or provide deployment permissions. Existing environments may use a different skill discovery directory; use their current documentation.

## Optional helpers

- Ledger arithmetic: `node skills/token-optimization/scripts/measure.mjs <scoped-ledger.json>`. Reads only the supplied ledger; see the skill's accounting reference for schema. No external account or current price lookup is performed.
- Local chat retrieval: `node skills/codex-thread-reader/scripts/read-thread.mjs --thread <UUID> --binary <codex-binary>`. Requires an authorized local Codex runtime and starts its App Server. PowerShell users can use `read-thread.ps1 -Thread <UUID> -CodexBinary <codex-binary>`. Read access remains scoped to the user's task; no chat writes are implemented.
- Static HTML accessibility check: `python skills/israeli-accessibility-compliance/scripts/audit_a11y.py --url <authorized-url>`. Requires separately installed `requests` and `beautifulsoup4`. It fetches the target URL and reports static checks; contrast, rendered UI and legal compliance require separate review. Nothing in this package installs these dependencies.

## Offline verification

Requires Node.js with ESM and the built-in test runner, plus Python 3 for syntax compilation of the optional auditor. No npm package installation is needed for the Node helpers.

```text
node --test tests/thread-reader.test.mjs tests/accounting.test.mjs
```

The tests use synthetic records and mocked RPC. They do not launch a live chat session, read a mailbox, message anyone or contact an external account. Historical fixture prices are test inputs, not current price guidance. Browser workflows, provider access, runtime protocol compatibility and live account effects are unverified by these checks. Recheck relevant current official behavior before implementation.

## Gateway examples and workflow notes

See the [photo validation package](scripts/whatsapp-photo/README.md) for its separate npm dependency installation and offline tests. The [daily review workflow](skills/whatsapp-business/references/daily-review.md) and [startup diagnostic method](skills/wa-agent-integration/references/desktop-startup-diagnostics.md) document reusable operating lessons. These are components and instructions, not a turnkey assistant or live-service activation.
