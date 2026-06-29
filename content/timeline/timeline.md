---
title: "Timeline"
type: "timeline"
---

# Timeline

## 2026-05 → Present — MarketGap VN SaaS
- Built a Next.js/React/TypeScript SaaS dashboard for MarketGap's product opportunity data.
- Modeled PostgreSQL data with Prisma for users, plans, subscriptions, payments, and the opportunity/competitor/radar data the engine produces.
- Implemented idempotent ingest of the data engine's results so re-syncing the same data updates cleanly instead of duplicating it.
- Added auth, subscription/entitlement logic, payOS checkout/webhook flow, the opportunity board and detail/competitor/radar views, and tests.

## 2026-04 → Present — Arbitext AI Translation Platform
- Built a monorepo with Node.js API control plane, Next.js product shell, and Python worker runtime.
- Implemented document ingestion, parsing, cleaning, segmentation, context analysis, LLM drafting, deterministic gates, arbiter repair, review, export, and provider routing.
- Added production readiness checks, migration status tools, launch rehearsal scripts, Docker/Caddy deployment shape, storage abstraction, and runbooks.
- Worked on provider ops for OpenAI, Anthropic, OpenRouter, and xAI with DB-backed credential resolution and usage tracking.

## 2025-06 → Present — TruyenVietHay Platform
- Built and maintained Node.js services for story delivery, audio workflows, user activity features, gamification, shop/inventory, reports, and author tools.
- Separated metadata APIs from CDN-served chapter and audio assets to reduce backend pressure on high-read and high-listen flows.
- Implemented JWT, Google OAuth, role-based authorization, Redis caching, Socket.io realtime, notification queues, and cron automation.
- Added migrations, tests, validators, transactions, cache invalidation, SEO/sitemap planning, and deployment docs.

## 2026-04 → Present — MarketGap Data Engine
- Developed a Python data engine for 1688-to-Shopee-Vietnam product opportunity research.
- Built scheduled stages for crawling sources, grouping duplicate listings, checking the Shopee market with image search, scoring opportunities (demand, competition, margin, risk), and publishing finished results to the dashboard.
- Kept the data engine separate from the user-facing app so the dashboard reads only finished, normalized results.

## 2026-06 → Present — OmniPilot AI Shopee Agent
- Built an AI agent that handles a Shopee shop's customer chat 24/7, delivered as a Chrome MV3 extension (Vue 3) plus a Fastify backend.
- Implemented knowledge-grounded (retrieval-augmented) replies from the shop's product specs, policies, and FAQs, with seller-controlled auto-send and a kill-switch.
- Added safety handling for risky buyers, off-platform requests, and customer reviews, and a client/server split that keeps AI credentials and customer data protected.

## 2022-09 → Present — Information Technology Student
- Focused on software engineering, databases, web architecture, backend systems, and applied AI tooling.
- Used side projects to practice production thinking around auth, persistence, caching, queues, deployment, testing, and maintainability.
- University name, major details, GPA, and coursework are not included in the current RAG corpus.
