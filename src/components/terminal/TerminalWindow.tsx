import { useEffect, useRef, useState } from 'react';
import {
  Plus,
  Search,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Terminal,
  X,
} from 'lucide-react';
import { TerminalLineRow } from './TerminalLine';
import {
  quickCommands,
  sessions,
  getScript,
} from '@/data/terminalScript';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/cn';
import type { TerminalLine } from '@/data/terminalScript';
import { runTerminalCommand } from '@/terminal/commandRouter';
import { postJson } from '@/lib/apiClient';
import type { AgentTraceStep, ConsoleResponse, SourceChunk } from '@/types/console';

type ChatApiResponse = Partial<ConsoleResponse> & { answer?: string };

function formatTrace(trace: AgentTraceStep[]) {
  if (trace.length === 0) return '';
  const compact = trace.slice(0, 4).map((step) => {
    const marker =
      step.status === 'completed' ? '[ok]' :
      step.status === 'running' ? '[..]' :
      step.status === 'failed' ? '[x]' :
      '[ ]';
    return `${marker} ${step.label}${step.detail ? ` - ${step.detail}` : ''}`;
  });
  return `Trace:\n${compact.join('\n')}`;
}

function formatSources(sources: SourceChunk[]) {
  if (sources.length === 0) return '';
  const lines = sources.slice(0, 3).map((src, idx) => {
    const sim = typeof src.similarity === 'number' ? ` (${src.similarity.toFixed(3)})` : '';
    const title = src.title ?? src.path ?? src.id;
    return `${idx + 1}. ${title}${sim}`;
  });
  return `Sources:\n${lines.join('\n')}`;
}

