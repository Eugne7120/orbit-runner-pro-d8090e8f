---
name: 0RBIT Atmosphere area routing
description: How new marketing pages should hook into the global animated background's per-page emphasis.
---

`src/components/orbit/Atmosphere.tsx` renders one shared background topology across the whole site, but emphasizes different node clusters (`edge`/`router`/`worker`/`storage`/`sink`) and signal edges depending on an `Area` derived from the current pathname (`areaFromPath`).

**Why:** This is how every page gets a background that "feels" thematically relevant (e.g. workers pages emphasize the worker mesh, economy/treasury pages emphasize storage/sink nodes) without maintaining a separate background per route.

**How to apply:** When adding a new top-level route, check `areaFromPath` and either map the new path to an existing `Area` that fits thematically, or add a new `Area` with its own `AREA_EMPHASIS`/`SIGNAL_INDICES` entries. Multiple paths can safely share one `Area` (e.g. `/pricing` and `/economy` both map to `"economy"`) — this is intentional reuse, not a workaround. Also check `PageBackground.tsx` for the separate, page-specific ambient overlay (`variant` prop like `"credits"`, `"packets"`) which can likewise be reused across thematically similar pages.
