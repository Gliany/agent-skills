# Conditional behavioral validation

Use for substantive revisions, competing fixes or interacting instruction owners. Keep a small self-contained review lightweight.

Freeze original prompt, required behavior, target model/effort, actual message slots, tool access, input fixtures and acceptance before comparing. Change one primary cause when possible. A role prompt quoted in an evaluator's user message tests interpretation under that harness; it does not reproduce a production system/developer slot or tool authorization.

Retain a compact requirement-to-evidence mapping: requirement, original/revised instruction, test input, observed result and unknowns. Include normal input, a meaningful boundary/missing-data case, a failure mode and a security/authority case when applicable. An already-good control protects against gratuitous rewriting. For new design, compare against the requested requirements rather than inventing a defective predecessor.

Check task success, required fields/values, factual support, approval and tool scope, missing-data/retry behavior, responsibility and completion, and assumptions added or removed. Where exact JSON/types/values matter, use deterministic checks. Judgment such as usefulness/minimality needs semantic review; passing regexes or a shorter prompt is insufficient.

Compare revised behavior with original behavior on equivalent inputs and tools. Use masked or independent review when practical; avoid revealing intended verdicts. Keep response-order/verbosity bias and sample size in view. Do not count a stronger review explanation as proof the downstream agent improved. If the original already succeeds, report preserved behavior or inconclusive benefit.

Use the existing authorized environment; do not add evaluator services, install packages or run production side effects to complete a comparison. Check current lifecycle before relying on a hosted evaluation product. If testing is blocked, return the proposed correction, untested impact and smallest missing check. Report failed runs as failures, not simulated success.

Separate reviewer input/output/tool/latency from downstream execution and authoring cost. Cached/reasoning telemetry are subsets of totals. Keep every attempt, correction and changed test scope. Human correction time and billing are unknown unless measured. A few successful fixtures justify only bounded confidence; revalidate after a model, tool, instruction-owner or workload change.
