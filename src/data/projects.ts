import type { Project } from '@/types'

export const projects: Project[] = [
  {
    id: '1',
    name: 'TruyenVietHay - Backend for Story Reading & Audio Platform',
    description: 'A scalable backend for an online story reading and audio platform, focused on content delivery, caching, authentication, and real-time engagement.',
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
      'RESTful backend architecture with Express, service layers, and MySQL persistence',
      'Chapter metadata served by API while chapter JSON content is delivered through CDN object storage',
      'Audio metadata served by API with direct MP3 playback from CDN for better scale and faster load times',
      'Redis-backed caching, online state, and scheduled jobs for rankings, stats, and cleanup',
    ],
    features: [
      'Designed APIs for story reading, chapter metadata, reading history, audio playlists, and progress synchronization',
      'Built CDN-based chapter and audio delivery flow to reduce backend load and improve scalability for high-traffic content access',
      'Implemented authentication and authorization with JWT, Google OAuth, and role-based access for admin, author, and user',
      'Developed interaction and gamification modules for comments, ratings, follows, badges, inventory, mailbox, and shop logic',
      'Integrated Socket.io and Redis for real-time notifications, chat, online presence, and shared application state',
      'Automated operational workloads with cron jobs for rankings, statistics aggregation, cleanup, and reward lifecycle handling',
    ],
    liveUrl: 'https://truyen-viet-hay.vercel.app/',
    githubUrl: 'https://github.com/quocbao201104/TruyenVietHay.git',
  },
  {
    id: '2',
    name: 'Generic Content Ingestion Crawler (Node.js)',
    description: 'A sequential crawler for ingesting and normalizing paginated content.',
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
    features: [
      'Sequential crawling with configurable delay',
      'Duplicate detection via slug-based checks',
      'Robust HTML-to-text normalization',
      'Modular and extensible architecture',
    ],
    githubUrl: 'https://github.com/quocbao201104/nodejs-content-crawler',
  },
]
