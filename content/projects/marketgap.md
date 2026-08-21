---
title: "MarketGap — Product Opportunity Intelligence"
type: "project"
subtype: "explored"
project_id: "marketgap-vn-marketgap"
status: "paused"
eyebrow: "EXPLORED · PAUSED"
icon: "spark"
tags: ["python", "data-pipeline", "nextjs", "postgresql", "vision", "analytics"]
aliases: ["MarketGap", "MarketGap VN", "MarketGap-VN", "1688 to Shopee"]
updated: "2026-08-21"
contains_pii: false
summary: "Paused private R&D/product track that turns 1688 source signals and Shopee market evidence into explainable opportunity decisions through a headless Python engine and separate SaaS read-model layer."
problem: "Sourcing decisions combine messy source listings, duplicate products, visual market matching, margin assumptions, competition, demand, and risk. The system was designed to normalize those signals into evidence-backed decisions instead of a single opaque score."
---

# MarketGap — Product Opportunity Intelligence

## RAG Aliases
MarketGap, MarketGap VN, 1688 to Shopee, Shopee Vietnam opportunity research, product opportunity engine, market gap finder.

## Current Status
**Paused. Private source.** MarketGap is not a current live-product claim. It remains substantial reusable product/R&D IP and is useful as evidence of data-pipeline, scoring, contract, SaaS, auth, and billing engineering.

## System Split
MarketGap intentionally separates computation from presentation:

### Headless Python engine
Pipeline stages include source crawling, pHash/title deduplication, Chinese-title translation, Shopee image/market matching, source-supply enrichment, summary/scoring, and publication of a versioned SaaS payload.

The scoring layer keeps multiple signals separate: demand, visual gap, estimated margin, local gap, data confidence, competition pressure, risk, spam/fake-sold suspicion, price-war indicators, and supply quality evidence. Velocity is used for trend classification rather than blindly boosting the opportunity score. Outputs include decision labels, reasons, risks, next actions, and evidence.

### MarketGap VN SaaS
A separate Next.js/React/TypeScript application consumes normalized engine read models rather than raw crawler APIs. It uses Prisma/PostgreSQL for opportunity/detail/competitor/radar data plus user state.

The SaaS includes custom auth/session handling, save/note/watch/reserve workflows, subscription entitlements, admin controls, Redis-backed rate limiting with fallback, audit logging, Sentry integration, and payOS billing. Payment activation is based on verified webhook truth rather than browser return URLs.

## Data Contract
The engine publishes `engine_sync_v3`; the SaaS validates and upserts it idempotently. Stable identifiers are derived for radar/competitor records where upstream IDs are missing so repeated syncs do not create duplicates.

## Tech Stack
Python, SQLite for engine state, pHash/vision-assisted matching, scheduled jobs, Next.js, React, TypeScript, Prisma, PostgreSQL, Redis, Zod, payOS, Vitest.

## Honest Boundaries
The corpus does not assert that MarketGap is currently operating as a public service, has paying users, or has validated predictive accuracy. It should be described as a paused but technically serious product/R&D track.

## Links
Source remains private. Do not invent or expose private repository links as public evidence.

## Best RAG Answer
MarketGap is Bao's paused 1688-to-Shopee product-opportunity R&D track. A headless Python engine crawls, deduplicates, visually matches, enriches, scores, and explains opportunities, then publishes a versioned read-model contract to a separate Next.js/PostgreSQL SaaS that handles user workflows, entitlements, and billing. Its value in the portfolio is the separation of evidence, scoring, data contracts, and product-shell concerns—not a claim that the service is currently live.
