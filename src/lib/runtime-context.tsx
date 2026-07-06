import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export type RuntimeStage =
  | "idle"
  | "allocate"
  | "load"
  | "prepare"
  | "inference"
  | "stream"
  | "complete";

export interface RuntimeSnapshot {
  stage: RuntimeStage;
  workerId: string | null;
}

interface RuntimeContextValue extends RuntimeSnapshot {
  setRuntime: (next: Partial<RuntimeSnapshot>) => void;
  reset: () => void;
}

const IDLE: RuntimeSnapshot = { stage: "idle", workerId: null };

const RuntimeContext = createContext<RuntimeContextValue>({
  ...IDLE,
  setRuntime: () => {},
  reset: () => {},
});

export function RuntimeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RuntimeSnapshot>(IDLE);

  const setRuntime = useCallback((next: Partial<RuntimeSnapshot>) => {
    setState((prev) => ({ ...prev, ...next }));
  }, []);

  const reset = useCallback(() => setState(IDLE), []);

  return (
    <RuntimeContext.Provider value={{ ...state, setRuntime, reset }}>
      {children}
    </RuntimeContext.Provider>
  );
}

export function useRuntime() {
  return useContext(RuntimeContext);
}
