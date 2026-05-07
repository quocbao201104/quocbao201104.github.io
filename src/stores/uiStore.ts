import { create } from 'zustand';

export type SectionId = 'home' | 'projects' | 'agents' | 'lab' | 'skills' | 'memory' | 'terminal';

interface UIState {
  paletteOpen: boolean;
  setPaletteOpen: (open: boolean) => void;
  togglePalette: () => void;

  terminalVisible: boolean;
  showTerminal: () => void;
  hideTerminal: () => void;

  terminalCollapsed: boolean;
  toggleTerminal: () => void;
  setTerminalCollapsed: (v: boolean) => void;
  terminalDocked: boolean;
  setTerminalDocked: (v: boolean) => void;

  activeSection: SectionId;
  setActiveSection: (s: SectionId) => void;

  openedTabs: SectionId[];
  openTab: (id: SectionId) => void;
  closeTab: (id: SectionId) => void;

  selectedAgentId: string | null;
  setSelectedAgentId: (id: string | null) => void;

  terminalSession: string;
  setTerminalSession: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  paletteOpen: false,
  setPaletteOpen: (open) => set({ paletteOpen: open }),
  togglePalette: () => set((s) => ({ paletteOpen: !s.paletteOpen })),

  terminalVisible: false,
  showTerminal: () => set({ terminalVisible: true, terminalCollapsed: false }),
  hideTerminal: () => set({ terminalVisible: false }),

  terminalCollapsed: true,
  toggleTerminal: () =>
    set((s) =>
      s.terminalVisible
        ? { terminalCollapsed: !s.terminalCollapsed }
        : { terminalVisible: true, terminalCollapsed: false },
    ),
  setTerminalCollapsed: (v) => set({ terminalCollapsed: v }),
  terminalDocked: true,
  setTerminalDocked: (v) => set({ terminalDocked: v }),

  activeSection: 'home',
  setActiveSection: (s) => set({ activeSection: s }),

  openedTabs: ['home'],
  openTab: (id) =>
    set((s) => ({
      openedTabs: s.openedTabs.includes(id) ? s.openedTabs : [...s.openedTabs, id],
      activeSection: id,
    })),
  closeTab: (id) =>
    set((s) => {
      if (id === 'home') return s;
      const nextTabs = s.openedTabs.filter((t) => t !== id);
      const nextActive = s.activeSection === id ? nextTabs[nextTabs.length - 1] ?? 'home' : s.activeSection;
      return { openedTabs: nextTabs.length ? nextTabs : ['home'], activeSection: nextActive };
    }),

  selectedAgentId: null,
  setSelectedAgentId: (id) => set({ selectedAgentId: id }),

  terminalSession: 'session_01',
  setTerminalSession: (id) => set({ terminalSession: id }),
}));
