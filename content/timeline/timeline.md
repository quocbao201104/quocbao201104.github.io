---
title: "Engineering timeline"
type: "timeline"
status: "active"
updated: "2026-08-24"
contains_pii: false
---

# Engineering Timeline

## 2026-08 → Present — Marketing Practitioner
- Building an open-source research-first marketing decision system for AI agents rather than a prompt/template collection.
- Evolved the runtime around the current job, resolved state, open decision, dependency-first loading, evidence/claim boundaries, and minimum sufficient output.
- Added shared content/distribution and commerce/product-discovery models with platform modules for Facebook, Instagram, LinkedIn, TikTok, X, Google commerce, Amazon, TikTok Shop, Shopee, Etsy, and Lazada.
- Added addressable just-in-time knowledge routing, deterministic semantic-section/source lookup, targeted routing checks, adversarial review artifacts, and task-specification guidance for underspecified user requests.
- Public source: https://github.com/quocbao201104/marketing-practitioner-skill

## 2026-08 → Present — Trustworthy Agentic Systems
- Started/continued a research track on durable agent-state integrity, provenance, temporal correctness, authority, and effect governance.
- Used adversarial review and strong null hypotheses to discard or narrow weak formal ideas instead of forcing novelty.
- Current A0.3 work freezes benchmark semantics, implementation, held-out population, and adjudication rules before authoritative evaluation.
- As of 2026-08-21, authoritative held-out results remain unseen.

## 2026-06 → Present — OmniPilot
- Building a seller-controlled Shopee AI sales agent as a Chrome MV3 extension + Fastify backend.
- Added local-first durable state, retry/recovery paths, idempotent decisions, a durable send queue, stale-send protection, RAG/knowledge ingestion, deterministic compliance/risk gates, observability, and kill-switches.
- Source remains private because it is active commercial work.

## 2026 — TruyenVietHay — Completed
- Completed a full-stack Vietnamese reading/audio platform with Vue 3, Node.js/Express, MySQL, Redis, Socket.io, PWA support, gamification, author/admin tooling, and background jobs.
- Separated application metadata/state from CDN/object-storage delivery for chapter JSON and audio assets.
- Source was made public in August 2026 for inspectable engineering evidence: https://github.com/quocbao201104/TruyenVietHay

## 2026-04 → Paused — MarketGap
- Built a Python headless engine for 1688-to-Shopee product-opportunity research: crawl, dedupe, translation, visual/market matching, source enrichment, explainable scoring, and versioned read-model publication.
- Built a separate Next.js/PostgreSQL SaaS for auth, opportunity exploration, saved/watch/reserve actions, subscriptions, audit, and payOS billing.
- The product/R&D track is paused; private source remains reusable IP rather than a current live-product claim.

## 2026-05 → Present — BAO.OS
- Built an interactive React/TypeScript portfolio with command parsing/routing, multiple AI/RAG modes, deterministic local embeddings, Supabase pgvector retrieval, server-side redaction, and an OpenAI-compatible API surface.
- The public deployment currently disables live LLM/RAG to avoid maintaining always-on AI/database infrastructure for portfolio traffic; the implementation remains in source for inspection or later reactivation.

## Ongoing Pattern
Across these systems, the recurring focus is explicit state, recovery, bounded automation, trust boundaries, observability, evidence, uncertainty, and preserving the distinction between what a system can produce and what its evidence actually supports.
