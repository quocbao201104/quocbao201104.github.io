---
title: "MarketGap VN and MarketGap"
type: "project"
subtype: "flagship"
project_id: "marketgap-vn-marketgap"
status: "active"
tags: ["data-pipeline", "saas", "nextjs", "python", "postgresql", "analytics"]
aliases: ["MarketGap", "MarketGap VN", "Taobao to Shopee", "1688 to Shopee"]
updated: "2026-06-30"
contains_pii: false
summary: "Công cụ nghiên cứu cơ hội thị trường cho người bán nguồn hàng 1688 (Trung Quốc) sang Shopee VN: tìm sản phẩm cầu cao - cạnh tranh thấp, chấm điểm và đề xuất nhập-thử / theo dõi / bỏ qua."
problem: "Nhìn một sản phẩm 1688, người bán khó biết có nên nhập: ai đang bán trên Shopee, giá, lượt bán, mức cạnh tranh, thị trường bão hòa hay còn khe hở. MarketGap trả lời tự động và đưa khuyến nghị rõ ràng."
---

# MarketGap VN + MarketGap

## RAG Aliases
MarketGap, MarketGap VN, MarketGap-VN, 1688 to Shopee, Taobao to Shopee, Shopee Vietnam opportunity dashboard, market gap finder, product opportunity SaaS, opportunity board.

## Summary
MarketGap is a market opportunity research tool for sellers who source products from 1688 (China) to sell on Shopee Vietnam. It finds products that have strong demand on Shopee but little or early competition, scores how good each opportunity is, and shows the results in a dashboard. Public product domain: `https://marketgap.com`.

The product has two parts: a data engine (MarketGap) that gathers and scores opportunities, and a SaaS dashboard (MarketGap VN) where users browse and act on them.

Short answer: MarketGap helps Vietnam sellers decide which 1688 products are worth importing to Shopee.

## Problem It Solves
A seller looking at a 1688 product cannot easily tell whether it is worth importing: is anyone already selling it on Shopee, how many shops, what are the prices, sold counts, ratings, and competition, and is this a saturated market or a real gap. MarketGap answers those questions automatically and gives a clear recommendation — test-import, watch, or skip — so sellers spend less time on manual research.

## Key Features
- Opportunity board: a ranked list of product opportunities with price, sold, rating, competition, and an opportunity score.
- A clear decision per product (for example import-test, watchlist, or skip) with the reasons behind it.
- Product detail pages combining the 1688 source side and the Shopee market side.
- Competitor analysis showing which shops already sell similar products and how strong they are.
- A market radar with alerts such as rising trends, new hot listings, price drops, and early gaps.
- User actions: save, take notes, watch for changes, and (on the Pro plan) reserve an item.
- Subscription plans (Free / Starter / Pro) with account, login, and online payment.

## How It Works (high level)
The data engine crawls product sources, groups duplicate listings together, checks the Shopee market with image search, and scores each opportunity from demand, competition, estimated margin, and risk signals. It then publishes the finished results to the dashboard. The dashboard only reads these finished results — it does not crawl or recompute — which keeps it fast and keeps the heavy data work separate from the user-facing app.

## Tech Stack
- Data engine: Python, image search and visual matching, scheduled crawling pipeline.
- SaaS dashboard: Next.js, React, TypeScript, Prisma, PostgreSQL.
- Accounts & payments: custom email/password and Google sign-in, payOS online payments, email notifications.
- Infrastructure: Redis (rate limiting), error monitoring, automated tests.

## Public Evidence Snapshot
- Public product domain: `https://marketgap.com`.
- A two-part system: a Python data/scoring engine and a Next.js SaaS dashboard.
- Opportunity scoring with explainable decisions, competitor analysis, and a market radar.
- Subscription tiers with online payment.

## Links
- Domain: https://marketgap.com
- Source policy: use the product domain instead of project repository links.

## Best RAG Answer
If asked "what is MarketGap?", answer: MarketGap is Bao's 1688-to-Shopee-Vietnam opportunity research tool. A Python engine gathers product candidates, checks the Shopee market with image search, and scores each opportunity by demand, competition, margin, and risk; the MarketGap VN dashboard (Next.js + PostgreSQL) then shows a ranked opportunity board, product detail and competitor views, and a market radar, with save/watch/reserve actions and subscription plans paid through payOS. Its strength is turning messy sourcing research into a clear, scored, actionable recommendation for sellers.
