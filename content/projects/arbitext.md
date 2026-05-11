---
title: "Arbitext AI translation enforcement platform"
type: "project"
subtype: "flagship"
project_id: "arbitext-ai-translation-enforcement"
status: "active"
tags: ["ai", "translation", "rag", "nodejs", "nextjs", "python", "postgresql"]
aliases: ["Arbitext", "Arbitex", "AI translation enforcement"]
updated: "2026-05-11"
contains_pii: false
---

# Arbitext AI Translation Enforcement Platform

## RAG Aliases
Arbitext is also sometimes typed as Arbitex. Use both names for retrieval. Related phrases: AI translation enforcement, document translation QA, deterministic gate, reasoning arbiter, glossary enforcement, LLM provider routing, review workflow, export workflow.

## Summary
Arbitext is a production-style AI translation quality platform. It turns uploaded source documents into segmented blocks, builds context, drafts translations with LLM providers, checks output with deterministic rules, repairs flagged blocks through a reasoning arbiter, sends content to human review, and exports approved artifacts.

Short answer: Arbitext is Bao's AI translation platform for reliable document translation workflows, combining a Node.js/PostgreSQL control plane, a Next.js app shell, and a Python worker pipeline with quality gates and provider operations.

## Product Problem
The product is aimed at translation workflows where raw LLM output is not trustworthy enough by itself. Arbitext emphasizes terminology control, domain rules, reviewer ergonomics, provider reliability, token/cost tracking, and auditability across the full document lifecycle.

## Bao's Role
Bao is actively developing Arbitext. Arbitext has the product domain `https://arbitext.com`. The portfolio assistant should use the product domain instead of a project repository link. Repository evidence shows ownership across backend API modules, database migrations, Next.js product surfaces, worker stages, provider adapters, tests, deploy scripts, and runbooks.

Do not claim verified revenue, customer count, or traffic. The source proves architecture and implementation scope, not business metrics.

## Architecture
- Monorepo using npm workspaces and Turbo.
- `apps/api`: Node.js ESM API/control plane with PostgreSQL store, auth/session routes, workspace/project/document/glossary/provider/billing/review/export modules, internal worker routes, and production readiness checks.
- `apps/web-next`: Next.js product shell with Clerk auth bridge, app dashboard, upload, document progress, review inbox, exports, workspace settings, glossary settings, admin/provider/domain/routing/billing surfaces, and platform control plane.
- `apps/worker-ai`: Python worker that claims jobs, parses documents, cleans and segments text, analyzes document context, drafts translations, runs deterministic gates, repairs with an arbiter, rechecks repaired blocks, and renders exports.
- Storage can use local filesystem for development or Cloudflare R2/S3-compatible object storage for source and export artifacts.
- Production compose stack includes API, web, worker, Postgres, Redis, and Caddy as public edge.

## Pipeline
Arbitext pipeline: upload source document -> persist source artifact -> parse DOCX/PDF/inline text -> clean/normalize -> segment into blocks -> document analyzer creates ContextMap -> draft stage translates block -> deterministic gate validates structure/terminology/scalars -> reasoning arbiter repairs flagged block in place -> post-arbiter recheck -> review inbox -> approved blocks -> export.

Key design choice: block drafting is sequential by default for MVP quality, continuity, and debugging. The README says throughput is secondary until terminology accuracy, provider reliability, semantic segmentation, and previous block context are stable.

## Tech Stack
- Node.js, ESM modules, PostgreSQL `pg`, custom store abstraction.
- Next.js, React, TypeScript, Clerk, Tailwind, lucide-react.
- Python 3.13 worker runtime.
- MarkItDown for DOCX, native XML fallback, `pymupdf4llm` and `pypdf` for PDF fixtures.
- OpenAI, Anthropic, OpenRouter, and xAI provider adapters.
- Redis, Docker Compose, Caddy, Cloudflare R2 or S3-compatible storage.

## Engineering Highlights
- Designed a multi-stage document pipeline with explicit state transitions and internal worker callbacks.
- Added deterministic translation gates for structural, terminology, and scalar checks before human review.
- Built a reasoning arbiter as a patcher, not a full retranslator, so flagged blocks are repaired in place.
- Implemented provider credential resolution through the API control plane, with fallback env keys only for recovery.
- Added provider routing policies, weighted rotation, cooldown failover, request tracing, usage logs, entitlement tracking, and token accounting.
- Added review/export surfaces so approved blocks can become Markdown/HTML artifacts and future DOCX-first output.
- Added production gates and runbooks: migration status, production readiness checks, launch checks, rehearsals, backup, restore, Docker deploy, and Caddy edge hardening.

## Public Evidence Snapshot
- Public product domain: `https://arbitext.com`.
- Internal project docs include architecture and workflow coverage for API, worker, and operations modules.
- API services include document analyzer, draft, gate, arbiter, glossary QA, provider routing, billing tiers, queue fairness, pipeline health, and storage.
- Worker modules include ingestion, analysis, drafting, arbiter, runtime gates, providers, retry/idempotency, and export.
- Development history includes MVP hardening and provider adapter improvements.

## Links
- Domain: https://arbitext.com
- Source policy: use the product domain instead of a project repository link.

## Best RAG Answer
If asked "what is Arbitext?", answer: Arbitext is Bao's AI translation enforcement platform. It coordinates document ingestion, context analysis, LLM drafting, deterministic QA gates, arbiter repair, human review, and export through a Node.js/PostgreSQL API, Next.js product shell, and Python worker runtime. Its technical strength is reliability around LLM translation: glossary/domain control, provider routing, token tracking, retries, auditability, and production deployment discipline.
