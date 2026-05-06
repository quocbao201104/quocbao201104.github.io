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
    { kind: 'command', prompt: PROMPT, text: 'ask recruiter' },
    {
      kind: 'output',
      speaker: 'Recruiter Agent',
      speakerTone: 'purple',
      text:
        "Hi! I can help you learn more about Bao's background, skills, and experience. What would you like to know?",
    },
    { kind: 'command', prompt: PROMPT, text: 'inspect architecture orgmind' },
    {
      kind: 'output',
      speaker: 'Architect Agent',
      speakerTone: 'cyan',
      text:
        'Analyzing OrgMind architecture... Generating system diagram and explanation.',
    },
    { kind: 'command', prompt: PROMPT, text: 'run memory agent' },
    {
      kind: 'output',
      speaker: 'Memory Agent',
      speakerTone: 'ok',
      text: 'Searching through 1043 memories... Found 23 relevant memories.',
    },
  ],
  'architecture.ai': [
    { kind: 'command', prompt: 'bao@arch:~$', text: 'explain graphrag pipeline' },
    {
      kind: 'output',
      speaker: 'Architect Agent',
      speakerTone: 'cyan',
      text:
        'GraphRAG: chunk → embed → entity-extract → graph-build → traverse → retrieve → re-rank.',
    },
    { kind: 'command', prompt: 'bao@arch:~$', text: 'render diagram orgmind' },
    {
      kind: 'output',
      speaker: 'Architect Agent',
      speakerTone: 'cyan',
      text:
        'Rendering ASCII diagram of OrgMind ingest, retrieval and reasoning layers...',
    },
  ],
  'memory.log': [
    { kind: 'command', prompt: 'bao@memory:~$', text: 'tail -f recall.stream' },
    {
      kind: 'output',
      speaker: 'Memory Agent',
      speakerTone: 'ok',
      text: 'Streaming recall events. 3.2k embeddings indexed. Drift below threshold.',
    },
    { kind: 'command', prompt: 'bao@memory:~$', text: 'compact --policy lru' },
    {
      kind: 'output',
      speaker: 'Memory Agent',
      speakerTone: 'ok',
      text: 'Compaction complete. 412 stale items archived. Retention: 30d.',
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
  { cmd: 'ask recruiter', hint: 'Get hiring perspective' },
  { cmd: 'inspect architecture', hint: 'Analyze system design' },
  { cmd: 'run research agent', hint: 'Latest AI research' },
  { cmd: 'search memory', hint: 'Search your knowledge' },
  { cmd: 'open neural lab', hint: 'View experiments' },
  { cmd: 'help', hint: 'Show all commands' },
];
