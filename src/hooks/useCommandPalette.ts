import { useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';

export function useCommandPaletteShortcut() {
  const togglePalette = useUIStore((s) => s.togglePalette);
  const setOpen = useUIStore((s) => s.setPaletteOpen);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey;
      if (isMeta && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        togglePalette();
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [togglePalette, setOpen]);
}
