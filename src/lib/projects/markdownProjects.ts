export interface MarkdownProjectLink {
  label: string;
  href: string;
}

export interface MarkdownProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  links: MarkdownProjectLink[];
  eyebrow: string;
  icon: 'heart' | 'shield' | 'brain' | 'spark';
  markdown: string;
}

type FrontmatterValue = string | number | boolean | null | FrontmatterValue[] | { [k: string]: FrontmatterValue };

function parseFrontmatter(raw: string): { frontmatter: Record<string, FrontmatterValue>; body: string } {
  const trimmed = raw.replace(/^\uFEFF/, '');
  if (!trimmed.startsWith('---\n')) return { frontmatter: {}, body: raw };

  const endIdx = trimmed.indexOf('\n---', 4);
  if (endIdx === -1) return { frontmatter: {}, body: raw };

  const fmBlock = trimmed.slice(4, endIdx).trim();
  const body = trimmed.slice(endIdx + '\n---'.length).replace(/^\s*\n/, '');

  const frontmatter: Record<string, FrontmatterValue> = {};
  const lines = fmBlock.split('\n');
  let currentKey: string | null = null;
  for (const line of lines) {
    const listMatch = line.match(/^\s*-\s+(.*)\s*$/);
    if (listMatch && currentKey) {
      const arr = (frontmatter[currentKey] as FrontmatterValue[]) ?? [];
      if (Array.isArray(arr)) {
        arr.push(coerceScalar(listMatch[1]));
        frontmatter[currentKey] = arr;
      }
      continue;
    }

    const kv = line.match(/^([A-Za-z0-9_-]+)\s*:\s*(.*)\s*$/);
    if (!kv) continue;
    currentKey = kv[1];
    const rawVal = kv[2];
    frontmatter[currentKey] = rawVal === '' ? [] : coerceScalar(rawVal);
  }

  return { frontmatter, body };
}

function coerceScalar(v: string): FrontmatterValue {
  const s = v.trim();
  const unquoted = s.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
  if (unquoted === 'true') return true;
  if (unquoted === 'false') return false;
  if (unquoted === 'null') return null;
  if (/^-?\d+(\.\d+)?$/.test(unquoted)) return Number(unquoted);
  if (unquoted.startsWith('[') && unquoted.endsWith(']')) {
    const inner = unquoted.slice(1, -1).trim();
    if (!inner) return [];
    return inner
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
      .map((x) => coerceScalar(x));
  }
  return unquoted;
}

