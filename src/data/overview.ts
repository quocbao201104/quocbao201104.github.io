import type { OverviewCard, SystemDesignArea } from '@/types'

export const overviewCards: OverviewCard[] = [
  {
    id: 'about',
    label: 'About',
    title: 'Backend-first engineer',
    body: 'I work on APIs, automation, and service boundaries with a focus on dependable delivery instead of visual polish.',
    metric: '2+ years',
    size: 'wide',
  },
  {
    id: 'stack',
    label: 'Tech stack',
    title: 'Node.js, MySQL, Redis',
    body: 'Comfortable building REST services, auth flows, queue-style workers, and storage-backed delivery paths.',
    items: ['Node.js', 'Express', 'MySQL', 'Redis', 'Cloudflare R2'],
  },
  {
    id: 'impact',
    label: 'Key achievement',
    title: 'Reduced backend load with decoupled delivery',
    body: 'Moved chapter and audio assets behind CDN/object storage while keeping metadata and permissions inside the API.',
  },
  {
    id: 'systems',
    label: 'System skills',
    title: 'Caching, auth, scaling',
    body: 'Builds backend flows around secure access control, cache-aware reads, and scheduled automation.',
    items: ['JWT + OAuth', 'RBAC', 'Redis caching', 'Cron jobs'],
  },
]

export const systemDesignAreas: SystemDesignArea[] = [
  {
    id: 'api',
    label: 'API structure',
    title: 'Clear boundaries between delivery and business logic',
    description: 'I prefer separating public content delivery, auth-sensitive operations, and background workflows into focused service modules.',
    details: ['REST endpoints by domain', 'service-oriented business logic', 'admin and user permissions kept separate'],
  },
  {
    id: 'data',
    label: 'Data model',
    title: 'Schemas shaped around high-frequency reads',
    description: 'Database and cache decisions are driven by common read paths such as chapters, reading history, playlists, and notification state.',
    details: ['normalized relational storage', 'history and engagement flows', 'careful query design for repeat access'],
  },
  {
    id: 'cache',
    label: 'Caching strategy',
    title: 'Redis for latency-sensitive coordination',
    description: 'Use caching and shared state where it helps reads, presence, notifications, and worker coordination stay responsive.',
    details: ['read acceleration', 'online presence', 'queue and worker state'],
  },
  {
    id: 'ops',
    label: 'Background jobs',
    title: 'Automation for cleanup, sync, and reporting',
    description: 'Scheduled jobs handle repetitive system work so the main API can stay focused on request-response responsibilities.',
    details: ['cron-driven maintenance', 'content sync tasks', 'rankings and reporting jobs'],
  },
]
