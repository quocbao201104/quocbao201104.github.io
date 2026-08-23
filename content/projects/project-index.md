---
title: "Primary portfolio project index"
type: "project_index"
subtype: "navigation"
status: "active"
tags: ["portfolio", "projects", "index", "rag-navigation"]
aliases: ["main projects", "portfolio projects", "bao projects"]
updated: "2026-08-24"
contains_pii: false
---

# Primary Portfolio Project Index

This file is the retrieval entry point and card-order source for Bao's current portfolio projects.

## Card Order
- omnipilot
- marketing-practitioner
- truyenviethay
- trustworthy-agentic-systems
- marketgap

## RAG Aliases
Primary projects, main projects, portfolio projects, Bao projects, OmniPilot, OmniPilot AI, Marketing Practitioner, marketing-practitioner-skill, TruyenVietHay, Trustworthy Agentic Systems, trustworthy-agentic-systems, MarketGap, MarketGap VN, BAO.OS.

## Current Story
Bao's project portfolio is intentionally grouped by status rather than pretending every project is equally current:

1. **Building — OmniPilot:** the active commercial project and deepest current product work.
2. **Building in Public / Researching — Marketing Practitioner:** active open-source research-first marketing decision system for AI agents, with a decision-first runtime, evidence/claim boundaries, addressable just-in-time knowledge, platform/content and commerce/product-discovery models, and adversarial evals.
3. **Shipped — TruyenVietHay:** a completed full-stack system with public source that can be inspected directly.
4. **Researching — Trustworthy Agentic Systems:** ongoing research with falsification-first gates and a preregistered durable-execution benchmark; authoritative held-out results are still unseen.
5. **Explored — MarketGap:** a paused but technically substantial private R&D/product track whose engine and SaaS remain reusable IP.

GitHub profile: https://github.com/quocbao201104

## OmniPilot
OmniPilot is a seller-controlled Shopee AI sales agent built as a Chrome Manifest V3 extension plus a Fastify backend. The extension owns the Shopee session and durable local runtime state; the backend owns LLM/RAG, ingestion, and server-side knowledge. The design emphasizes durable state, idempotent decisions, fail-closed gates, marketplace-compliance bypasses, seller control, and a global/per-shop kill-switch. Source remains private.

## Marketing Practitioner
Marketing Practitioner is an active open-source research-first marketing decision system for AI agents. It is not a prompt or copy-template collection. The runtime starts from the current job, preserves already-resolved decisions, identifies the remaining open decision, and loads only evidence or knowledge that can materially change it. The repository combines marketing research, evidence and causal boundaries, a shared content/distribution model, commerce/product-discovery reasoning, platform-specific modules, addressable just-in-time knowledge routing, and eval/adversarial review artifacts. Current releases also include a task-specification layer for turning rough user requests into the smallest sufficient working specification without inventing missing facts or reopening resolved decisions.

Public source: https://github.com/quocbao201104/marketing-practitioner-skill

The repository deliberately does not claim universal platform theory, access to private ranking systems, guaranteed campaign lift, or runtime reliability across every agent host.

## TruyenVietHay
TruyenVietHay is a completed Vietnamese reading/audio platform with Vue 3, Node.js/Express, MySQL, Redis, Socket.io, background jobs, object storage, and CDN-backed chapter/audio delivery. Its source is now public at https://github.com/quocbao201104/TruyenVietHay and the deployment domain is https://truyenviethay.id.vn/.

## Trustworthy Agentic Systems
Trustworthy Agentic Systems is an active research track on durable knowledge, provenance, authority, temporal correctness, and effect governance in long-lived agents. Current benchmark work studies whether an already-produced action occurrence can remain bound to the exact committed external effect occurrence after a crash/recovery boundary. The benchmark design and adjudication rules are frozen before authoritative held-out results are observed. The research repository remains private until release.

## MarketGap
MarketGap is a paused private product/R&D track. A Python headless engine crawls and deduplicates source products, performs Shopee market matching, enriches supply evidence, computes explainable opportunity/risk signals, and publishes a versioned read-model contract. A separate Next.js/PostgreSQL SaaS handles user-facing exploration, auth, entitlements, actions, and payOS billing. It should not be described as a currently live product unless fresh evidence says so.

## Public Supporting Evidence
- BAO.OS source: https://github.com/quocbao201104/quocbao201104.github.io
- CD1-2: https://github.com/quocbao201104/CD1-2
- Audio Ingest: https://github.com/quocbao201104/Audio-Ingest

## Honest Boundaries
Repository evidence can support implementation, architecture, tests, contracts, and engineering decisions. It does not by itself prove public adoption, revenue, production scale, comparative superiority, or research publication validity.
