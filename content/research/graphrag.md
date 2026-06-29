---
title: "GraphRAG notes"
type: "research"
subtype: "rag-architecture"
status: "active"
tags: ["rag", "graphrag", "retrieval", "knowledge-graph"]
aliases: ["graph rag", "knowledge graph retrieval"]
updated: "2026-05-11"
contains_pii: false
---

# GraphRAG notes

## Definition
GraphRAG combines vector retrieval with an explicit graph of entities and relationships. For Bao's portfolio, useful entities are Person, Project, Repository, Technology, Domain, Feature, Architecture Component, Data Flow, Source File, and Link.

## When Vector RAG Is Enough
Vector-only RAG is enough for direct questions such as "What is Arbitext?", "What stack does MarketGap VN use?", or "What did Bao build in TruyenVietHay?" A well-written Markdown fact file can retrieve the right chunk.

## When GraphRAG Helps
GraphRAG helps when questions need relationships across files:

- Which projects use Redis?
- Which projects involve payment or billing?
- Which projects have Python workers or crawlers?
- Which systems use background jobs?
- How are Bao's AI/RAG interests connected to actual projects?

## Proposed Graph Schema
- Person: Vo Dinh Quoc Bao.
- Project: Arbitext, MarketGap, MarketGap VN, OmniPilot AI, TruyenVietHay, BAO.OS.
- Repository: public product domains and sanitized repository evidence references.
- Technology: Node.js, Express, Fastify, Next.js, Vue, Python, PostgreSQL, MySQL, Redis, Socket.io, Prisma, Docker, R2, Cloudinary, Chrome MV3, OpenAI, Anthropic, OpenRouter, xAI.
- Relationship examples: `Bao BUILDS Arbitext`, `Arbitext USES Python worker`, `MarketGap PRODUCES opportunity data`, `MarketGap VN CONSUMES opportunity data`, `OmniPilot USES RAG`, `OmniPilot RUNS_ON Chrome MV3`, `TruyenVietHay USES Redis`, `TruyenVietHay DELIVERS audio via CDN`.

## Pitfalls
- Do not turn inferred links into hard employment claims.
- Do not duplicate stale placeholder content into graph nodes.
- Keep graph nodes source-backed with public links or sanitized repository evidence.
- Use graph retrieval for relationship questions, and vector retrieval for detailed project descriptions.
