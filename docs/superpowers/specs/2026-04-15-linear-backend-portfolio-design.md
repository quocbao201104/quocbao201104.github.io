# Linear-inspired backend portfolio redesign

## Summary

Refactor the existing Vue 3 + Tailwind portfolio from a sidebar-heavy CV layout into a full-width, content-first portfolio inspired by Linear's product UI language. The new design should feel calm, technical, and hiring-focused for a backend engineer rather than visual or creative.

The page should emphasize:

- a concise hero
- a compact bento overview
- a strong, scan-friendly projects section
- a clean experience section
- an optional system design snapshot

## Goals

- Remove the current left sidebar layout completely.
- Use a full-width, single-column page structure.
- Present the profile as a backend engineer portfolio, not a decorative CV.
- Keep copy brief and metric-oriented where possible.
- Use Tailwind CSS and the existing Vue stack.
- Preserve current functionality such as outbound links and downloadable CV access where it still fits the new layout.

## Non-goals

- Do not migrate frameworks or styling systems.
- Do not add heavy animation libraries or complex motion.
- Do not turn the page into a dashboard with dense, noisy data widgets.
- Do not optimize for print-first layout; screen presentation is the priority.

## Current-state audit

The current home page has several traits that conflict with the target direction:

- fixed left sidebar dominates the page structure
- neon glow, gradient-heavy accents, and terminal-styled project cards create a flashy tone
- paragraphs are long for a portfolio that should be scan-friendly
- project information is split across decorative UI patterns instead of a stronger vertical reading flow
- the styling language is inconsistent between profile, experience, skills, and project sections

These should be replaced with a restrained, low-contrast visual system and more deliberate information hierarchy.

## Recommended approach

Adopt a data-first redesign.

This approach updates both the presentation layer and the content model:

- reshape data to match portfolio-style sections
- simplify the page into clear, reusable sections
- remove layout and styling patterns that belong to the old CV treatment

This creates a cleaner long-term structure than a surface-only reskin and makes future content edits easier.

## Information architecture

The page will use a top-to-bottom structure:

1. Hero
2. Overview bento
3. Projects
4. Experience
5. System design
6. Footer

The entire page should live in a centered max-width container with full-width breathing room, not a split layout with independent scrolling regions.

## Section design

### Hero

Purpose: establish identity fast and provide two clear actions.

Content:

- avatar
- full name
- role: Backend Developer
- one-sentence intro
- primary CTA: GitHub
- secondary CTA: Contact

Behavior:

- compact, calm, and immediately readable
- left-aligned on desktop, stacked naturally on mobile
- no sidebar behavior or oversized decorative framing

### Overview bento

Purpose: provide a quick technical snapshot before the user scrolls into details.

Initial cards:

- About me
- Tech stack
- Key achievement
- System skills

Rules:

- each card stays short and scannable
- cards use subtle contrast, rounded corners, soft borders, and a very light hover response
- card heights may vary slightly to avoid a rigid template feel, but spacing remains consistent

### Projects

Purpose: become the strongest section on the page.

Each project card should include:

- title
- short summary
- impact statement
- tech stack
- highlights
- architecture note
- outbound links or source note where applicable

Presentation rules:

- use a clean vertical stack, not a bento grid
- make the impact line visually easier to notice than the supporting description
- keep the stack tags compact
- avoid decorative terminal chrome, glow borders, or loud gradients

### Experience

Purpose: show progression and execution history without long prose blocks.

Presentation:

- stacked cards or a simple timeline
- each role uses short bullet points
- bullets prioritize technical contributions, systems work, and measurable outcomes

### System design

Purpose: show backend thinking without adding a full architecture diagram.

Potential content blocks:

- API structure
- database design
- caching strategy
- background jobs and queues
- auth and access control

This section should read like an engineering snapshot rather than a separate case study.

## Visual system

### Color and surfaces

- Use a dark charcoal base instead of neon-tinted black.
- Keep the background grid or pattern extremely subtle.
- Use low-contrast panels and borders inspired by product UI, not showcase landing pages.
- Replace strong purple-pink glow treatments with restrained neutral surfaces and one subdued accent family.

### Typography

- Use Inter as the primary interface font.
- Use strong but clean display hierarchy for section headings.
- Use a mono font only for technical metadata, labels, and stack-style accents.
- Keep paragraphs short and line lengths controlled.

### Spacing

Use a consistent spacing rhythm based on:

- 8px
- 16px
- 24px
- 32px
- 48px

This spacing system should be applied consistently across sections, cards, tags, and CTA groups.

### Motion

- use subtle fade and small translate transitions
- keep hover motion shallow
- no flashy effects, pulses, or large transforms

## Component strategy

The redesign should stay focused and reviewable.

Likely implementation shape:

- keep `App.vue` and router behavior mostly unchanged
- rebuild `Home.vue` around the new section sequence
- stop relying on `SideProfile.vue` inside the main page
- optionally introduce smaller presentational section components if `Home.vue` becomes too large
- update global styles in `style.css` to establish the new visual language

## Data model changes

### Projects

Current project data is CV-like and should be reshaped to better match the new cards.

Target shape:

- `name`
- `summary`
- `impact`
- `techStack`
- `highlights`
- `architecture`
- `liveUrl`
- `githubUrl`
- `sourceNote`

### Experience

Target shape:

- `role`
- `org`
- `period`
- `bullets`

### New supporting data

Add data structures for:

- overview cards
- system design highlights
- possibly hero CTA metadata if that simplifies rendering

This keeps the view declarative and avoids hardcoded copy blocks spread across template markup.

## Responsive behavior

- mobile: stack all sections in one column with generous padding
- tablet: allow the bento section to expand into two columns
- desktop: keep a wider layout with clean max-width constraints and stronger section rhythm

Projects and experience must remain easy to scan on narrow screens. Content should collapse naturally without introducing horizontal overflow.

## Accessibility

- keep semantic section structure
- preserve visible focus states on links and buttons
- ensure contrast stays readable despite low-contrast styling goals
- provide meaningful `alt` text for the avatar image
- avoid hover-only meaning

## Error handling and content resilience

- sections should tolerate missing optional fields such as `githubUrl`, `liveUrl`, or `sourceNote`
- overview and system design cards should render gracefully even if the user shortens or replaces content later
- the layout should not depend on every project having identical text length

## Testing and verification

Because this is a UI refactor with data-shape changes, verification should include:

- type safety via the existing build pipeline
- successful production build with `npm run build`
- lint pass with `npm run lint` if the updated files trigger style or type-driven issues
- manual check that the new layout has no remaining sidebar behavior and no broken links

## Risks

- over-condensing content could make the portfolio feel too sparse if not balanced with strong section hierarchy
- keeping old styling utilities alongside new ones could leave visual inconsistencies
- changing data shapes without updating types carefully could create template/runtime mismatches

## Implementation direction

Proceed with a focused refactor of the existing portfolio:

- update data models first
- rebuild the home page structure around the approved layout
- replace the old visual system in global styles
- verify with build and lint before marking the work complete
