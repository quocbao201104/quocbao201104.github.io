# Linear-inspired backend portfolio implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the portfolio into a full-width, Linear-inspired backend engineer profile with a stronger projects section and cleaner data model.

**Architecture:** Keep the existing Vue 3 + Tailwind app shell, but replace the sidebar CV layout with a single-column section flow in `Home.vue`. Normalize the content model so overview cards, projects, experience, and system design are driven by concise backend-focused data rather than decorative template structure.

**Tech Stack:** Vue 3, TypeScript, Vue Router, Tailwind CSS 3, Vite

---

## File map

- Modify: `src/types/index.ts`
- Modify: `src/data/personal.ts`
- Modify: `src/data/projects.ts`
- Modify: `src/data/experience.ts`
- Modify: `src/data/contact.ts`
- Create: `src/data/overview.ts`
- Modify: `src/views/Home.vue`
- Modify: `src/style.css`
- Potentially deprecate from main page flow: `src/components/SideProfile.vue`, `src/components/SkillsGrid.vue`

## Notes before implementation

- The project does not currently include a dedicated unit test runner such as Vitest.
- Verification will therefore rely on `npm run build` and `npm run lint` plus TypeScript/template correctness.
- Keep file encoding as UTF-8. Match the existing markdown/doc files with LF and preserve source file text safely when editing.

### Task 1: Normalize the portfolio data model

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/data/personal.ts`
- Modify: `src/data/projects.ts`
- Modify: `src/data/experience.ts`
- Modify: `src/data/contact.ts`
- Create: `src/data/overview.ts`

- [ ] **Step 1: Update the shared types for the new page shape**

Define leaner interfaces for backend-focused content:

```ts
export interface ProjectLink {
  label: string
  url: string
}

export interface Project {
  id: string
  name: string
  summary: string
  impact: string
  techStack: string[]
  highlights: string[]
  architecture: string[]
  links?: ProjectLink[]
  sourceNote?: string
}
```

- [ ] **Step 2: Update personal data to support the hero**

Add short-form content used directly in the hero:

```ts
export const personalInfo = {
  fullName: 'Vo Dinh Quoc Bao',
  title: 'Backend Developer',
  intro: 'I build backend systems focused on API reliability, caching, and scalable content delivery.',
  location: 'Vietnam',
}
```

- [ ] **Step 3: Create overview-card data**

Add `src/data/overview.ts` with a concise array for the bento section:

```ts
export const overviewCards = [
  { id: 'about', label: 'About', title: 'Backend-first engineer', body: 'Builds APIs, background jobs, and data workflows with a focus on reliability.' },
]
```

- [ ] **Step 4: Reshape projects into summary + impact + highlights**

Convert long CV-style fields into cleaner card-ready fields:

```ts
{
  id: '1',
  name: 'TruyenVietHay backend platform',
  summary: 'Production-oriented API platform for reading, audio, and user activity flows.',
  impact: 'Designed content and engagement services for high-volume reading traffic with Redis-backed coordination.',
  techStack: ['Node.js', 'Express', 'MySQL', 'Redis'],
  highlights: ['JWT + OAuth auth flow', 'real-time notifications', 'cron-driven automation'],
  architecture: ['API metadata separated from CDN asset delivery'],
}
```

- [ ] **Step 5: Simplify experience entries**

Move from title/company/start-end/description to role/org/period/bullets so the UI stays compact.

- [ ] **Step 6: Verify imports compile conceptually before moving on**

Run: `npm run build`
Expected: build may still fail on old `Home.vue`, but type changes should be coherent and guide the next task.

### Task 2: Rebuild the home page into the new section flow

**Files:**
- Modify: `src/views/Home.vue`
- Read: `src/data/personal.ts`
- Read: `src/data/overview.ts`
- Read: `src/data/projects.ts`
- Read: `src/data/experience.ts`
- Read: `src/data/contact.ts`

- [ ] **Step 1: Remove sidebar-era dependencies from the page**

Delete `SideProfile` and `SkillsGrid` usage from `Home.vue` and replace the page shell with a centered single-column layout.

- [ ] **Step 2: Implement the hero section**

Render:

- avatar
- name
- backend role
- short intro
- GitHub button
- Contact button

Structure target:

```vue
<section class="hero-shell">
  <img src="/IMG_6939.jpg" alt="Portrait of Vo Dinh Quoc Bao" />
  <div>
    <p>Backend Developer</p>
    <h1>Vo Dinh Quoc Bao</h1>
    <p>{{ personalInfo.intro }}</p>
  </div>
