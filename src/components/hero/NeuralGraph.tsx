import { motion } from 'framer-motion';
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

interface Particle {
  id: string;
  fromId: string;
  toId: string;
  duration: number;
  delay: number;
  color: 'purple' | 'cyan' | 'white';
}

const VIEW_W = 800;
const VIEW_H = 600;
const CX = 400;
const CY = 300;

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function buildGraph(): { nodes: Node[]; edges: Edge[]; particles: Particle[] } {
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

  // Traveling data-packet particles — flow ONLY along strongest paths.
  // Each particle animates from its fromId node to its toId node (or reverse).
  const particles: Particle[] = [
    { id: 'p1', fromId: 'core', toId: 'i0', duration: 4.2, delay: 0, color: 'purple' },
    { id: 'p2', fromId: 'core', toId: 'i2', duration: 4.6, delay: 1.1, color: 'cyan' },
    { id: 'p3', fromId: 'core', toId: 'i4', duration: 4.4, delay: 2.0, color: 'purple' },
    { id: 'p4', fromId: 'i1', toId: 'm1', duration: 3.8, delay: 0.6, color: 'purple' },
    { id: 'p5', fromId: 'i3', toId: 'm4', duration: 4.0, delay: 1.7, color: 'cyan' },
    { id: 'p6', fromId: 'm2', toId: 'o2', duration: 4.5, delay: 2.5, color: 'white' },
    { id: 'p7', fromId: 'i5', toId: 'core', duration: 4.2, delay: 3.2, color: 'cyan' },
    { id: 'p8', fromId: 'o5', toId: 'm5', duration: 4.6, delay: 0.9, color: 'purple' },
  ];

  return { nodes, edges, particles };
}

const particleColor: Record<Particle['color'], string> = {
  purple: '#c4a3f7',
  cyan: '#a5f3fc',
  white: '#ffffff',
};

