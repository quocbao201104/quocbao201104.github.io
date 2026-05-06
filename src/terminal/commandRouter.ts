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
    persona?: 'bao' | 'recruiter' | 'architect' | 'memory';
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
      remote: { mode: 'llm', speaker: 'BAO.OS', tone: 'muted', message: msg, persona: 'bao' },
    };
  }
  if (lower.startsWith('rag ')) {
    const msg = raw.slice(4).trim();
    if (!msg) return { lines: [out('BAO.OS', 'Usage: rag <message>', 'muted')] };
    return {
      lines: [],
      remote: { mode: 'rag', speaker: 'BAO.OS', tone: 'muted', message: msg, persona: 'bao' },
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
    return {
      lines: [],
      remote: {
        mode: 'llm',
        speaker: 'Recruiter Agent',
        tone: 'purple',
        message: topic || 'Summarize Bao’s fit and strengths for backend/platform/AI infra roles.',
        persona: 'recruiter',
      },
    };
  }

  if (lower.startsWith('inspect architecture')) {
    const system = raw.replace(/inspect architecture/i, '').trim() || 'this system';
    return {
      lines: [],
      remote: {
        mode: 'llm',
        speaker: 'Architect Agent',
        tone: 'cyan',
        message: `Inspect architecture: ${system}. Provide boundaries, data flow, trade-offs, failure modes, and next steps.`,
        persona: 'architect',
      },
    };
  }

  if (lower.startsWith('run memory agent') || lower.startsWith('search memory')) {
    const q = raw.replace(/run memory agent|search memory/i, '').trim() || 'recent focus';
    return {
      lines: [],
      remote: {
        mode: 'rag',
        speaker: 'Memory Agent',
        tone: 'ok',
        message: q,
        persona: 'memory',
      },
    };
  }

  // Session defaults: typing plain text uses that tab’s persona/mode.
  if (!/^(help|\?|clear|cls|switch\b|ask recruiter\b|inspect architecture\b|run memory agent\b|search memory\b|llm\b|rag\b)/i.test(lower)) {
    if (opts.sessionId === 'architecture.ai') {
      return {
        lines: [],
        remote: { mode: 'llm', speaker: 'Architect Agent', tone: 'cyan', message: raw, persona: 'architect' },
      };
    }
    if (opts.sessionId === 'memory.log') {
      return {
        lines: [],
        remote: { mode: 'rag', speaker: 'Memory Agent', tone: 'ok', message: raw, persona: 'memory' },
      };
    }
    return {
      lines: [],
      remote: { mode: 'llm', speaker: 'BAO.OS', tone: 'muted', message: raw, persona: 'bao' },
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

