import type { TerminalLine } from '@/data/terminalScript';
import { parseTerminalCommand } from '@/terminal/commandParser';
import { routeTerminalIntent } from '@/terminal/intentRouter';
import type { ConsoleMode } from '@/types/console';

function out(
  speaker: string,
  text: string,
  tone: TerminalLine extends { kind: 'output'; speakerTone?: infer T }
    ? NonNullable<T>
    : 'muted' = 'muted',
): TerminalLine {
  return { kind: 'output', speaker, speakerTone: tone as any, text } as TerminalLine;
}

function liveAiEnabled(): boolean {
  const raw = (import.meta as any).env?.VITE_AI_ENABLED;
  if (raw === undefined || raw === null || raw === '') return true;
  return !['0', 'false', 'off', 'no'].includes(String(raw).trim().toLowerCase());
}

export interface CommandResult {
  lines: TerminalLine[];
  clear?: boolean;
  switchSession?: string;
  ui?: {
    openHelp?: boolean;
  };
  remote?: {
    mode: ConsoleMode;
    speaker: string;
    tone: 'purple' | 'cyan' | 'ok' | 'warn' | 'muted';
    command: string;
    userInput: string;
    intent: string;
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
  const parsed = parseTerminalCommand(opts.input);
  if (!parsed) return { lines: [] };

  const routed = routeTerminalIntent(opts.sessionId, parsed);
  if (routed.kind === 'help') return { lines: [], ui: { openHelp: true } };
  if (routed.kind === 'clear') return { lines: [], clear: true };
  if (routed.kind === 'error') return { lines: [out('', routed.message, 'muted')] };

  if (!liveAiEnabled()) {
    return {
      lines: [
        out(
          'BAO.OS',
          'Live LLM/RAG is intentionally offline on this public deployment. The routing, retrieval, redaction, and API implementation remain available in the public source; enable VITE_AI_ENABLED with the backend environment to run the interactive AI modes.',
          'warn',
        ),
      ],
    };
  }

  return {
    lines: [],
    remote: {
      mode: routed.plan.mode,
      speaker: routed.plan.speaker,
      tone: routed.plan.tone,
      command: routed.plan.command,
      userInput: routed.plan.userInput,
      intent: routed.plan.intent,
      message: routed.plan.message,
      persona: routed.plan.persona,
      activeView: routed.plan.activeView,
    },
  };
}
