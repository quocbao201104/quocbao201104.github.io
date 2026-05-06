import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const API_BASE = process.env.API_BASE_URL?.replace(/\/$/, '');
const INGEST_TOKEN = process.env.INGEST_TOKEN;

if (!API_BASE) {
  console.error('Missing API_BASE_URL (e.g. https://your-vercel-app.vercel.app)');
  process.exit(1);
}
if (!INGEST_TOKEN) {
  console.error('Missing INGEST_TOKEN (must match Vercel env INGEST_TOKEN)');
  process.exit(1);
}

async function walk(dir) {
  const out = [];
  const entries = await readdir(dir);
  for (const e of entries) {
    const p = join(dir, e);
    const s = await stat(p);
    if (s.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

const root = process.cwd();
const contentDir = join(root, 'content');
const files = (await walk(contentDir)).filter((p) => p.endsWith('.md') || p.endsWith('.mdx'));

const payload = {
  files: await Promise.all(
    files.map(async (abs) => ({
      path: relative(root, abs).replace(/\\/g, '/'),
      content: await readFile(abs, 'utf8'),
    })),
  ),
};

const r = await fetch(`${API_BASE}/api/ingest`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${INGEST_TOKEN}`,
  },
  body: JSON.stringify(payload),
});

const text = await r.text();
if (!r.ok) {
  console.error('Ingest failed:', r.status, text);
  process.exit(1);
}
console.log('Ingest OK:', text);

