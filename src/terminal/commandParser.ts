import type { ConsoleMode } from '@/types/console';

export type ParsedCommandType =
  | 'help'
  | 'clear'
  | 'llm'
  | 'rag'
  | 'ask_recruiter'
  | 'inspect_architecture'
  | 'search_memory'
  | 'plain_text';

export interface ParsedCommand {
  raw: string;
  normalized: string;
  type: ParsedCommandType;
  command: string;
  userInput: string;
  mode?: ConsoleMode;
}

function normalize(input: string) {
  return input.trim().replace(/\s+/g, ' ');
}

export function parseTerminalCommand(input: string): ParsedCommand | null {
  const raw = normalize(input);
  if (!raw) return null;

  const lower = raw.toLowerCase();
  if (lower === 'help' || lower === '?') {
    return { raw, normalized: lower, type: 'help', command: 'help', userInput: '' };
  }
  if (lower === 'clear' || lower === 'cls') {
    return { raw, normalized: lower, type: 'clear', command: 'clear', userInput: '' };
  }

  if (lower.startsWith('llm ')) {
    const userInput = raw.slice(4).trim();
    return { raw, normalized: lower, type: 'llm', command: 'llm', userInput, mode: 'llm' };
  }

  if (lower.startsWith('rag ')) {
    const userInput = raw.slice(4).trim();
    return { raw, normalized: lower, type: 'rag', command: 'rag', userInput, mode: 'rag' };
  }

  if (lower.startsWith('ask recruiter')) {
    const userInput = raw.replace(/ask recruiter/i, '').trim();
    return {
      raw,
      normalized: lower,
      type: 'ask_recruiter',
      command: 'ask recruiter',
      userInput,
      mode: 'agentic_rag',
    };
  }

  if (lower.startsWith('inspect architecture')) {
    const userInput = raw.replace(/inspect architecture/i, '').trim();
    return {
      raw,
      normalized: lower,
      type: 'inspect_architecture',
      command: 'inspect architecture',
      userInput,
      mode: 'agentic_rag',
    };
  }

  if (lower.startsWith('run memory agent') || lower.startsWith('search memory')) {
    const userInput = raw.replace(/run memory agent|search memory/i, '').trim();
    return {
      raw,
      normalized: lower,
      type: 'search_memory',
      command: lower.startsWith('run memory agent') ? 'run memory agent' : 'search memory',
      userInput,
      mode: 'agentic_rag',
    };
  }

  return {
    raw,
    normalized: lower,
    type: 'plain_text',
    command: 'message',
    userInput: raw,
  };
}