export function NeuralGraph() {
  const { nodes, edges, particles } = useMemo(buildGraph, []);
  const nodeMap = useMemo(
    () => Object.fromEntries(nodes.map((n) => [n.id, n])),
    [nodes],
  );

  return (
    <div className="relative w-full aspect-[5/4] mx-auto select-none -translate-y-6">
      {/* Layer 1: Outer atmospheric blur — wide, very faint */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 mask-radial-soft"
        style={{
          background:
            'radial-gradient(circle at center, rgba(168,85,247,0.16) 0%, rgba(124,58,237,0.10) 25%, rgba(103,232,249,0.04) 50%, transparent 75%)',
          filter: 'blur(28px)',
        }}
      />

      {/* Layer 2: Mid halo */}
      <div
        aria-hidden
        className="absolute inset-[10%] -z-10 rounded-full"
        style={{
          background:
            'radial-gradient(circle at center, rgba(168,85,247,0.20) 0%, rgba(168,85,247,0.06) 40%, transparent 70%)',
          filter: 'blur(8px)',
        }}
      />

      {/* Layer 3: Drifting ambient particles outside the graph */}
      <AmbientParticles />

      <motion.svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className="relative w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      >
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="35%" stopColor="#c4a3f7" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#a855f7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="coreOuter" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#7c3aed" stopOpacity="0.15" />
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

          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="particleGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
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
              <motion.line
                key={`${e.from}-${e.to}-${idx}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="url(#edge)"
                strokeWidth={0.8}
                strokeOpacity={e.pulse ? 0.55 : 0.16}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: e.pulse ? 0.55 : 0.16 }}
                transition={{
                  pathLength: { duration: 1.4, delay: 0.2 + (e.delay ?? 0) * 0.04 },
                  opacity: { duration: 1, delay: 0.2 + (e.delay ?? 0) * 0.04 },
                }}
                style={
                  e.pulse
                    ? {
                        animation: `neural-pulse 5s ease-in-out infinite`,
                        animationDelay: `${(e.delay ?? 0) * 0.5}s`,
                      }
                    : undefined
                }
              />
            );
          })}
        </g>

        {/* Traveling data-packet particles — render BEHIND nodes so nodes hide endpoints */}
        <g filter="url(#particleGlow)">
          {particles.map((p) => {
            const a = nodeMap[p.fromId];
            const b = nodeMap[p.toId];
            if (!a || !b) return null;
            return (
              <motion.circle
                key={p.id}
                r={1.8}
                fill={particleColor[p.color]}
                initial={{ cx: a.x, cy: a.y, opacity: 0 }}
                animate={{
                  cx: [a.x, b.x],
                  cy: [a.y, b.y],
                  opacity: [0, 0.95, 0.95, 0],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  repeatDelay: 1.2,
                  ease: 'easeInOut',
                  times: [0, 0.15, 0.85, 1],
                }}
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
                  {/* Outer halo — slow */}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={70}
                    fill="url(#coreOuter)"
                    style={{
                      animation: 'pulse-glow 5.4s ease-in-out infinite',
                      transformOrigin: `${n.x}px ${n.y}px`,
                      animationDelay: '0.6s',
                    }}
                  />
                  {/* Mid glow — main pulse */}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={42}
                    fill="url(#coreGlow)"
                    className="animate-pulse-glow"
                    style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                  />
                  {/* Expanding pulse ring */}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={18}
                    fill="none"
                    stroke="rgba(168,85,247,0.55)"
                    strokeWidth={1.2}
                    style={{
                      animation: 'pulse-ring 3.2s ease-out infinite',
                      transformOrigin: `${n.x}px ${n.y}px`,
                    }}
                  />
                  {/* Bright core */}
                  <circle cx={n.x} cy={n.y} r={9} fill="#f4f4f7" filter="url(#glow)" />
                  <circle cx={n.x} cy={n.y} r={4} fill="#ffffff" />
                </g>
              );
            }
            const isCyan = n.tier === 'outer' && (n.id === 'o2' || n.id === 'o6');
            return (
              <motion.circle
                key={n.id}
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill={isCyan ? 'url(#cyanNode)' : 'url(#nodeGlow)'}
                filter="url(#softGlow)"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 110,
                  damping: 18,
                  delay: 0.25 + (n.delay ?? 0),
                }}
                style={{ transformOrigin: `${n.x}px ${n.y}px` }}
              />
            );
          })}
        </g>
      </motion.svg>

      {/* Floating satellite chips */}
      <SatelliteChip
        className="left-[10%] top-[4%]"
        icon={<Brain size={11} />}
        label="MEMORY"
        value="92% Active"
        tone="purple"
        driftDelay={0}
      />
      <SatelliteChip
        className="right-[6%] top-[16%]"
        icon={<Network size={11} />}
        label="AGENTS"
        value="5 Online"
        tone="cyan"
        driftDelay={1.5}
      />
      <SatelliteChip
        className="left-[12%] bottom-[30%]"
        icon={<Boxes size={11} />}
        label="PROJECTS"
        value="12 Deployed"
        tone="purple"
        driftDelay={3}
      />
      <SatelliteChip
        className="right-[10%] bottom-[14%]"
        icon={<Layers size={11} />}
        label="SYSTEMS"
        value="All Green"
        tone="ok"
        driftDelay={4.5}
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
  driftDelay = 0,
}: {
  className?: string;
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: 'purple' | 'cyan' | 'ok';
  driftDelay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{
        opacity: 1,
        y: [0, -4, 0],
        scale: 1,
      }}
      transition={{
        opacity: { duration: 0.7, delay: 1.6, ease: 'easeOut' },
        scale: { duration: 0.7, delay: 1.6, ease: 'easeOut' },
        y: {
          duration: 7,
          delay: driftDelay,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }}
      className={cn(
        'absolute pointer-events-none flex items-center gap-2 rounded-full px-3 py-1.5',
        'glass shadow-[0_4px_18px_-6px_rgba(0,0,0,0.6)]',
        className,
      )}
    >
      <StatusDot tone={tone} pulse />
      <span className="flex items-center gap-1.5 text-2xs font-mono uppercase tracking-wider2 text-ink-bright">
        <span className="text-accent-purple-soft">{icon}</span>
        {label}
      </span>
      <span className="text-2xs text-ink-dim">{value}</span>
    </motion.div>
  );
}

/**
 * Tiny ambient particles drifting outside the graph — purely atmospheric.
 * Pre-seeded positions so motion is calm and deterministic.
 */
function AmbientParticles() {
  const seeds = [
    { x: '12%', y: '18%', dx: 12, dy: -8, dur: 18, delay: 0, size: 1.5, op: 0.5 },
    { x: '88%', y: '14%', dx: -10, dy: 14, dur: 22, delay: 1, size: 1, op: 0.4 },
    { x: '8%', y: '70%', dx: 18, dy: -6, dur: 26, delay: 2, size: 1.5, op: 0.55 },
    { x: '92%', y: '78%', dx: -14, dy: -10, dur: 24, delay: 3, size: 1, op: 0.4 },
    { x: '50%', y: '6%', dx: 6, dy: 12, dur: 20, delay: 1.5, size: 1, op: 0.45 },
    { x: '50%', y: '92%', dx: -8, dy: -12, dur: 23, delay: 2.5, size: 1.2, op: 0.45 },
  ];
  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {seeds.map((s, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-accent-purple-soft"
          style={{
            left: s.x,
            top: s.y,
            width: s.size + 'px',
            height: s.size + 'px',
            opacity: s.op,
            boxShadow: '0 0 6px rgba(196,163,247,0.6)',
          }}
          animate={{
            x: [0, s.dx, 0],
            y: [0, s.dy, 0],
          }}
          transition={{
            duration: s.dur,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
