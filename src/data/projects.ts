import type { Project } from '@/types'

export const projects: Project[] = [
  {
    id: '1',
    name: 'TruyenVietHay backend platform',
    summary: 'Production-oriented backend for a story reading and audio platform, centered on scalable APIs, secure service design, and efficient content delivery.',
    impact: 'Separated metadata APIs from asset delivery so reading and audio traffic could scale through CDN-backed storage instead of hitting the app server directly.',
    techStack: [
      'Node.js',
      'Express',
      'MySQL',
      'Redis',
      'Socket.io',
      'JWT',
      'Google OAuth',
      'Cloudinary',
      'AWS S3 / Cloudflare R2',
      'Node-cron',
    ],
    architecture: [
      'Layered Node.js/Express architecture with MySQL persistence and service-oriented business logic',
      'Decoupled delivery model where metadata stays in the API while chapter and audio assets are served through CDN/object storage',
      'Redis-backed caching and shared state for latency-sensitive reads, notifications, and online presence',
      'Background job pipeline for rankings, statistics aggregation, cleanup, and reward lifecycle automation',
    ],
    highlights: [
      'Engineered REST APIs for stories, chapters, reading history, playlists, ratings, and follow features.',
      'Designed a secure authentication flow with JWT, Google OAuth, and strict RBAC for sensitive operations.',
      'Integrated Redis, Socket.io, and scheduled jobs to support notifications, rankings, and cleanup workflows.',
      'Optimized MySQL schema and query paths for frequent reading, history tracking, and interaction-heavy endpoints.',
    ],
    links: [
      { label: 'Live', url: 'https://truyenviethay.id.vn/' },
    ],
    sourceNote: 'Private repository',
  },
  {
    id: '2',
    name: 'YouTube audio ingestion pipeline',
    summary: 'Automated ingestion pipeline that scans playlists, processes audio with FFmpeg, uploads assets to Cloudflare R2, and syncs metadata to MySQL.',
    impact: 'Moved media-heavy work into a queue-driven pipeline so extraction and upload tasks could run safely without overwhelming application memory.',
    techStack: [
      'Node.js',
      'Docker',
      'MySQL',
      'Redis',
      'Cloudflare R2',
      'FFmpeg',
    ],
    architecture: [
      'Containerized ecosystem orchestrating Crawlers, Workers, Redis, and MySQL',
      'Decoupled worker architecture scaling processing-heavy media operations safely',
      'Automated pipeline: Scrape -> Queue -> Process -> Upload -> Sync Database',
    ],
    highlights: [
      'Scheduled playlist synchronization with cron-driven discovery and processing.',
      'Used Redis queues to coordinate extraction, chunking, upload, and database sync stages.',
      'Cleaned and normalized metadata before persisting assets and stream references.',
      'Handled storage delivery through Cloudflare R2 for CDN-friendly audio streaming.',
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/quocbao201104/truyenviethay-audio-ingest.git' },
    ],
  },
  {
    id: '3',
    name: 'Node.js content ingestion crawler',
    summary: 'Sequential crawler for ingesting and normalizing paginated content into a structured persistence layer.',
    impact: 'Built a predictable fetch-parse-store workflow that kept ingestion deterministic while reducing duplicate content and cleanup work.',
    techStack: [
      'Node.js',
      'Axios',
      'Cheerio',
      'MySQL (Aiven)',
      'Dotenv',
    ],
    architecture: [
      'Crawler layer for controlled HTTP fetching',
      'Parser layer for structured HTML normalization',
      'DAO / Model layer for database persistence',
    ],
    highlights: [
      'Controlled crawling with configurable pacing to avoid unstable fetch behavior.',
      'Slug-based duplicate detection before persistence.',
      'Robust normalization from HTML content into database-ready text fields.',
      'Split the crawler into focused layers for fetching, parsing, and persistence.',
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/quocbao201104/nodejs-content-crawler' },
    ],
  },
]
