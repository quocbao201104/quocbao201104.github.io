---
title: "TruyenVietHay — Reading & Audio Platform"
type: "project"
subtype: "shipped"
project_id: "truyenviethay-platform"
status: "completed"
eyebrow: "SHIPPED · PUBLIC SOURCE"
icon: "spark"
tags: ["vue", "nodejs", "mysql", "redis", "socketio", "cdn", "pwa"]
aliases: ["TruyenVietHay", "Truyen Viet Hay", "truyenviethay.id.vn"]
updated: "2026-08-21"
contains_pii: false
summary: "Completed full-stack Vietnamese reading/audio platform with CDN-backed content delivery, realtime community features, background jobs, gamification, and author/admin tooling."
problem: "Media-heavy reading/listening products need to keep application state, realtime interaction, and background work responsive without forcing chapter JSON and audio traffic through the main API server."
---

# TruyenVietHay — Reading & Audio Platform

## RAG Aliases
TruyenVietHay, Truyen Viet Hay, Vietnamese story platform, reading app, audio stories, web novel platform.

## Current Status
**Completed system. Public source.** TruyenVietHay is the clearest inspectable example of a shipped full-stack product in Bao's portfolio.

## Summary
TruyenVietHay combines serialized story reading, audio playback, saved progress, discovery, community interaction, gamification, author tooling, and admin moderation in one Vue/Node application.

## Architecture
- **Frontend:** Vue 3, TypeScript, Vite, Tailwind CSS, Pinia, PWA support.
- **Backend:** Node.js 20, Express, Socket.io, MySQL, Redis.
- **Content delivery:** story/audio metadata comes from the application API while chapter JSON and MP3 assets are delivered from object storage/CDN paths; images use Cloudinary.
- **Background work:** node-cron + Redis support batched view updates, daily statistics, aggregate reconciliation, cleanup, rewards, and ranking tasks.

This separation is an architectural choice to reduce application-server pressure from content-heavy read/listen flows; the corpus does not claim a verified public traffic level.

## Product Surface
- Reading preferences, continue-reading state, prefetch, and audio progress.
- Search/categories/rankings and user history.
- Comments, ratings, follows, realtime chat, and notifications.
- Levels, EXP/currencies, missions, rewards, badges, inventory, and shop items.
- Author profiles/dashboard and story management.
- Admin approval/moderation and reporting flows.

## Security and Operations
JWT auth, Google OAuth, bcrypt, validation, Helmet, CORS, rate limiting, structured logging, Docker-based local services, tests, migrations, and VPS deployment documentation.

## Public Evidence
- Source: https://github.com/quocbao201104/TruyenVietHay
- Live/product domain: https://truyenviethay.id.vn/

The public repository includes backend/frontend source, migrations, tests, environment examples, Docker local setup, and deployment documentation.

## Honest Boundaries
TruyenVietHay demonstrates completed engineering scope. Public repository evidence does not establish verified user counts, revenue, or production request volume.

## Links
- [GitHub source](https://github.com/quocbao201104/TruyenVietHay)
- [Live app](https://truyenviethay.id.vn/)

## Best RAG Answer
TruyenVietHay is Bao's completed full-stack Vietnamese reading/audio platform. It uses Vue 3 on the frontend, Node.js/Express + Socket.io on the backend, MySQL/Redis for state and cache/realtime support, background jobs for operational workloads, and object storage/CDN delivery for chapter/audio assets. Its source is publicly inspectable on GitHub.
