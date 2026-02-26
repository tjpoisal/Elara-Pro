'use client';
import { useState } from 'react';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Button, Input, Badge } from '@/components/Navigation';

export default function ConsultationDetailPage({ params }: { params: { id: string } }) {
  const [notes, setNotes] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const handleParseNotes = async () => {
    setIsParsing(true);
    // AI parsing would happen here via /api/ai?action=parse
    setTimeout(() => setIsParsing(false), 1500);
  };

  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader title="Consultation" subtitle={`Consultation ${params.id}`} />
        <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; @media (max-width: 768px) { grid-template-columns: 1fr; }`}>
          <Card>
            <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Client Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter stylist notes... e.g., 'Client wants to go from level 5 brown to level 8 blonde, 30% gray, medium porosity'"
              className={css`width: 100%; min-height: 200px; padding: 1rem; background: ${theme.colors.obsidian}; border: 1px solid ${theme.colors.borderDefault}; border-radius: ${theme.radii.md}; color: ${theme.colors.warmCream}; font-family: inherit; font-size: 0.875rem; resize: vertical; &:focus { border-color: ${theme.colors.borderFocus}; outline: none; }`}
            />
            <div className={css`margin-top: 1rem; display: flex; gap: 0.75rem;`}>
              <Button onClick={handleParseNotes} disabled={isParsing || !notes}>
                {isParsing ? 'Parsing with AI...' : 'Parse Notes with AI'}
              </Button>
              <Button variant="secondary">Save Draft</Button>
            </div>
          </Card>
          <div>
            <Card>
              <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Hair Assessment</h3>
              <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;`}>
                <div><label className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.25rem;`}>Current Level</label><Input placeholder="1-10" /></div>
                <div><label className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.25rem;`}>Target Level</label><Input placeholder="1-10" /></div>
                <div><label className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.25rem;`}>Gray %</label><Input placeholder="0-100" /></div>
                <div><label className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.25rem;`}>Porosity</label><Input placeholder="low/medium/high" /></div>
              </div>
            </Card>
            <div className={css`margin-top: 1.5rem;`}>
              <Card>
                <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>AI Confidence</h3>
                <div className={css`display: flex; align-items: center; gap: 1rem;`}>
                  <Badge color={theme.colors.success}>Pending</Badge>
                  <span className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>Parse notes to see confidence score</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </MainContent>
    </>
  );
}
