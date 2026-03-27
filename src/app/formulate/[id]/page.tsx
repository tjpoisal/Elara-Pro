'use client';
import { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Button, Input, Badge } from '@/components/Navigation';
import { calculateLift, calculateGrayCoverage, calculateAdjustedTiming, type HairLevel } from '@/lib/chemistry';
import { useSalon } from '@/lib/salon-context';
import { HeadMap, type SectionPlacement } from '@/components/HeadMap';

interface FormulaZone {
  id: string;
  name: string;
  zoneType: string;
  brandSlug: string;
  lineSlug: string;
  shade: string;
  developerVolume: number;
  mixingRatio: string;
  amountGrams: number;
  processingTime: number;
  notes: string;
}

// In production this would come from the salon's settings/onboarding selection
// For now we show all brands and let the stylist pick
const ZONE_TYPES = ['roots', 'midshaft', 'ends', 'full_head', 'highlights', 'lowlights', 'balayage', 'gloss', 'toner', 'custom'];

export default function FormulaDetailPage({ params }: { params: { id: string } }) {
  const { carriedBrands } = useSalon();
  const [startLevel, setStartLevel] = useState<number>(5);
  const [targetLevel, setTargetLevel] = useState<number>(7);
  const [grayPct, setGrayPct] = useState<number>(0);
  const [porosity, setPorosity] = useState<'low' | 'medium' | 'high'>('medium');
  const [texture, setTexture] = useState<'fine' | 'medium' | 'coarse'>('medium');
  const [zones, setZones] = useState<FormulaZone[]>([]);
  const [headMapPlacements, setHeadMapPlacements] = useState<SectionPlacement[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [formulaName, setFormulaName] = useState('');
  const [saving, setSaving] = useState(false);

  const liftResult = calculateLift(startLevel as HairLevel, targetLevel as HairLevel);
  const grayResult = grayPct > 0 ? calculateGrayCoverage(grayPct, targetLevel as HairLevel, startLevel as HairLevel) : null;
  const timingResult = calculateAdjustedTiming(35, porosity, texture, 'permanent');

  const label = css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.375rem;`;

  const addZone = () => {
    const newZone: FormulaZone = {
      id: crypto.randomUUID(),
      name: `Zone ${zones.length + 1}`,
      zoneType: 'roots',
      brandSlug: selectedBrand,
      lineSlug: '',
      shade: '',
      developerVolume: liftResult.requiredDeveloperVolume,
      mixingRatio: '1:1',
      amountGrams: 60,
      processingTime: timingResult.adjustedTimeMinutes,
      notes: '',
    };
    setZones([...zones, newZone]);
  };

  const updateZone = (id: string, patch: Partial<FormulaZone>) => {
    setZones(zones.map((z) => z.id === id ? { ...z, ...patch } : z));
  };

  const removeZone = (id: string) => setZones(zones.filter((z) => z.id !== id));

  const [saveError, setSaveError] = useState('');

  const handleSave = async (asTemplate = false) => {
    if (!formulaName.trim() || zones.length === 0) return;
    setSaving(true);
    setSaveError('');
    try {
      const res = await fetch('/api/formulas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formulaName.trim(),
          isTemplate: asTemplate,
          zones: zones.map((z) => ({
            zoneType: z.zoneType,
            zoneName: z.name,
            developerVolume: z.developerVolume,
            mixingRatio: z.mixingRatio,
            processingTime: z.processingTime,
            products: [], // products would be linked via productId in production
          })),
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        setSaveError(d.error ?? 'Failed to save formula.');
      }
    } catch {
      setSaveError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const totalGrams = zones.reduce((sum, z) => sum + z.amountGrams, 0);
  const brand = carriedBrands.find((b) => b.slug === selectedBrand);
  const select = css`width: 100%; padding: 0.5rem 0.75rem; background: ${theme.colors.obsidian}; border: 1px solid ${theme.colors.borderDefault}; border-radius: ${theme.radii.md}; color: ${theme.colors.warmCream}; font-size: 0.875rem; &:focus { border-color: ${theme.colors.borderFocus}; outline: none; }`;

  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader title="Formula Builder" subtitle={`Formula ${params.id}`} />

        <div className={css`display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; @media (max-width: 900px) { grid-template-columns: 1fr; }`}>
          <div className={css`display: flex; flex-direction: column; gap: 1.5rem;`}>

            {/* Formula name */}
            <Card>
              <label className={label}>Formula Name</label>
              <Input placeholder="e.g. Sarah — Level 8 Balayage + Toner" value={formulaName} onChange={(e) => setFormulaName(e.target.value)} />
            </Card>

            {/* Hair profile */}
            <Card>
              <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Hair Profile</h3>
              <div className={css`display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1rem;`}>
                <div>
                  <label className={label}>Start Level</label>
                  <Input type="number" min={1} max={10} value={startLevel} onChange={(e) => setStartLevel(Number(e.target.value))} />
                </div>
                <div>
                  <label className={label}>Target Level</label>
                  <Input type="number" min={1} max={10} value={targetLevel} onChange={(e) => setTargetLevel(Number(e.target.value))} />
                </div>
                <div>
                  <label className={label}>Gray %</label>
                  <Input type="number" min={0} max={100} value={grayPct} onChange={(e) => setGrayPct(Number(e.target.value))} />
                </div>
                <div>
                  <label className={label}>Porosity</label>
                  <select className={select} value={porosity} onChange={(e) => setPorosity(e.target.value as typeof porosity)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className={label}>Texture</label>
                  <select className={select} value={texture} onChange={(e) => setTexture(e.target.value as typeof texture)}>
                    <option value="fine">Fine</option>
                    <option value="medium">Medium</option>
                    <option value="coarse">Coarse</option>
                  </select>
                </div>
              </div>

              {/* Color math results */}
              <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;`}>
                <div className={css`padding: 0.75rem; background: ${theme.colors.obsidian}; border-radius: ${theme.radii.md};`}>
                  <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.7rem; margin-bottom: 0.25rem;`}>LEVELS OF LIFT</p>
                  <p className={css`color: ${theme.colors.warmCream}; font-size: 1.25rem; font-weight: 700;`}>{liftResult.levelsOfLift}</p>
                </div>
                <div className={css`padding: 0.75rem; background: ${theme.colors.obsidian}; border-radius: ${theme.radii.md};`}>
                  <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.7rem; margin-bottom: 0.25rem;`}>DEVELOPER</p>
                  <p className={css`color: ${theme.colors.warmCream}; font-size: 1.25rem; font-weight: 700;`}>{liftResult.requiredDeveloperVolume}V</p>
                </div>
                <div className={css`padding: 0.75rem; background: ${theme.colors.obsidian}; border-radius: ${theme.radii.md};`}>
                  <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.7rem; margin-bottom: 0.25rem;`}>PROCESSING TIME</p>
                  <p className={css`color: ${theme.colors.warmCream}; font-size: 1.25rem; font-weight: 700;`}>{timingResult.adjustedTimeMinutes} min</p>
                </div>
                <div className={css`padding: 0.75rem; background: ${theme.colors.obsidian}; border-radius: ${theme.radii.md}; display: flex; align-items: center; gap: 0.5rem;`}>
                  <div className={css`width: 20px; height: 20px; border-radius: 50%; background: ${liftResult.exposedPigment.hexColor}; flex-shrink: 0;`} />
                  <div>
                    <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.7rem;`}>EXPOSED PIGMENT</p>
                    <p className={css`color: ${theme.colors.warmCream}; font-size: 0.8rem; font-weight: 600;`}>{liftResult.exposedPigment.pigmentName}</p>
                  </div>
                </div>
              </div>

              {liftResult.warnings.length > 0 && (
                <div className={css`margin-top: 0.75rem; padding: 0.75rem; background: ${theme.colors.warning}15; border: 1px solid ${theme.colors.warning}40; border-radius: ${theme.radii.md};`}>
                  {liftResult.warnings.map((w, i) => (
                    <p key={i} className={css`color: ${theme.colors.warning}; font-size: 0.8rem; margin-bottom: ${i < liftResult.warnings.length - 1 ? '0.375rem' : '0'};`}>⚠ {w}</p>
                  ))}
                </div>
              )}

              {grayResult && grayResult.needsSpecialFormulation && (
                <div className={css`margin-top: 0.75rem; padding: 0.75rem; background: #4A9EFF15; border: 1px solid #4A9EFF40; border-radius: ${theme.radii.md};`}>
                  <p className={css`color: #4A9EFF; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.25rem;`}>Gray Coverage Adjustment</p>
                  <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem;`}>Add {grayResult.recommendedBaseRatio}% natural base shade. Extra processing: +{grayResult.processingTimeBoost} min.</p>
                  {grayResult.warnings.map((w, i) => (
                    <p key={i} className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem; margin-top: 0.25rem;`}>• {w}</p>
                  ))}
                </div>
              )}
            </Card>

            {/* Brand selection */}
            <Card>
              <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Brand</h3>
              <div>
                <label className={label}>Select Brand</label>
                <select className={select} value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                  <option value="">Choose a brand...</option>
                  {carriedBrands.map((b) => (
                    <option key={b.slug} value={b.slug}>{b.name}</option>
                  ))}
                </select>
              </div>
            </Card>

            {/* Formula zones */}
            <Card>
              <div className={css`display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;`}>
                <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream};`}>Formula Zones</h3>
                <Button onClick={addZone}>+ Add Zone</Button>
              </div>

              {zones.length === 0 && (
                <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>No zones yet. Add a zone to start building your formula.</p>
              )}

              <div className={css`display: flex; flex-direction: column; gap: 1rem;`}>
                {zones.map((zone, idx) => (
                  <div key={zone.id} className={css`padding: 1rem; background: ${theme.colors.obsidian}; border-radius: ${theme.radii.md}; border: 1px solid ${theme.colors.borderDefault};`}>
                    <div className={css`display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;`}>
                      <Input
                        value={zone.name}
                        onChange={(e) => updateZone(zone.id, { name: e.target.value })}
                        className={css`font-weight: 600; background: transparent; border: none; padding: 0; font-size: 0.9rem;`}
                      />
                      <button onClick={() => removeZone(zone.id)} className={css`background: none; border: none; color: ${theme.colors.textMuted}; cursor: pointer; font-size: 0.875rem; &:hover { color: #FF4444; }`}>Remove</button>
                    </div>
                    <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;`}>
                      <div>
                        <label className={label}>Zone Type</label>
                        <select className={select} value={zone.zoneType} onChange={(e) => updateZone(zone.id, { zoneType: e.target.value })}>
                          {ZONE_TYPES.map((z) => <option key={z} value={z}>{z.replace('_', ' ')}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={label}>Product Line</label>
                        <select className={select} value={zone.lineSlug} onChange={(e) => updateZone(zone.id, { lineSlug: e.target.value })}>
                          <option value="">Select line...</option>
                          {brand?.lines.map((l) => <option key={l.slug} value={l.slug}>{l.name}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={label}>Shade / Formula</label>
                        <Input placeholder="e.g. 7/0, 8N, 6WB" value={zone.shade} onChange={(e) => updateZone(zone.id, { shade: e.target.value })} />
                      </div>
                      <div>
                        <label className={label}>Developer Volume</label>
                        <select className={select} value={zone.developerVolume} onChange={(e) => updateZone(zone.id, { developerVolume: Number(e.target.value) })}>
                          {[5, 10, 15, 20, 30, 40].map((v) => <option key={v} value={v}>{v}V</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={label}>Mixing Ratio</label>
                        <select className={select} value={zone.mixingRatio} onChange={(e) => updateZone(zone.id, { mixingRatio: e.target.value })}>
                          <option value="1:1">1:1</option>
                          <option value="1:1.5">1:1.5</option>
                          <option value="1:2">1:2</option>
                          <option value="2:1">2:1</option>
                        </select>
                      </div>
                      <div>
                        <label className={label}>Amount (grams)</label>
                        <Input type="number" min={5} value={zone.amountGrams} onChange={(e) => updateZone(zone.id, { amountGrams: Number(e.target.value) })} />
                      </div>
                      <div>
                        <label className={label}>Processing Time (min)</label>
                        <Input type="number" min={5} value={zone.processingTime} onChange={(e) => updateZone(zone.id, { processingTime: Number(e.target.value) })} />
                      </div>
                    </div>
                    <div className={css`margin-top: 0.75rem;`}>
                      <label className={label}>Zone Notes</label>
                      <Input placeholder="Application notes for this zone..." value={zone.notes} onChange={(e) => updateZone(zone.id, { notes: e.target.value })} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Summary sidebar */}
          <div className={css`display: flex; flex-direction: column; gap: 1rem;`}>
            <Card>
              <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Formula Summary</h3>
              {zones.length === 0 ? (
                <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>Add zones to see the formula summary.</p>
              ) : (
                <div className={css`display: flex; flex-direction: column; gap: 0.75rem;`}>
                  {zones.map((z) => (
                    <div key={z.id} className={css`padding: 0.75rem; background: ${theme.colors.obsidian}; border-radius: ${theme.radii.md};`}>
                      <p className={css`color: ${theme.colors.warmCream}; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.25rem;`}>{z.name}</p>
                      <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem;`}>{z.shade || 'No shade'} · {z.developerVolume}V · {z.mixingRatio} · {z.amountGrams}g</p>
                      <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem;`}>{z.processingTime} min</p>
                    </div>
                  ))}
                  <div className={css`padding: 0.75rem; background: ${theme.colors.obsidianMid}; border-radius: ${theme.radii.md}; border-top: 1px solid ${theme.colors.borderDefault};`}>
                    <div className={css`display: flex; justify-content: space-between;`}>
                      <span className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem;`}>Total Product</span>
                      <span className={css`color: ${theme.colors.warmCream}; font-weight: 600;`}>{totalGrams}g</span>
                    </div>
                    <div className={css`display: flex; justify-content: space-between; margin-top: 0.25rem;`}>
                      <span className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem;`}>Max Processing</span>
                      <span className={css`color: ${theme.colors.warmCream}; font-weight: 600;`}>{Math.max(...zones.map((z) => z.processingTime))} min</span>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <Card>
              <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 0.75rem;`}>Check Intervals</h3>
              <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem;`}>
                Check every <strong className={css`color: ${theme.colors.roseGold};`}>{timingResult.checkIntervalMinutes} min</strong> based on {porosity} porosity.
              </p>
              {timingResult.warnings.map((w, i) => (
                <p key={i} className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem; margin-top: 0.5rem;`}>• {w}</p>
              ))}
            </Card>

            <div className={css`display: flex; flex-direction: column; gap: 0.75rem;`}>
              <Button disabled={saving || zones.length === 0 || !formulaName.trim()} onClick={() => handleSave(false)}>
                {saving ? 'Saving…' : 'Save Formula'}
              </Button>
              <Button variant="secondary" disabled={saving || zones.length === 0 || !formulaName.trim()} onClick={() => handleSave(true)}>
                Save as Template
              </Button>
              {saveError && <p className={css`color: ${theme.colors.error}; font-size: 0.78rem; margin: 0;`}>{saveError}</p>}
            </div>
          </div>
        </div>

        {/* Head Map — full width below the two-column layout */}
        <div className={css`margin-top: 1.5rem;`}>
          <HeadMap
            value={headMapPlacements}
            onChange={setHeadMapPlacements}
            zoneLabels={zones.map((z) => z.name)}
            showBranding
          />
        </div>
      </MainContent>
    </>
  );
}
