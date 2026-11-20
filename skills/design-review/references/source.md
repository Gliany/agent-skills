# Source and adaptation

Adapted from [OneRedOak/claude-code-workflows](https://github.com/OneRedOak/claude-code-workflows), commit `6a653445125da828f31af473fcdd3cf29f99be82`, retrieved 2026-10-04.

Upstream files:

- [design-review/design-review-agent.md](https://github.com/OneRedOak/claude-code-workflows/blob/6a653445125da828f31af473fcdd3cf29f99be82/design-review/design-review-agent.md)
- [design-review/design-review-slash-command.md](https://github.com/OneRedOak/claude-code-workflows/blob/6a653445125da828f31af473fcdd3cf29f99be82/design-review/design-review-slash-command.md)
- [design-review/design-principles-example.md](https://github.com/OneRedOak/claude-code-workflows/blob/6a653445125da828f31af473fcdd3cf29f99be82/design-review/design-principles-example.md)

Copyright (c) 2025 Patrick Ellis. The upstream MIT license is preserved in [LICENSE](../LICENSE).

This Codex adaptation replaces Claude slash-command expansion, agent model/tool declarations, and mandatory subagents with ordinary Codex skill instructions and available tools. It preserves the workflow's review focus and evidence-based reporting, makes Git scope explicit, and separates observed results from unavailable checks. GitHub Actions templates and automatic external posting are outside this local skill implementation.

The example design principles are treated as illustrative, not installed as a project-wide design standard. Browser checks use available capabilities; unavailable live or accessibility checks must be disclosed.

