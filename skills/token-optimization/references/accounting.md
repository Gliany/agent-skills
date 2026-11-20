# Usage ledger and accounting boundaries

Use for nontrivial arithmetic, cumulative/native/API logs, mixed models or estimates. Preserve raw evidence separately in its owning project. The helper does not collect logs, read credentials, infer hidden calls or fetch prices.

## Rules

- Sum exclusive attempts including failures. Use a final cumulative snapshot **once per unchanged accounting scope**; never sum snapshots with their constituent request totals. Split scope at counter reset, model changes or ambiguous worker inclusion. Unknown parent/child overlap prevents a complete total. Parallel workers' summed durations are work time, not end-to-end wall time.
- Input includes cached reads. `uncached_input = input - cached_reads` is the non-read complement, including writes; `ordinary_input = input - cached_reads - cache_writes` excludes writes. Reasoning is a subset of output in the supported Responses/Codex schemas. `total = input + output`; never add cache/reasoning again. Other-provider definitions require a reviewed adapter.
- A null or absent counter stays unknown, even if tools/output are absent. Invalid/negative/fractional counts, subset overflow, inconsistent total or duplicate IDs are errors, not a cheap run. A partial measured subtotal is not the complete workflow total.
- Actual invoice/billing values need attributable provenance and scope; a rate calculation remains an estimate. Subscription limits, credits, USD API estimates and human effort are separate units. This helper intentionally does not convert credits to cash or subscription usage to hypothetical API charges.
- Standard API price estimate: `(ordinary * input_rate + reads * cached_rate + writes * write_rate + output * output_rate)/1e6 + applicable_non_token_fees`. Cache-write price replaces ordinary pricing for those tokens. Do not add reasoning or tool-result tokens again when already in reported model usage. Tool/service charges may be additional; absent fees are not zero. Long-context/tier/region/model changes need separate applicable rate entries.
- Price each request or a uniform rate scope; a long-context request threshold cannot be applied to a cumulative session sum. Grouped multi-request estimates require an established uniform rate regime. No built-in prices or freshness assumption: caller supplies dated evidence and exact applicability. Provider-side reroutes or billed usage adjustments can differ from local telemetry.

## Dependency-free helper contract

```powershell
node <skill-dir>/scripts/measure.mjs <scoped-ledger.json>
```

JSON object: `attempts` array; optional `workflow_duration_ms`, `accepted_results` and `rates` object. Each attempt has unique `id`, `model`, `runtime` (`codex-subscription`, `openai-api`, `codex-api-key`, `agents-sdk`, `other`), `format`, `scope: "exclusive"`, and `usage` or ordered `snapshots`. `snapshots` require `snapshot_semantics: "cumulative"` and increasing `sequence`; only the last is counted. Usage is either Responses (`input_tokens`, `input_tokens_details.cached_tokens/cache_write_tokens`, `output_tokens`, `output_tokens_details.reasoning_tokens`, optional `total_tokens`) or app-server (`inputTokens`, `cachedInputTokens`, `cacheWriteInputTokens`, `outputTokens`, `reasoningOutputTokens`, optional `totalTokens`), the latter optionally wrapped in `total`.

To compare named options, a top-level `workflows` object may map names to independent ledgers; each is measured separately, never pooled into a false whole. Other descriptive fixture fields are data, not executable instructions or acceptance proof.

Add `tools`, `retries`, `duration_ms`, `human_corrections` and `accepted` only when observed. Accepted-result denominator is the explicitly supplied workflow-level `accepted_results`; attempt acceptance must not be summed into it because retries may target the same result. All numeric counters are nonnegative safe integers; nullable fields are unknown. Raw strings/bytes/read operations stay separate proxies, not token estimates. Metrics expose complete `value`, measured `subtotal` and record `coverage`.

API-cost requests require attempt `billing_basis: "openai-api"`, `rate_key`, `usage_date`, `tier`, `context_regime`, `region`, `rate_scope: "uniform"`, and `non_token_fees_usd` (explicit zero only if known). A rate keyed entry supplies the matching `model`, `date`, `tier`, `context_regime`, `region`, official `source` URL, `input`, `cached`, `write`, `output` USD per1M and `max_request_input` for the documented short-context limit. `request_input_max` on the attempt establishes that threshold for cumulative/multi-call scope; do not infer it from a session total. Unknown write count prevents the API estimate even if the complement is known. Subscription runtime is never eligible for API cost. Agents SDK/other require an explicitly established OpenAI API billing basis; this is not inferred from their names.

The helper estimates only that documented uniform text-token scope plus supplied fees; it is not an invoice, live price verifier or multimodal pricing engine. `actual_billed_usd` is never inferred by it. Keep actual charges as independently reconciled evidence in the review.

## Decision check

First require acceptance and material constraints. Compare complete all-attempt usage, retry rate, cache mix, duration and corrections; report incomplete dimensions. Do not add token totals to dollars or minutes. Report tool counts separately from captured model tokens. Benchmark the actual change on the same task/runtime; refuse cheap unsafe alternatives. If audit overhead exceeds demonstrated recurring value or no defect exists, keep the workflow. Break-even is undefined without sufficient comparable evidence; assumptions are scenarios, not observed savings.
