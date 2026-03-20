import type { Experience } from '@/types'

export const experiences: Experience[] = [
  {
    id: '1',
    title: 'Backend Developer',
    company: 'Personal Project - TruyenVietHay',
    startDate: '2024-06',
    endDate: 'Present',
    description: [
      'Architected and developed the backend for an online story reading and audio platform using Node.js, Express, and MySQL',
      'Designed RESTful APIs for stories, chapters, reading history, audio playlists, comments, ratings, and user progression',
      'Implemented JWT authentication, Google OAuth, and role-based access control for Admin, Author, and User roles',
      'Built a CDN-oriented content delivery flow by separating chapter metadata in API from chapter and audio assets in object storage',
      'Integrated Redis, Socket.io, and scheduled jobs for caching, notifications, online presence, rankings, and background maintenance',
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
