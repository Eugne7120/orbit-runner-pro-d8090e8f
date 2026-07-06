// Free models via OpenRouter (https://openrouter.ai/models?q=free)
// All entries are $0 — no API credits consumed.
export const ORBIT_MODELS = [
  {
    id: "0rbit-lite",
    name: "0RBIT Lite",
    description: "Fast responses. Auto-selected free model.",
    internal: "openrouter/free",
    badge: "Free",
    recommended: false,
  },
  {
    id: "0rbit-core",
    name: "0RBIT Core",
    description: "Balanced performance. Nemotron 120B.",
    internal: "nvidia/nemotron-3-super-120b-a12b:free",
    badge: "Recommended",
    recommended: true,
  },
  {
    id: "0rbit-pro",
    name: "0RBIT Pro",
    description: "Advanced reasoning. Gemma 4 31B.",
    internal: "google/gemma-4-31b-it:free",
    badge: "Free",
    recommended: false,
  },
] as const;

export type OrbitModelId = (typeof ORBIT_MODELS)[number]["id"];

/** Map a public 0RBIT model ID to the internal OpenRouter model string. */
export function resolveModel(orbitId: OrbitModelId): string {
  return ORBIT_MODELS.find((m) => m.id === orbitId)?.internal ?? "openrouter/free";
}

/** All valid internal model strings — used server-side to allowlist requests. */
export const ALLOWED_INTERNAL_MODELS = new Set(ORBIT_MODELS.map((m) => m.internal));
