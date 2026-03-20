export interface Project {
  id: string
  name: string
  description: string
  techStack: string[]
  features: string[]
  liveUrl?: string
  githubUrl?: string
  sourceNote?: string
  architecture?: string[]
}

export interface Skill {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category: 'frontend' | 'backend' | 'database' | 'tools'
}

export interface Experience {
  id: string
  title: string
  company: string
  startDate: string
  endDate: string | 'Present'
  description: string[]
}

export interface SocialLink {
  name: string
  url: string
  icon: string
  display?: string
}

export interface PersonalInfo {
  fullName: string
  title: string
  location: string
  dateOfBirth?: string
  yearsOfExperience: number
  summary: string
  languages: string[]
}
