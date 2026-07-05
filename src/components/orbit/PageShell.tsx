import type { ReactNode } from "react";
import { Nav } from "./Nav";
import { Footer } from "./Footer";
import { Atmosphere } from "./Atmosphere";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <Atmosphere />
      <Nav />
      <main className="pt-32">{children}</main>
      <Footer />
    </div>
  );
}
