# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Vite dev server (frontend only — /api functions do NOT run locally)
npm run build     # tsc type-check + vite build → dist/
npm run preview   # serve the production build
npm run lint      # eslint --fix across .js/.jsx/.ts/.tsx
npm test          # node --test api/*.test.mjs  (API logic tests)
```

Run a single API test file: `node --test api/_chat_core.test.mjs`

Ingest the `content/` corpus into Supabase (requires `API_BASE_URL` + `INGEST_TOKEN` env):
```bash
node scripts/ingest-content.mjs
```

## Critical context

- **README.md is stale.** It describes a Vue 3 portfolio. The actual app is **React 18 + TypeScript + Vite + Zustand + Tailwind + framer-motion**. Trust `package.json` and the code, not the README's stack/structure sections.
- **`npm run dev` only serves the frontend.** The `/api` serverless functions are Vercel Edge functions and do not run under Vite. To exercise chat/RAG locally either deploy, or rely on `apiClient.ts`'s fallback to the live API (`https://bao-os-api.vercel.app`).

## Architecture

This is **BAO.OS** — a single-page "developer operating system" portfolio whose centerpiece is an in-browser terminal that talks to a RAG backend.

### Frontend (`src/`)
- **Single view, no router.** `App.tsx` renders a fixed dashboard chrome (TopSystemBar / LeftSidebar / MainArea / RightPanels / BottomTerminal). "Navigation" is just `activeSection` state in the Zustand store — `MainArea.tsx` switches between workspace views (`home`, `projects`, `agents`, `lab`, `skills`, `memory`, `terminal`) with a VSCode-style tab bar.
- **All UI state lives in `src/stores/uiStore.ts`** (Zustand): active section, opened tabs, terminal visibility/dock/collapse, command palette, terminal session id. There is no other global state container.
- **Path alias `@/` → `src/`** (configured in both `vite.config.ts` and `tsconfig.json`).
- **Projects are content-driven, not hardcoded.** `src/lib/projects/markdownProjects.ts` uses `import.meta.glob('content/projects/*.md', { query: '?raw' })` to load markdown at build time, parses frontmatter, and infers tags/eyebrow/icon/links heuristically. `content/projects/project-index.md` (a bullet list of slugs) controls ordering. Most `src/data/*.ts` files are static display data, but projects flow from `content/`.

### Terminal command pipeline
Typed terminal input flows through three stages before hitting the API:
1. `src/terminal/commandParser.ts` — tokenizes raw input into a `ParsedCommand` (`help`, `clear`, `llm`, `rag`, `ask recruiter`, `inspect architecture`, `search memory`, or plain text).
2. `src/terminal/intentRouter.ts` — maps the parsed command (and the current `sessionId`, e.g. `architecture.ai` / `memory.log` / `session_01`) to a `RemoteExecutionPlan`: which **mode** (`llm` | `rag` | `agentic_rag`) and **persona** (`bao` | `recruiter` | `architect` | `memory`) to use.
3. `src/terminal/commandRouter.ts` — returns either local UI actions (help/clear) or a `remote` plan that the terminal component POSTs to the API.

### API (`api/` — Vercel Edge functions)
- **`api/_chat_core.ts` is the shared brain.** `runChat()` is the single entry point for all chat: it retrieves context (RAG modes only), builds the persona/mode system prompt, calls the LLM, and assembles the `ConsoleResponse` (answer + sources + agent trace + metadata). Both `api/chat.ts` and the OpenAI-compatible `api/v1/chat/completions.ts` delegate to it.
- **Embeddings are computed locally, not via an embeddings API.** `cheapEmbed()` is a deterministic FNV-1a hashed bag-of-words into a 1536-dim unit vector. The LLM backend (Xiaomi MiMo via `LLM_BASE_URL`) is chat-completions only, so both ingest and retrieval must use the *same* `cheapEmbed` — if you change the embedding function, you must re-ingest all content or retrieval breaks.
- **Retrieval** calls a Supabase RPC `match_chunks(query_embedding, match_count, allow_pii)` against a `chunks` table (unique key `path,chunk_index`).
- **Redaction is enforced server-side, outside the prompt.** Even if frontmatter is wrong, `retrieve()` strips emails/phones/local-paths/private-repo-links from chunk content unless the chunk `status === 'public'` or the message is a contact intent (`isContactIntent`). Treat the redaction helpers in `_chat_core.ts` as a security boundary, not cosmetic.
- **OpenAI-compatible surface.** `api/v1/chat/completions.ts` + `api/v1/models.ts` expose an OpenAI-shaped API; the requested `model` name encodes mode/persona (e.g. a model containing `rag` → RAG mode, `recruiter` → recruiter persona). Optional `OPENAI_COMPAT_TOKEN` gates these endpoints.
- **`api/ingest.ts`** chunks markdown (~1100 chars, 180 overlap), parses frontmatter, embeds with `cheapEmbed`, and upserts into Supabase. Gated by `INGEST_TOKEN`. `ALLOWED_TYPES` whitelists frontmatter `type` values.

### Content corpus (`content/`)
Markdown files (`profile/`, `projects/`, `research/`, `experiments/`, `notes/`, `timeline/`) are the RAG knowledge base. Per `content/README.md`: write retrieval-friendly facts (not marketing copy), never invent metrics, mark inferred facts as inferred, preserve Vietnamese accents exactly. `contains_pii: true` and `status: public` frontmatter flags drive the redaction layer.

## Deployment (dual-target)

- **Vercel (primary):** `vercel.json` rewrites `/api/*`, `/v1`, `/v1/*` to the edge functions and SPA-falls-back everything else to `index.html`. `apiClient.ts` calls same-origin `/api/*` so functions "just work."
- **GitHub Pages (static):** `.github/workflows/deploy-pages.yml` builds and deploys `dist/` on push to `main`. There are no serverless functions here, so `VITE_API_BASE_URL` must point at the live API deployment (`.env.production` → `https://bao-os-api.vercel.app`). `apiClient.ts` also auto-falls-back to that legacy host on 404/405/HTML responses when no base URL is configured.

Required API env vars: `LLM_BASE_URL`, `LLM_API_KEY`, `LLM_MODEL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `INGEST_TOKEN`. Optional: `OPENAI_COMPAT_TOKEN`, `ALLOWED_ORIGIN`.
