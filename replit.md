# 0RBIT Marketing Site

A marketing website for the 0RBIT distributed AI runtime platform.

## Stack

- **Framework**: TanStack Start (SSR) + TanStack Router
- **UI**: React 19, Tailwind CSS 4, Radix UI, shadcn/ui components
- **Build**: Vite 8, Bun
- **Animations**: Framer Motion (via `motion`)

## How to run

```bash
bun install
bun run dev
```

The dev server starts on **port 5000**.

## Project structure

- `src/components/orbit/` all page-level and section components for the 0RBIT design system
- `src/components/ui/` shadcn/ui primitives
- `src/routes/` TanStack Router route files
- `src/styles.css` global styles with Tailwind 4 config

## Chat engine

The AI chat backend uses **OpenRouter free models** (zero cost):

| 0RBIT model | OpenRouter model |
|-------------|-----------------|
| 0RBIT Lite  | `nvidia/nemotron-3-nano-30b-a3b:free` (fastest, MoE 3B active) |
| 0RBIT Core  | `openai/gpt-oss-20b:free` (recommended: fast + good quality) |
| 0RBIT Pro   | `nvidia/nemotron-3-super-120b-a12b:free` (best reasoning quality) |

These picks were chosen by live-testing OpenRouter's free-tier catalog for real latency and reliability (July 2026) — free-model availability/speed varies by provider and drifts over time, so re-test via `https://openrouter.ai/api/v1/models` and direct chat-completion calls if models start feeling slow or start erroring.

Required secret: `OPENROUTER_API_KEY` — get a free key at https://openrouter.ai/keys

The server-side handler (`src/routes/app-chat-api.tsx`) allowlists model IDs so the client can't request arbitrary (paid) models.

## Notes

- The project was originally built with [Lovable](https://lovable.dev). Avoid rewriting published git history.
- Hydration mismatches in the browser console are benign — they come from `Math.random()`-seeded initial state in orbit components (accepted pattern).

## User preferences

- Keep existing structure and stack; do not restructure or migrate.
