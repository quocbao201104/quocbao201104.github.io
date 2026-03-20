import type { Experience } from '@/types'

export const experiences: Experience[] = [
  {
    id: '1',
    title: 'Backend Developer',
    company: 'Personal Project - TruyenVietHay',
    startDate: '2025-06',
    endDate: 'Present',
    description: [
      'Architected a scalable backend handling high-traffic chapter content and audio delivery using Node.js, Express, and MySQL',
      'Optimized content delivery performance by decoupling chapter metadata from CDN-served object storage, significantly reducing API load',
      'Secured user data and system endpoints by implementing robust JWT authentication, Google OAuth, and granular RBAC for distinct user roles',
      'Enhanced real-time user engagement through Socket.io and Redis for instant chat, notifications, and dynamic online state synchronization',
      'Automated system performance reporting and data cleanup using scheduled cron jobs, ensuring consistent high availability',
    ],
  },
  {
    id: '2',
    title: 'Information Technology Student',
    company: 'University',
    startDate: '2022-09',
    endDate: 'Present',
    description: [
      'Major in Information Technology',
      'Focused on web development, databases, and software engineering',
      'Self-studied backend development with Node.js and real-world projects',
      'Built multiple personal projects to practice backend development',
    ],
  },
]
