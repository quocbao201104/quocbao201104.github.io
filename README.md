# BAO.OS — Developer Portfolio

An interactive "developer operating system" portfolio for **Quoc Bao** (baodev.me). The centerpiece is an in-browser terminal that talks to a RAG (retrieval-augmented generation) backend grounded in a personal markdown knowledge base.

Built with **React 18 + TypeScript + Vite + Zustand + TailwindCSS + framer-motion**, with **Vercel Edge functions** + **Supabase (pgvector)** powering the chat/RAG layer.

## Quick start

```bash
npm install
npm run dev        # Vite dev server at http://localhost:5173
```

> **Note:** `npm run dev` serves the frontend only. The `/api` routes are Vercel Edge functions and do not run under Vite. Chat/RAG in local dev falls back to the deployed API (see [API configuration](#api-configuration)).

## Scripts

```bash
npm run dev        # Vite dev server (frontend only)
npm run build      # tsc type-check + vite build → dist/
npm run preview    # serve the production build locally
npm run lint       # eslint --fix across .js/.jsx/.ts/.tsx
npm test           # node --test api/*.test.mjs (API logic tests)
```

Run a single test file:

```bash
node --test api/_chat_core.test.mjs
```

## Architecture

A single-page app with no router — "navigation" is `activeSection` state in a Zustand store.

### Frontend (`src/`)

- `App.tsx` — fixed dashboard chrome (top bar, left sidebar, main area, right panels, bottom terminal).
- `src/stores/uiStore.ts` — the single global store (active section, opened tabs, terminal state, command palette).
- `src/components/layout/MainArea.tsx` — switches between workspace views (`home`, `projects`, `agents`, `lab`, `skills`, `memory`, `terminal`) with a VSCode-style tab bar.
- Path alias `@/` → `src/` (set in both `vite.config.ts` and `tsconfig.json`).

### Content-driven projects

Projects are **not hardcoded**. `src/lib/projects/markdownProjects.ts` loads `content/projects/*.md` at build time via `import.meta.glob`, parses frontmatter, and infers tags/icon/links. `content/projects/project-index.md` (a bullet list of slugs) controls ordering.

### Terminal command pipeline

Typed terminal input flows through three stages before hitting the API:

1. `src/terminal/commandParser.ts` — parses raw input (`help`, `clear`, `llm`, `rag`, `ask recruiter`, `inspect architecture`, `search memory`, or plain text).
2. `src/terminal/intentRouter.ts` — maps the command + current session to a plan: which **mode** (`llm` / `rag` / `agentic_rag`) and **persona** (`bao` / `recruiter` / `architect` / `memory`).
3. `src/terminal/commandRouter.ts` — returns local UI actions or a remote plan to POST to the API.

### API (`api/` — Vercel Edge functions)

- `api/_chat_core.ts` — the shared brain. `runChat()` retrieves context (RAG modes), builds the persona/mode prompt, calls the LLM, and assembles the response. Both `api/chat.ts` and the OpenAI-compatible `api/v1/chat/completions.ts` delegate to it.
- **Embeddings are local.** `cheapEmbed()` is a deterministic FNV-1a hashed bag-of-words → 1536-dim vector (the LLM backend is chat-completions only). Ingest and retrieval must use the **same** embedding function — changing it requires re-ingesting all content.
- **Retrieval** calls a Supabase RPC `match_chunks(query_embedding, match_count, allow_pii)` against a `chunks` table.
- **Redaction is enforced server-side.** Emails, phones, local paths, and private repo links are stripped from retrieved chunks unless the chunk is marked `status: public` (or the message is a contact intent).
- `api/v1/chat/completions.ts` + `api/v1/models.ts` expose an OpenAI-compatible surface; the requested `model` name encodes the mode/persona.

### Content corpus (`content/`)

Markdown files (`profile/`, `projects/`, `research/`, `experiments/`, `notes/`, `timeline/`) form the RAG knowledge base. Write retrieval-friendly facts, never invent metrics, mark inferred facts as inferred, and preserve Vietnamese accents exactly. Frontmatter flags `contains_pii` and `status` drive the redaction layer. See `content/README.md`.

Ingest the corpus into Supabase (requires `API_BASE_URL` + `INGEST_TOKEN`):

```bash
node scripts/ingest-content.mjs
```

## API configuration

The frontend (`src/lib/apiClient.ts`) calls same-origin `/api/*` by default, so Vercel deployments work with no extra config. For static hosting (e.g. GitHub Pages, where serverless functions don't exist), set `VITE_API_BASE_URL` to your API deployment.

Required API env vars (set in Vercel):

| Variable | Purpose |
| --- | --- |
| `LLM_BASE_URL` | Chat-completions endpoint (OpenAI-compatible) |
| `LLM_API_KEY` | LLM API key |
| `LLM_MODEL` | Model name (default `mimo-v2.5-pro`) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `INGEST_TOKEN` | Shared secret gating `/api/ingest` |
| `OPENAI_COMPAT_TOKEN` | _(optional)_ gates the `/v1/*` endpoints |
| `ALLOWED_ORIGIN` | _(optional)_ CORS allowlist (defaults to `*`) |

## Deployment

### Vercel (primary)

`vercel.json` rewrites `/api/*`, `/v1`, and `/v1/*` to the edge functions and SPA-falls-back everything else to `index.html`. Import the repo into Vercel, set the env vars above, and deploy. Auto-detects Vite settings (build `npm run build`, output `dist`).

### GitHub Pages (static)

`.github/workflows/deploy-pages.yml` builds and deploys `dist/` on push to `main`. There are no serverless functions here, so set `VITE_API_BASE_URL` to point at the live API (see `.env.production`).

## Tech stack

- **Frontend:** React 18, TypeScript, Vite, Zustand, TailwindCSS, framer-motion, lucide-react, cmdk
- **Backend:** Vercel Edge functions, Supabase (pgvector)
- **Hosting:** Vercel (with API) and/or GitHub Pages (static)
