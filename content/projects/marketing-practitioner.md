---
title: "Marketing Practitioner — Research-First Marketing Decision System"
type: "project"
subtype: "open-source-research"
project_id: "marketing-practitioner"
status: "active"
eyebrow: "BUILDING IN PUBLIC · OPEN SOURCE"
icon: "brain"
tags: ["agent-skill", "decision-systems", "marketing", "research", "knowledge-routing", "commerce", "platforms"]
aliases: ["Marketing Practitioner", "marketing-practitioner-skill", "marketing practitioner skill"]
updated: "2026-08-24"
contains_pii: false
summary: "Open-source research-first marketing decision system for AI agents, combining evidence discipline, decision-first runtime routing, addressable just-in-time knowledge, platform/content models, commerce/product-discovery reasoning, and adversarial evaluation."
problem: "General-purpose agents can write fluent marketing output while silently reopening resolved decisions, inventing unsupported claims, collapsing observation into causality, or loading broad platform advice that does not change the current job. Marketing Practitioner gives the agent a bounded decision architecture instead of another prompt or template pack."
---

# Marketing Practitioner — Research-First Marketing Decision System

## RAG Aliases
Marketing Practitioner, marketing-practitioner-skill, research-first marketing system, marketing agent skill, decision-first marketing runtime, marketing reasoning for AI agents.

## Current Status
**Active open-source project and ongoing research.** Marketing Practitioner is one of Bao's main current public projects. The installable skill is MIT-licensed and currently published as v0.4.0.

Source: https://github.com/quocbao201104/marketing-practitioner-skill

## Summary
Marketing Practitioner gives an AI agent a disciplined way to turn messy market evidence into bounded marketing decisions across customer research, segmentation, positioning, messaging, copy, platform content, commerce, product discovery, diagnosis, experimentation, localization, and learning.

It is deliberately **not** a prompt collection, growth-hack library, copy-template pack, SEO checklist, or claim to know private platform algorithms. The runtime begins from the job the user actually needs done, preserves facts and already-resolved decisions, identifies what decision remains open, loads only knowledge that can materially change that decision, and returns the minimum sufficient output.

```text
EVIDENCE
→ UNDERSTANDING
→ DECISION
→ REPRESENTATION / EXECUTION
→ DISTRIBUTION / DISCOVERY
→ OBSERVATION
→ LEARNING
```

## Runtime Architecture
The governing `SKILL.md` acts as a runtime controller rather than a long static marketing prompt.

Its operating logic is approximately:

```text
USER TASK
→ identify current job
→ preserve resolved state
→ identify open decision
→ determine what evidence/knowledge can change it
→ load only the required dependency
→ resolve the decision
→ validate claims / uncertainty / output scope
→ return minimum sufficient output
```

This keeps simple tasks on a fast path while allowing deeper reasoning only when the decision requires it.

## Addressable Knowledge System
Large marketing knowledge surfaces are exposed through logical addresses rather than forcing the agent to read the whole handbook.

The current architecture includes:

- 13 knowledge namespaces and 191 logical routes introduced with the JIT routing layer;
- `routing-index.json` as a semantic address table;
- deterministic section/source retrieval through `scripts/get-knowledge.py` when helper execution is available;
- capability-aware fallback when a host can only read whole files;
- fail-closed routing integrity checks so incompatible lookup modes do not silently return the wrong artifact.

The physical Markdown layout can change while logical knowledge IDs remain stable.

## Shared Marketing Model
The repository has a shared handbook rather than independent one-off prompt logic for every channel.

Current knowledge covers:

- market/customer evidence and research;
- segmentation, ICP, and JTBD;
- positioning and value;
- messaging, proof, and copy;
- diagnosis, causality, and experimentation;
- organizational learning;
- international marketing and ethics;
- content environments and distribution;
- commerce environments and product discovery.

Platform modules specialize the shared model for Facebook, Instagram, LinkedIn, TikTok, X, Google commerce, Amazon, TikTok Shop, Shopee, Etsy, and Lazada.

## Why the Platform / Commerce Work Is Different
The project does not reduce platform work to tone or "algorithm hacks." It models distinctions that can materially change an agent's decision, including:

```text
CONTENT OBJECT ≠ REPRESENTATION ≠ SURFACE
RELATIONSHIP ≠ DELIVERY ≠ PERMISSION
RETRIEVAL ≠ RANKING ≠ FILTERING ≠ RECOMMENDATION
PRODUCT FACT ≠ COMMERCIAL STATE ≠ OBSERVED FEEDBACK
SHOPPER INTENT ≠ DELEGATED AUTHORITY ≠ EXECUTED EFFECT
```

These distinctions are used only when they prevent a wrong tactical conclusion; narrow writing tasks should not expand into unnecessary theory.

## Evidence Discipline
Marketing Practitioner treats uncertainty as a valid state and explicitly guards against common reasoning failures:

- qualitative recurrence does not establish population prevalence;
- descriptive evidence does not by itself establish causality;
- attribution does not equal incrementality;
- multiple derivatives from one source are not independent evidence;
- platform eligibility does not guarantee exposure;
- engagement does not automatically prove organic preference;
- inferred product information is not automatically verified product truth;
- stronger claims require stronger evidence;
- learning remains scoped to the market, population, surface, product state, platform regime, and period that support it.

The system also forbids persuasive shortcuts that depend on fabricated scarcity, hidden costs, false social proof, or invented personal experience.

## Research and Evaluation Practice
The repository includes evals and adversarial review artifacts outside the installable runtime so tests are not mistaken for marketing knowledge.

Recent work has included:

- conceptual losslessness audits while compressing platform models;
- runtime-routing walk-throughs and targeted smoke tests;
- adversarial review of just-in-time knowledge architecture;
- scoped evidence ledgers and bibliography work;
- research-backed task-specification guidance for underspecified user requests.

The project deliberately keeps claim ceilings narrow. Passing targeted checks does not establish universal marketing theory, full knowledge of private ranking systems, causal effectiveness of tactics, or runtime reliability across every agent host.

## Open-Source Surface
The repository includes:

- the installable `skills/marketing-practitioner/` package;
- `SKILL.md` runtime controller;
- task-specification guide;
- handbook chapters;
- platform and commerce modules;
- logical knowledge routing index;
- deterministic knowledge loader/tests;
- practitioner frameworks and quality rubrics;
- scoped references/evidence ledgers;
- evals and adversarial audits of the skill itself.

Install with:

```bash
npx skills add quocbao201104/marketing-practitioner-skill
```

## Honest Boundaries
Marketing Practitioner is evolving open-source research and implementation, not a claim of a universal marketing ontology or a production-proven autonomous marketer. Repository evidence supports the architecture, knowledge model, routing mechanics, evaluation artifacts, and explicit epistemic boundaries. It does not by itself prove campaign lift, user adoption, universal host compatibility, or complete knowledge of platform production systems.

## Links
- [GitHub source](https://github.com/quocbao201104/marketing-practitioner-skill)
- [Installable skill](https://github.com/quocbao201104/marketing-practitioner-skill/tree/main/skills/marketing-practitioner)

## Best RAG Answer
Marketing Practitioner is Bao's active open-source research-first marketing decision system for AI agents. Instead of giving an agent more prompt templates, it provides a decision-first runtime, evidence and claim boundaries, addressable just-in-time marketing knowledge, shared platform/content and commerce/product-discovery models, and adversarial evals. The project is designed to preserve resolved decisions and uncertainty, load only knowledge that can change the current job, and keep output proportional to the task. It is ongoing research and implementation rather than a claim of universal marketing theory or production-proven autonomous marketing.
