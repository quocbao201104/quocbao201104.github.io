---
title: "Portfolio memory compression"
type: "experiment"
status: "active"
updated: "2026-08-21"
contains_pii: false
---

# Portfolio Memory Compression

## Purpose
Memory compression means turning large repositories and research artifacts into small, high-signal Markdown facts for BAO.OS without ingesting every source line or turning guesses into portfolio claims.

## Method
- Read README/docs/contracts/tests and key implementation boundaries.
- Compress each current project into: status, aliases, summary, problem, architecture, data flow, stack, reliability/security highlights, public evidence, private-source boundary, and honest non-claims.
- Keep completed, active, paused, and research-in-progress statuses explicit.
- Prefer current source over older portfolio notes when they conflict.
- Remove abandoned-project content from the current-project corpus instead of leaving stale retrieval anchors.
- Keep public corpus data safe even when server-side redaction exists.

## Current Result
The 2026-08-21 refresh covers the current four-project story:
- OmniPilot — building / active commercial / private source.
- TruyenVietHay — shipped / completed / public source.
- Trustworthy Agentic Systems — research in progress / held-out results unseen.
- MarketGap — explored / paused / private source.

Supporting public engineering evidence is indexed separately through BAO.OS, CD1-2, Marketing Practitioner, and Audio Ingest.
