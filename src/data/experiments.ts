export interface Experiment {
  name: string;
  version: string;
}

export const experiments: Experiment[] = [
  { name: 'Multi-Agent Orchestrator', version: 'v0.3.2' },
  { name: 'Local LLM Evaluation', version: 'v0.2.1' },
  { name: 'Memory Compression', version: 'v0.1.8' },
];
