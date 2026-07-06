/**
 * Per-page ambient overlay layered above the global Atmosphere.
 * Extremely subtle (2-5% opacity), always animated slowly.
 */
type Variant = "network" | "code" | "packets" | "credits" | "map" | "blueprint";

export function PageBackground({ variant }: { variant: Variant }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {variant === "code" && <CodeGraph />}
      {variant === "packets" && <Packets />}
      {variant === "credits" && <Credits />}
      {variant === "map" && <MapGrid />}
      {variant === "blueprint" && <Blueprint />}
      {variant === "network" && null}
    </div>
  );
}

function CodeGraph() {
  const modules = Array.from({ length: 18 }).map((_, i) => ({
    x: ((i * 197 + 60) % 1500) + 50,
    y: ((i * 313 + 90) % 800) + 40,
    i,
  }));
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full opacity-[0.045] animate-orbit-atmos-drift"
    >
      <g stroke="oklch(0.78 0.14 232)" strokeWidth="0.5" fill="none">
        {modules.flatMap((a, i) =>
          modules.slice(i + 1).map((b) => {
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d > 340) return null;
            return <path key={`${a.i}-${b.i}`} d={`M${a.x},${a.y} L${b.x},${b.y}`} opacity={0.5} />;
          }),
        )}
      </g>
      {modules.map((m) => (
        <g key={m.i}>
          <rect
            x={m.x - 22}
            y={m.y - 10}
            width="44"
            height="20"
            rx="3"
            fill="none"
            stroke="oklch(0.78 0.14 232 / 0.9)"
            strokeWidth="0.5"
          />
          <circle cx={m.x} cy={m.y} r="1.4" fill="oklch(0.85 0.12 232)" />
        </g>
      ))}
    </svg>
  );
}

function Packets() {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full opacity-[0.045]"
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const y = 120 + i * 160;
        return (
          <g key={i}>
            <line
              x1={0}
              x2={1600}
              y1={y}
              y2={y}
              stroke="oklch(0.78 0.14 232 / 0.35)"
              strokeWidth="0.4"
              strokeDasharray="1 6"
            />
            {Array.from({ length: 4 }).map((_, j) => (
              <rect
                key={j}
                x={-40}
                y={y - 3}
                width="18"
                height="6"
                rx="1"
                fill="oklch(0.78 0.14 232)"
              >
                <animate
                  attributeName="x"
                  from={-40}
                  to={1640}
                  dur={`${9 + i * 1.4 + j}s`}
                  begin={`${j * 1.2 + i * 0.4}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;1;1;0"
                  keyTimes="0;0.1;0.9;1"
                  dur={`${9 + i * 1.4 + j}s`}
                  begin={`${j * 1.2 + i * 0.4}s`}
                  repeatCount="indefinite"
                />
              </rect>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function Credits() {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full opacity-[0.05]"
    >
      {Array.from({ length: 60 }).map((_, i) => {
        const x = (i * 173) % 1600;
        const y = (i * 241) % 900;
        return <circle key={i} cx={x} cy={y} r="1.4" fill="oklch(0.78 0.14 232)" />;
      })}
      <g stroke="oklch(0.78 0.14 232 / 0.3)" strokeWidth="0.5" fill="none">
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={i} d={`M0,${100 + i * 100} Q800,${140 + i * 90} 1600,${80 + i * 100}`} />
        ))}
      </g>
    </svg>
  );
}

function MapGrid() {
  const dots: [number, number][] = [];
  for (let x = 40; x < 1560; x += 20) {
    for (let y = 60; y < 840; y += 20) {
      const nx = x / 1560;
      const ny = y / 840;
      const n = Math.sin(nx * 22 + ny * 9) * Math.cos(ny * 15 - nx * 6);
      if (n > 0.15 && n < 0.9) dots.push([x, y]);
    }
  }
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full opacity-[0.05]"
    >
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.9" fill="oklch(0.78 0.14 232)" />
      ))}
    </svg>
  );
}

function Blueprint() {
  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full opacity-[0.04]"
    >
      <defs>
        <pattern id="bp-grid" width="80" height="80" patternUnits="userSpaceOnUse">
          <path d="M 80 0 L 0 0 0 80" fill="none" stroke="oklch(0.78 0.14 232)" strokeWidth="0.4" />
          <path
            d="M 40 0 L 40 80 M 0 40 L 80 40"
            fill="none"
            stroke="oklch(0.78 0.14 232)"
            strokeWidth="0.2"
          />
        </pattern>
      </defs>
      <rect width="1600" height="900" fill="url(#bp-grid)" />
      {/* engineering annotations */}
      <g stroke="oklch(0.78 0.14 232 / 0.6)" strokeWidth="0.5" fill="none">
        <circle cx="400" cy="300" r="120" />
        <circle cx="1100" cy="600" r="180" />
        <line x1="200" y1="450" x2="1400" y2="450" strokeDasharray="4 4" />
      </g>
    </svg>
  );
}
