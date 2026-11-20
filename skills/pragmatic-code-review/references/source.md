# Source and adaptation

Adapted from [OneRedOak/claude-code-workflows](https://github.com/OneRedOak/claude-code-workflows), commit `6a653445125da828f31af473fcdd3cf29f99be82`, retrieved 2026-10-04.

Upstream files:

- [code-review/pragmatic-code-review-subagent.md](https://github.com/OneRedOak/claude-code-workflows/blob/6a653445125da828f31af473fcdd3cf29f99be82/code-review/pragmatic-code-review-subagent.md)
- [code-review/pragmatic-code-review-slash-command.md](https://github.com/OneRedOak/claude-code-workflows/blob/6a653445125da828f31af473fcdd3cf29f99be82/code-review/pragmatic-code-review-slash-command.md)

Copyright (c) 2025 Patrick Ellis. The upstream MIT license is preserved in [LICENSE](../LICENSE).

This Codex adaptation replaces Claude slash-command expansion, agent model/tool declarations, and mandatory subagents with ordinary Codex skill instructions and available tools. It preserves the workflow's review focus and evidence-based reporting, makes Git scope explicit, and separates observed results from unavailable checks. GitHub Actions templates and automatic external posting are outside this local skill implementation.

