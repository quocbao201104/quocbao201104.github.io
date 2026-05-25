import { Command, ChevronDown, Terminal } from 'lucide-react';
import { profile, systemMeta } from '@/data/profile';
import { StatusDot } from '@/components/common/StatusDot';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/cn';
import { useEffect, useRef, useState } from 'react';

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
        'relative z-50 h-11 shrink-0 border-b border-line/80 bg-bg-base/85',
        'flex items-center px-4 lg:px-6 gap-3',
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 min-w-0 lg:w-[220px]">
        <LogoMark />
        <span className="font-semibold text-xs tracking-tight text-ink-bright">
          {profile.os.name}
        </span>
        <span className="hidden sm:inline text-[10px] font-mono text-ink-dim">
          {profile.os.version}
        </span>
      </div>

      {/* System status — compact single line */}
      <div className="hidden md:flex flex-1 items-center justify-center gap-5 min-w-0">
        {systemMeta.slice(0, 3).map((m) => {
          const tone = m.tone === 'ok' ? 'ok' : m.tone === 'cyan' ? 'cyan' : 'muted';
          return (
            <div key={m.label} className="flex items-center gap-1.5 min-w-0">
              {tone !== 'muted' && <StatusDot tone={tone} />}
              <span className="text-[11px] font-mono text-ink-muted truncate">
                {m.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1.5 ml-auto">
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setTermMenuOpen((v) => !v)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-2 py-1',
              'text-2xs font-mono text-ink-dim hover:text-ink-bright',
              'hover:bg-white/[0.04] transition-colors',
            )}
            aria-label="Terminal menu"
          >
            <Terminal size={12} className="text-accent-purple-soft" />
            <ChevronDown size={10} />
          </button>

          {termMenuOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-[180px] z-[999]
                panel-soft border border-white/[0.06] rounded-lg overflow-hidden
                shadow-[0_12px_40px_-15px_rgba(0,0,0,0.7)]"
              role="menu"
            >
              <button
                type="button"
                onClick={() => { showTerminal(); setTermMenuOpen(false); }}
                className="w-full px-3 py-2 text-left text-[12px] font-mono text-ink-bright hover:bg-white/[0.04] transition-colors"
              >
                New Terminal
              </button>
              <button
                type="button"
                onClick={() => { toggleTerminal(); setTermMenuOpen(false); }}
                className="w-full px-3 py-2 text-left text-[12px] font-mono text-ink-muted hover:bg-white/[0.04] transition-colors"
              >
                Toggle Panel
              </button>
              <button
                type="button"
                disabled={!terminalVisible}
                onClick={() => { hideTerminal(); setTermMenuOpen(false); }}
                className={cn(
                  'w-full px-3 py-2 text-left text-[12px] font-mono hover:bg-white/[0.04] transition-colors',
                  terminalVisible ? 'text-ink-muted' : 'text-ink-faint cursor-not-allowed',
                )}
              >
                Close
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={togglePalette}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-1
            text-ink-dim hover:text-ink-bright hover:bg-white/[0.04] transition-colors"
          aria-label="Command palette (Ctrl+K)"
        >
          <kbd className="flex items-center gap-0.5 rounded border border-line px-1 py-0.5
            font-mono text-[10px] text-ink-bright bg-white/[0.02]">
            <Command size={9} />K
          </kbd>
        </button>
      </div>
    </header>
  );
}

function LogoMark() {
  return (
    <span
      aria-hidden
      className="relative inline-flex h-6 w-6 shrink-0 items-center justify-center rounded"
    >
      <span
        className="absolute inset-0 rounded"
        style={{
          background:
            'linear-gradient(135deg, rgba(168,85,247,0.9), rgba(124,58,237,0.6))',
        }}
      />
      <span
        className="absolute inset-[2px] rounded-[4px] bg-bg-base"
        style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)' }}
      />
      <svg viewBox="0 0 16 16" className="relative h-3 w-3">
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
