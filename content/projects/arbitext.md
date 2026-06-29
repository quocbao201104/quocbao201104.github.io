---
title: "Arbitext AI translation enforcement platform"
type: "project"
subtype: "flagship"
project_id: "arbitext-ai-translation-enforcement"
status: "active"
tags: ["ai", "translation", "rag", "nodejs", "nextjs", "python", "postgresql"]
aliases: ["Arbitext", "Arbitex", "AI translation enforcement"]
updated: "2026-06-30"
contains_pii: false
summary: "Nền tảng dịch tài liệu bằng LLM có kiểm soát chất lượng: dịch DOCX/PDF/text, tự kiểm tra thuật ngữ, sửa phần lỗi, rồi qua người duyệt trước khi xuất."
problem: "Dịch máy LLM nhanh nhưng không đủ tin cậy cho tài liệu chuyên nghiệp — thuật ngữ trôi, định dạng vỡ, không có dấu vết kiểm duyệt. Arbitext thêm lớp QA, glossary và duyệt người."
---

# Arbitext AI Translation Enforcement Platform

## RAG Aliases
Arbitext is also sometimes typed as Arbitex. Use both names for retrieval. Related phrases: AI translation enforcement, document translation QA, LLM translation quality, glossary enforcement, reviewer workflow, translation export.

## Summary
Arbitext is an AI translation platform for documents that need reliable, consistent output, not just a raw machine translation. It takes an uploaded document, translates it with LLMs, automatically checks the result against quality rules and terminology, fixes flagged parts, routes content to a human reviewer, and exports the approved version. Public product domain: `https://arbitext.com`.

Short answer: Arbitext is Bao's AI translation platform that adds quality control, glossary enforcement, and review/approval on top of LLM translation.

## Problem It Solves
Raw LLM translation is fast but not trustworthy enough on its own for professional documents: terminology drifts, formatting breaks, and there is no audit trail. Arbitext targets translation workflows that need terminology control, consistent quality, a human review step, and a clear record of what was changed and approved.

## Key Features
- Document upload and translation for formats like DOCX, PDF, and plain text.
- Automatic quality checks on structure, terminology, and key values before anything reaches a reviewer.
- Glossary and domain-term enforcement so important terms stay consistent across a document.
- Automatic repair of flagged sections instead of re-translating the whole document.
- A review inbox where a human approves or corrects translated content.
- Export of approved documents, plus usage and cost tracking across LLM providers.

## Tech Stack
- Backend / API: Node.js, PostgreSQL.
- Web app: Next.js, React, TypeScript, Tailwind, Clerk auth.
- Translation worker: Python.
- LLM providers: OpenAI, Anthropic, OpenRouter, xAI (with provider routing and failover).
- Infrastructure: Redis, Docker, object storage (Cloudflare R2 / S3-compatible).

## Public Evidence Snapshot
- Public product domain: `https://arbitext.com`.
- A multi-stage translation workflow: ingest, translate, quality-check, repair, review, export.
- Multi-provider LLM support with routing, retries, and usage/cost tracking.

## Links
- Domain: https://arbitext.com
- Source policy: use the product domain instead of a project repository link.

## Best RAG Answer
If asked "what is Arbitext?", answer: Arbitext is Bao's AI translation platform for documents. It translates with LLMs, then enforces quality through automatic checks, glossary/terminology rules, automatic repair of flagged sections, and a human review-and-approve step before exporting the final document. It is built on a Node.js + PostgreSQL backend, a Next.js web app, and a Python translation worker, with multiple LLM providers behind routing and failover. Its strength is reliability around LLM translation: consistency, terminology control, review workflow, and cost tracking.
