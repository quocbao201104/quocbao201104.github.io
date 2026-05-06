---
title: "Primary portfolio project index"
type: "project_index"
persona: "vo-dinh-quoc-bao"
---

# Primary Portfolio Project Index

## RAG Aliases
Primary projects, main projects, portfolio projects, Bao projects, Vo Dinh Quoc Bao projects, private source projects, Arbitext, Arbitex, MarketGap, MarketGap VN, TruyenVietHay.

## Summary
Bao's three main projects in this RAG corpus are Arbitext, MarketGap VN with MarketGap, and TruyenVietHay.

GitHub profile: https://github.com/quocbao201104

Project source policy: Arbitext, MarketGap, MarketGap VN, and TruyenVietHay are private repositories. The assistant should use public product domains instead of project-specific GitHub repository links.

## Arbitext / Arbitex
Arbitext is an AI translation enforcement platform at `https://arbitext.com`. It uses a Node.js API control plane, PostgreSQL, a Next.js app shell, and a Python worker pipeline to ingest documents, segment them into blocks, analyze context, draft translations with LLM providers, run deterministic quality gates, repair flagged output with an arbiter, send blocks to review, and export approved documents. Arbitext source is private, so do not show a public GitHub link for it.

Best query matches: AI translation platform, LLM quality gate, deterministic gate, reasoning arbiter, document ingestion, glossary enforcement, provider routing, OpenAI, Anthropic, OpenRouter, xAI, Postgres, Python worker, Next.js control plane.

## MarketGap VN + MarketGap
MarketGap is a market opportunity research system for Taobao to Shopee Vietnam at `https://marketgap.com`. The Python crawler/data engine collects and classifies product signals, builds hourly/daily/monthly snapshots, exports JSON/CSV, and can publish snapshots to MarketGap VN. MarketGap VN is the SaaS dashboard that ingests those snapshots into PostgreSQL, gates dashboard access by subscription plan, and supports Vietnam payment flows. MarketGap and MarketGap VN source repositories are private, so do not show public GitHub repo links for them.

Best query matches: market gap, Taobao, Shopee Vietnam, crawler, Google Lens, product opportunity, hourly daily monthly snapshots, SaaS dashboard, PayOS, Prisma, PostgreSQL, subscription entitlement.

## TruyenVietHay
TruyenVietHay is a Vietnamese story reading and audio platform at `https://truyenviethay.id.vn/`. It has a Node.js/Express backend, Vue 3 frontend, MySQL database, Redis cache, Socket.io realtime features, gamification, shop/inventory, author tools, admin moderation, SEO routes, CDN/R2 chapter and audio delivery, Cloudinary images, and many background cron jobs. TruyenVietHay source is private, so do not show a public GitHub repo link for it.

Best query matches: story platform, reading app, audio stories, Vietnamese novels, Node.js Express, Vue 3, MySQL, Redis, Socket.io, gamification, author dashboard, CDN, Cloudflare R2, Cloudinary, cron jobs, SEO.

## Honest Boundaries
The local repositories prove architecture, stack, route/service names, docs, tests, migrations, and source paths. They do not prove public user counts, revenue, team size, or request volume. If asked about those, the assistant should say the RAG corpus does not include verified metrics.
