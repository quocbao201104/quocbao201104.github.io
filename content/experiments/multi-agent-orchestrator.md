---
title: "Multi-agent orchestrator experiment"
type: "experiment"
status: "active"
---

# Multi-agent orchestrator experiment

## Purpose
This is a research direction for Bao's AI systems work: coordinating multiple specialized workers or agents without losing reliability, traceability, and cost control.

## Source-Backed Inspiration
Arbitext already behaves like a staged agentic pipeline even if it is implemented as deterministic services and workers rather than free-form autonomous agents. It has ingestion, analysis, draft, gate, arbiter, recheck, review, and export stages with explicit status transitions.

## Design Lessons
- Keep the coordinator explicit. A control plane should own job state, retries, status callbacks, usage logs, and audit data.
- Keep workers narrow. Each stage should have one job and clear inputs/outputs.
- Add deterministic gates before expensive reasoning stages.
- Treat LLM providers as routed infrastructure with credentials, cooldowns, fallbacks, and telemetry.
- Human review is a feature, not a failure, when quality matters.

## Status
This is a portfolio research note, not a separate shipped product yet. The strongest production evidence currently comes from Arbitext's worker/control-plane architecture.
