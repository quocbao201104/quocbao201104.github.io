---
title: "Agent memory notes"
type: "research"
status: "active"
---

# Agent memory notes

## Portfolio RAG Strategy
BAO.OS memory uses Markdown files as long-term facts for Supabase pgvector. The current ingest script sends each Markdown file as raw UTF-8 text and the API chunks content by roughly 1100 characters with overlap. Because frontmatter is not parsed into separate metadata during ingest, useful retrieval terms must appear in the visible Markdown body too.

## Memory Types
- Profile memory: stable facts about Bao, positioning, contact, language, location, and current focus.
- Project memory: source-backed facts about architecture, stack, role, data flow, highlights, links, and honest boundaries.
- Timeline memory: chronological evidence across active projects.
- Research memory: how Bao thinks about RAG, GraphRAG, agent workflows, and system design.
- Notes memory: dated updates that explain why the corpus changed.

## Retrieval Rules
- Repeat aliases near the top of each important file. Example: Arbitext should also include Arbitex because users may type the path name.
- Add source paths and GitHub links so retrieved chunks can ground answers.
- Keep sections short enough that one chunk carries a complete answer.
- Avoid unresolved placeholder markers because the assistant may retrieve and repeat them.
- If metrics are not verified, explicitly say the corpus does not include verified metrics.

## Safety and Accuracy
The assistant should not invent traffic, users, revenue, team size, or employment claims. It can say "repository evidence shows" for stack, modules, routes, migrations, docs, tests, and architecture.
