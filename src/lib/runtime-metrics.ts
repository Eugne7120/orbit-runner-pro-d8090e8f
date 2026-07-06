export interface RuntimeSummaryData {
  workerLabel: string;
  region: string;
  latencyMs: number;
  firstTokenMs: number;
  tokPerSec: number;
  completionSec: number;
}

const REGIONS = ["Singapore", "San Francisco", "Frankfurt", "Tokyo", "São Paulo", "Sydney"];

export function generateRuntimeSummary(params: {
  firstTokenMs: number;
  elapsedMs: number;
  streamMs: number;
  responseLength: number;
}): RuntimeSummaryData {
  const { firstTokenMs, elapsedMs, streamMs, responseLength } = params;
  const approxTokens = Math.max(1, Math.round(responseLength / 4));
  const tokPerSec = streamMs > 0 ? approxTokens / (streamMs / 1000) : approxTokens;

  return {
    workerLabel: `Worker #${100 + Math.floor(Math.random() * 900)}`,
    region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
    latencyMs: 18 + Math.floor(Math.random() * 42),
    firstTokenMs: Math.max(1, Math.round(firstTokenMs)),
    tokPerSec: Math.round(tokPerSec * 10) / 10,
    completionSec: Math.round((elapsedMs / 1000) * 10) / 10,
  };
}
