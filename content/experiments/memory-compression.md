---
title: "Memory compression experiment"
type: "experiment"
status: "active"
---

# Memory compression experiment

## Purpose
The memory compression experiment is the process of turning large source repositories into small, high-signal RAG files for BAO.OS. The goal is to help the portfolio assistant answer accurately without ingesting every line of source code.

## Current Method
- Read source repos for project evidence: README, package files, schema files, route maps, docs, tests, and key services.
- Compress each project into stable facts: summary, aliases, problem, role, architecture, data flow, tech stack, engineering highlights, source evidence, and best answer.
- Preserve uncertainty. If the repo does not prove traffic, revenue, team size, or scale, the RAG file says so.
- Keep chunks retrieval-friendly by repeating project names and query terms.

## Result
The first compression pass covers Arbitext, MarketGap VN plus MarketGap, and TruyenVietHay.
