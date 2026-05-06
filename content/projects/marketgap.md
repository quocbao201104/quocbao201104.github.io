---
title: "MarketGap VN and MarketGap"
type: "project"
project_id: "marketgap-vn-marketgap"
status: "active"
priority: "primary"
---

# MarketGap VN + MarketGap

## RAG Aliases
MarketGap, MarketGap VN, MarketGap-VN, Taobao to Shopee, Shopee Vietnam opportunity dashboard, market gap crawler, product opportunity SaaS, hourly daily monthly snapshots.

## Summary
MarketGap is Bao's market opportunity research system for Taobao to Shopee Vietnam. The public product domain is `https://marketgap.com`. The system has two connected parts: a Python crawler/data engine called MarketGap, and a Next.js SaaS dashboard called MarketGap VN.

Short answer: MarketGap finds products with strong signals on Chinese sources such as Taobao and weak or early competition on Shopee Vietnam, then turns crawler output into subscription-gated dashboard snapshots.

## Product Problem
Vietnam sellers need a faster way to spot product gaps: products that appear promising at the source market but are not yet saturated on Shopee Vietnam. MarketGap collects candidates, checks marketplace presence, classifies signal strength, and exposes the results through dashboards.

## Bao's Role
Bao is actively developing both local repositories:

- Data engine: `C:\Users\Admin\Downloads\Folders\MarketGap`.
- SaaS dashboard: `C:\Users\Admin\Downloads\Folders\MarketGap VN`.

Both source repositories are private, so the portfolio assistant should use `https://marketgap.com` as the public project link and should not provide GitHub repository links for MarketGap or MarketGap VN. The local repo evidence shows work across crawler orchestration, snapshot export, publisher integration, SaaS ingest contracts, PostgreSQL schema, dashboard queries, auth, billing, entitlement gates, and tests.

## MarketGap Data Engine
MarketGap is the internal crawler/data engine. Its README describes this flow:

1. `session_health` checks the Taobao browser profile.
2. `crawler_job` crawls Taobao categories and sources.
3. `analyzer_job` normalizes candidates.
4. `lens_discovery_job` uses Google Lens to find Shopee links and matching shops.
5. `market_check_job` classifies market signals.
6. `snapshot_job` builds hourly, daily, and monthly snapshots.
7. `export_job` writes CSV/JSON reports.
8. `publisher_job` can post exported snapshots to MarketGap VN.

The engine is Python 3.10+ with `scrapling`, `patchright`, `lxml`, and `Pillow`. It uses a SQLite-style internal database through the `marketgap.db` layer and exports current/archive report artifacts.

## MarketGap VN SaaS
MarketGap VN is a separate Next.js App Router SaaS app backed by PostgreSQL and Prisma. It receives exported snapshots from the Python data engine, stores them as queryable rows, handles login, billing, and unlocks dashboard access by plan.

V1 product scope from the repo:

- Public landing page.
- Register/login with bcrypt password hashing and signed session cookies.
- Shared dashboard for latest/hourly data.
- Month/Standard and Year/Pro style paid access.
- Payment creation and webhook unlock, with PayOS as implemented provider.
- Admin import and payment overview.

## Data Contract
MarketGap exports JSON files such as:

- `reports/current/hourly.json`
- `reports/current/daily.json`
- `reports/current/monthly.json`
- archived snapshots under `reports/archive/...`

MarketGap VN maps `snapshot.scope`, `slot_date`, `slot`, `month`, `generated_at`, and `rows[]` into PostgreSQL models. Stable snapshot UIDs look like:

- `marketgap:hourly:YYYY-MM-DD:SLOT`
- `marketgap:daily:YYYY-MM-DD`
- `marketgap:monthly:YYYY-MM`

Repeated ingest is idempotent: the service upserts the same snapshot UID and replaces rows cleanly instead of duplicating results.

## Tech Stack
- Python data engine: Python 3.10+, Scrapling, Patchright, lxml, Pillow, pytest, SQLite-style local database, static dashboard utilities, scheduled shell pipeline.
- SaaS dashboard: Next.js 15, React 19, TypeScript, Prisma, PostgreSQL, Zod, bcryptjs, PayOS adapter, Recharts, Tailwind CSS, Vitest.
- Key storage models: User, Plan, Subscription, Payment, IngestRun, Snapshot, SnapshotItem.

## Engineering Highlights
- Separated crawler/data collection from SaaS billing and user access logic so the production crawler DB stays internal.
- Designed a stable ingest contract between Python exports and the SaaS PostgreSQL schema.
- Built idempotent snapshot ingest using payload hash and source/snapshot UID uniqueness.
- Converted crawler-friendly values into app-safe types: boolean-like integers, JSON Shopee links, date-only fields, enum scopes.
- Implemented entitlement-aware dashboard views: free preview, recent daily access for paid users, and monthly trend access for higher plan users.
- Built payment checkout and webhook flow around provider references and subscription activation.

## Source Evidence
- MarketGap README: `C:\Users\Admin\Downloads\Folders\MarketGap\README.md`.
- MarketGap export job: `C:\Users\Admin\Downloads\Folders\MarketGap\marketgap\export_job.py`.
- MarketGap snapshot builder: `C:\Users\Admin\Downloads\Folders\MarketGap\marketgap\snapshot_builder.py`.
- MarketGap VN README: `C:\Users\Admin\Downloads\Folders\MarketGap VN\README.md`.
- MarketGap VN ingest contract: `C:\Users\Admin\Downloads\Folders\MarketGap VN\docs\architecture\data-ingest-contract.md`.
- MarketGap VN Prisma schema: `C:\Users\Admin\Downloads\Folders\MarketGap VN\prisma\schema.prisma`.
- Tests include ingest, dashboard, entitlement, payment webhook, auth, env, and theme CSS.

## Links
- Domain: https://marketgap.com
- Source: Private repositories; no public GitHub link should be shown for MarketGap or MarketGap VN.
- Local SaaS path: `C:\Users\Admin\Downloads\Folders\MarketGap VN`
- Local data engine path: `C:\Users\Admin\Downloads\Folders\MarketGap`

## Best RAG Answer
If asked "what is MarketGap?", answer: MarketGap is Bao's Taobao to Shopee Vietnam opportunity research system. The Python MarketGap engine crawls and analyzes product candidates, checks Shopee presence through Google Lens and marketplace signals, builds hourly/daily/monthly snapshots, and exports JSON/CSV. MarketGap VN is the SaaS dashboard that ingests those snapshots into PostgreSQL, provides dashboard views, and gates access through subscription plans and PayOS payment flow.
