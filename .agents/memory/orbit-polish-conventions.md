---
name: 0RBIT final-polish conventions
description: Mobile nav pattern, easing/aria conventions established during the Sprint 7 pre-launch polish pass.
---

**Mobile navigation:** The main nav previously hid all links (`hidden md:flex`) with no mobile alternative. Fixed by adding a `Sheet` (from `src/components/ui/sheet.tsx`, Radix Dialog under the hood) triggered by a hamburger icon `md:hidden`, mirroring the same link list. Any new top-level nav link must be added to both the desktop link list and the mobile Sheet content in `Nav.tsx`.

**Why:** This app targets a broad marketing audience and mobile users had zero way to navigate beyond the homepage before this fix.

**Animation easing:** Two custom eases exist: `--ease-orbit` (cubic-bezier(0.22,0.61,0.36,1)) for pulse/glow-style loops, `--ease-out-soft` (cubic-bezier(0.16,1,0.3,1)) for entrance/reveal animations. When adding new looping "signal" animations, reuse `--ease-orbit` rather than inventing a new cubic-bezier — inconsistent eases were flagged and fixed once already (`orbit-ping` was on a bespoke curve, now aligned to `--ease-orbit`).

**Accessibility baseline:** Interactive elements in `orbit/` components (nav links, footer links, accordion triggers, staking buttons) should carry `focus-visible:ring-2 focus-visible:ring-ring` (the `ui/` primitives already do this by default) plus real `aria-label`/`aria-expanded`/`aria-controls` where relevant. This was largely missing in the marketing-page-specific components (as opposed to the shared `ui/` primitives) and was retrofitted — check for it before assuming it's already there when touching `orbit/` files.
