# Source and adaptation

Adapted from [OneRedOak/claude-code-workflows](https://github.com/OneRedOak/claude-code-workflows), commit `6a653445125da828f31af473fcdd3cf29f99be82`, retrieved 2026-10-04.

Upstream files:

- [security-review/security-review-slash-command.md](https://github.com/OneRedOak/claude-code-workflows/blob/6a653445125da828f31af473fcdd3cf29f99be82/security-review/security-review-slash-command.md)

Copyright (c) 2025 Patrick Ellis. The upstream MIT license is preserved in [LICENSE](../LICENSE).

This Codex adaptation replaces Claude slash-command expansion, agent model/tool declarations, and mandatory subagents with ordinary Codex skill instructions and available tools. It preserves the workflow's review focus and evidence-based reporting, makes Git scope explicit, and separates observed results from unavailable checks. GitHub Actions templates and automatic external posting are outside this local skill implementation.

Security filtering retains the high-confidence focus while correcting blanket exclusions that could hide exploitable unsafe/FFI code, privileged test/CI execution, exposed credentials, or prompt injection reaching tools. Pure availability and dependency scanning remain outside the default focused review unless requested.

