'use client';
/**
 * ElaraChat — floating AI assistant available on every page.
 * Supports text chat + optional TTS voice playback (voice add-on).
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { useSalon } from '@/lib/salon-context';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
}

interface ElaraChatProps {
  /** Page context passed to Elara for smarter responses */
  page?: string;
  clientName?: string;
  clientLevel?: number;
  clientGray?: number;
  clientPorosity?: string;
  clientChemicalHistory?: string[];
  consultationServiceType?: string;
  currentLevel?: number;
  targetLevel?: number;
}

const GREETING = "Hi, I'm Elara ✦  Ask me anything — formulas, techniques, color theory, or about a brand you're working with.";

export function ElaraChat(props: ElaraChatProps) {
  const { settings } = useSalon();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'greeting', role: 'assistant', content: GREETING },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const speak = useCallback(async (text: string) => {
    if (!voiceEnabled || speaking) return;
    try {
      setSpeaking(true);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 500) }), // cap for speed
      });
      if (!res.ok) {
        if (res.status === 402) setVoiceEnabled(false); // no add-on
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
      }
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { setSpeaking(false); URL.revokeObjectURL(url); };
      audio.onerror = () => setSpeaking(false);
      await audio.play();
    } catch {
      setSpeaking(false);
    }
  }, [voiceEnabled, speaking]);

  const stopSpeaking = () => {
    audioRef.current?.pause();
    setSpeaking(false);
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', content: text };
    const loadingMsg: Message = { id: 'loading', role: 'assistant', content: '…', isLoading: true };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setInput('');
    setLoading(true);

    try {
      // Build history (exclude greeting and loading)
      const history = [...messages, userMsg]
        .filter((m) => m.id !== 'greeting' && !m.isLoading)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history,
          context: {
            page: props.page,
            clientName: props.clientName,
            clientLevel: props.clientLevel,
            clientGray: props.clientGray,
            clientPorosity: props.clientPorosity,
            clientChemicalHistory: props.clientChemicalHistory,
            consultationServiceType: props.consultationServiceType,
            currentLevel: props.currentLevel,
            targetLevel: props.targetLevel,
            carriedBrands: settings.selectedBrands,
          },
        }),
      });

      const data = await res.json();
      const reply = res.ok ? data.reply : (data.error ?? 'Something went wrong. Try again.');

      // Append brand discovery result to reply if applicable
      let fullReply = reply;
      if (data.actionResult?.type === 'brand_discovered' && data.actionResult.savedToGlobalCatalog) {
        fullReply += `\n\n✦ Added to the global Elara Pro catalog — every stylist on the platform can now use it.`;
      } else if (data.actionResult?.type === 'brand_found') {
        const b = data.actionResult.brand;
        fullReply += `\n\n✦ Found in catalog: ${b.name} (${b.lines?.length ?? 0} product lines)`;
      }

      const assistantMsg: Message = { id: crypto.randomUUID(), role: 'assistant', content: fullReply };
      setMessages((prev) => prev.filter((m) => m.id !== 'loading').concat(assistantMsg));

      if (voiceEnabled) speak(reply);
    } catch {
      setMessages((prev) =>
        prev.filter((m) => m.id !== 'loading').concat({
          id: crypto.randomUUID(),
          role: 'assistant',
          content: 'Connection error. Please try again.',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close Elara' : 'Open Elara AI assistant'}
        className={css`
          position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 1000;
          width: 56px; height: 56px; border-radius: 50%;
          background: linear-gradient(135deg, #d4af37 0%, #f5e070 50%, #d4af37 100%);
          background-size: 200% auto;
          animation: shimmer-gold 4s linear infinite;
          border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.375rem;
          box-shadow: 0 0 24px rgba(212,175,55,0.4), 0 4px 16px rgba(0,0,0,0.5);
          transition: transform 0.2s, box-shadow 0.2s;
          color: #100d1e;
          &:hover { transform: scale(1.08); box-shadow: 0 0 36px rgba(212,175,55,0.6), 0 6px 24px rgba(0,0,0,0.5); }
          &:focus-visible { outline: 2px solid #d4af37; outline-offset: 3px; }
        `}
      >
        {open ? '✕' : '✦'}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Elara AI assistant"
          className={css`
            position: fixed; bottom: 5rem; right: 1.5rem; z-index: 999;
            width: min(420px, calc(100vw - 2rem));
            height: min(560px, calc(100vh - 8rem));
            background: ${theme.colors.obsidianMid};
            border: 1px solid ${theme.colors.gold}30;
            border-radius: ${theme.radii.xl};
            display: flex; flex-direction: column;
            box-shadow: 0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px ${theme.colors.gold}15;
            overflow: hidden;
          `}
        >
          {/* Header */}
          <div className={css`
            padding: 0.875rem 1rem;
            background: ${theme.colors.void};
            border-bottom: 1px solid ${theme.colors.borderDefault};
            display: flex; align-items: center; justify-content: space-between;
          `}>
            <div className={css`display: flex; align-items: center; gap: 0.625rem;`}>
              <div className={css`
                width: 32px; height: 32px; border-radius: 50%;
                background: linear-gradient(135deg, #d4af37 0%, #f5e070 100%);
                display: flex; align-items: center; justify-content: center;
                font-size: 0.875rem; font-weight: 700; color: #100d1e;
              `}>E</div>
              <div>
                <p className={css`color: ${theme.colors.textPrimary}; font-weight: 600; font-size: 0.9rem; line-height: 1; font-family: ${theme.fonts.heading};`}>Elara</p>
                <p className={css`color: ${theme.colors.gold}; font-size: 0.68rem; letter-spacing: 0.05em;`}>AI Hair Assistant</p>
              </div>
            </div>
            <div className={css`display: flex; align-items: center; gap: 0.5rem;`}>
              {/* Voice toggle */}
              <button
                onClick={() => { if (speaking) stopSpeaking(); setVoiceEnabled((v) => !v); }}
                title={voiceEnabled ? 'Voice on — click to mute' : 'Enable voice'}
                className={css`
                  background: ${voiceEnabled ? theme.colors.gold + '20' : 'transparent'};
                  border: 1px solid ${voiceEnabled ? theme.colors.gold : theme.colors.borderDefault};
                  border-radius: ${theme.radii.sm}; padding: 0.25rem 0.5rem;
                  color: ${voiceEnabled ? theme.colors.gold : theme.colors.textMuted};
                  font-size: 0.75rem; cursor: pointer; min-height: unset; min-width: unset;
                  &:focus-visible { outline: 2px solid ${theme.colors.gold}; }
                `}
              >
                {speaking ? '⏹ Stop' : voiceEnabled ? '🔊 On' : '🔇 Off'}
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className={css`flex: 1; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 0.75rem;`}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={css`
                  display: flex;
                  justify-content: ${msg.role === 'user' ? 'flex-end' : 'flex-start'};
                `}
              >
                <div className={css`
                  max-width: 85%;
                  padding: 0.625rem 0.875rem;
                  border-radius: ${msg.role === 'user' ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem'};
                  background: ${msg.role === 'user'
                    ? `linear-gradient(135deg, ${theme.colors.gold}, ${theme.colors.goldLight})`
                    : theme.colors.obsidian};
                  border: ${msg.role === 'assistant' ? `1px solid ${theme.colors.borderDefault}` : 'none'};
                  color: ${msg.role === 'user' ? theme.colors.obsidian : theme.colors.textSecondary};
                  font-size: 0.85rem;
                  line-height: 1.5;
                  white-space: pre-wrap;
                  opacity: ${msg.isLoading ? 0.5 : 1};
                `}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className={css`
            padding: 0.75rem;
            border-top: 1px solid ${theme.colors.borderDefault};
            display: flex; gap: 0.5rem; align-items: flex-end;
          `}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask Elara anything…"
              rows={1}
              disabled={loading}
              aria-label="Message Elara"
              className={css`
                flex: 1; resize: none; max-height: 120px;
                padding: 0.625rem 0.75rem;
                background: ${theme.colors.obsidian};
                border: 1px solid ${theme.colors.borderDefault};
                border-radius: ${theme.radii.md};
                color: ${theme.colors.warmCream};
                font-size: 0.875rem;
                font-family: inherit;
                line-height: 1.4;
                &:focus { border-color: ${theme.colors.roseGold}; outline: none; }
                &:disabled { opacity: 0.5; }
              `}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className={css`
                width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
                background: ${theme.colors.gold};
                border: none; cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                font-size: 1rem; color: ${theme.colors.obsidian}; font-weight: 700;
                transition: opacity 0.15s;
                &:disabled { opacity: 0.4; cursor: not-allowed; }
                &:focus-visible { outline: 2px solid ${theme.colors.gold}; outline-offset: 2px; }
              `}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}
