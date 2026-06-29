---
title: "Primary portfolio project index"
type: "project_index"
subtype: "navigation"
status: "active"
tags: ["portfolio", "projects", "index", "rag-navigation"]
aliases: ["main projects", "portfolio projects", "bao projects"]
updated: "2026-06-30"
contains_pii: false
---

# Primary Portfolio Project Index

This file is a retrieval entry point for Bao's flagship projects and public-safe linking policy.

## RAG Aliases
Primary projects, main projects, portfolio projects, Bao projects, Vo Dinh Quoc Bao projects, Arbitext, Arbitex, MarketGap, MarketGap VN, OmniPilot, OmniPilot AI, TruyenVietHay.

## Summary
Bao's main projects in this RAG corpus are Arbitext, MarketGap VN with MarketGap, OmniPilot AI, and TruyenVietHay.

GitHub profile: https://github.com/quocbao201104

Project source policy: use public product domains instead of project-specific GitHub repository links for Arbitext, MarketGap, MarketGap VN, and TruyenVietHay. OmniPilot AI has no public product domain in the corpus, so describe it from architecture and implementation scope instead of inventing a link.

## Arbitext / Arbitex
Arbitext is an AI translation platform for documents at `https://arbitext.com`. It translates documents (DOCX, PDF, text) with LLMs, then enforces quality through automatic checks, glossary/terminology rules, and automatic repair of flagged sections, followed by a human review-and-approve step before export. Built on a Node.js + PostgreSQL backend, a Next.js web app, and a Python translation worker, with multiple LLM providers (OpenAI, Anthropic, OpenRouter, xAI) behind routing and failover. Use the product domain instead of a project repository link.

Best query matches: AI translation platform, document translation, LLM translation quality, glossary enforcement, terminology control, human review workflow, translation export, provider routing, Node.js, PostgreSQL, Next.js, Python worker.

## MarketGap VN + MarketGap
MarketGap is a market opportunity research tool for sellers sourcing from 1688 (China) to Shopee Vietnam at `https://marketgap.com`. It finds products with strong Shopee demand but weak or early competition, scores each opportunity (demand, competition, margin, risk), and gives a clear recommendation — import-test, watch, or skip. A Python data engine gathers and scores opportunities (including image-search market checks); the MarketGap VN dashboard (Next.js + PostgreSQL) shows a ranked opportunity board, product detail and competitor views, and a market radar, with save/watch/reserve actions and subscription plans paid through payOS. Use the product domain instead of project repository links.

Best query matches: market gap, 1688, Shopee Vietnam, product opportunity research, image search, opportunity score, opportunity board, competitor analysis, market radar, SaaS dashboard, payOS, subscription, Next.js, PostgreSQL, Python.

## OmniPilot AI
OmniPilot AI is an AI agent that handles a Shopee shop's customer chat 24/7. It reads new buyer messages, understands intent, looks up the shop's own product and policy knowledge, drafts a reply, and (when the seller enables auto-send) sends it — with safety rules for risky buyers, off-platform requests, and reviews, plus a seller-controlled kill-switch. It is delivered as a Chrome extension (Manifest V3, Vue 3) that works inside Shopee, backed by a Fastify server that holds the AI and the shop's knowledge base; the split keeps credentials and customer data protected. No public product domain is stated in the corpus.

Best query matches: OmniPilot, Shopee selling agent, AI customer chat agent, autonomous chat, knowledge-grounded replies, RAG, Chrome extension, Manifest V3, Fastify, Vue 3, auto-send, kill-switch, AI seller assistant.

## TruyenVietHay
TruyenVietHay is a Vietnamese story reading and audio platform at `https://truyenviethay.id.vn/`. Readers can read serialized stories and listen to audio versions with saved progress, plus discovery, community features (comments, ratings, realtime chat, notifications), gamification (levels, points, rewards, a shop), and author/admin tools. Built on a Node.js/Express + Socket.io backend with MySQL and Redis, a Vue 3 frontend, and CDN/object-storage delivery for chapters and audio. Use the product domain instead of a project repository link.

Best query matches: story platform, reading app, audio stories, Vietnamese novels, web novel, gamification, community, author tools, Node.js, Express, Socket.io, Vue 3, MySQL, Redis, CDN.

## Honest Boundaries
Repository evidence proves the product's features, architecture, and tech stack. It does not prove public user counts, revenue, team size, or request volume. If asked about those, the assistant should say the RAG corpus does not include verified metrics.
