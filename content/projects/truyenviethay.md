---
title: "TruyenVietHay backend platform"
type: "project"
subtype: "flagship"
project_id: "truyenviethay-backend-platform"
status: "active"
tags: ["content-platform", "nodejs", "vue", "mysql", "redis", "socketio"]
aliases: ["TruyenVietHay", "Truyen Viet Hay", "truyenviethay.id.vn"]
updated: "2026-05-11"
contains_pii: false
---

# TruyenVietHay backend platform

## RAG Aliases
TruyenVietHay, Truyen Viet Hay, truyenviethay_new, truyenviethay.id.vn, Vietnamese story platform, story reading app, audio stories, Node.js Express Vue MySQL Redis platform.

## Summary
TruyenVietHay is a full-stack Vietnamese story reading and audio platform at `https://truyenviethay.id.vn/`. It supports reading stories, listening to audio, author profiles, admin moderation, realtime chat/notifications, gamification, shop/inventory, reading history, SEO, and CDN-backed content delivery.

Short answer: TruyenVietHay is Bao's production-style content platform with a Node.js/Express backend, Vue 3 frontend, MySQL, Redis, Socket.io, Cloudinary images, and Cloudflare R2/CDN delivery for chapters and audio.

## Product Problem
The platform is built for Vietnamese users who read serialized stories and listen to story audio on mobile. It needs fast content loading, personalized progress, social interaction, author tools, moderation, and scalable media delivery.

## Bao's Role
Bao is actively developing TruyenVietHay. The portfolio assistant should use `https://truyenviethay.id.vn/` as the public project link and avoid project repository links.

Repo evidence shows backend-heavy ownership across Express routes, controllers, services, MySQL models, Redis cache, Socket.io realtime, cron jobs, migrations, admin workflows, tests, deployment docs, and frontend integration work. Do not claim verified public traffic, revenue, or team size because the RAG corpus does not contain those metrics.

## Tech Stack
- Backend: Node.js 20, Express, Socket.io, MySQL 8+, Redis with `ioredis`, AWS SDK S3 client for Cloudflare R2, Cloudinary, Multer, Sharp, Winston, node-cron.
- Security: JWT, Google OAuth, bcrypt, Joi, express-validator, Helmet, CORS, xss-clean, compression, express-rate-limit.
- Frontend: Vue 3, TypeScript, Vite, Tailwind CSS 4, Pinia, Vue Router, Axios, Socket.io client, Vite PWA, ApexCharts, TinyMCE.
- Tests and ops: Jest, Supertest, Docker Compose local MySQL/Redis/Adminer, deployment docs for VPS.

## Backend Architecture
The backend follows a layered Express architecture:

- Routes define HTTP endpoints under `/api`.
- Controllers handle request lifecycle and input.
- Services contain business logic such as chat, notifications, rewards, shop, audio, reports, story workflows, and cache behavior.
- Models access MySQL directly with optimized SQL.
- Middleware handles auth, error handling, rate limits, uploads, and validation.
- Redis supports cache, online presence, notification queue/idempotency, chat state, and cooldowns.

Core route groups include auth, story, chapter, upload, category, history, comments, follow, like, profile, admin users, levels, points, tasks, rewards, ratings, notifications, currency, badges, inventory, author, authors, chat, shop, mailbox, reports, and sitemap.

## Content and Media Delivery
TruyenVietHay separates metadata APIs from heavy content delivery:

- Backend APIs return story metadata, playlist metadata, permissions, progress, and URLs.
- Chapter JSON and audio MP3 assets can be delivered through CDN/object storage rather than the app server.
- Audio playlist responses resolve URLs from R2 keys or stored audio URLs.
- Cloudinary is used for image assets such as avatars, covers, badges, and shop items.

This reduces backend pressure on high-read and high-listen flows.

## Realtime and Background Jobs
Socket.io powers realtime chat, online presence, and notifications. The backend verifies socket JWT, manages world and author rooms, emits user notifications, and uses Redis for queues, idempotency, cooldowns, and cached chat profile style.

Startup jobs include view sync, daily stats, notification cleanup, reward expiry, inventory expiry, reading history cleanup, aggregate reconciliation, author ranking, and notification worker. These jobs keep derived counts, rankings, rewards, inventory, notifications, and history healthier without blocking request paths.

## Gamification and Community
The platform includes user levels, points, tasks, rewards, user rewards, currency, badges, shop items, inventory, avatar frames, chat colors, author ranking, comments, ratings, likes, follows, mailbox, and notifications.

Roadmap docs show completed work on reward contract stabilization, transaction-safe claim/grant/use flows, inventory/shop hardening, expiration crons, Redis catalog cache, pagination, structured logs, comment moderation, anti-spam limiters, aggregate reconciliation, notification fanout, and chat profile cache invalidation.

## Author and Admin Features
Author-facing features include public author profiles, author follow, author ranking, author dashboard statistics, author application flow, story/chapter publishing, and moderation. Admin features include story and chapter approval/rejection, reports, users, dashboard cache routes, gamification health, sitemap/SEO support, and safe soft delete flows.

## Engineering Highlights
- Built a large Express API surface with modular routes/controllers/services/models.
- Integrated MySQL, Redis, Socket.io, Cloudinary, R2/CDN, JWT, Google OAuth, and cron jobs.
- Implemented audio story metadata and playlist caching with per-user listening progress.
- Hardened gamification, shop/inventory, comments, follow/rating consistency, and notifications through migrations, validators, transactions, Redis cache, and tests.
- Added SEO-related sitemap, canonical/robots planning, and performance indexes for story listings.
- Used a deployment shape with separate frontend, backend API, audio CDN, and content CDN domains.

## Public Evidence Snapshot
- Public product domain: `https://truyenviethay.id.vn/`.
- Internal docs and implementation cover backend architecture, route/service layering, startup jobs, and realtime systems.
- Audio delivery behavior is documented and implemented through dedicated media service modules.
- Roadmaps track gamification, shop/inventory, chat-notification, and phased delivery milestones.

## Links
- Domain: https://truyenviethay.id.vn/
- Live app: https://truyenviethay.id.vn/
- Source policy: use the product domain instead of a project repository link.
- Referenced API domain: https://api.truyenviethay.id.vn/
- Referenced content CDN: https://cdn.truyenviethay.id.vn/
- Referenced audio CDN: https://audio.truyenviethay.id.vn/

## Best RAG Answer
If asked "what is TruyenVietHay?", answer: TruyenVietHay is Bao's full-stack Vietnamese story and audio platform. It combines a Node.js/Express API, Vue 3 frontend, MySQL, Redis, Socket.io, Cloudinary, and R2/CDN delivery to support story reading, audio playback, author tools, moderation, realtime notifications/chat, gamification, shop/inventory, reading history, SEO, and operational cron jobs.
