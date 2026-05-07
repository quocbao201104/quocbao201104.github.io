export type SkillItem = {
  name: string;
  level: number; // 0..100
};

export type SkillCategory = {
  title: string;
  items: SkillItem[];
};

export const skillsMeta = {
  status: 'shipping',
  passions: ['backend craft', 'RAG systems', 'automation', 'calm UI'],
  location: 'Vietnam',
} as const;

export const skillCategories: SkillCategory[] = [
  {
    title: 'Languages',
    items: [
      { name: 'TypeScript', level: 90 },
      { name: 'Python', level: 86 },
      { name: 'SQL', level: 82 },
      { name: 'Bash', level: 70 },
    ],
  },
  {
    title: 'Backend & APIs',
    items: [
      { name: 'Node.js (Express)', level: 88 },
      { name: 'Next.js (App + API routes)', level: 84 },
      { name: 'FastAPI', level: 76 },
      { name: 'Auth patterns (JWT / sessions / RBAC)', level: 82 },
    ],
  },
  {
    title: 'Generative AI & LLM Engineering',
    items: [
      { name: 'RAG / agent memory', level: 86 },
      { name: 'LangChain', level: 78 },
      { name: 'Provider routing + evals', level: 72 },
      { name: 'Prompt/tool design', level: 80 },
    ],
  },
  {
    title: 'Data / Infra',
    items: [
      { name: 'PostgreSQL', level: 84 },
      { name: 'Supabase (Auth/DB/Storage)', level: 76 },
      { name: 'Docker', level: 74 },
      { name: 'Vercel deployments', level: 70 },
    ],
  },
];

