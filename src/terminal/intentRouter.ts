import type { ParsedCommand } from '@/terminal/commandParser';
import type { ConsoleMode } from '@/types/console';

export type TerminalPersona = 'bao' | 'recruiter' | 'architect' | 'memory';
export type TerminalTone = 'purple' | 'cyan' | 'ok' | 'warn' | 'muted';

export interface RemoteExecutionPlan {
  mode: ConsoleMode;
  command: string;
  userInput: string;
  speaker: string;
  tone: TerminalTone;
  persona: TerminalPersona;
  intent: string;
  message: string;
  activeView?: string;
}

export type RoutedIntent =
  | { kind: 'help' }
  | { kind: 'clear' }
  | { kind: 'error'; message: string }
  | { kind: 'remote'; plan: RemoteExecutionPlan };

export function routeTerminalIntent(sessionId: string, parsed: ParsedCommand): RoutedIntent {
  if (parsed.type === 'help') return { kind: 'help' };
  if (parsed.type === 'clear') return { kind: 'clear' };

  if (parsed.type === 'llm') {
    if (!parsed.userInput) return { kind: 'error', message: 'Usage: llm <message>' };
    return {
      kind: 'remote',
      plan: {
        mode: 'llm',
        command: parsed.command,
        userInput: parsed.userInput,
        speaker: 'BAO.OS',
        tone: 'muted',
        persona: 'bao',
        intent: 'direct_llm',
        message: parsed.userInput,
      },
    };
  }

  if (parsed.type === 'rag') {
    if (!parsed.userInput) return { kind: 'error', message: 'Usage: rag <message>' };
    return {
      kind: 'remote',
      plan: {
        mode: 'rag',
        command: parsed.command,
        userInput: parsed.userInput,
        speaker: 'BAO.OS',
        tone: 'muted',
        persona: 'bao',
        intent: 'retrieval_augmented_answer',
        message: parsed.userInput,
      },
    };
  }

  if (parsed.type === 'ask_recruiter') {
    const topic = parsed.userInput || 'Summarize Bao’s fit and strengths for backend/platform/AI infra roles.';
    return {
      kind: 'remote',
      plan: {
        mode: 'agentic_rag',
        command: parsed.command,
        userInput: parsed.userInput,
        speaker: 'Recruiter Agent',
        tone: 'purple',
        persona: 'recruiter',
        intent: 'recruiter_assessment',
        message: topic,
      },
    };
  }

  if (parsed.type === 'inspect_architecture') {
    const system = parsed.userInput || 'this system';
    return {
      kind: 'remote',
      plan: {
        mode: 'agentic_rag',
        command: parsed.command,
        userInput: parsed.userInput,
        speaker: 'Architect Agent',
        tone: 'cyan',
        persona: 'architect',
        intent: 'architecture_inspection',
        message: `Inspect architecture: ${system}. Provide boundaries, data flow, trade-offs, failure modes, and next steps.`,
      },
    };
  }

  if (parsed.type === 'search_memory') {
    const query = parsed.userInput || 'recent focus';
    return {
      kind: 'remote',
      plan: {
        mode: 'agentic_rag',
        command: parsed.command,
        userInput: parsed.userInput,
        speaker: 'Memory Agent',
        tone: 'ok',
        persona: 'memory',
        intent: 'memory_search',
        message: query,
      },
    };
  }

  const defaultBySession: Record<string, { mode: ConsoleMode; persona: TerminalPersona; speaker: string; tone: TerminalTone; intent: string }> = {
    'architecture.ai': {
      mode: 'rag',
      persona: 'architect',
      speaker: 'Architect Agent',
      tone: 'cyan',
      intent: 'architecture_session_query',
    },
    'memory.log': {
      mode: 'rag',
      persona: 'memory',
      speaker: 'Memory Agent',
      tone: 'ok',
      intent: 'memory_session_query',
    },
    session_01: {
      mode: 'llm',
      persona: 'bao',
      speaker: 'BAO.OS',
      tone: 'muted',
      intent: 'default_chat',
    },
  };

  const fallback = defaultBySession[sessionId] ?? defaultBySession.session_01;
  return {
    kind: 'remote',
    plan: {
      mode: fallback.mode,
      command: parsed.command,
      userInput: parsed.userInput,
      speaker: fallback.speaker,
      tone: fallback.tone,
      persona: fallback.persona,
      intent: fallback.intent,
      message: parsed.userInput,
    },
  };
}
