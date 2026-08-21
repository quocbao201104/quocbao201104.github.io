---
title: "BAO.OS memory and retrieval notes"
type: "research"
subtype: "rag-architecture"
status: "active"
updated: "2026-08-21"
contains_pii: false
---

# BAO.OS Memory and Retrieval Notes

## Current Deployment Reality
BAO.OS implements an LLM/RAG backend, retrieval modes, personas, deterministic local embeddings, Supabase pgvector retrieval, server-side redaction, and OpenAI-compatible endpoints. The **public deployment currently disables live AI/RAG**. The source architecture and tests remain inspectable, and the Markdown corpus remains versioned so the backend can be re-enabled later without rebuilding project knowledge from scratch.

## Corpus Strategy
The ingestion path treats Markdown as retrieval data and chunks raw text into overlapping sections. Important aliases and project names therefore need to appear in the visible body, not only in frontmatter.

## Memory Types
- Profile memory: public-safe positioning, current focus, and public contact links.
- Project memory: current status, architecture, data flow, stack, verified evidence, public links, and honest boundaries.
- Timeline memory: chronological engineering evidence with active/completed/paused distinctions.
- Research memory: BAO.OS retrieval architecture and Trustworthy Agentic Systems methodology/status.
- Notes memory: dated corpus changes that prevent old project status from silently surviving.

## Retrieval Rules
- Prefer the current project index when status conflicts with older notes.
- Repeat aliases near the top of important files.
- Keep one chunk capable of answering one coherent question.
- Distinguish **implemented in source** from **currently enabled on the public deployment**.
- Distinguish private-source evidence from public inspectable evidence.
- If metrics are not verified, say the corpus does not contain verified metrics.
- Never use the RAG redaction layer as an excuse to store sensitive data in the public Git repository.

## Current Main Entities
OmniPilot, TruyenVietHay, Trustworthy Agentic Systems, MarketGap, and BAO.OS. Public supporting evidence also includes CD1-2, Marketing Practitioner, and Audio Ingest.
