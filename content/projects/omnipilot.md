---
title: "OmniPilot — Shopee AI Sales Agent"
type: "project"
subtype: "flagship"
project_id: "omnipilot-ai-shopee-agent"
status: "active"
eyebrow: "BUILDING · COMMERCIAL"
icon: "brain"
tags: ["typescript", "chrome-mv3", "fastify", "rag", "durable-state", "reliability"]
aliases: ["OmniPilot", "OmniPilot AI", "Shopee selling agent", "Shopee chat agent"]
updated: "2026-08-21"
contains_pii: false
summary: "Seller-controlled Shopee AI sales agent with local-first durable state, grounded replies, deterministic safety gates, recoverable send execution, and explicit kill-switches."
problem: "Automating marketplace chat is not just text generation: the system must survive browser-worker restarts, avoid duplicate or stale sends, keep marketplace credentials separated from AI secrets, and prevent the model from gaining unrestricted effect authority."
---

# OmniPilot — Shopee AI Sales Agent

## RAG Aliases
OmniPilot, OmniPilot AI, Shopee AI sales agent, Shopee chat automation, seller-controlled agent, Chrome MV3 agent.

## Current Status
**Active commercial project. Private source.** OmniPilot is the main project currently being built. Public portfolio material should describe verified architecture and implementation without inventing a product URL, customers, revenue, or marketplace approval status.

## Summary
OmniPilot handles Shopee buyer conversations for a seller: detect new messages, resolve intent, retrieve shop knowledge, draft a grounded response, and optionally execute the send when the seller enables automation. Its defining engineering concern is bounded, recoverable automation rather than unconstrained autonomous chat.

## Architecture
OmniPilot deliberately splits trust boundaries:

- **Chrome Manifest V3 extension:** owns the Shopee session, platform reads/writes, local durable state, runtime decisions, and send execution.
- **Fastify backend:** owns LLM credentials, RAG/knowledge services, raw-ingest processing, policy/fact validation, telemetry, and kill-switch state.
- **Signed boundary:** extension-to-backend requests are authenticated; Shopee cookies/session credentials are not moved into the AI backend.

The extension stores durable runtime state in Dexie/IndexedDB because MV3 service workers may disappear at any time. Background work is scheduled with `chrome.alarms` instead of assuming a continuously alive process.

## Reliability and Recovery
- Durable debounce and conversation locks reduce duplicate concurrent processing.
- Conversation cursors and message IDs make polling/recovery explicit.
- Idempotency checks prevent the same buyer message from generating repeated decisions.
- Decision persistence and send-queue insertion are coupled so a persisted decision cannot silently lose its effect work.
- Send execution uses retry/backoff plus stale-send protection so an automated reply does not blindly overwrite a newer manual seller response.
- Runtime events, heartbeats, relay health, and exportable telemetry make failures inspectable.

## Bounded AI Behavior
- RAG is organized around structured shop knowledge such as MATRIX, PLAYBOOK/product specs, and FAQ/policy material.
- Marketplace-compliance cases can bypass the LLM entirely and return deterministic canned responses.
- Buyer-risk gates can hold automation and route the case back to the seller.
- Review Care separates safe automatic acknowledgements from low-rating cases that require manual handling.
- Seller-controlled auto-send and global/per-shop kill-switches cap effect authority.

## Knowledge Flow
The extension can collect raw catalog/detail/variation/size information, while the backend performs the heavier parsing/normalization into publishable knowledge and retrieval chunks. Seller-authored changes are reviewed/published separately from automatically built knowledge. The browser database acts as cache/draft/offline state rather than the sole long-term source of truth for published knowledge.

## Tech Stack
TypeScript, Chrome Manifest V3, Dexie/IndexedDB, Fastify/Node.js, PostgreSQL, Redis, HMAC-signed requests, LLM + retrieval, automated tests.

## Honest Boundaries
Repository evidence supports the architecture, control flow, safety gates, recovery mechanisms, and implementation scope. It does not prove customer adoption, conversion lift, revenue, or universal compatibility with future Shopee changes.

## Links
Source is private. No public product URL is asserted in this corpus.

## Best RAG Answer
OmniPilot is Bao's active seller-controlled Shopee AI sales agent. It combines a local-first Chrome MV3 runtime with a Fastify AI/RAG backend, keeps Shopee session credentials and LLM secrets on opposite sides of a hard trust boundary, persists decisions and send work durably, and uses deterministic safety/compliance gates plus seller kill-switches to bound what the model can cause.
