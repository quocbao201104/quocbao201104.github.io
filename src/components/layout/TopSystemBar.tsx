import { Command, CircuitBoard, Cpu, Database, Clock, ChevronDown, Terminal } from 'lucide-react';
import { profile, systemMeta } from '@/data/profile';
import { StatusDot } from '@/components/common/StatusDot';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/cn';
import { useEffect, useRef, useState } from 'react';

const icons = [CircuitBoard, Cpu, Database, Clock];

export function TopSystemBar() {
  const togglePalette = useUIStore((s) => s.togglePalette);
  const showTerminal = useUIStore((s) => s.showTerminal);
  const toggleTerminal = useUIStore((s) => s.toggleTerminal);
  const hideTerminal = useUIStore((s) => s.hideTerminal);
  const terminalVisible = useUIStore((s) => s.terminalVisible);

  const [termMenuOpen, setTermMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!termMenuOpen) return;
      const t = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(t)) setTermMenuOpen(false);
    };
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, [termMenuOpen]);

  return (
    <header
      className={cn(
        'relative z-50 h-14 shrink-0 border-b border-line/80 bg-bg-base/85',
        'flex items-center px-4 lg:px-6 gap-4',
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 min-w-0 lg:w-[244px]">
        <LogoMark />
        <div className="flex items-baseline gap-1.5 min-w-0">
          <span className="font-semibold text-sm tracking-tight text-ink-bright">
            {profile.os.name}
          </span>
          <span className="hidden sm:inline text-2xs font-mono text-ink-dim">
            {profile.os.version}
          </span>
        </div>
      </div>

      {/* System status row */}
      <div className="hidden md:flex flex-1 items-center justify-center gap-6 lg:gap-9 px-4 min-w-0">
        {systemMeta.map((m, i) => {
          const Icon = icons[i] ?? CircuitBoard;
          const tone =
            m.tone === 'ok' ? 'ok' : m.tone === 'cyan' ? 'cyan' : 'muted';
          return (
            <div
              key={m.label}
              className="flex items-center gap-2.5 min-w-0"
            >
              <Icon size={13} className="text-ink-dim shrink-0" />
              <div className="flex flex-col min-w-0 leading-tight">
                <span className="text-[10px] font-mono uppercase tracking-wider2 text-ink-dim">
                  {m.label}
                </span>
                <span className="flex items-center gap-1.5 text-[12px] text-ink-bright truncate">
                  {tone !== 'muted' && <StatusDot tone={tone} />}
                  {m.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right cluster */}
      <div className="flex items-center gap-2 ml-auto">
        <div ref={menuRef} className="relative z-50">
          <button
            type="button"
            onClick={() => setTermMenuOpen((v) => !v)}
            className={cn(
              'group inline-flex items-center gap-2 rounded-md px-2.5 py-1.5',
              'glass text-2xs text-ink-muted hover:text-ink-bright',
              'hover:border-accent-purple/25 transition-all',
            )}
            aria-label="Terminal menu"
          >
            <Terminal size={12} className="text-accent-purple-soft" />
            <span className="hidden sm:inline font-mono">Terminal</span>
            <ChevronDown size={12} className="text-ink-dim" />
          </button>

          {termMenuOpen && (
            <div
              className="fixed right-6 top-14 mt-2 w-[200px] z-[999] panel-soft border border-white/[0.06] rounded-lg overflow-hidden shadow-[0_18px_60px_-30px_rgba(0,0,0,0.8)]"
              role="menu"
            >
              <button
                type="button"
                onClick={() => {
                  showTerminal();
                  setTermMenuOpen(false);
                }}
                className="w-full px-3 py-2.5 text-left text-[12.5px] font-mono text-ink-bright hover:bg-white/[0.04] transition-colors"
              >
                New Terminal
              </button>
              <button
                type="button"
                onClick={() => {
                  toggleTerminal();
                  setTermMenuOpen(false);
                }}
                className="w-full px-3 py-2.5 text-left text-[12.5px] font-mono text-ink-muted hover:bg-white/[0.04] transition-colors"
              >
                Toggle Panel
              </button>
              <button
                type="button"
                disabled={!terminalVisible}
                onClick={() => {
                  hideTerminal();
                  setTermMenuOpen(false);
                }}
                className={cn(
                  'w-full px-3 py-2.5 text-left text-[12.5px] font-mono hover:bg-white/[0.04] transition-colors',
                  terminalVisible ? 'text-ink-muted' : 'text-ink-faint cursor-not-allowed',
                )}
              >
                Close Terminal
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={togglePalette}
          className={cn(
            'group inline-flex items-center gap-2 rounded-md px-2.5 py-1.5',
            'glass text-2xs text-ink-muted hover:text-ink-bright',
            'hover:border-accent-purple/30 transition-all',
          )}
          aria-label="Open command palette"
        >
          <kbd
            className={cn(
              'flex items-center gap-0.5 rounded border border-line px-1 py-0.5',
              'font-mono text-[10px] text-ink-bright bg-white/[0.02]',
            )}
          >
            <Command size={10} />K
          </kbd>
          <span className="hidden sm:inline font-mono">Command Palette</span>
        </button>

        <Avatar />
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <span
      aria-hidden
      className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md"
    >
      <span
        className="absolute inset-0 rounded-md"
        style={{
          background:
            'linear-gradient(135deg, rgba(168,85,247,0.9), rgba(124,58,237,0.6))',
        }}
      />
      <span
        className="absolute inset-[2px] rounded-[5px] bg-bg-base"
        style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}
      />
      <svg viewBox="0 0 16 16" className="relative h-3.5 w-3.5">
        <circle cx="8" cy="8" r="2.4" fill="#c4a3f7" />
        <circle cx="8" cy="8" r="6" fill="none" stroke="#a855f7" strokeWidth="0.8" strokeOpacity="0.6" />
        <circle cx="8" cy="2" r="0.9" fill="#67e8f9" />
        <circle cx="14" cy="8" r="0.9" fill="#a855f7" />
        <circle cx="8" cy="14" r="0.9" fill="#a855f7" />
        <circle cx="2" cy="8" r="0.9" fill="#67e8f9" />
      </svg>
    </span>
  );
}

function Avatar() {
  return (
    <button
      type="button"
      className={cn(
        'relative inline-flex h-8 w-8 items-center justify-center rounded-full',
        'border border-line-strong overflow-hidden',
        'hover:border-accent-purple/40 transition-colors',
      )}
      title={profile.name}
    >
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, #c4a3f7 0%, #7c3aed 60%, #1a1a25 100%)',
        }}
      />
      <span className="relative font-mono text-[11px] font-semibold text-ink-bright">QB</span>
      <span className="absolute -bottom-0.5 -right-0.5 inline-flex h-2.5 w-2.5 rounded-full bg-status-ok ring-2 ring-bg-base" />
    </button>
  );
}
