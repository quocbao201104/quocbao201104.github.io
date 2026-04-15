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

export interface Skill {
  name: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  category: 'frontend' | 'backend' | 'database' | 'tools'
}

export interface Experience {
  id: string
  role: string
  org: string
  period: string
  bullets: string[]
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
  intro: string
  dateOfBirth?: string
  yearsOfExperience: number
  summary: string
  languages: string[]
}

export interface OverviewCard {
  id: string
  label: string
  title: string
  body: string
  metric?: string
  items?: string[]
  size?: 'default' | 'wide'
}

export interface SystemDesignArea {
  id: string
  label: string
  title: string
  description: string
  details: string[]
}
