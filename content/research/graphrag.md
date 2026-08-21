---
title: "GraphRAG design notes"
type: "research"
subtype: "rag-architecture"
status: "concept"
tags: ["rag", "graphrag", "retrieval", "knowledge-graph"]
aliases: ["graph rag", "knowledge graph retrieval"]
updated: "2026-08-21"
contains_pii: false
---

# GraphRAG Design Notes

## Status
GraphRAG is a **design/research note, not a claim about the current public BAO.OS deployment**. BAO.OS source currently demonstrates vector-style retrieval with deterministic local embeddings and Supabase pgvector when the AI backend is enabled; live AI/RAG is disabled on the public deployment.

## When Vector Retrieval Is Enough
Vector retrieval is sufficient for direct project questions such as:
- What is OmniPilot?
- What stack does TruyenVietHay use?
- What is the current status of MarketGap?
- What is Trustworthy Agentic Systems researching?

Well-written project files with current status and aliases are more valuable than adding a graph purely for complexity.

## When a Graph Could Help
A graph becomes useful for relationship-heavy questions:
- Which projects use Redis or background jobs?
- Which systems have explicit authorization/effect boundaries?
- Which projects are public versus private?
- Which engineering patterns recur across product and research work?

## Proposed Entity Model
- Person: Quoc Bao.
- Project: OmniPilot, TruyenVietHay, Trustworthy Agentic Systems, MarketGap, BAO.OS.
- Public Artifact: CD1-2, Marketing Practitioner, Audio Ingest.
- Technology: TypeScript, Node.js, Fastify, Express, Vue, Next.js, Python, PostgreSQL, MySQL, Redis, Docker, R2, Cloudinary, Chrome MV3.
- Concept: durable state, idempotency, provenance, authorization, temporal correctness, retrieval, bounded effects, recovery.

Example relationships: `OmniPilot USES durable local state`, `TruyenVietHay DELIVERS media via CDN`, `MarketGap PRODUCES engine_sync_v3 read models`, `Trustworthy Agentic Systems STUDIES action-to-effect binding`, `BAO.OS IMPLEMENTS vector retrieval architecture`.

## Pitfalls
Do not present proposed graph nodes as implemented infrastructure. Do not turn technical relationships into employment, scale, novelty, or performance claims.
