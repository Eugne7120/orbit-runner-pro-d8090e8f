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

## Notes

- The project was originally built with [Lovable](https://lovable.dev). Avoid rewriting published git history.
- Hydration mismatches in the browser console are benign they come from `Math.random()`-seeded initial state in orbit components (accepted pattern).

## User preferences

- Keep existing structure and stack; do not restructure or migrate.
