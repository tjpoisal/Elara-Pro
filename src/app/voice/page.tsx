'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Button, Badge } from '@/components/Navigation';

interface VoiceLog {
  id: string;
  transcription: string | null;
  actionTaken: string | null;
  durationSeconds: number | null;
  createdAt: string;
}

type ListeningState = 'idle' | 'listening' | 'processing';

interface ISpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: { results: Array<Array<{ transcript: string }>> }) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

export default function VoicePage() {
  const [state, setState] = useState<ListeningState>('idle');
  const [transcript, setTranscript] = useState('');
  const [reply, setReply] = useState('');
  const [logs, setLogs] = useState<VoiceLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const startTimeRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const transcriptRef = useRef('');

  useEffect(() => {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) setVoiceSupported(false);
    fetch('/api/voice')
      .then((r) => r.json())
      .then((d: { voiceLogs?: VoiceLog[] }) => setLogs(d.voiceLogs ?? []))
      .catch(() => {})
      .finally(() => setLogsLoading(false));
  }, []);

  const speakReply = useCallback(async (text: string) => {
    try {
      setSpeaking(true);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.slice(0, 500) }),
      });
      if (!res.ok) { setSpeaking(false); return; }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) { audioRef.current.pause(); URL.revokeObjectURL(audioRef.current.src); }
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { setSpeaking(false); URL.revokeObjectURL(url); };
      audio.onerror = () => setSpeaking(false);
      await audio.play();
    } catch { setSpeaking(false); }
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setState('idle');
  }, []);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;
    startTimeRef.current = Date.now();
    transcriptRef.current = '';

    recognition.onstart = () => { setState('listening'); setTranscript(''); setReply(''); };

    recognition.onresult = (event) => {
      const interim = Array.from(event.results)
        .map((r) => r[0]!.transcript)
        .join('');
      transcriptRef.current = interim;
      setTranscript(interim);
    };

    recognition.onend = async () => {
      setState('processing');
      const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
      const finalText = transcriptRef.current;

      if (!finalText.trim()) { setState('idle'); return; }

      try {
        const chatRes = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'user', content: finalText }],
            context: { page: 'voice' },
          }),
        });
        const data = await chatRes.json() as { reply?: string };
        const elaraReply = chatRes.ok ? (data.reply ?? '') : 'Sorry, I had trouble with that.';
        setReply(elaraReply);

        await fetch('/api/voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcription: finalText, durationSeconds: duration, wakeWord: 'manual' }),
        });

        fetch('/api/voice')
          .then((r) => r.json())
          .then((d: { voiceLogs?: VoiceLog[] }) => setLogs(d.voiceLogs ?? []))
          .catch(() => {});

        await speakReply(elaraReply);
      } catch {
        setReply('Connection error. Please try again.');
      } finally {
        setState('idle');
      }
    };

    recognition.onerror = () => { setState('idle'); };
    recognition.start();
  }, [speakReply]);

  const stopSpeaking = () => { audioRef.current?.pause(); setSpeaking(false); };

  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader title="Voice" subtitle="Speak to Elara hands-free" />

        {!voiceSupported && (
          <div className={css`
            background: ${theme.colors.topaz}15;
            border: 1px solid ${theme.colors.topaz}40;
            border-radius: ${theme.radii.md};
            padding: 0.875rem 1.25rem;
            margin-bottom: 1.5rem;
          `}>
            <p className={css`color: ${theme.colors.topaz}; font-size: 0.875rem; margin: 0;`}>
              Your browser does not support the Web Speech API. Try Chrome or Edge for voice input.
            </p>
          </div>
        )}

        {/* Main voice interface */}
        <div className={css`
          background: ${theme.colors.obsidianMid};
          border: 1px solid ${theme.colors.borderDefault};
          border-radius: ${theme.radii.xl};
          padding: 3rem 2rem;
          text-align: center;
          margin-bottom: 2rem;
        `}>
          {/* Orb */}
          <div className={css`
            width: 120px; height: 120px; border-radius: 50%; margin: 0 auto 2rem;
            background: ${state === 'listening'
              ? 'radial-gradient(circle, rgba(212,130,100,0.6) 0%, rgba(212,130,100,0.2) 60%, transparent 100%)'
              : state === 'processing'
              ? 'radial-gradient(circle, rgba(212,175,55,0.6) 0%, rgba(212,175,55,0.2) 60%, transparent 100%)'
              : 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, rgba(212,175,55,0.1) 60%, transparent 100%)'};
            border: 2px solid ${state === 'listening' ? theme.colors.roseGold : state === 'processing' ? theme.colors.gold : theme.colors.borderDefault};
            display: flex; align-items: center; justify-content: center;
            font-size: 2.5rem;
            transition: all 0.3s;
          `}>
            {state === 'listening' ? '🎙' : state === 'processing' ? '◷' : '✦'}
          </div>

          <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem; margin: 0 0 0.5rem;`}>
            {state === 'listening' ? 'Listening…' : state === 'processing' ? 'Processing…' : 'Tap to speak to Elara'}
          </p>

          {transcript && (
            <p className={css`color: ${theme.colors.warmCream}; font-size: 1rem; margin: 0.75rem auto 1.5rem; font-style: italic; max-width: 480px;`}>
              &ldquo;{transcript}&rdquo;
            </p>
          )}

          {reply && (
            <div className={css`
              background: ${theme.colors.obsidian};
              border: 1px solid ${theme.colors.gold}30;
              border-radius: ${theme.radii.lg};
              padding: 1rem 1.25rem;
              max-width: 560px; margin: 0 auto 1.5rem;
              text-align: left;
            `}>
              <div className={css`display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;`}>
                <span className={css`color: ${theme.colors.gold}; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em;`}>✦ ELARA</span>
              </div>
              <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; line-height: 1.6; margin: 0; white-space: pre-wrap;`}>
                {reply}
              </p>
            </div>
          )}

          <div className={css`display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;`}>
            {state === 'idle' ? (
              <Button onClick={startListening} disabled={!voiceSupported}>
                🎙 Start Listening
              </Button>
            ) : state === 'listening' ? (
              <Button variant="danger" onClick={stopListening}>Stop</Button>
            ) : (
              <Button variant="secondary" disabled>Processing…</Button>
            )}
            {speaking && (
              <Button variant="secondary" onClick={stopSpeaking}>Stop Speaking</Button>
            )}
          </div>
        </div>

        {/* Recent sessions */}
        <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin: 0 0 1rem;`}>
          Recent Sessions
        </h3>
        {logsLoading ? (
          <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>Loading…</p>
        ) : logs.length === 0 ? (
          <Card>
            <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem; margin: 0;`}>No voice sessions yet.</p>
          </Card>
        ) : (
          <div className={css`display: flex; flex-direction: column; gap: 0.5rem;`}>
            {logs.map((log) => (
              <div key={log.id} className={css`
                background: ${theme.colors.obsidianMid};
                border: 1px solid ${theme.colors.borderDefault};
                border-radius: ${theme.radii.md};
                padding: 0.875rem 1.25rem;
                display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;
              `}>
                <div className={css`flex: 1;`}>
                  <p className={css`color: ${theme.colors.warmCream}; font-size: 0.85rem; margin: 0 0 0.25rem; font-style: italic;`}>
                    &ldquo;{log.transcription ?? '—'}&rdquo;
                  </p>
                  {log.actionTaken && <Badge variant="info">{log.actionTaken}</Badge>}
                </div>
                <div className={css`text-align: right; flex-shrink: 0;`}>
                  <p className={css`color: ${theme.colors.textDisabled}; font-size: 0.72rem; margin: 0;`}>
                    {new Date(log.createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                  {log.durationSeconds != null && (
                    <p className={css`color: ${theme.colors.textDisabled}; font-size: 0.72rem; margin: 0.125rem 0 0;`}>
                      {log.durationSeconds}s
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </MainContent>
    </>
  );
}
