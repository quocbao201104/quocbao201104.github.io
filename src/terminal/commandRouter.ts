import type { TerminalLine } from '@/data/terminalScript';

function out(
  speaker: string,
  text: string,
  tone: TerminalLine extends { kind: 'output'; speakerTone?: infer T }
    ? NonNullable<T>
    : 'muted' = 'muted',
): TerminalLine {
  return { kind: 'output', speaker, speakerTone: tone as any, text } as TerminalLine;
}

function normalize(input: string) {
  return input.trim().replace(/\s+/g, ' ');
}

export interface CommandResult {
  lines: TerminalLine[];
  clear?: boolean;
  switchSession?: string;
  remote?: {
    mode: 'llm' | 'rag';
    speaker: string;
    tone: 'purple' | 'cyan' | 'ok' | 'warn' | 'muted';
    message: string;
    activeView?: string;
  };
}

export function runTerminalCommand(opts: {
  sessionId: string;
  prompt: string;
  input: string;
}): CommandResult {
  const raw = normalize(opts.input);
  if (!raw) return { lines: [] };

  const lower = raw.toLowerCase();

  // Real LLM / RAG mode (server-side)
  if (lower.startsWith('llm ')) {
    const msg = raw.slice(4).trim();
    if (!msg) return { lines: [out('BAO.OS', 'Usage: llm <message>', 'muted')] };
    return {
      lines: [],
      remote: { mode: 'llm', speaker: 'BAO.OS', tone: 'muted', message: msg },
    };
  }
  if (lower.startsWith('rag ')) {
    const msg = raw.slice(4).trim();
    if (!msg) return { lines: [out('BAO.OS', 'Usage: rag <message>', 'muted')] };
    return {
      lines: [],
      remote: { mode: 'rag', speaker: 'BAO.OS', tone: 'muted', message: msg },
    };
  }

  if (lower === 'help' || lower === '?') {
    return {
      lines: [
        out('BAO.OS', 'Available commands:', 'muted'),
        out('BAO.OS', '  help', 'muted'),
        out('BAO.OS', '  clear', 'muted'),
        out('BAO.OS', '  llm <message>        (real model via Vercel proxy)', 'muted'),
        out('BAO.OS', '  rag <message>        (real model + Supabase pgvector)', 'muted'),
        out('BAO.OS', '  ask recruiter [topic]', 'muted'),
        out('BAO.OS', '  inspect architecture [system]', 'muted'),
        out('BAO.OS', '  run memory agent [query]', 'muted'),
        out('BAO.OS', '  switch session_01|architecture.ai|memory.log', 'muted'),
      ],
    };
  }

  if (lower === 'clear' || lower === 'cls') {
    return { lines: [], clear: true };
  }

  if (lower.startsWith('switch ')) {
    const target = lower.replace('switch ', '').trim();
    const allow = ['session_01', 'architecture.ai', 'memory.log'];
    if (allow.includes(target)) return { lines: [out('BAO.OS', `Switching to ${target}...`, 'muted')], switchSession: target };
    return { lines: [out('BAO.OS', `Unknown session "${target}". Try: ${allow.join(' | ')}`, 'warn' as any)] };
  }

  if (lower.startsWith('ask recruiter')) {
    const topic = raw.replace(/ask recruiter/i, '').trim();
    if (!topic) {
      return {
        lines: [
          out(
            'Recruiter Agent',
            "Tell me what role you’re targeting (backend / platform / AI infra), and I’ll summarize fit + strengths + likely interview angles.",
            'purple' as any,
          ),
        ],
      };
    }
    return {
      lines: [
        out(
          'Recruiter Agent',
          `On "${topic}": I’d position Bao as a calm systems thinker — strong backend fundamentals, architecture taste, and pragmatic agentic experimentation. Want a 30-second pitch or a bullet resume rewrite?`,
          'purple' as any,
        ),
      ],
    };
  }

  if (lower.startsWith('inspect architecture')) {
    const system = raw.replace(/inspect architecture/i, '').trim() || 'this system';
    return {
      lines: [
        out('Architect Agent', `Analyzing ${system}...`, 'cyan' as any),
        out(
          'Architect Agent',
          'High-level: ingress → normalization → vector/graph memory → retrieval + rerank → response synthesis. Key risks: latency budgets, eval loops, and memory drift.',
          'cyan' as any,
        ),
      ],
    };
  }

  if (lower.startsWith('run memory agent') || lower.startsWith('search memory')) {
    const q = raw.replace(/run memory agent|search memory/i, '').trim() || 'recent focus';
    return {
      lines: [
        out('Memory Agent', `Query: "${q}"`, 'ok' as any),
        out('Memory Agent', 'Searching through episodic + semantic indexes...', 'ok' as any),
        out('Memory Agent', 'Found 6 relevant memories. Top: GraphRAG tuning notes, retrieval eval checklist, and orchestration latency profiling.', 'ok' as any),
      ],
    };
  }

  return {
    lines: [
      out(
        'BAO.OS',
        `Unknown command: "${raw}". Type "help" for options.`,
        'muted',
      ),
    ],
  };
}

