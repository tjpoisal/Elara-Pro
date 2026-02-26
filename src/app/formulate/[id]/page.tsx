'use client';
import { useState } from 'react';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Button, Input, Badge } from '@/components/Navigation';
import { calculateLift, type HairLevel } from '@/lib/chemistry';

export default function FormulaDetailPage({ params }: { params: { id: string } }) {
  const [startLevel, setStartLevel] = useState<number>(5);
  const [targetLevel, setTargetLevel] = useState<number>(7);
  const liftResult = calculateLift(startLevel as HairLevel, targetLevel as HairLevel);

  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader title="Formula Builder" subtitle={`Formula ${params.id}`} />
        <div className={css`display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; @media (max-width: 768px) { grid-template-columns: 1fr; }`}>
          <div>
            <Card>
              <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Color Math</h3>
              <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;`}>
                <div>
                  <label className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.25rem;`}>Start Level</label>
                  <Input type="number" min={1} max={10} value={startLevel} onChange={(e) => setStartLevel(Number(e.target.value))} />
                </div>
                <div>
                  <label className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.25rem;`}>Target Level</label>
                  <Input type="number" min={1} max={10} value={targetLevel} onChange={(e) => setTargetLevel(Number(e.target.value))} />
                </div>
              </div>
              <div className={css`padding: 1rem; background: ${theme.colors.obsidian}; border-radius: ${theme.radii.md}; margin-bottom: 1rem;`}>
                <div className={css`display: flex; justify-content: space-between; margin-bottom: 0.5rem;`}>
                  <span className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem;`}>Levels of Lift</span>
                  <span className={css`color: ${theme.colors.warmCream}; font-weight: 600;`}>{liftResult.levelsOfLift}</span>
                </div>
                <div className={css`display: flex; justify-content: space-between; margin-bottom: 0.5rem;`}>
                  <span className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem;`}>Developer Volume</span>
                  <span className={css`color: ${theme.colors.warmCream}; font-weight: 600;`}>{liftResult.requiredDeveloperVolume}V</span>
                </div>
                <div className={css`display: flex; justify-content: space-between; margin-bottom: 0.5rem;`}>
                  <span className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem;`}>Exposed Pigment</span>
                  <div className={css`display: flex; align-items: center; gap: 0.5rem;`}>
                    <div className={css`width: 16px; height: 16px; border-radius: 50%; background: ${liftResult.exposedPigment.hexColor};`} />
                    <span className={css`color: ${theme.colors.warmCream}; font-weight: 600;`}>{liftResult.exposedPigment.pigmentName}</span>
                  </div>
                </div>
                <div className={css`display: flex; justify-content: space-between;`}>
                  <span className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem;`}>Pre-Lightening</span>
                  <Badge color={liftResult.requiresPreLightening ? theme.colors.warning : theme.colors.success}>
                    {liftResult.requiresPreLightening ? 'Required' : 'Not Needed'}
                  </Badge>
                </div>
              </div>
              {liftResult.warnings.length > 0 && (
                <div className={css`padding: 1rem; background: ${theme.colors.warning}15; border: 1px solid ${theme.colors.warning}40; border-radius: ${theme.radii.md};`}>
                  {liftResult.warnings.map((w, i) => (
                    <p key={i} className={css`color: ${theme.colors.warning}; font-size: 0.875rem; margin-bottom: ${i < liftResult.warnings.length - 1 ? '0.5rem' : '0'};`}>{w}</p>
                  ))}
                </div>
              )}
            </Card>
            <div className={css`margin-top: 1.5rem;`}>
              <Card>
                <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Formula Zones</h3>
                <Button>Add Zone</Button>
              </Card>
            </div>
          </div>
          <Card>
            <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Summary</h3>
            <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>Add products to zones to see the formula summary.</p>
            <div className={css`margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem;`}>
              <Button>Save Formula</Button>
              <Button variant="secondary">Save as Template</Button>
            </div>
          </Card>
        </div>
      </MainContent>
    </>
  );
}
