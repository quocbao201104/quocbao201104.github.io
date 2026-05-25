import { useMemo } from 'react';
import { Brain, Network, Layers, Boxes } from 'lucide-react';
import { cn } from '@/lib/cn';
import { StatusDot } from '@/components/common/StatusDot';

type Tier = 'core' | 'inner' | 'mid' | 'outer' | 'micro';

interface Node {
  id: string;
  x: number;
  y: number;
  r: number;
  tier: Tier;
  delay?: number;
}

interface Edge {
  from: string;
  to: string;
  pulse?: boolean;
  delay?: number;
}

const VIEW_W = 800;
const VIEW_H = 600;
const CX = 400;
const CY = 300;

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function buildGraph(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [
    { id: 'core', x: CX, y: CY, r: 5, tier: 'core' },
  ];

  // Inner ring – 6 nodes
  const innerCount = 6;
  for (let i = 0; i < innerCount; i++) {
    const { x, y } = polar(CX, CY, 95, (360 / innerCount) * i + 30);
    nodes.push({ id: `i${i}`, x, y, r: 3.4, tier: 'inner', delay: i * 0.18 });
  }

  // Mid ring – 8 nodes
  const midCount = 8;
  for (let i = 0; i < midCount; i++) {
    const { x, y } = polar(CX, CY, 178, (360 / midCount) * i + 22);
    nodes.push({ id: `m${i}`, x, y, r: 2.6, tier: 'mid', delay: i * 0.13 + 0.5 });
  }

  // Outer ring – 10 scattered nodes
  const outerSeeds = [
    { d: 248, deg: 14 },
    { d: 270, deg: 50 },
    { d: 252, deg: 90 },
    { d: 272, deg: 135 },
    { d: 248, deg: 170 },
    { d: 252, deg: 205 },
    { d: 272, deg: 240 },
    { d: 250, deg: 275 },
    { d: 270, deg: 312 },
    { d: 248, deg: 348 },
  ];
  outerSeeds.forEach((s, i) => {
    const { x, y } = polar(CX, CY, s.d, s.deg);
    nodes.push({ id: `o${i}`, x, y, r: 2.0, tier: 'outer', delay: i * 0.09 + 1.1 });
  });

  // Micro ambient dots
  const microSeeds = [
    { d: 297, deg: 28 },
    { d: 308, deg: 75 },
    { d: 292, deg: 198 },
    { d: 312, deg: 322 },
  ];
  microSeeds.forEach((s, i) => {
    const { x, y } = polar(CX, CY, s.d, s.deg);
    nodes.push({ id: `u${i}`, x, y, r: 1.4, tier: 'micro' });
  });

  const edges: Edge[] = [];
  for (let i = 0; i < innerCount; i++) {
    edges.push({ from: 'core', to: `i${i}`, pulse: i % 2 === 0, delay: i * 0.4 });
  }
  for (let i = 0; i < midCount; i++) {
    const a = Math.floor((i * innerCount) / midCount);
    const b = (a + 1) % innerCount;
    edges.push({ from: `i${a}`, to: `m${i}`, pulse: i % 3 === 0, delay: i * 0.35 + 1.2 });
    if (i % 2 === 0) {
      edges.push({ from: `i${b}`, to: `m${i}`, delay: i * 0.45 + 2 });
    }
  }
  outerSeeds.forEach((_s, i) => {
    const m = Math.round((i * midCount) / outerSeeds.length) % midCount;
    edges.push({ from: `m${m}`, to: `o${i}`, pulse: i % 4 === 1, delay: i * 0.3 + 2.4 });
  });

  return { nodes, edges };
}

