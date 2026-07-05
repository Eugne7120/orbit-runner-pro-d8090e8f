export const ORBIT_MODELS = [
  {
    id: "0rbit-lite",
    name: "0RBIT Lite",
    description: "Fast responses. Free.",
    internal: "openai/gpt-4o-mini",
    badge: "Free",
    recommended: false,
  },
  {
    id: "0rbit-core",
    name: "0RBIT Core",
    description: "Balanced performance.",
    internal: "openai/gpt-4o",
    badge: "Recommended",
    recommended: true,
  },
  {
    id: "0rbit-pro",
    name: "0RBIT Pro",
    description: "Advanced reasoning.",
    internal: "openai/gpt-4o",
    badge: "Premium",
    recommended: false,
  },
] as const;

export type OrbitModelId = (typeof ORBIT_MODELS)[number]["id"];

export function resolveModel(orbitId: OrbitModelId): string {
  return ORBIT_MODELS.find((m) => m.id === orbitId)?.internal ?? "openai/gpt-4o-mini";
}
