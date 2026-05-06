export type ProjectTagTone = 'purple' | 'cyan' | 'ok' | 'warn' | 'muted';

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  tags: string[];
  links: ProjectLink[];
  icon: 'heart' | 'shield' | 'brain' | 'spark';
}

export const projects: Project[] = [
  {
    id: 'orgmind',
    eyebrow: 'AI · GraphRAG · Full Stack',
    title: 'OrgMind — Agentic Knowledge Workspace',
    description:
      'A calm AI operating system for memory, retrieval, and long-horizon workflows. Graph-backed recall, agent orchestration, and evaluation loops.',
    tags: ['TypeScript', 'PostgreSQL', 'Docker', 'RAG'],
    links: [
      { label: 'GitHub', href: 'https://github.com/' },
      { label: 'Live', href: '#' },
    ],
    icon: 'brain',
  },
  {
    id: 'safety',
    eyebrow: 'Mobile · AI · Safety Tech',
    title: "Safe Yatra — Women's Safety App",
    description:
      'Route tracking with voice-triggered alerts and lightweight on-device inference. Built for reliability under poor connectivity.',
    tags: ['Python', 'NLP', 'React Native', 'Voice'],
    links: [{ label: 'GitHub', href: 'https://github.com/' }],
    icon: 'shield',
  },
  {
    id: 'foundation',
    eyebrow: 'Full Stack · NGO · Social Impact',
    title: 'Little Angel Foundation',
    description:
      'A full redesign + rebuild for a nonprofit website: fast CMS workflows, clean content IA, and long-term maintainability.',
    tags: ['React', 'Tailwind', 'CDN', 'SEO'],
    links: [
      { label: 'Live', href: '#' },
      { label: 'Case study', href: '#' },
    ],
    icon: 'heart',
  },
  {
    id: 'agents',
    eyebrow: 'Full Stack · NLP · GenAI',
    title: 'Agent Pipeline Toolkit',
    description:
      'Composable agent pipeline primitives: tools, memory adapters, guardrails, and latency-aware orchestration patterns.',
    tags: ['TypeScript', 'Zustand', 'Eval', 'Agents'],
    links: [{ label: 'GitHub', href: 'https://github.com/' }],
    icon: 'spark',
  },
];