export function NeuralGraph() {
  const { nodes, edges } = useMemo(buildGraph, []);
  const nodeMap = useMemo(
    () => Object.fromEntries(nodes.map((n) => [n.id, n])),
    [nodes],
  );

  return (
    <div className="relative w-full aspect-[5/4] mx-auto select-none -translate-y-6">
      {/* Static, lightweight backdrop (no filters/animation) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 mask-radial-soft"
        style={{
          background:
            'radial-gradient(circle at center, rgba(168,85,247,0.10) 0%, rgba(124,58,237,0.06) 28%, rgba(103,232,249,0.03) 52%, transparent 75%)',
        }}
      />

      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="relative w-full h-full"
      >
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="45%" stopColor="#c4a3f7" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e9d5ff" stopOpacity="1" />
            <stop offset="60%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="cyanNode" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#cffafe" stopOpacity="1" />
            <stop offset="60%" stopColor="#67e8f9" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="edge" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(168,85,247,0.45)" />
            <stop offset="100%" stopColor="rgba(103,232,249,0.22)" />
          </linearGradient>
        </defs>

        {/* Decorative orbital rings */}
        <circle
          cx={CX}
          cy={CY}
          r={250}
          fill="none"
          stroke="rgba(168,85,247,0.10)"
          strokeDasharray="2 6"
        />
        <circle
          cx={CX}
          cy={CY}
          r={178}
          fill="none"
          stroke="rgba(168,85,247,0.06)"
        />
        <circle
          cx={CX}
          cy={CY}
          r={95}
          fill="none"
          stroke="rgba(168,85,247,0.04)"
        />

        {/* Edges */}
        <g>
          {edges.map((e, idx) => {
            const a = nodeMap[e.from];
            const b = nodeMap[e.to];
            if (!a || !b) return null;
            return (
              <line
                key={`${e.from}-${e.to}-${idx}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="url(#edge)"
                strokeWidth={0.8}
                strokeOpacity={e.pulse ? 0.35 : 0.14}
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {nodes.map((n) => {
            if (n.tier === 'core') {
              return (
                <g key={n.id}>
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={54}
                    fill="url(#coreGlow)"
                    opacity={0.55}
                  />
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={18.5}
                    fill="none"
                    stroke="rgba(168,85,247,0.40)"
                    strokeWidth={1}
                  />
                  {/* Bright core */}
                  <circle cx={n.x} cy={n.y} r={8} fill="#f4f4f7" />
                  <circle cx={n.x} cy={n.y} r={4} fill="#ffffff" opacity={0.92} />
                </g>
              );
            }
            const isCyan = n.tier === 'outer' && (n.id === 'o2' || n.id === 'o6');
            return (
              <circle
                key={n.id}
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill={isCyan ? 'url(#cyanNode)' : 'url(#nodeGlow)'}
                opacity={0.95}
              />
            );
          })}
        </g>
      </svg>

      {/* Floating satellite chips */}
      <SatelliteChip
        className="left-[10%] top-[4%]"
        icon={<Brain size={11} />}
        label="MEMORY"
        value="92% Active"
        tone="purple"
      />
      <SatelliteChip
        className="right-[6%] top-[16%]"
        icon={<Network size={11} />}
        label="AGENTS"
        value="5 Online"
        tone="cyan"
      />
      <SatelliteChip
        className="left-[12%] bottom-[30%]"
        icon={<Boxes size={11} />}
        label="PROJECTS"
        value="12 Deployed"
        tone="purple"
      />
      <SatelliteChip
        className="right-[10%] bottom-[14%]"
        icon={<Layers size={11} />}
        label="SYSTEMS"
        value="All Green"
        tone="ok"
      />
    </div>
  );
}

function SatelliteChip({
  className,
  icon,
  label,
  value,
  tone,
}: {
  className?: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: 'purple' | 'cyan' | 'ok';
}) {
  return (
    <div
      className={cn(
        'absolute pointer-events-none flex items-center gap-2 rounded-full px-3 py-1.5',
        'glass shadow-[0_4px_18px_-6px_rgba(0,0,0,0.6)]',
        className,
      )}
    >
      <StatusDot tone={tone} />
      <span className="flex items-center gap-1.5 text-2xs font-mono uppercase tracking-wider2 text-ink-bright">
        <span className="text-accent-purple-soft">{icon}</span>
        {label}
      </span>
      <span className="text-2xs text-ink-dim">{value}</span>
    </div>
  );
}

// AmbientParticles removed for static performance.
