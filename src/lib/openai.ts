// Free models via OpenRouter (https://openrouter.ai/models?q=free)
// All entries use the `:free` suffix — no API credits consumed.
export const ORBIT_MODELS = [
  {
    id: "0rbit-lite",
    name: "0RBIT Lite",
    description: "Fast responses. Llama 3.1 8B.",
    internal: "meta-llama/llama-3.1-8b-instruct:free",
    badge: "Free",
    recommended: false,
  },
  {
    id: "0rbit-core",
    name: "0RBIT Core",
    description: "Balanced performance. Llama 3.3 70B.",
    internal: "meta-llama/llama-3.3-70b-instruct:free",
    badge: "Recommended",
    recommended: true,
  },
  {
    id: "0rbit-pro",
    name: "0RBIT Pro",
    description: "Advanced reasoning. Gemma 2 9B.",
    internal: "google/gemma-2-9b-it:free",
    badge: "Free",
    recommended: false,
  },
] as const;

export type OrbitModelId = (typeof ORBIT_MODELS)[number]["id"];

/** Map a public 0RBIT model ID to the internal OpenRouter model string. */
export function resolveModel(orbitId: OrbitModelId): string {
  return (
    ORBIT_MODELS.find((m) => m.id === orbitId)?.internal ??
    "meta-llama/llama-3.1-8b-instruct:free"
  );
}

/** All valid internal model strings — used server-side to allowlist requests. */
export const ALLOWED_INTERNAL_MODELS = new Set(ORBIT_MODELS.map((m) => m.internal));