</section>
```

- [ ] **Step 3: Implement the overview bento**

Render overview cards from data with variable spans on desktop, but a simple stack on mobile.

- [ ] **Step 4: Implement the projects section as the primary narrative**

Each project card should include:

- project name
- summary
- impact line
- tech stack tags
- short highlights list
- short architecture list
- link row / source note

- [ ] **Step 5: Implement experience as stacked timeline cards**

Use compact bullets and lightweight date formatting logic.

- [ ] **Step 6: Implement the system design section**

Render concise backend design pillars such as API boundaries, data model choices, caching, and background jobs.

- [ ] **Step 7: Add a restrained footer**

Keep it simple and aligned with the new visual tone.

### Task 3: Replace the old global visual system

**Files:**
- Modify: `src/style.css`

- [ ] **Step 1: Redefine the design tokens**

Replace neon-oriented variables with subdued dark UI tokens:

```css
:root {
  --app-bg: #0a0d10;
  --surface-1: rgba(15, 23, 31, 0.72);
  --surface-2: rgba(18, 28, 38, 0.9);
  --border-soft: rgba(148, 163, 184, 0.16);
  --text-main: #d7dee7;
  --text-muted: #93a1b2;
  --accent: #8fb7ff;
}
```

- [ ] **Step 2: Replace old helper classes**

Introduce shared classes for:

- section shells
- subdued cards
- mono labels
- pill tags
- primary and secondary buttons

- [ ] **Step 3: Tone down the background treatment**

Keep the grid texture but reduce opacity and remove the strong purple spotlight.

- [ ] **Step 4: Remove obsolete neon utilities**

Delete or stop using:

- `gradient-text`
- `gradient-button`
- `gradient-outline-button`
- `neon-project-card`
- other glow-heavy helpers no longer referenced by the new page

### Task 4: Clean up page-adjacent dependencies

**Files:**
- Review: `src/components/SideProfile.vue`
- Review: `src/components/SkillsGrid.vue`
- Modify if needed: `src/views/Home.vue`

- [ ] **Step 1: Confirm the new page no longer imports the sidebar components**

The new layout should be self-contained or use only intentionally chosen smaller sections.

- [ ] **Step 2: Leave unused components untouched unless removal is safe and helpful**

Prefer minimizing risk. If they are not imported anymore, they can remain in the repo for now.

### Task 5: Verify and polish

**Files:**
- Verify all modified files

- [ ] **Step 1: Run the production build**

Run: `npm run build`
Expected: success with no TypeScript or Vue template errors.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: no remaining lint errors in touched files.

- [ ] **Step 3: Review the final diff for leftover old-theme artifacts**

Check that the page no longer depends on:

- fixed left sidebar layout
- bright neon glow styles
- terminal-window project headers
- long paragraph-heavy CV presentation

- [ ] **Step 4: Commit the implementation changes**

```bash
git add src/types/index.ts src/data/personal.ts src/data/projects.ts src/data/experience.ts src/data/contact.ts src/data/overview.ts src/views/Home.vue src/style.css
git commit -m "refactor: redesign portfolio with linear-inspired backend layout"
```

## Inline execution decision

The user requested immediate implementation after approving the spec, so execute this plan inline in the current session rather than pausing for a separate handoff.
