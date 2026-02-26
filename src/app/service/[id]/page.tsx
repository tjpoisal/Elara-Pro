'use client';
import { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Button, Badge } from '@/components/Navigation';

export default function ServicePage({ params }: { params: { id: string } }) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader title="Active Service" subtitle={`Service ${params.id}`} />
        <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; @media (max-width: 768px) { grid-template-columns: 1fr; }`}>
          <Card>
            <div className={css`text-align: center; padding: 2rem 0;`}>
              <div className={css`font-family: ${theme.fonts.mono}; font-size: 4rem; color: ${isRunning ? theme.colors.roseGold : theme.colors.warmCream}; margin-bottom: 1.5rem;`}>
                {formatTime(seconds)}
              </div>
              <div className={css`display: flex; gap: 0.75rem; justify-content: center;`}>
                <Button onClick={() => setIsRunning(!isRunning)}>
                  {isRunning ? 'Pause' : 'Start'}
                </Button>
                <Button variant="secondary" onClick={() => { setSeconds(0); setIsRunning(false); }}>
                  Reset
                </Button>
                <Button variant="danger">End Service</Button>
              </div>
            </div>
          </Card>
          <Card>
            <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Service Timeline</h3>
            <div className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>
              <p>Service steps will appear here as the timer progresses.</p>
            </div>
          </Card>
        </div>
      </MainContent>
    </>
  );
}
