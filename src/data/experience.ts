import type { Experience } from '@/types'

export const experiences: Experience[] = [
  {
    id: '1',
    role: 'Backend Developer',
    org: 'TruyenVietHay',
    period: 'Jun 2025 - Present',
    bullets: [
      'Built and maintained Node.js services for story delivery, audio workflows, and user activity features.',
      'Separated metadata APIs from CDN-served chapter and audio assets to reduce backend pressure on high-read flows.',
      'Implemented JWT, Google OAuth, and role-based authorization across admin and user-facing operations.',
      'Used Redis, Socket.io, and cron automation for notifications, online presence, and scheduled maintenance jobs.',
    ],
  },
  {
    id: '2',
    role: 'Information Technology Student',
    org: 'University',
    period: 'Sep 2022 - Present',
    bullets: [
      'Focused on software engineering, databases, and web architecture with a backend-leaning project portfolio.',
      'Used personal products and ingestion pipelines to practice API design, persistence, and automation workflows.',
      'Built production-style side projects to strengthen real-world thinking around reliability and maintainability.',
    ],
  },
]
