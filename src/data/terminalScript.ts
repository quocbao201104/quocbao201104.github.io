export interface TerminalCommandLine {
  kind: 'command';
  prompt: string;
  text: string;
}

export interface TerminalOutputLine {
  kind: 'output';
  speaker: string;
  speakerTone?: 'purple' | 'cyan' | 'ok' | 'warn' | 'muted';
  text: string;
}

export type TerminalLine = TerminalCommandLine | TerminalOutputLine;

export const PROMPT = 'bao@bao-os:~$';

export interface SessionMeta {
  id: string;
  label: string;
  prompt: string;
}

export const sessions: SessionMeta[] = [
  { id: 'session_01', label: 'session_01', prompt: PROMPT },
  { id: 'architecture.ai', label: 'architecture.ai', prompt: 'bao@arch:~$' },
  { id: 'memory.log', label: 'memory.log', prompt: 'bao@memory:~$' },
];

const sessionScripts: Record<string, TerminalLine[]> = {
  session_01: [
    {
      kind: 'output',
      speaker: 'BAO.OS',
      speakerTone: 'muted',
      text: 'Session: session_01 (general). Use: llm <msg> | rag <msg> | help',
    },
  ],
  'architecture.ai': [
    {
      kind: 'output',
      speaker: 'Architect Agent',
      speakerTone: 'cyan',
      text: 'Session: architecture.ai. Type normally (defaults to Architect RAG), or use: inspect architecture <system>',
    },
  ],
  'memory.log': [
    {
      kind: 'output',
      speaker: 'Memory Agent',
      speakerTone: 'ok',
      text: 'Session: memory.log. Type normally (defaults to RAG), or use: search memory <query>',
    },
  ],
};

export function getScript(sessionId: string): TerminalLine[] {
  return sessionScripts[sessionId] ?? sessionScripts.session_01!;
}

export interface QuickCommand {
  cmd: string;
  hint: string;
}

export const quickCommands: QuickCommand[] = [
  { cmd: 'ask recruiter <topic>', hint: 'Hiring perspective (agentic RAG)' },
  { cmd: 'inspect architecture <system>', hint: 'System design review (agentic RAG)' },
  { cmd: 'search memory <query>', hint: 'Search content/memory (agentic RAG)' },
  { cmd: 'llm <message>', hint: 'Direct LLM' },
  { cmd: 'rag <message>', hint: 'Direct RAG' },
  { cmd: 'help', hint: 'Show all commands' },
];
