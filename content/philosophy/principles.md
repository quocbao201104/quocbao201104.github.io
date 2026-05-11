---
title: "Engineering principles"
type: "philosophy"
status: "active"
---

# Principles

## Reliability first
- Prefer idempotent writes for external data flows. Example: MarketGap VN uses stable snapshot UIDs so repeated ingest updates the same snapshot instead of duplicating rows.
- Keep long-running work out of request paths. Example: Arbitext uses worker stages and internal callbacks; TruyenVietHay uses cron jobs for stats, cleanup, rewards, inventory, view sync, and reconciliation.
- Add explicit stop conditions and runbooks before production-like deploys. Example: Arbitext has production readiness, launch check, launch rehearsal, backup, and restore flows.
- Track retries and provider failures as operational signals, not just exceptions. Example: Arbitext reports provider credential outcomes and supports cooldown/failover.

## Secure by default
- Auth and permission checks belong near the boundary: route guards, middleware, session verification, and role checks should be clear before business logic runs.
- Secrets should be loaded from environment or credential stores and never committed. Arbitext also supports DB-backed provider credentials with encrypted-at-rest direction.
- Public ingest and webhook endpoints need shared secret, bearer token, signature, or provider verification. MarketGap VN rejects invalid ingest/payment calls.
- For realtime systems, socket identity must come from verified auth, not client-supplied user IDs.

## Clear boundaries
- Keep data engines separate from SaaS user/billing logic. MarketGap crawler remains the internal engine; MarketGap VN is the product shell and subscription dashboard.
- Use layered backend architecture: route -> controller -> service -> model/store. TruyenVietHay follows this pattern for many domains.
- Put shared contracts in docs or schema files. MarketGap VN has a snapshot ingest contract; Arbitext keeps prompt/rule registries and database migrations repo-authored.
- Keep AI stages explicit. Arbitext separates analyzer, draft, deterministic gate, arbiter, recheck, review, and export so each stage can be tested and debugged.

## Operate what you build
- Build admin and ops surfaces early when the system has queues, payments, provider calls, or ingest jobs.
- Capture evidence for readiness: git status, migration status, tests, launch checks, and environment validation.
- Prefer structured logs and health endpoints for background work.
- Treat RAG content as production data: use factual chunks, evidence notes, aliases, and honest boundaries so the assistant retrieves truth instead of vibes.
