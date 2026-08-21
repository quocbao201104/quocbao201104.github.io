---
title: "Trustworthy Agentic Systems — State Integrity Research"
type: "project"
subtype: "research"
project_id: "trustworthy-agentic-systems"
status: "research_in_progress"
eyebrow: "RESEARCHING · IN PROGRESS"
icon: "shield"
tags: ["agent-runtimes", "durable-execution", "provenance", "benchmarking", "state-integrity"]
aliases: ["Trustworthy Agentic Systems", "trustworthy-agentic-systems", "agent state integrity", "durable action effect binding"]
updated: "2026-08-21"
contains_pii: false
summary: "Ongoing research on durable agent-state integrity: provenance, authority, temporal correctness, and whether an action occurrence remains bound to the exact committed external effect occurrence across crash/recovery boundaries."
problem: "Persistent agents can retain rich traces yet still lack the typed state needed to reconstruct which action caused which committed effect after failures, retries, policy changes, or recovery. The research tests those boundaries without assuming a novel formal contribution exists."
---

# Trustworthy Agentic Systems — State Integrity Research

## RAG Aliases
Trustworthy Agentic Systems, agent state integrity, durable agent execution, provenance, authorization, temporal correctness, action-to-effect binding, governance-interface-complete trace.

## Current Status
**Research in progress. Repository private until release.** As of 2026-08-21, the active A0.3 benchmark design, implementation, population, and adjudication protocol are frozen, but the authoritative held-out results have **not been run or observed**.

## Research Scope
The repository studies selected state-integrity problems in long-lived agents rather than claiming comprehensive AI safety. Core distinctions include:

- retrieved does not automatically mean authoritative;
- persisted does not automatically mean canonical;
- current state is not automatically historically available state;
- version history is not automatically decision provenance;
- an observed external effect is not automatically bound to the exact model/tool action occurrence that produced it.

## Method
The research process is deliberately adversarial:

- start from established literature and a strong conventional/null baseline;
- attack novelty rather than infer it from complexity or CI success;
- abandon or narrow hypotheses that do not survive counterexamples/prior art;
- freeze benchmark semantics, implementation, held-out population, and claim ceiling before authoritative evaluation;
- preregister deterministic aggregation/adjudication rules and bind artifacts mechanically before seeing held-out results.

A previous broad formal/composition direction was not carried forward after adversarial review. The current track is empirical and does not treat that abandoned hypothesis as a result that needs rescuing.

## Current A0.3 Object
The benchmark studies this failure boundary:

`model action → external effect commits → tool result is not durably accepted → process dies → fresh recovery → retry/replay/re-execution`

The question is whether the runtime record preserves enough identity/observability to bind the original action occurrence to the exact committed effect occurrence after recovery, and what additional supported instrumentation is required.

Matched-boundary pilot evidence was sufficient for an independent verdict to proceed to benchmark freeze. That does **not** establish the final held-out result, universal runtime rankings, or publication validity.

## Claim Ceiling
Any eventual claim must remain scoped to tested runtime versions, tested durable-agent execution paths, and the frozen benchmark conditions. The project does not claim exactly-once semantics were violated, that provider call IDs are universal durable operation IDs, or that idempotency/outbox/WAL techniques cannot repair duplicate effects.

## Links
Research source is private until release; do not expose a private GitHub URL as if it were public.

## Best RAG Answer
Trustworthy Agentic Systems is Bao's ongoing research on durable state integrity in persistent agents. The current empirical benchmark focuses on action-to-effect binding across a commit-before-receipt crash boundary. The process uses prior-art attack, falsification-first gates, frozen implementation/population, preregistered adjudication, and a narrow claim ceiling. As of 2026-08-21, authoritative held-out results are still unseen.
