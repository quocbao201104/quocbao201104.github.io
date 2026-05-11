export type ConsoleMode = 'llm' | 'rag' | 'agentic_rag';

export type AgentTraceStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface AgentTraceStep {
  label: string;
  status: AgentTraceStatus;
  detail?: string;
}

export interface SourceChunk {
  id: string;
  title?: string;
  path?: string;
  content: string;
  similarity?: number;
  tags?: string[];
  containsPii?: boolean;
  redactedContent?: string;
  healthWarnings?: string[];
}

export interface ConsoleResponse {
  mode: ConsoleMode;
  command: string;
  userInput: string;
  answer: string;
  sources?: SourceChunk[];
  trace?: AgentTraceStep[];
  metadata?: {
    intent?: string;
    topK?: number;
    model?: string;
    usedTools?: string[];
    confidence?: number;
  };
}
