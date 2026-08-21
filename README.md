# BAO.OS — Developer Portfolio

An interactive developer portfolio for **Quoc Bao** (baodev.me). The UI is built as a small “developer operating system” with workspace views and a terminal-style command surface.

Built with **React 18 + TypeScript + Vite + Zustand + TailwindCSS + framer-motion**. The repository also contains an optional **Vercel Edge + Supabase pgvector** LLM/RAG backend with deterministic local embeddings, persona/mode routing, server-side redaction, and OpenAI-compatible endpoints.

## Public deployment status

As of **2026-08-21**, the public deployment intentionally runs with **live LLM/RAG disabled** (`VITE_AI_ENABLED=false`). Keeping always-on database/LLM infrastructure is not justified for a low-traffic portfolio, so remote AI commands degrade to an explicit offline message instead of calling a dead backend.

The AI/RAG architecture, tests, retrieval code, redaction boundary, API handlers, and Markdown knowledge corpus remain in this repository for inspection and can be enabled again by setting `VITE_AI_ENABLED=true` and providing the required backend environment.

## Quick start

```bash
npm install
npm run dev
```

`npm run dev` serves the Vite frontend. Remote AI modes require the API deployment plus `VITE_AI_ENABLED=true`; static/local UI functionality does not.

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm test
```

Run a single API test file:

```bash
node --test api/_chat_core.test.mjs
```

## Architecture

### Frontend (`src/`)
- `App.tsx` — dashboard chrome and workspace shell.
- `src/stores/uiStore.ts` — global UI state.
- `src/components/layout/MainArea.tsx` — workspace views (`home`, `projects`, `agents`, `lab`, `skills`, `memory`, `terminal`).
- `src/lib/projects/markdownProjects.ts` — loads `content/projects/*.md` at build time so project cards are content-driven rather than hardcoded.

### Terminal command pipeline
Terminal input flows through explicit stages:

1. `src/terminal/commandParser.ts` parses local/AI commands.
2. `src/terminal/intentRouter.ts` maps commands to mode/persona plans.
3. `src/terminal/commandRouter.ts` returns local actions or a remote plan; production can disable remote AI with `VITE_AI_ENABLED=false`.

### Optional API (`api/` — Vercel Edge functions)
- `api/_chat_core.ts` coordinates retrieval, prompt/persona construction, model calls, and response assembly.
- `cheapEmbed()` is a deterministic FNV-1a hashed bag-of-words embedding producing a 1536-dimensional vector; ingest and retrieval must use the same function.
- Supabase RPC `match_chunks(...)` provides pgvector retrieval when the backend is enabled.
- Server-side redaction strips emails, phones, local paths, and private-repository links from retrieved material according to content status/intent rules.
- `api/v1/chat/completions.ts` and `api/v1/models.ts` expose an OpenAI-compatible surface.

### Content corpus (`content/`)
Markdown files form the portfolio knowledge source. The current corpus tracks project **status** as well as architecture so abandoned, paused, shipped, active, and research-in-progress work are not flattened into one list.

Current hierarchy:
- Building — OmniPilot.
- Shipped — TruyenVietHay.
- Researching — Trustworthy Agentic Systems.
- Explored/paused — MarketGap.

See `content/README.md` for corpus safety and evidence rules.

## API / environment configuration

### Frontend build variables
| Variable | Purpose |
| --- | --- |
| `VITE_AI_ENABLED` | Set `false` to keep remote AI/RAG offline while retaining local portfolio/terminal UI. |
| `VITE_API_BASE_URL` | API base for static hosting when remote AI is enabled. |

### Backend variables (only needed when enabling AI/RAG)
| Variable | Purpose |
| --- | --- |
| `LLM_BASE_URL` | OpenAI-compatible chat endpoint. |
| `LLM_API_KEY` | LLM credential. |
| `LLM_MODEL` | Model name. |
| `SUPABASE_URL` | Supabase project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side Supabase credential. |
| `INGEST_TOKEN` | Token for `/api/ingest`. |
| `OPENAI_COMPAT_TOKEN` | Optional token for `/v1/*`. |
| `ALLOWED_ORIGIN` | Optional CORS allowlist. |

Ingest the corpus only when the backend is enabled and configured:

```bash
node scripts/ingest-content.mjs
```

## Deployment

### GitHub Pages / static public portfolio
`.github/workflows/deploy-pages.yml` builds `dist/` on pushes to `main`. The checked-in production configuration keeps live AI/RAG off, so the site remains useful without serverless/Supabase availability.

### Vercel / AI-enabled deployment
Vercel can serve both the SPA and Edge API. Set `VITE_AI_ENABLED=true`, configure the backend variables above, and deploy the API routes. Existing `vercel.json` rewrites support `/api/*`, `/v1`, and `/v1/*`.

## Tech stack
- **Frontend:** React 18, TypeScript, Vite, Zustand, TailwindCSS, framer-motion, lucide-react, cmdk
- **Optional AI backend:** Vercel Edge functions, Supabase pgvector, OpenAI-compatible LLM endpoint
- **Hosting:** GitHub Pages/static and/or Vercel

## Evidence boundary
This repository demonstrates implementation and architecture. It does not claim that the public deployment currently runs a live LLM, that Supabase is always-on, or that the portfolio has verified usage/traffic metrics.
