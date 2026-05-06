import type { LucideIcon } from 'lucide-react';
import { Briefcase, Cpu, FlaskConical, Brain, Code2 } from 'lucide-react';

export type AgentTone = 'purple' | 'cyan' | 'ok' | 'warn';

export interface Agent {
  id: string;
  name: string;
  subtitle: string;
  icon: LucideIcon;
  tone: AgentTone;
  status: 'online' | 'idle' | 'thinking';
}

export const agents: Agent[] = [
  {
    id: 'recruiter',
    name: 'Recruiter Agent',
    subtitle: 'Career & Hiring Expert',
    icon: Briefcase,
    tone: 'purple',
    status: 'online',
  },
  {
    id: 'architect',
    name: 'Architect Agent',
    subtitle: 'System Design Expert',
    icon: Cpu,
    tone: 'cyan',
    status: 'online',
  },
  {
    id: 'research',
    name: 'Research Agent',
    subtitle: 'AI Research Specialist',
    icon: FlaskConical,
    tone: 'purple',
    status: 'thinking',
  },
  {
    id: 'memory',
    name: 'Memory Agent',
    subtitle: 'Knowledge & Recall',
    icon: Brain,
    tone: 'ok',
    status: 'online',
  },
  {
    id: 'coding',
    name: 'Coding Agent',
    subtitle: 'Pair Programmer',
    icon: Code2,
    tone: 'warn',
    status: 'idle',
  },
];
