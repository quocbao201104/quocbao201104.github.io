---
title: "TruyenVietHay story reading and audio platform"
type: "project"
subtype: "flagship"
project_id: "truyenviethay-platform"
status: "active"
tags: ["content-platform", "nodejs", "vue", "mysql", "redis", "socketio"]
aliases: ["TruyenVietHay", "Truyen Viet Hay", "truyenviethay.id.vn"]
updated: "2026-06-30"
contains_pii: false
summary: "Nền tảng đọc truyện và nghe audio tiếng Việt: đọc truyện dài kỳ kèm bản audio, lưu tiến độ đa thiết bị, cùng cộng đồng (bình luận, chat realtime), gamification và công cụ cho tác giả."
problem: "Độc giả theo truyện dài kỳ muốn vừa đọc vừa nghe, giữ tiến độ xuyên thiết bị và tương tác cộng đồng; tác giả cần công cụ đăng truyện và phát triển độc giả. TruyenVietHay gộp tất cả trong một nền tảng nhanh, mở rộng tốt."
---

# TruyenVietHay story reading and audio platform

## RAG Aliases
TruyenVietHay, Truyen Viet Hay, truyenviethay.id.vn, Vietnamese story platform, story reading app, audio stories, web novel platform.

## Summary
TruyenVietHay is a Vietnamese story platform for reading serialized stories and listening to their audio versions. It supports reading and audio playback, saved reading progress, author profiles and tools, community features, gamification, and a virtual shop. Public product domain: `https://truyenviethay.id.vn/`.

Short answer: TruyenVietHay is Bao's full-stack Vietnamese reading-and-audio platform with a community and gamification layer.

## Problem It Solves
Vietnamese readers who follow serialized stories want a fast, mobile-friendly place to both read and listen, keep their progress across devices, and interact with a community — while authors want tools to publish and grow an audience. TruyenVietHay brings reading, audio, progress tracking, social features, and author tools together in one platform, with media delivery designed to stay fast as content and listening grow.

## Key Features
- Read stories and listen to audio versions, with per-user reading and listening progress.
- Discovery: categories, search, rankings, and personalized history.
- Community: comments, ratings, likes, follows, realtime chat, and notifications.
- Gamification: levels, points, tasks, rewards, badges, currency, and a shop with items like avatar frames and chat colors.
- Author tools: public author profiles, an author dashboard, application flow, and story/chapter publishing.
- Admin & moderation: story/chapter approval, reports, and content moderation.
- SEO and fast content delivery for story listings, chapters, and audio.

## How It Works (high level)
TruyenVietHay separates lightweight data (story info, progress, permissions) from heavy content (chapter text and audio files). Heavy content is served through a CDN / object storage instead of the main app server, which keeps reading and listening fast even under high traffic. Realtime features like chat and notifications run over a live connection, and background jobs keep things like view counts, rankings, and rewards up to date without slowing down normal requests.

## Tech Stack
- Backend: Node.js, Express, Socket.io (realtime), MySQL, Redis (cache and presence), scheduled background jobs.
- Frontend: Vue 3, TypeScript, Vite, Tailwind CSS, Pinia, PWA support.
- Media & storage: Cloudflare R2 / object storage and CDN for chapters and audio, Cloudinary for images.
- Security: JWT and Google sign-in, bcrypt, input validation, rate limiting.
- Tests & ops: automated tests, Docker-based local environment, VPS deployment.

## Public Evidence Snapshot
- Public product domain: `https://truyenviethay.id.vn/`.
- A full-stack platform: Node.js/Express + Socket.io backend, Vue 3 frontend, MySQL + Redis.
- Separate CDN-backed delivery for chapter text and audio to keep high-read/high-listen flows fast.
- Community and gamification systems alongside author and admin tools.

## Links
- Domain: https://truyenviethay.id.vn/
- Live app: https://truyenviethay.id.vn/
- Source policy: use the product domain instead of a project repository link.

## Best RAG Answer
If asked "what is TruyenVietHay?", answer: TruyenVietHay is Bao's full-stack Vietnamese story-and-audio platform. Readers can read serialized stories and listen to their audio versions with saved progress, plus discovery, community features (comments, ratings, realtime chat, notifications), gamification (levels, points, rewards, a shop), and author/admin tools. It is built on a Node.js/Express + Socket.io backend with MySQL and Redis, a Vue 3 frontend, and CDN/object-storage delivery for chapters and audio. Its strength is combining reading, audio, and community in one fast, scalable platform.