export function TerminalWindow() {
  const collapsed = useUIStore((s) => s.terminalCollapsed);
  const toggle = useUIStore((s) => s.toggleTerminal);
  const hideTerminal = useUIStore((s) => s.hideTerminal);
  const terminalDocked = useUIStore((s) => s.terminalDocked);
  const setTerminalDocked = useUIStore((s) => s.setTerminalDocked);
  const openTab = useUIStore((s) => s.openTab);
  const sessionId = useUIStore((s) => s.terminalSession);
  const setSession = useUIStore((s) => s.setTerminalSession);

  const [shownCount] = useState(0);
  const [historyBySession, setHistoryBySession] = useState<Record<string, TerminalLine[]>>(
    () => ({
      session_01: [
        {
          kind: 'output',
          speaker: 'BAO.OS',
          speakerTone: 'muted',
          text: 'Welcome. Type \"help\" to see available commands.',
        },
      ],
    }),
  );
  const [input, setInput] = useState('');
  const [helpOpen, setHelpOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const cmdHistoryRef = useRef<Record<string, string[]>>({});
  const cmdCursorRef = useRef<Record<string, number>>({});
  const tabCycleRef = useRef<Record<string, number>>({});

  // Reset input when changing session
  useEffect(() => {
    setInput('');
  }, [sessionId]);

  const activeSession = sessions.find((s) => s.id === sessionId) ?? sessions[0]!;
  const history = historyBySession[sessionId] ?? [];

  // Seed per-session banner/help on first open
  useEffect(() => {
    setHistoryBySession((prev) => {
      if (prev[sessionId]?.length) return prev;
      return { ...prev, [sessionId]: getScript(sessionId) };
    });
  }, [sessionId]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // keep pinned near bottom
    el.scrollTop = el.scrollHeight;
  }, [shownCount, history.length, collapsed, sessionId]);

  const onSubmit = () => {
    void submitAsync();
  };

  const tabSuggestions = (sid: string) => {
    if (sid === 'architecture.ai') return ['inspect architecture ', 'rag '];
    if (sid === 'memory.log') return ['search memory ', 'rag '];
    return ['llm ', 'rag '];
  };

  const applyTabSuggestion = () => {
    if (input.trim().length > 0) return;
    const opts = tabSuggestions(sessionId);
    const i = tabCycleRef.current[sessionId] ?? 0;
    const next = opts[i % opts.length]!;
    tabCycleRef.current[sessionId] = (i + 1) % opts.length;
    setInput(next);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const historyUp = () => {
    const list = cmdHistoryRef.current[sessionId] ?? [];
    if (list.length === 0) return;
    const cur = cmdCursorRef.current[sessionId] ?? -1;
    const next = cur === -1 ? list.length - 1 : Math.max(0, cur - 1);
    cmdCursorRef.current[sessionId] = next;
    setInput(list[next] ?? '');
  };

  const historyDown = () => {
    const list = cmdHistoryRef.current[sessionId] ?? [];
    if (list.length === 0) return;
    const cur = cmdCursorRef.current[sessionId] ?? -1;
    if (cur === -1) return;
    const next = cur + 1;
    if (next >= list.length) {
      cmdCursorRef.current[sessionId] = -1;
      setInput('');
      return;
    }
    cmdCursorRef.current[sessionId] = next;
    setInput(list[next] ?? '');
  };

  const submitAsync = async () => {
    const raw = input.trim();
    if (!raw) return;

    const cmdLine: TerminalLine = {
      kind: 'command',
      prompt: activeSession.prompt,
      text: raw,
    };

    setHistoryBySession((prev) => ({
      ...prev,
      [sessionId]: [...(prev[sessionId] ?? []), cmdLine],
    }));
    setInput('');
    setHelpOpen(false);

    // Record command history (per session)
    cmdHistoryRef.current[sessionId] = [...(cmdHistoryRef.current[sessionId] ?? []), raw].slice(-50);
    cmdCursorRef.current[sessionId] = -1;

    // Resolve (either local canned, or remote LLM/RAG)
    const res = runTerminalCommand({
      sessionId,
      prompt: activeSession.prompt,
      input: raw,
    });

    if (res.ui?.openHelp) {
      setHelpOpen(true);
      return;
    }

    if (res.clear) {
      setHistoryBySession((prev) => ({ ...prev, [sessionId]: [] }));
    }

    if (res.switchSession) {
      window.setTimeout(() => setSession(res.switchSession!), 120);
    }

    if (res.remote) {
      const remote = res.remote;
      // Add a subtle \"thinking\" placeholder then replace with answer.
      const pendingLine: TerminalLine = {
        kind: 'output',
        speaker: 'BAO.OS',
        speakerTone: 'muted',
        text: 'Thinking…',
      };
      setHistoryBySession((prev) => ({
        ...prev,
        [sessionId]: [...(prev[sessionId] ?? []), pendingLine],
      }));

      try {
        const j = await postJson<ChatApiResponse>(`/api/chat`, {
          command: remote.command,
          userInput: remote.userInput,
          message: remote.message,
          mode: remote.mode,
          intent: remote.intent,
          sessionId,
          activeView: remote.activeView,
          persona: remote.persona,
        });

        const answer = (j.answer ?? '').trim() || 'No response generated.';
        const traceText = j.trace?.length ? formatTrace(j.trace) : '';
        const sourcesText = j.sources?.length ? formatSources(j.sources) : '';
        const metadataText = j.metadata?.intent
          ? `Mode: ${j.mode ?? remote.mode} | Intent: ${j.metadata.intent}`
          : `Mode: ${j.mode ?? remote.mode}`;

        const lines: TerminalLine[] = [
          {
            kind: 'output',
            speaker: remote.speaker,
            speakerTone: remote.tone,
            text: answer,
          } as TerminalLine,
        ];
        if (sourcesText) {
          lines.push({
            kind: 'output',
            speaker: remote.speaker,
            speakerTone: 'muted',
            text: sourcesText,
          } as TerminalLine);
        }
        if (traceText) {
          lines.push({
            kind: 'output',
            speaker: remote.speaker,
            speakerTone: 'muted',
            text: traceText,
          } as TerminalLine);
        }
        lines.push({
          kind: 'output',
          speaker: remote.speaker,
          speakerTone: 'muted',
          text: metadataText,
        } as TerminalLine);

        setHistoryBySession((prev) => ({
          ...prev,
          [sessionId]: [
            ...(prev[sessionId] ?? []).slice(0, -1),
            ...lines,
          ],
        }));
      } catch (e: any) {
        setHistoryBySession((prev) => ({
          ...prev,
          [sessionId]: [
            ...(prev[sessionId] ?? []).slice(0, -1),
            {
              kind: 'output',
              speaker: 'BAO.OS',
              speakerTone: 'warn',
              text: e?.message ?? 'Request failed',
            } as TerminalLine,
          ],
        }));
      }
    } else if (res.lines.length) {
      setHistoryBySession((prev) => ({
        ...prev,
        [sessionId]: [...(prev[sessionId] ?? []), ...res.lines],
      }));
    }

    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <section
      className={cn(
        'shrink-0 border-t border-white/[0.04] bg-bg-base/80',
        'transition-[height] duration-500 ease-out',
        terminalDocked ? (collapsed ? 'h-12' : 'h-[26vh] min-h-[200px] max-h-[280px]') : 'h-full',
      )}
    >
      <Header
        collapsed={collapsed}
        onToggle={toggle}
        onClose={hideTerminal}
        docked={terminalDocked}
        onExpand={() => {
          setTerminalDocked(false);
          openTab('terminal');
        }}
        onDock={() => setTerminalDocked(true)}
        activeSessionId={sessionId}
        onSelectSession={setSession}
      />

      {(!collapsed || !terminalDocked) && (
        <div className="relative grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_240px] gap-0 h-[calc(100%-44px)]">
          {/* Subtle scanline + noise overlay */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 texture-scanlines opacity-50"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 texture-noise opacity-[0.06] mix-blend-overlay"
          />

          <div
            ref={scrollRef}
            className="relative overflow-y-auto px-5 lg:px-6 py-4 space-y-1.5"
            onMouseDown={() => inputRef.current?.focus()}
          >
            {helpOpen && (
              <div className="mb-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2">
                <div className="text-2xs font-mono uppercase tracking-wider2 text-ink-dim">
                  Commands (Tab to autofill, ↑/↓ history, Esc close)
                </div>
                <div className="mt-2 grid gap-1.5 text-[12px] font-mono text-ink-muted/95">
                  <div><span className="text-ink-dim">help</span> — open this panel</div>
                  <div><span className="text-ink-dim">clear</span> — clear screen</div>
                  <div><span className="text-ink-dim">llm &lt;message&gt;</span> — direct LLM</div>
                  <div><span className="text-ink-dim">rag &lt;message&gt;</span> — RAG answer</div>
                  <div><span className="text-ink-dim">ask recruiter &lt;topic&gt;</span> — agentic recruiter</div>
                  <div><span className="text-ink-dim">inspect architecture &lt;system&gt;</span> — agentic architecture</div>
                  <div><span className="text-ink-dim">search memory &lt;query&gt;</span> — agentic memory search</div>
                </div>
              </div>
            )}

            {/* Interactive history */ }
            {history.map((line, i) => (
              <TerminalLineRow
                key={`${sessionId}-hist-${i}`}
                line={line}
                animate={i >= Math.max(0, history.length - 1)}
              />
            ))}

            {/* Input row */}
            <div className="flex items-baseline gap-2 font-mono text-[12.5px] text-ink-bright pt-1">
              <span className="text-status-ok select-none">{activeSession.prompt}</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSubmit();
                  else if (e.key === 'Tab') {
                    e.preventDefault();
                    applyTabSuggestion();
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    historyUp();
                  } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    historyDown();
                  } else if (e.key === 'Escape') {
                    setHelpOpen(false);
                  }
                }}
                placeholder='Type "help"...'
                className="flex-1 bg-transparent outline-none border-none text-ink-bright placeholder:text-ink-dim"
                spellCheck={false}
                autoCapitalize="none"
                autoCorrect="off"
              />
              <span className="inline-block h-3 w-1.5 -mb-[2px] bg-accent-purple animate-cursor-blink align-middle" />
            </div>
          </div>

          <div className="relative hidden lg:flex flex-col border-l border-white/[0.04] px-5 py-4 overflow-y-auto">
            <div className="label-eyebrow mb-3">Quick Commands</div>
            <ul className="flex flex-col gap-2">
              {quickCommands.map((q) => (
                <li
                  key={q.cmd}
                  className="grid grid-cols-[110px_minmax(0,1fr)] items-baseline gap-3"
                >
                  <button
                    type="button"
                    onClick={() => {
                      // Drop placeholder tokens like <topic>
                      const seed = q.cmd.replace(/<[^>]+>/g, '').trimEnd() + ' ';
                      setInput(seed);
                      window.setTimeout(() => inputRef.current?.focus(), 0);
                    }}
                    className="text-left font-mono text-[12px] text-accent-purple-soft truncate hover:text-accent-purple"
                    title={q.cmd}
                  >
                    &gt; {q.cmd}
                  </button>
                  <span className="text-2xs text-ink-dim truncate">{q.hint}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}

function Header({
  collapsed,
  onToggle,
  onClose,
  docked,
  onExpand,
  onDock,
  activeSessionId,
  onSelectSession,
}: {
  collapsed: boolean;
  onToggle: () => void;
  onClose: () => void;
  docked: boolean;
  onExpand: () => void;
  onDock: () => void;
  activeSessionId: string;
  onSelectSession: (id: string) => void;
}) {
  return (
    <header className="h-11 px-4 lg:px-5 flex items-stretch gap-1 border-b border-white/[0.04]">
      <div className="flex items-center gap-2 pr-3 mr-1 border-r border-white/[0.04]">
        <Terminal size={13} className="text-accent-purple shrink-0" />
        <span className="text-2xs font-mono uppercase tracking-wider2 text-ink-bright">
          BAO.OS
        </span>
      </div>

      {/* Session tabs */}
      <div className="flex items-stretch gap-0.5">
        {sessions.map((s) => {
          const active = s.id === activeSessionId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelectSession(s.id)}
              className={cn(
                'group relative inline-flex items-center gap-1.5 px-3 -mb-px',
                'text-[11.5px] font-mono transition-colors duration-200',
                active
                  ? 'text-ink-bright'
                  : 'text-ink-dim hover:text-ink-muted',
              )}
            >
              <span
                aria-hidden
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  active
                    ? 'bg-accent-purple shadow-[0_0_8px_rgba(168,85,247,0.7)]'
                    : 'bg-ink-faint',
                )}
              />
              {s.label}
              {active && (
                <span
                  aria-hidden
                  className="absolute inset-x-2 -bottom-px h-px bg-accent-purple/70"
                />
              )}
              {active && (
                <X
                  size={10}
                  className="text-ink-dim hover:text-ink-bright ml-1"
                  aria-hidden
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="ml-auto flex items-center gap-1">
        <HeaderIconBtn label="New tab"><Plus size={12} /></HeaderIconBtn>
        <HeaderIconBtn label="Search"><Search size={12} /></HeaderIconBtn>
        <HeaderIconBtn label="Clear"><Trash2 size={12} /></HeaderIconBtn>
        <HeaderIconBtn label="More"><MoreHorizontal size={12} /></HeaderIconBtn>
        <HeaderIconBtn label="Close terminal" onClick={onClose}><X size={12} /></HeaderIconBtn>
        {docked ? (
          <HeaderIconBtn label="Open in workspace" onClick={onExpand}><ChevronUp size={12} /></HeaderIconBtn>
        ) : (
          <HeaderIconBtn label="Dock terminal" onClick={onDock}><ChevronDown size={12} /></HeaderIconBtn>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-md
            text-ink-dim hover:text-ink-bright hover:bg-white/[0.04] transition-colors"
          aria-label={collapsed ? 'Expand terminal' : 'Collapse terminal'}
        >
          {collapsed ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>
    </header>
  );
}

function HeaderIconBtn({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="inline-flex h-6 w-6 items-center justify-center rounded-md
        text-ink-dim hover:text-ink-bright hover:bg-white/[0.04] transition-colors"
    >
      {children}
    </button>
  );
}
