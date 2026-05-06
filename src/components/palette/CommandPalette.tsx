import { Command } from 'cmdk';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useUIStore } from '@/stores/uiStore';
import { useCommandPaletteShortcut } from '@/hooks/useCommandPalette';
import { paletteCommands, type PaletteCommand } from '@/data/paletteCommands';
import { cn } from '@/lib/cn';

export function CommandPalette() {
  useCommandPaletteShortcut();
  const open = useUIStore((s) => s.paletteOpen);
  const setOpen = useUIStore((s) => s.setPaletteOpen);
  const toggleTerminal = useUIStore((s) => s.toggleTerminal);
  const openTab = useUIStore((s) => s.openTab);

  // Lock body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
    return undefined;
  }, [open]);

  const groups = useMemo(() => {
    const out: Record<string, PaletteCommand[]> = {};
    paletteCommands.forEach((c) => {
      out[c.group] = out[c.group] ?? [];
      out[c.group]!.push(c);
    });
    return out;
  }, []);

  const handleSelect = (c: PaletteCommand) => {
    setOpen(false);
    requestAnimationFrame(() => {
      if (c.kind === 'navigate' && c.target) {
        openTab(c.target as any);
      } else if (c.kind === 'action') {
        if (c.toggle === 'terminal') toggleTerminal();
        else if (c.target) {
          openTab(c.target as any);
        }
      } else if (c.kind === 'link' && c.href) {
        if (c.id === 'link-email') {
          navigator.clipboard?.writeText(c.hint ?? c.href.replace('mailto:', ''));
          window.location.href = c.href;
        } else {
          window.open(c.href, '_blank', 'noopener,noreferrer');
        }
      }
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[60] flex items-start justify-center pt-[12vh] px-4"
          onClick={() => setOpen(false)}
        >
          <div
            aria-hidden
            className="absolute inset-0 bg-bg-sunken/80"
          />
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-[40vh] pointer-events-none"
            style={{
              background:
                'radial-gradient(60% 50% at 50% 0%, rgba(168,85,247,0.18) 0%, transparent 70%)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              'relative w-full max-w-[640px] glass-strong rounded-2xl overflow-hidden',
              'shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]',
              'ring-1 ring-accent-purple/15',
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <Command label="Command Palette" className="flex flex-col">
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-line">
                <Search size={15} className="text-ink-dim shrink-0" />
                <Command.Input
                  placeholder="Search BAO.OS..."
                  className="flex-1 bg-transparent outline-none border-none
                    text-[14px] text-ink-bright placeholder:text-ink-dim"
                  autoFocus
                />
                <kbd className="hidden sm:inline-flex items-center rounded border border-line
                  px-1.5 py-0.5 font-mono text-[10px] text-ink-dim">
                  ESC
                </kbd>
              </div>

              <Command.List className="max-h-[420px] overflow-y-auto p-2">
                <Command.Empty className="px-4 py-10 text-center text-2xs font-mono text-ink-dim">
                  No results.
                </Command.Empty>

                {Object.entries(groups).map(([group, items]) => (
                  <Command.Group
                    key={group}
                    heading={group}
                    className="
                      [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5
                      [&_[cmdk-group-heading]]:text-2xs [&_[cmdk-group-heading]]:font-mono
                      [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider2
                      [&_[cmdk-group-heading]]:text-ink-dim
                    "
                  >
                    {items.map((c) => (
                      <CommandRow key={c.id} c={c} onSelect={() => handleSelect(c)} />
                    ))}
                  </Command.Group>
                ))}
              </Command.List>

              <div className="border-t border-line px-4 py-2.5 flex items-center justify-between text-2xs font-mono text-ink-dim">
                <span className="flex items-center gap-2">
                  <Kbd>↵</Kbd> Select
                  <Kbd>↑↓</Kbd> Navigate
                </span>
                <span className="flex items-center gap-1.5">
                  Powered by
                  <span className="text-accent-purple-soft">BAO.OS</span>
                </span>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CommandRow({ c, onSelect }: { c: PaletteCommand; onSelect: () => void }) {
  const Icon = c.icon;
  return (
    <Command.Item
      value={`${c.group} ${c.label} ${c.hint ?? ''} ${c.keywords ?? ''}`}
      onSelect={onSelect}
      className="group flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer
        text-[13px] text-ink-muted
        data-[selected=true]:bg-accent-purple/10
        data-[selected=true]:text-ink-bright
        data-[selected=true]:ring-1 data-[selected=true]:ring-accent-purple/25"
    >
      <Icon
        size={14}
        className="text-ink-dim group-data-[selected=true]:text-accent-purple-soft transition-colors"
      />
      <span className="flex-1 truncate">{c.label}</span>
      {c.hint && <span className="text-2xs text-ink-dim truncate">{c.hint}</span>}
      {c.shortcut && (
        <span className="hidden sm:flex items-center gap-1">
          {c.shortcut.map((k) => (
            <Kbd key={k}>{k}</Kbd>
          ))}
        </span>
      )}
    </Command.Item>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center rounded border border-line bg-bg-raised px-1.5 py-0.5
      font-mono text-[10px] text-ink-bright">
      {children}
    </kbd>
  );
}
