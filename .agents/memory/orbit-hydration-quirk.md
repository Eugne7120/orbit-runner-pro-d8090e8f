---
name: 0RBIT design system hydration quirk
description: Explains why SSR hydration mismatch warnings appear across 0RBIT orbit components and why they're expected, not bugs.
---

Several `src/components/orbit/*` components (LiveCard's float delay/duration, MiniSparkline, BootTerminal, ActivityFeed, MetricTile/AreaChart charts) seed their initial render state with `Math.random()` or similar non-deterministic values directly in `useState`/`useMemo`.

This causes React hydration mismatch warnings in the browser console on every page load (visible in workflow logs as "A tree hydrated but some attributes... didn't match"). This happens on the homepage and every other page that uses these components — it predates the Workers page and is not something introduced by a specific feature.

**Why:** The design intent is "always live, never static" — every card/chart should look subtly different and already in motion on load. React handles the mismatch by regenerating the affected subtree client-side; the page still renders correctly and the animations still work. It's cosmetic console noise, not a functional bug.

**How to apply:** Don't try to "fix" this by memoizing random values across SSR/client or adding `useEffect`-gated randomness unless the user explicitly asks to eliminate hydration warnings — that would mean touching shared design-system components, which is out of scope for feature work and risks behavior changes across the whole site. When building new components that follow this same "always live" pattern (e.g. ActivityFeed), it's consistent with existing convention to do the same thing.