function firstH1Title(markdown: string): string | null {
  const lines = markdown.split('\n');
  for (const l of lines) {
    const m = l.match(/^#\s+(.+)\s*$/);
    if (m) return stripMd(m[1]);
  }
  return null;
}

function firstParagraph(markdown: string): string {
  const cleaned = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^\s*#{1,6}\s+.*$/gm, '')
    .replace(/^\s*>.*$/gm, '')
    .trim();

  const paras = cleaned
    .split(/\n\s*\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => p.replace(/\s+/g, ' '));

  return stripMd(paras[0] ?? '');
}

function stripMd(s: string): string {
  return s
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[`*_~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractLinks(markdown: string, fm: Record<string, FrontmatterValue>): MarkdownProjectLink[] {
  const fromFm = fm.links;
  const links: MarkdownProjectLink[] = [];

  if (Array.isArray(fromFm)) {
    for (const item of fromFm) {
      if (!item) continue;
      if (typeof item === 'string') {
        links.push({ label: 'Link', href: item });
      } else if (typeof item === 'object') {
        const o = item as { [k: string]: FrontmatterValue };
        const href = typeof o.href === 'string' ? o.href : typeof o.url === 'string' ? o.url : null;
        const label = typeof o.label === 'string' ? o.label : typeof o.name === 'string' ? o.name : 'Link';
        if (href) links.push({ label, href });
      }
    }
  }

  if (links.length > 0) return sanitizeLinks(links);

  // Fall back to a "Links" section list: "- Label: https://..." or "- [Label](https://...)"
  const lines = markdown.split('\n');
  let inLinks = false;
  for (const line of lines) {
    if (/^##\s+Links\b/i.test(line)) {
      inLinks = true;
      continue;
    }
    if (inLinks && /^##\s+/.test(line)) break;
    if (!inLinks) continue;

    const mdLink = line.match(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/);
    if (mdLink) {
      links.push({ label: stripMd(mdLink[1]), href: mdLink[2] });
      continue;
    }

    const plain = line.match(/^\s*-\s*(.+?)\s*:\s*(https?:\/\/\S+)\s*$/);
    if (plain) {
      links.push({ label: stripMd(plain[1]), href: plain[2] });
      continue;
    }

    const urlOnly = line.match(/(https?:\/\/\S+)/);
    if (urlOnly) links.push({ label: 'Link', href: urlOnly[1] });
  }

  return sanitizeLinks(links);
}

function sanitizeLinks(links: MarkdownProjectLink[]): MarkdownProjectLink[] {
  const seen = new Set<string>();
  return links
    .map((l) => ({ label: l.label.trim() || 'Link', href: l.href.trim() }))
    .filter((l) => /^https?:\/\//i.test(l.href))
    .filter((l) => !/localhost|127\.0\.0\.1|\bprivate\b/i.test(l.href))
    .filter((l) => !/^[A-Za-z]:\\/.test(l.href))
    .filter((l) => {
      const key = `${l.label}::${l.href}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function inferTags(markdown: string, fm: Record<string, FrontmatterValue>): string[] {
  const fmTags = fm.tags;
  if (Array.isArray(fmTags)) return fmTags.filter((t): t is string => typeof t === 'string').map(stripMd);
  if (typeof fmTags === 'string') {
    return fmTags
      .split(',')
      .map((t) => stripMd(t))
      .filter(Boolean);
  }

  const hay = markdown.toLowerCase();
  const candidates: Array<[string, RegExp]> = [
    ['TypeScript', /\btypescript\b/i],
    ['JavaScript', /\bjavascript\b/i],
    ['Next.js', /\bnext\.js\b|\bnextjs\b/i],
    ['React', /\breact\b/i],
    ['Vue', /\bvue\b/i],
    ['Node.js', /\bnode\.js\b|\bnodejs\b/i],
    ['Express', /\bexpress\b/i],
    ['Python', /\bpython\b/i],
    ['PostgreSQL', /\bpostgres\b|\bpostgresql\b/i],
    ['MySQL', /\bmysql\b/i],
    ['Redis', /\bredis\b/i],
    ['Docker', /\bdocker\b/i],
    ['Tailwind', /\btailwind\b/i],
    ['Prisma', /\bprisma\b/i],
    ['RAG', /\brag\b|\bgraphrag\b/i],
    ['LLMs', /\bllm\b|\bllms\b|\banthropic\b|\bopenai\b/i],
  ];

  const tags: string[] = [];
  for (const [label, re] of candidates) {
    if (re.test(hay)) tags.push(label);
  }
  return tags.slice(0, 8);
}

function inferEyebrow(tags: string[], markdown: string, fm: Record<string, FrontmatterValue>): string {
  const fmEyebrow = fm.eyebrow;
  if (typeof fmEyebrow === 'string' && fmEyebrow.trim()) return fmEyebrow.trim();

  const picked = tags.filter((t) => !['LLMs'].includes(t)).slice(0, 4);
  if (picked.length > 0) return picked.join(' · ');

  const title = typeof fm.type === 'string' ? fm.type : '';
  if (title) return String(title);

  const hay = markdown.toLowerCase();
  if (/\bai\b|\bagent\b|\brag\b/.test(hay)) return 'AI · Systems';
  return 'Build';
}

function inferIcon(markdown: string, fm: Record<string, FrontmatterValue>): MarkdownProject['icon'] {
  const fmIcon = fm.icon;
  if (fmIcon === 'heart' || fmIcon === 'shield' || fmIcon === 'brain' || fmIcon === 'spark') return fmIcon;

  const hay = markdown.toLowerCase();
  if (/\bsafety\b|\bsecurity\b/.test(hay)) return 'shield';
  if (/\bngo\b|\bnonprofit\b|\bfoundation\b/.test(hay)) return 'heart';
  if (/\bagent\b|\brag\b|\bllm\b|\bai\b/.test(hay)) return 'brain';
  return 'spark';
}

function inferOrderFromIndex(indexMarkdown: string): string[] | null {
  // Accept either a bullet list or a simple plain list of slugs.
  const slugs: string[] = [];
  const lines = indexMarkdown.split('\n');
  for (const line of lines) {
    const m = line.match(/^\s*-\s+([a-z0-9][a-z0-9-]*)\s*$/i);
    if (m) slugs.push(m[1]);
  }
  if (slugs.length > 0) return slugs.map((s) => s.toLowerCase());
  return null;
}

export function getMarkdownProjects(): MarkdownProject[] {
  const modules = import.meta.glob('../../../content/projects/*.md', {
    eager: true,
    query: '?raw',
    import: 'default',
  }) as Record<string, string>;

  const entries = Object.entries(modules);
  const indexEntry = entries.find(([p]) => p.endsWith('/project-index.md'));
  const order = indexEntry ? inferOrderFromIndex(indexEntry[1]) : null;

  const projects = entries
    .filter(([path]) => !path.endsWith('/project-index.md'))
    .map(([path, raw]) => {
      const slug = path.split('/').pop()!.replace(/\.md$/, '');
      const { frontmatter, body } = parseFrontmatter(raw);

      const title = (typeof frontmatter.title === 'string' && frontmatter.title.trim()) ? frontmatter.title.trim() : firstH1Title(body) ?? slug;
      const description = firstParagraph(body);
      const tags = inferTags(body, frontmatter);
      const links = extractLinks(body, frontmatter);
      const eyebrow = inferEyebrow(tags, body, frontmatter);
      const icon = inferIcon(body, frontmatter);

      return {
        id: slug,
        slug,
        title,
        description,
        tags,
        links,
        eyebrow,
        icon,
        markdown: body,
      } satisfies MarkdownProject;
    });

  if (order) {
    const rank = new Map(order.map((s, i) => [s, i]));
    return projects
      .slice()
      .sort((a, b) => (rank.get(a.slug) ?? 1e9) - (rank.get(b.slug) ?? 1e9));
  }

  return projects.slice().sort((a, b) => a.title.localeCompare(b.title));
}

