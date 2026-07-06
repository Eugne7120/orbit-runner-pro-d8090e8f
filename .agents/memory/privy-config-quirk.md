---
name: Privy config version quirk
description: The installed @privy-io/react-auth version rejects certain legacy config shapes (embeddedWallets fields, solanaClusters) with type errors.
---

The `PrivyProvider` config object shape drifts between `@privy-io/react-auth` versions. Fields that appear in older docs/examples (e.g. a top-level `solanaClusters` option, or `embeddedWallets.solana`/`embeddedWallets.ethereum` sub-keys) may not exist in the currently installed version's TypeScript types, causing `tsc` errors.

**Why:** During a QA pass, the config had `embeddedWallets: { ethereum: {...}, solana: {...} }` and a `solanaClusters` field that don't match the installed SDK version's type definitions, producing real TS compile errors (not false positives).

**How to apply:** Before adding/editing Privy config options, check the actual installed package's type definitions (`node_modules/@privy-io/react-auth/dist/**/*.d.ts` or hover types) rather than trusting older docs or examples — the config surface changes across versions.
