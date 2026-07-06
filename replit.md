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
| 0RBIT Lite  | `openrouter/free` (auto-routes to best available) |
| 0RBIT Core  | `nvidia/nemotron-3-super-120b-a12b:free` |
| 0RBIT Pro   | `google/gemma-4-31b-it:free` |

Required secret: `OPENROUTER_API_KEY` — get a free key at https://openrouter.ai/keys

The server-side handler (`src/routes/app-chat-api.tsx`) allowlists model IDs so the client can't request arbitrary (paid) models.

## Notes

- The project was originally built with [Lovable](https://lovable.dev). Avoid rewriting published git history.
- Hydration mismatches in the browser console are benign — they come from `Math.random()`-seeded initial state in orbit components (accepted pattern).

## User preferences

- Keep existing structure and stack; do not restructure or migrate.
