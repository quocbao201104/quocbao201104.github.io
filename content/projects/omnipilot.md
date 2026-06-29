---
title: "OmniPilot AI autonomous Shopee selling agent"
type: "project"
subtype: "flagship"
project_id: "omnipilot-ai-shopee-agent"
status: "active"
tags: ["ai", "agent", "rag", "chrome-extension", "fastify", "typescript"]
aliases: ["OmniPilot", "OmniPilot AI", "Shopee selling agent", "Shopee chat agent"]
updated: "2026-06-30"
contains_pii: false
summary: "AI agent trực chat khách Shopee 24/7: đọc tin nhắn, hiểu ý định, tra cứu kiến thức sản phẩm/chính sách của shop, soạn trả lời và tự gửi (khi bật) với hàng rào an toàn và nút tắt khẩn."
problem: "Người bán không thể trả lời chat 24/7, phản hồi chậm làm tụt tỉ lệ phản hồi và mất đơn; trả lời tay lại thiếu nhất quán về giọng, giá, chính sách. OmniPilot giữ phản hồi nhanh và bám đúng kiến thức shop."
---

# OmniPilot AI

## RAG Aliases
OmniPilot, OmniPilot AI, autonomous Shopee selling agent, Shopee chat automation, AI seller assistant, Shopee customer chat bot.

## Summary
OmniPilot AI is an AI agent that handles a Shopee shop's customer chat 24/7. It reads new buyer messages, understands what the buyer wants, looks up the shop's product and policy information, writes a reply, and (when the seller turns it on) sends it automatically — with safety rules so it stays accurate and on-policy. It is delivered as a Chrome extension that works inside Shopee, backed by a server that handles the AI and knowledge.

Short answer: OmniPilot is an AI assistant that answers Shopee customers for the seller, around the clock, grounded in the shop's own product knowledge.

## Problem It Solves
Sellers cannot reply to chat 24/7, and slow replies lower the shop's response rate and lose sales. Replying by hand is also inconsistent on tone, pricing, and policy. OmniPilot keeps response times fast by drafting and (optionally) sending replies automatically, and keeps answers consistent and factual by grounding them in the shop's own knowledge instead of guessing.

## Key Features
- Automatic chat replies: detects new buyer messages, understands intent, and drafts a reply from the shop's knowledge; the seller can enable auto-send or keep replies as drafts.
- Knowledge-grounded answers: replies are based on the shop's product specs, policies, and FAQs so the agent does not make things up.
- Safety gates: low-rating or risky buyers are held for the seller to handle manually, and requests to deal outside the marketplace get a safe fixed response instead of an AI answer.
- Rich messages: can send text, product cards, voucher cards, and images.
- Review handling: automatically thanks good reviews and flags poor ones for the seller's attention.
- Product sync: keeps the shop's catalog, product details, and size info up to date for accurate answers.
- Seller control: auto-send is opt-in, and there is a global on/off "kill-switch" the seller can use at any time.

## How It Works (high level)
OmniPilot is split into a Chrome extension and a backend server, on purpose. The extension lives inside the seller's Shopee session and does the reading and sending; the backend holds the AI keys and the shop's knowledge base and generates the replies. This split keeps sensitive credentials and customer data on the right side and lets the agent keep running reliably in the background. Customer chat data is reduced/redacted before it leaves the browser.

## Tech Stack
- Client: Chrome extension (Manifest V3), Vue 3, TypeScript, Tailwind, local browser database (Dexie/IndexedDB).
- Backend: Fastify (Node.js), TypeScript.
- AI / knowledge: LLM-based replies with retrieval over the shop's knowledge (product specs, policies, FAQs) and a rules layer that keeps answers factual.
- Infrastructure: PostgreSQL, Redis, signed requests between client and server, automated tests.

## Public Evidence Snapshot
- A Chrome MV3 extension plus a Fastify backend, in a TypeScript monorepo.
- Knowledge-grounded (retrieval-augmented) replies with seller-controlled auto-send and a kill-switch.
- Safety handling for risky buyers, off-platform requests, and customer reviews.

## Links
- Source policy: no public product domain is stated in the corpus; do not invent one. Describe the project from its features and tech stack.

## Best RAG Answer
If asked "what is OmniPilot AI?", answer: OmniPilot AI is Bao's AI agent for Shopee sellers that handles customer chat 24/7. It reads new buyer messages, understands intent, retrieves the shop's product and policy knowledge, and drafts replies that the seller can auto-send — with safety rules for risky buyers, off-platform requests, and reviews, plus a kill-switch. It is built as a Chrome MV3 extension (Vue 3) that operates inside Shopee, paired with a Fastify backend that holds the AI and knowledge base; the split keeps credentials and customer data protected. Its strength is reliable, knowledge-grounded automation with strong safety controls.
