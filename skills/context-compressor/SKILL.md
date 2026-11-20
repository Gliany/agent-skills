---
name: context-compressor
description: Compress the current conversation or project context into a concise, continuation-ready handoff for another AI agent. Use when the user asks for context compression, a project handoff, `/compress`, or `/compress-min`; do not use for ordinary summaries intended primarily for human readers.
---

# Context Compressor

Produce a standalone replacement for the prior context. Preserve only facts that materially affect safe, correct continuation.

## Select the mode

- `/compress-min`: extreme compression, normally no more than 500 words unless critical technical detail makes that impossible.
- `/compress`: fuller handoff, normally 500-1500 words according to project complexity.
- If neither is specified, use `/compress`.

## Preserve

- Latest decisions; omit superseded decisions unless the transition itself remains operationally relevant.
- Current requirements, constraints, business rules, architecture, and verified project state.
- Exact names for relevant files, paths, components, objects, IDs, APIs, fields, and commands.
- Open questions, blockers, pending tasks, and the next concrete work.
- Authorization and safety boundaries that constrain future actions.

Mark missing or uncertain facts as `UNCONFIRMED`, unresolved items as `OPEN`, and required next work as `NEXT`. Never infer or invent missing details.

## Remove

- Greetings, repetition, conversational narration, and temporary reasoning.
- Explanations already reduced to a stable decision.
- Failed approaches that no longer affect future work.
- Duplicate requirements and nonessential examples.
- Unrelated project or personal context.

Prefer facts over narrative, one fact per line, and compact phrases over full sentences. Merge duplicates. State verification status when it affects whether another agent may rely on a fact.

## Output

Use exactly these sections, retaining an empty section only when its absence could be mistaken for omitted context:

```markdown
# PROJECT

<project name or objective in 1-2 lines>

# CURRENT STATE

- ...

# DECISIONS

- ...

# REQUIREMENTS

- ...

# TECHNICAL

- ...

# OPEN

- ...

# NEXT

- ...
```

Before returning the result, verify internally that an agent given only the compressed context could continue safely without rereading the conversation. Add only missing critical facts. Output the handoff itself without preamble, commentary, or an explanation of the compression process.
