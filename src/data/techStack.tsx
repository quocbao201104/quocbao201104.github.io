import type { ReactNode } from 'react';

export interface Tech {
  id: string;
  label: string;
  glyph: ReactNode;
  brand: string;
}

function Mono({ children, color }: { children: ReactNode; color: string }) {
  return (
    <span
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-bg-raised text-[12px] font-mono font-semibold tracking-tight"
      style={{ color }}
    >
      {children}
    </span>
  );
}

function Tri({ color }: { color: string }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-bg-raised">
      <svg viewBox="0 0 24 24" width="14" height="14" fill={color}>
        <path d="M12 2 22 21 2 21 Z" />
      </svg>
    </span>
  );
}

function Whale({ color }: { color: string }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-bg-raised">
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="9" width="3" height="3" />
        <rect x="7" y="9" width="3" height="3" />
        <rect x="11" y="9" width="3" height="3" />
        <rect x="7" y="5" width="3" height="3" />
        <path d="M2 13s2 4 8 4 10-3 12-7c-1 1-3 1-4 0" />
      </svg>
    </span>
  );
}

function Chain({ color }: { color: string }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-bg-raised">
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 14a4 4 0 0 1 0-5.7l2-2a4 4 0 1 1 5.7 5.7l-1 1" />
        <path d="M14 10a4 4 0 0 1 0 5.7l-2 2a4 4 0 1 1-5.7-5.7l1-1" />
      </svg>
    </span>
  );
}

function Spark({ color }: { color: string }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-bg-raised">
      <svg viewBox="0 0 24 24" width="14" height="14" fill={color}>
        <path d="M12 2 13.5 9.5 21 11 13.5 12.5 12 20 10.5 12.5 3 11 10.5 9.5Z" />
      </svg>
    </span>
  );
}

export const techStack: Tech[] = [
  { id: 'python', label: 'Python', brand: '#facc15', glyph: <Mono color="#facc15">Py</Mono> },
  { id: 'typescript', label: 'TypeScript', brand: '#3b82f6', glyph: <Mono color="#3b82f6">Ts</Mono> },
  { id: 'nextjs', label: 'Next.js', brand: '#f4f4f7', glyph: <Tri color="#f4f4f7" /> },
  { id: 'postgres', label: 'PostgreSQL', brand: '#67e8f9', glyph: <Mono color="#67e8f9">Pg</Mono> },
  { id: 'docker', label: 'Docker', brand: '#60a5fa', glyph: <Whale color="#60a5fa" /> },
  { id: 'langchain', label: 'LangChain', brand: '#34d399', glyph: <Chain color="#34d399" /> },
  { id: 'openai', label: 'OpenAI', brand: '#a855f7', glyph: <Spark color="#a855f7" /> },
];
