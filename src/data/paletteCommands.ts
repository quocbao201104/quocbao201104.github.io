import type { LucideIcon } from 'lucide-react';
import {
  Home,
  FolderGit2,
  Bot,
  FlaskConical,
  Brain,
  Terminal,
  Github,
  Linkedin,
  Mail,
  FileText,
  Sparkles,
} from 'lucide-react';
import { profile } from './profile';

export type CommandKind = 'navigate' | 'action' | 'link';

export interface PaletteCommand {
  id: string;
  group: 'Navigate' | 'Actions' | 'Links';
  label: string;
  hint?: string;
  icon: LucideIcon;
  shortcut?: string[];
  kind: CommandKind;
  target?: string;
  href?: string;
  toggle?: 'terminal';
  keywords?: string;
}

export const paletteCommands: PaletteCommand[] = [
  // Navigate
  { id: 'nav-home', group: 'Navigate', label: 'Home', icon: Home, kind: 'navigate', target: 'home', shortcut: ['G', 'H'] },
  { id: 'nav-projects', group: 'Navigate', label: 'Projects', icon: FolderGit2, kind: 'navigate', target: 'projects', shortcut: ['G', 'P'] },
  { id: 'nav-agents', group: 'Navigate', label: 'Agents', icon: Bot, kind: 'navigate', target: 'agents', shortcut: ['G', 'A'] },
  { id: 'nav-lab', group: 'Navigate', label: 'Lab', icon: FlaskConical, kind: 'navigate', target: 'lab', shortcut: ['G', 'L'] },
  { id: 'nav-memory', group: 'Navigate', label: 'Memory', icon: Brain, kind: 'navigate', target: 'memory', shortcut: ['G', 'M'] },

  // Actions
  { id: 'act-terminal', group: 'Actions', label: 'Toggle Terminal Panel', icon: Terminal, kind: 'action', toggle: 'terminal', keywords: 'console shell command line' },
  { id: 'act-ask-ai', group: 'Actions', label: 'Open Agents', icon: Sparkles, kind: 'action', target: 'agents', keywords: 'chat conversation' },

  // Links
  { id: 'link-email', group: 'Links', label: 'Copy email', icon: Mail, kind: 'link', href: `mailto:${profile.socials.email}`, hint: profile.socials.email },
  { id: 'link-github', group: 'Links', label: 'Open GitHub', icon: Github, kind: 'link', href: profile.socials.github },
  { id: 'link-linkedin', group: 'Links', label: 'Open LinkedIn', icon: Linkedin, kind: 'link', href: profile.socials.linkedin },
  { id: 'link-resume', group: 'Links', label: 'View Resume (PDF)', icon: FileText, kind: 'link', href: profile.socials.resume },
];
