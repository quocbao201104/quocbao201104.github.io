---
title: "Engineering principles"
type: "philosophy"
status: "active"
updated: "2026-08-21"
contains_pii: false
---

# Engineering Principles

## Design for failure, not only success
- Persistent workflows need durable state around retries, restarts, and partial completion.
- OmniPilot persists conversation/runtime state locally because an MV3 worker can disappear; decisions and send work are coupled so recovery does not silently lose an effect.
- TruyenVietHay moves batch statistics, reconciliation, cleanup, rewards, and rankings out of normal request paths.
- MarketGap publishes normalized versioned read models so the SaaS does not recompute crawler/scoring truth independently.

## Make authority explicit
- A model suggestion is not automatically permission to cause an external effect.
- OmniPilot uses deterministic compliance/risk gates, seller-controlled auto-send, and kill-switches around model output.
- Payment state in MarketGap VN is driven by verified webhook truth, not a browser return page.
- Trustworthy Agentic Systems treats retrieved, persisted, cited, authorized, current, and historically available state as different concepts rather than synonyms.

## Keep trust boundaries hard
- Secrets and sessions should stay on the side that needs them. OmniPilot keeps Shopee session state in the extension and LLM secrets in the backend.
- Public ingest/webhook boundaries need signatures/tokens and replay-aware validation.
- Realtime identity should come from verified auth, not client-asserted user IDs.
- A public Git repository should not contain private phone numbers, dates of birth, credentials, production dumps, or infrastructure details merely because a downstream RAG layer can redact them.

## Prefer inspectable state transitions
- Use idempotent writes, stable IDs, explicit status, and versioned contracts where repeated work is expected.
- Keep data engines separate from user-facing subscription/product shells when their failure modes and responsibilities differ.
- Capture structured logs, health signals, and evidence that make recovery/debugging possible.

## Evidence before claims
- Repository structure can prove that code, tests, migrations, contracts, and safety gates exist; it cannot prove adoption, scale, economic value, or comparative superiority.
- CI success means the experiment or test completed according to assertions; it does not manufacture scientific novelty.
- In research, freeze the question and evaluation rules before seeing authoritative held-out results when post-hoc flexibility would bias the conclusion.

## Operate what you build
Build observability, recovery paths, runbooks, kill-switches, admin/ops surfaces, and data-quality boundaries early enough that the system can be debugged when the happy path stops being happy.
