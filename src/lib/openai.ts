// Free models via OpenRouter (https://openrouter.ai/models?q=free)
// All entries are $0 — no API credits consumed.
// Picks are re-validated periodically by hitting the OpenRouter API directly
// and measuring real latency/availability, since free-tier model performance
// and uptime vary across providers. See replit.md for the last check date.
export const ORBIT_MODELS = [
  {
    id: "0rbit-lite",
    name: "0RBIT Lite",
    description: "Fastest responses. Nemotron 3 Nano (MoE, 3B active).",
    internal: "nvidia/nemotron-3-nano-30b-a3b:free",
    badge: "Free",
    recommended: false,
  },
  {
    id: "0rbit-core",
    name: "0RBIT Core",
    description: "Balanced speed and quality. OpenAI gpt-oss-20b.",
    internal: "openai/gpt-oss-20b:free",
    badge: "Recommended",
    recommended: true,
  },
  {
    id: "0rbit-pro",
    name: "0RBIT Pro",
    description: "Advanced reasoning. Nemotron 3 Super 120B.",
    internal: "nvidia/nemotron-3-super-120b-a12b:free",
    badge: "Free",
    recommended: false,
  },
] as const;

export type OrbitModelId = (typeof ORBIT_MODELS)[number]["id"];

/** Map a public 0RBIT model ID to the internal OpenRouter model string. */
export function resolveModel(orbitId: OrbitModelId): string {
  return (
    ORBIT_MODELS.find((m) => m.id === orbitId)?.internal ?? "nvidia/nemotron-3-nano-30b-a3b:free"
  );
}

/** All valid internal model strings — used server-side to allowlist requests. */
export const ALLOWED_INTERNAL_MODELS = new Set(ORBIT_MODELS.map((m) => m.internal));
