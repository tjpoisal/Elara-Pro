'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Button, Input, Badge } from '@/components/Navigation';
import { calculateLift, type HairLevel } from '@/lib/chemistry';
import { TECHNIQUES, type SkillLevel } from '@/lib/techniques/data';
import { ServiceReminders, CriticalReminders } from '@/components/ServiceReminders';

type ConsultStep = 'service' | 'client-hair' | 'photos' | 'patch-test' | 'consent' | 'color-plan' | 'techniques' | 'summary';
type ServiceType = 'cut' | 'color' | 'highlights' | 'balayage' | 'chemical' | 'color+cut' | 'highlights+cut';

interface ConsultData {
  serviceType: ServiceType | null;
  // Hair assessment
  currentLevel: number;
  targetLevel: number;
  grayPercentage: number;
  porosity: 'low' | 'medium' | 'high';
  texture: 'fine' | 'medium' | 'coarse';
  hairLength: 'short' | 'medium' | 'long' | 'extra_long';
  hairDensity: 'thin' | 'medium' | 'thick';
  scalpCondition: string;
  hairCondition: string;
  previousChemicals: string[];
  desiredResult: string;
  rawNotes: string;
  // Photos
  beforePhotos: string[];
  afterPhotos: string[];
  // Patch test
  patchTestDate: string;
  patchTestResult: string;
  patchTestProducts: string;
  // Consent
  consentSigned: boolean;
  consentSignature: string;
  // Color plan
  techniqueId: string | null;
  colorPlacementNotes: string;
  stylistSkillLevel: SkillLevel;
}

const STEPS: { id: ConsultStep; label: string }[] = [
  { id: 'service', label: 'Service' },
  { id: 'client-hair', label: 'Hair Assessment' },
  { id: 'photos', label: 'Photos' },
  { id: 'patch-test', label: 'Patch Test' },
  { id: 'consent', label: 'Consent' },
  { id: 'color-plan', label: 'Color Plan' },
  { id: 'techniques', label: 'Techniques' },
  { id: 'summary', label: 'Summary' },
];

const SERVICE_TYPES: { id: ServiceType; label: string; icon: string; desc: string }[] = [
  { id: 'cut', label: 'Haircut', icon: '✂️', desc: 'Cut only — no color' },
  { id: 'color', label: 'Color', icon: '🎨', desc: 'Single process, grey coverage, color change' },
  { id: 'highlights', label: 'Highlights', icon: '✨', desc: 'Foil highlights or lowlights' },
  { id: 'balayage', label: 'Balayage', icon: '🖌️', desc: 'Freehand painting, foilyage, money piece' },
  { id: 'chemical', label: 'Chemical', icon: '⚗️', desc: 'Keratin, relaxer, perm, bond treatment' },
  { id: 'color+cut', label: 'Color + Cut', icon: '🎨✂️', desc: 'Full color service with haircut' },
  { id: 'highlights+cut', label: 'Highlights + Cut', icon: '✨✂️', desc: 'Highlights or balayage with haircut' },
];

export default function ConsultationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<ConsultStep>('service');
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [parsedData, setParsedData] = useState<Record<string, unknown> | null>(null);
  const [cameraActive, setCameraActive] = useState<'before' | 'after' | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [data, setData] = useState<ConsultData>({
    serviceType: null,
    currentLevel: 5,
    targetLevel: 7,
    grayPercentage: 0,
    porosity: 'medium',
    texture: 'medium',
    hairLength: 'medium',
    hairDensity: 'medium',
    scalpCondition: 'normal',
    hairCondition: 'good',
    previousChemicals: [],
    desiredResult: '',
    rawNotes: '',
    beforePhotos: [],
    afterPhotos: [],
    patchTestDate: '',
    patchTestResult: '',
    patchTestProducts: '',
    consentSigned: false,
    consentSignature: '',
    techniqueId: null,
    colorPlacementNotes: '',
    stylistSkillLevel: 'intermediate',
  });

  const update = (patch: Partial<ConsultData>) => setData((d) => ({ ...d, ...patch }));

  const handleSaveConsultation = async (draftOnly = false) => {
    setIsSaving(true);
    setSaveError('');
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawNotes: data.rawNotes || undefined,
          currentLevel: data.currentLevel || undefined,
          targetLevel: data.targetLevel || undefined,
          grayPercentage: data.grayPercentage || undefined,
          porosityLevel: data.porosity,
          hairCondition: data.hairCondition,
          scalpCondition: data.scalpCondition,
          previousChemical: data.previousChemicals.join(', ') || undefined,
          desiredResult: data.desiredResult || undefined,
        }),
      });
      const d = await res.json();
      if (!res.ok) { setSaveError(d.error ?? 'Failed to save.'); return; }
      const consultId = d.consultation?.id;
      if (!draftOnly && consultId) {
        router.push(`/formulate/new?consultId=${consultId}`);
      }
    } catch {
      setSaveError('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const liftResult = data.currentLevel && data.targetLevel
    ? calculateLift(data.currentLevel as HairLevel, data.targetLevel as HairLevel)
    : null;

  const stepIdx = STEPS.findIndex((s) => s.id === currentStep);
  const isColorService = data.serviceType && ['color', 'highlights', 'balayage', 'color+cut', 'highlights+cut'].includes(data.serviceType);

  const handleParseNotes = async () => {
    if (!data.rawNotes) return;
    setIsParsing(true);
    try {
      const res = await fetch('/api/ai?action=parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawNotes: data.rawNotes }),
      });
      const result = await res.json();
      setParsedData(result);
      if (result.parsed) {
        const p = result.parsed;
        update({
          currentLevel: p.currentLevel ?? data.currentLevel,
          targetLevel: p.targetLevel ?? data.targetLevel,
          grayPercentage: p.grayPercentage ?? data.grayPercentage,
          porosity: p.porosityLevel ?? data.porosity,
          hairCondition: p.hairCondition ?? data.hairCondition,
          desiredResult: p.desiredResult ?? data.desiredResult,
          previousChemicals: p.previousChemicals ?? data.previousChemicals,
        });
      }
    } catch {
      // handle error
    } finally {
      setIsParsing(false);
    }
  };

  const startCamera = async (type: 'before' | 'after') => {
    setCameraActive(type);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch {
      alert('Camera access denied or unavailable.');
      setCameraActive(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !cameraActive) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvasRef.current.toDataURL('image/jpeg', 0.85);
    if (cameraActive === 'before') {
      update({ beforePhotos: [...data.beforePhotos, dataUrl] });
    } else {
      update({ afterPhotos: [...data.afterPhotos, dataUrl] });
    }
    stopCamera();
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(null);
  };

  const relevantTechniques = TECHNIQUES.filter((t) => {
    if (!data.serviceType) return false;
    if (data.serviceType === 'highlights' || data.serviceType === 'highlights+cut') return t.category === 'highlights' || t.category === 'balayage';
    if (data.serviceType === 'balayage') return t.category === 'balayage';
    if (data.serviceType === 'color' || data.serviceType === 'color+cut') return t.category === 'color' || t.category === 'toning';
    if (data.serviceType === 'chemical') return t.category === 'chemical';
    if (data.serviceType === 'cut') return t.category === 'cut';
    return false;
  });

  const selectedTechnique = TECHNIQUES.find((t) => t.id === data.techniqueId);

  const skillColors: Record<SkillLevel, string> = {
    beginner: theme.colors.success,
    intermediate: '#4A9EFF',
    advanced: theme.colors.warning,
    master: theme.colors.roseGold,
  };

  const label = css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.375rem;`;
  const select = css`width: 100%; padding: 0.625rem 0.75rem; background: ${theme.colors.obsidian}; border: 1px solid ${theme.colors.borderDefault}; border-radius: ${theme.radii.md}; color: ${theme.colors.warmCream}; font-size: 0.875rem; &:focus { border-color: ${theme.colors.borderFocus}; outline: none; }`;

  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader title="New Consultation" subtitle={`Consultation ${params.id}`} />

        {/* Step progress */}
        <div className={css`display: flex; gap: 0.25rem; margin-bottom: 2rem; overflow-x: auto; padding-bottom: 0.25rem;`}>
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrentStep(s.id)}
              className={css`
                flex-shrink: 0; padding: 0.375rem 0.75rem; border-radius: 999px; font-size: 0.75rem; cursor: pointer;
                border: 1px solid ${s.id === currentStep ? theme.colors.roseGold : theme.colors.borderDefault};
                background: ${s.id === currentStep ? `${theme.colors.roseGold}20` : 'transparent'};
                color: ${s.id === currentStep ? theme.colors.roseGold : i < stepIdx ? theme.colors.success : theme.colors.textMuted};
              `}
            >
              {i < stepIdx ? '✓ ' : ''}{s.label}
            </button>
          ))}
        </div>

        {/* STEP: Service Selection */}
        {currentStep === 'service' && (
          <div>
            <h3 className={css`color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>What service is the client here for?</h3>
            <div className={css`display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem;`}>
              {SERVICE_TYPES.map((s) => (
                <div
                  key={s.id}
                  onClick={() => update({ serviceType: s.id })}
                  className={css`
                    padding: 1.25rem; border-radius: ${theme.radii.md}; cursor: pointer;
                    border: 2px solid ${data.serviceType === s.id ? theme.colors.roseGold : theme.colors.borderDefault};
                    background: ${data.serviceType === s.id ? `${theme.colors.roseGold}10` : theme.colors.obsidianMid};
                    transition: all 0.15s;
                    &:hover { border-color: ${theme.colors.roseGold}; }
                  `}
                >
                  <div className={css`font-size: 1.5rem; margin-bottom: 0.5rem;`}>{s.icon}</div>
                  <div className={css`color: ${theme.colors.warmCream}; font-weight: 600; margin-bottom: 0.25rem;`}>{s.label}</div>
                  <div className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem;`}>{s.desc}</div>
                </div>
              ))}
            </div>
            <div className={css`margin-bottom: 1.5rem;`}>
              <label className={label}>Stylist notes (optional — AI will parse these)</label>
              <textarea
                value={data.rawNotes}
                onChange={(e) => update({ rawNotes: e.target.value })}
                placeholder="e.g. 'Client wants to go from level 5 brown to level 8 blonde, 30% gray, medium porosity, last colored 6 months ago'"
                className={css`width: 100%; min-height: 100px; padding: 0.75rem; background: ${theme.colors.obsidian}; border: 1px solid ${theme.colors.borderDefault}; border-radius: ${theme.radii.md}; color: ${theme.colors.warmCream}; font-size: 0.875rem; resize: vertical; &:focus { border-color: ${theme.colors.borderFocus}; outline: none; }`}
              />
              {data.rawNotes && (
                <Button onClick={handleParseNotes} disabled={isParsing} variant="secondary">
                  {isParsing ? 'Parsing...' : 'Parse with AI'}
                </Button>
              )}
            </div>
            {/* Critical reminders appear as soon as a service type is selected */}
            {data.serviceType && (
              <div className={css`margin-bottom: 1.5rem;`}>
                <CriticalReminders serviceType={data.serviceType} />
              </div>
            )}
            <Button onClick={() => setCurrentStep('client-hair')} disabled={!data.serviceType}>
              Continue to Hair Assessment
            </Button>
          </div>
        )}

        {/* STEP: Hair Assessment */}
        {currentStep === 'client-hair' && (
          <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; @media (max-width: 768px) { grid-template-columns: 1fr; }`}>
            <div>
              <Card>
                <h3 className={css`color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Hair Profile</h3>
                {isColorService && (
                  <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;`}>
                    <div>
                      <label className={label}>Current Level (1-10)</label>
                      <Input type="number" min={1} max={10} value={data.currentLevel} onChange={(e) => update({ currentLevel: Number(e.target.value) })} />
                    </div>
                    <div>
                      <label className={label}>Target Level (1-10)</label>
                      <Input type="number" min={1} max={10} value={data.targetLevel} onChange={(e) => update({ targetLevel: Number(e.target.value) })} />
                    </div>
                    <div>
                      <label className={label}>Gray %</label>
                      <Input type="number" min={0} max={100} value={data.grayPercentage} onChange={(e) => update({ grayPercentage: Number(e.target.value) })} />
                    </div>
                    <div>
                      <label className={label}>Porosity</label>
                      <select className={select} value={data.porosity} onChange={(e) => update({ porosity: e.target.value as typeof data.porosity })}>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                )}
                <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;`}>
                  <div>
                    <label className={label}>Hair Texture</label>
                    <select className={select} value={data.texture} onChange={(e) => update({ texture: e.target.value as typeof data.texture })}>
                      <option value="fine">Fine</option>
                      <option value="medium">Medium</option>
                      <option value="coarse">Coarse</option>
                    </select>
                  </div>
                  <div>
                    <label className={label}>Hair Length</label>
                    <select className={select} value={data.hairLength} onChange={(e) => update({ hairLength: e.target.value as typeof data.hairLength })}>
                      <option value="short">Short (above chin)</option>
                      <option value="medium">Medium (chin to shoulder)</option>
                      <option value="long">Long (shoulder to mid-back)</option>
                      <option value="extra_long">Extra Long (below mid-back)</option>
                    </select>
                  </div>
                  <div>
                    <label className={label}>Hair Density</label>
                    <select className={select} value={data.hairDensity} onChange={(e) => update({ hairDensity: e.target.value as typeof data.hairDensity })}>
                      <option value="thin">Thin</option>
                      <option value="medium">Medium</option>
                      <option value="thick">Thick</option>
                    </select>
                  </div>
                  <div>
                    <label className={label}>Hair Condition</label>
                    <select className={select} value={data.hairCondition} onChange={(e) => update({ hairCondition: e.target.value })}>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                      <option value="damaged">Damaged</option>
                    </select>
                  </div>
                  <div>
                    <label className={label}>Scalp Condition</label>
                    <select className={select} value={data.scalpCondition} onChange={(e) => update({ scalpCondition: e.target.value })}>
                      <option value="normal">Normal</option>
                      <option value="dry">Dry</option>
                      <option value="oily">Oily</option>
                      <option value="sensitive">Sensitive</option>
                      <option value="irritated">Irritated</option>
                    </select>
                  </div>
                </div>
                <div className={css`margin-bottom: 1rem;`}>
                  <label className={label}>Previous Chemical Services</label>
                  <div className={css`display: flex; flex-wrap: wrap; gap: 0.5rem;`}>
                    {['relaxer', 'keratin', 'perm', 'color', 'lightener', 'henna', 'metallic_dye'].map((chem) => {
                      const active = data.previousChemicals.includes(chem);
                      return (
                        <button
                          key={chem}
                          onClick={() => update({ previousChemicals: active ? data.previousChemicals.filter((c) => c !== chem) : [...data.previousChemicals, chem] })}
                          className={css`padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; cursor: pointer; border: 1px solid ${active ? theme.colors.warning : theme.colors.borderDefault}; background: ${active ? `${theme.colors.warning}20` : 'transparent'}; color: ${active ? theme.colors.warning : theme.colors.textMuted};`}
                        >
                          {chem.replace('_', ' ')}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className={label}>Desired Result</label>
                  <textarea
                    value={data.desiredResult}
                    onChange={(e) => update({ desiredResult: e.target.value })}
                    placeholder="Describe what the client wants to achieve..."
                    className={css`width: 100%; min-height: 80px; padding: 0.75rem; background: ${theme.colors.obsidian}; border: 1px solid ${theme.colors.borderDefault}; border-radius: ${theme.radii.md}; color: ${theme.colors.warmCream}; font-size: 0.875rem; resize: vertical; &:focus { border-color: ${theme.colors.borderFocus}; outline: none; }`}
                  />
                </div>
              </Card>
            </div>

            {/* Color math preview */}
            {isColorService && liftResult && (
              <div>
                <Card>
                  <h3 className={css`color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Color Math Preview</h3>
                  <div className={css`display: flex; flex-direction: column; gap: 0.75rem;`}>
                    <div className={css`display: flex; justify-content: space-between;`}>
                      <span className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem;`}>Levels of Lift</span>
                      <span className={css`color: ${theme.colors.warmCream}; font-weight: 600;`}>{liftResult.levelsOfLift}</span>
                    </div>
                    <div className={css`display: flex; justify-content: space-between;`}>
                      <span className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem;`}>Developer</span>
                      <span className={css`color: ${theme.colors.warmCream}; font-weight: 600;`}>{liftResult.requiredDeveloperVolume}V</span>
                    </div>
                    <div className={css`display: flex; justify-content: space-between; align-items: center;`}>
                      <span className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem;`}>Exposed Pigment</span>
                      <div className={css`display: flex; align-items: center; gap: 0.5rem;`}>
                        <div className={css`width: 14px; height: 14px; border-radius: 50%; background: ${liftResult.exposedPigment.hexColor};`} />
                        <span className={css`color: ${theme.colors.warmCream}; font-size: 0.875rem;`}>{liftResult.exposedPigment.pigmentName}</span>
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
                    <div className={css`margin-top: 1rem; padding: 0.75rem; background: ${theme.colors.warning}15; border: 1px solid ${theme.colors.warning}40; border-radius: ${theme.radii.md};`}>
                      {liftResult.warnings.map((w, i) => (
                        <p key={i} className={css`color: ${theme.colors.warning}; font-size: 0.8rem; margin-bottom: ${i < liftResult.warnings.length - 1 ? '0.5rem' : '0'};`}>{w}</p>
                      ))}
                    </div>
                  )}
                  {data.previousChemicals.length > 0 && (
                    <div className={css`margin-top: 1rem; padding: 0.75rem; background: ${theme.colors.warning}10; border: 1px solid ${theme.colors.warning}30; border-radius: ${theme.radii.md};`}>
                      <p className={css`color: ${theme.colors.warning}; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.25rem;`}>⚠ Previous Chemical History</p>
                      <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem;`}>{data.previousChemicals.join(', ')} — verify compatibility before proceeding</p>
                    </div>
                  )}
                </Card>
                {parsedData && (
                  <div className={css`margin-top: 1rem;`}>
                    <Card>
                      <h3 className={css`color: ${theme.colors.warmCream}; margin-bottom: 0.75rem;`}>AI Confidence</h3>
                      <div className={css`display: flex; align-items: center; gap: 0.75rem;`}>
                        <div className={css`flex: 1; height: 6px; background: ${theme.colors.obsidian}; border-radius: 3px; overflow: hidden;`}>
                          <div className={css`height: 100%; background: ${theme.colors.success}; width: ${Math.round(((parsedData as { confidence?: { overallConfidence?: number } }).confidence?.overallConfidence ?? 0) * 100)}%;`} />
                        </div>
                        <span className={css`color: ${theme.colors.success}; font-size: 0.875rem; font-weight: 600;`}>
                          {Math.round(((parsedData as { confidence?: { overallConfidence?: number } }).confidence?.overallConfidence ?? 0) * 100)}%
                        </span>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Navigation buttons for hair assessment step */}
        {currentStep === 'client-hair' && (
          <div className={css`display: flex; gap: 0.75rem; margin-top: 1.5rem;`}>
            <Button variant="secondary" onClick={() => setCurrentStep('service')}>Back</Button>
            <Button onClick={() => setCurrentStep('photos')}>Continue to Photos</Button>
          </div>
        )}

        {/* STEP: Photos */}
        {currentStep === 'photos' && (
          <div>
            <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; @media (max-width: 768px) { grid-template-columns: 1fr; }`}>
              {(['before', 'after'] as const).map((type) => {
                const photos = type === 'before' ? data.beforePhotos : data.afterPhotos;
                return (
                  <Card key={type}>
                    <h3 className={css`color: ${theme.colors.warmCream}; margin-bottom: 1rem; text-transform: capitalize;`}>{type} Photos</h3>
                    <div className={css`display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; margin-bottom: 1rem;`}>
                      {photos.map((photo, i) => (
                        <div key={i} className={css`position: relative; aspect-ratio: 1; border-radius: ${theme.radii.md}; overflow: hidden;`}>
                          <img src={photo} alt={`${type} ${i + 1}`} className={css`width: 100%; height: 100%; object-fit: cover;`} />
                          <button
                            onClick={() => {
                              const next = photos.filter((_, idx) => idx !== i);
                              update(type === 'before' ? { beforePhotos: next } : { afterPhotos: next });
                            }}
                            className={css`position: absolute; top: 4px; right: 4px; background: rgba(0,0,0,0.7); border: none; color: white; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-size: 10px; display: flex; align-items: center; justify-content: center;`}
                          >✕</button>
                        </div>
                      ))}
                      {photos.length === 0 && (
                        <div className={css`grid-column: 1/-1; padding: 2rem; text-align: center; color: ${theme.colors.textMuted}; font-size: 0.875rem; border: 1px dashed ${theme.colors.borderDefault}; border-radius: ${theme.radii.md};`}>
                          No {type} photos yet
                        </div>
                      )}
                    </div>
                    <div className={css`display: flex; gap: 0.5rem;`}>
                      <Button onClick={() => startCamera(type)}>📷 Take Photo</Button>
                      <label className={css`cursor: pointer;`}>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className={css`display: none;`}
                          onChange={(e) => {
                            const files = Array.from(e.target.files ?? []);
                            files.forEach((file) => {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                const url = ev.target?.result as string;
                                if (type === 'before') update({ beforePhotos: [...data.beforePhotos, url] });
                                else update({ afterPhotos: [...data.afterPhotos, url] });
                              };
                              reader.readAsDataURL(file);
                            });
                          }}
                        />
                        <span className={css`display: inline-flex; align-items: center; padding: 0.5rem 1rem; border: 1px solid ${theme.colors.borderDefault}; border-radius: ${theme.radii.md}; color: ${theme.colors.textSecondary}; font-size: 0.875rem; &:hover { border-color: ${theme.colors.roseGold}; color: ${theme.colors.roseGold}; }`}>
                          📁 Upload
                        </span>
                      </label>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Camera modal */}
            {cameraActive && (
              <div className={css`position: fixed; inset: 0; background: rgba(0,0,0,0.9); z-index: 100; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem;`}>
                <p className={css`color: white; font-size: 0.875rem; text-transform: capitalize;`}>Taking {cameraActive} photo</p>
                <video ref={videoRef} className={css`max-width: 90vw; max-height: 60vh; border-radius: 8px;`} playsInline />
                <canvas ref={canvasRef} className={css`display: none;`} />
                <div className={css`display: flex; gap: 1rem;`}>
                  <Button onClick={capturePhoto}>📸 Capture</Button>
                  <Button variant="secondary" onClick={stopCamera}>Cancel</Button>
                </div>
              </div>
            )}

            <div className={css`display: flex; gap: 0.75rem; margin-top: 1.5rem;`}>
              <Button variant="secondary" onClick={() => setCurrentStep('client-hair')}>Back</Button>
              <Button onClick={() => setCurrentStep('patch-test')}>Continue to Patch Test</Button>
            </div>
          </div>
        )}

        {/* STEP: Patch Test */}
        {currentStep === 'patch-test' && (
          <div className={css`max-width: 600px;`}>
            <Card>
              <h3 className={css`color: ${theme.colors.warmCream}; margin-bottom: 0.5rem;`}>Patch Test Record</h3>
              <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem; margin-bottom: 1.5rem;`}>
                A patch test must be performed 48 hours before any color or chemical service. This record protects you legally.
              </p>
              <div className={css`display: flex; flex-direction: column; gap: 1rem;`}>
                <div>
                  <label className={label}>Products Tested</label>
                  <Input
                    placeholder="e.g. Wella Koleston Perfect 7/0, 20V developer"
                    value={data.patchTestProducts}
                    onChange={(e) => update({ patchTestProducts: e.target.value })}
                  />
                </div>
                <div>
                  <label className={label}>Date & Time Applied</label>
                  <Input
                    type="datetime-local"
                    value={data.patchTestDate}
                    onChange={(e) => update({ patchTestDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className={label}>Result (checked at 48 hours)</label>
                  <select className={select} value={data.patchTestResult} onChange={(e) => update({ patchTestResult: e.target.value })}>
                    <option value="">Select result...</option>
                    <option value="negative">Negative — no reaction</option>
                    <option value="mild_reaction">Mild reaction — redness</option>
                    <option value="moderate_reaction">Moderate reaction — swelling/itching</option>
                    <option value="severe_reaction">Severe reaction — DO NOT PROCEED</option>
                    <option value="not_performed">Not performed — client declined</option>
                  </select>
                </div>
                {data.patchTestResult === 'not_performed' && (
                  <div className={css`padding: 0.75rem; background: ${theme.colors.warning}15; border: 1px solid ${theme.colors.warning}40; border-radius: ${theme.radii.md};`}>
                    <p className={css`color: ${theme.colors.warning}; font-size: 0.875rem;`}>⚠ Client declined patch test. A signed waiver is required before proceeding. This will be noted in the consent form.</p>
                  </div>
                )}
                {(data.patchTestResult === 'mild_reaction' || data.patchTestResult === 'moderate_reaction' || data.patchTestResult === 'severe_reaction') && (
                  <div className={css`padding: 0.75rem; background: #FF444415; border: 1px solid #FF444440; border-radius: ${theme.radii.md};`}>
                    <p className={css`color: #FF4444; font-size: 0.875rem; font-weight: 600;`}>🚫 Reaction detected — do not proceed with this product.</p>
                    <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; margin-top: 0.25rem;`}>Document the reaction and advise the client to consult a dermatologist if needed.</p>
                  </div>
                )}
                {data.patchTestResult === 'negative' && (
                  <div className={css`padding: 0.75rem; background: ${theme.colors.success}15; border: 1px solid ${theme.colors.success}40; border-radius: ${theme.radii.md};`}>
                    <p className={css`color: ${theme.colors.success}; font-size: 0.875rem;`}>✓ Patch test negative — safe to proceed.</p>
                  </div>
                )}
              </div>
            </Card>
            <div className={css`display: flex; gap: 0.75rem; margin-top: 1.5rem;`}>
              <Button variant="secondary" onClick={() => setCurrentStep('photos')}>Back</Button>
              <Button onClick={() => setCurrentStep('consent')}>Continue to Consent</Button>
            </div>
          </div>
        )}

        {/* STEP: Consent Form */}
        {currentStep === 'consent' && (
          <div className={css`max-width: 600px;`}>
            <Card>
              <h3 className={css`color: ${theme.colors.warmCream}; margin-bottom: 0.5rem;`}>Client Authorization & Consent</h3>
              <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem; margin-bottom: 1.5rem;`}>
                This form protects you legally. The client acknowledges the service details, risks, and patch test results.
              </p>
              <div className={css`padding: 1rem; background: ${theme.colors.obsidian}; border-radius: ${theme.radii.md}; margin-bottom: 1.5rem; font-size: 0.8rem; color: ${theme.colors.textSecondary}; line-height: 1.6;`}>
                <p className={css`font-weight: 600; color: ${theme.colors.warmCream}; margin-bottom: 0.75rem;`}>CLIENT AUTHORIZATION FORM</p>
                <p>I, the undersigned, authorize the stylist to perform the following service: <strong className={css`color: ${theme.colors.warmCream};`}>{data.serviceType?.replace('+', ' and ') ?? 'hair service'}</strong>.</p>
                <br />
                <p>I confirm that:</p>
                <ul className={css`margin: 0.5rem 0 0.5rem 1.25rem;`}>
                  <li>I have disclosed all previous chemical services and known allergies.</li>
                  <li>A patch test {data.patchTestResult === 'negative' ? 'was performed and showed no reaction' : data.patchTestResult === 'not_performed' ? 'was not performed at my request — I accept full responsibility' : 'was performed'}.</li>
                  <li>I understand that hair color results may vary based on my hair history and condition.</li>
                  <li>I understand that chemical services carry inherent risks including but not limited to breakage, scalp sensitivity, and color variation.</li>
                  <li>I release the salon and stylist from liability for results that differ from expectations due to undisclosed hair history.</li>
                </ul>
                <br />
                <p>Previous chemicals disclosed: {data.previousChemicals.length > 0 ? data.previousChemicals.join(', ') : 'None'}</p>
                <p>Desired result: {data.desiredResult || 'As discussed'}</p>
              </div>
              <div>
                <label className={label}>Client Signature (type full name to sign)</label>
                <Input
                  placeholder="Client full name"
                  value={data.consentSignature}
                  onChange={(e) => update({ consentSignature: e.target.value, consentSigned: e.target.value.length > 2 })}
                />
                {data.consentSigned && (
                  <p className={css`color: ${theme.colors.success}; font-size: 0.75rem; margin-top: 0.5rem;`}>
                    ✓ Signed by {data.consentSignature} on {new Date().toLocaleDateString()}
                  </p>
                )}
              </div>
            </Card>
            <div className={css`display: flex; gap: 0.75rem; margin-top: 1.5rem;`}>
              <Button variant="secondary" onClick={() => setCurrentStep('patch-test')}>Back</Button>
              <Button onClick={() => setCurrentStep('color-plan')}>Continue to Color Plan</Button>
            </div>
          </div>
        )}

        {/* STEP: Color Plan */}
        {currentStep === 'color-plan' && (
          <div>
            <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; @media (max-width: 768px) { grid-template-columns: 1fr; }`}>
              <Card>
                <h3 className={css`color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Color Placement Plan</h3>
                {liftResult && (
                  <div className={css`padding: 0.75rem; background: ${theme.colors.obsidian}; border-radius: ${theme.radii.md}; margin-bottom: 1rem;`}>
                    <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; margin-bottom: 0.5rem;`}>Based on your consultation:</p>
                    <div className={css`display: flex; flex-wrap: wrap; gap: 0.5rem;`}>
                      <Badge color={theme.colors.roseGold}>Level {data.currentLevel} → {data.targetLevel}</Badge>
                      <Badge color={theme.colors.success}>{liftResult.requiredDeveloperVolume}V Developer</Badge>
                      {liftResult.requiresPreLightening && <Badge color={theme.colors.warning}>Pre-lighten Required</Badge>}
                      {data.grayPercentage > 25 && <Badge color="#4A9EFF">{data.grayPercentage}% Gray</Badge>}
                    </div>
                  </div>
                )}

                {/* AI-generated placement suggestions */}
                <div className={css`margin-bottom: 1rem;`}>
                  <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin-bottom: 0.75rem;`}>Recommended placement based on service type:</p>
                  {data.serviceType === 'highlights' || data.serviceType === 'highlights+cut' ? (
                    <div className={css`display: flex; flex-direction: column; gap: 0.5rem;`}>
                      {[
                        { zone: 'Crown & Top', note: 'Primary brightness zone — heaviest concentration of highlights', color: theme.colors.roseGold },
                        { zone: 'Sides & Temples', note: 'Frame the face — lighter weaves for natural look', color: '#4A9EFF' },
                        { zone: 'Nape', note: 'Lighter application — less visible, can be skipped for partial', color: theme.colors.success },
                      ].map((z) => (
                        <div key={z.zone} className={css`padding: 0.75rem; border-left: 3px solid ${z.color}; background: ${theme.colors.obsidian}; border-radius: 0 ${theme.radii.md} ${theme.radii.md} 0;`}>
                          <p className={css`color: ${theme.colors.warmCream}; font-size: 0.875rem; font-weight: 500;`}>{z.zone}</p>
                          <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem;`}>{z.note}</p>
                        </div>
                      ))}
                    </div>
                  ) : data.serviceType === 'balayage' ? (
                    <div className={css`display: flex; flex-direction: column; gap: 0.5rem;`}>
                      {[
                        { zone: 'Ends (last 3-4 inches)', note: 'Heaviest lightener concentration — creates the bright tip', color: theme.colors.roseGold },
                        { zone: 'Mid-lengths', note: 'Feathered application — blend from ends upward', color: '#4A9EFF' },
                        { zone: 'Root area', note: 'Minimal to no product — natural shadow root effect', color: theme.colors.success },
                        { zone: 'Face framing', note: 'Slightly heavier application on front sections for brightness', color: theme.colors.warning },
                      ].map((z) => (
                        <div key={z.zone} className={css`padding: 0.75rem; border-left: 3px solid ${z.color}; background: ${theme.colors.obsidian}; border-radius: 0 ${theme.radii.md} ${theme.radii.md} 0;`}>
                          <p className={css`color: ${theme.colors.warmCream}; font-size: 0.875rem; font-weight: 500;`}>{z.zone}</p>
                          <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem;`}>{z.note}</p>
                        </div>
                      ))}
                    </div>
                  ) : data.serviceType === 'color' || data.serviceType === 'color+cut' ? (
                    <div className={css`display: flex; flex-direction: column; gap: 0.5rem;`}>
                      {[
                        { zone: 'Roots (new growth)', note: data.grayPercentage > 50 ? 'Apply first — grey coverage needs full processing time' : 'Apply last — roots process faster due to body heat', color: theme.colors.roseGold },
                        { zone: 'Mid-lengths', note: 'Apply after roots for retouch, or simultaneously for virgin hair', color: '#4A9EFF' },
                        { zone: 'Ends', note: 'Apply last — most porous, processes fastest', color: theme.colors.success },
                      ].map((z) => (
                        <div key={z.zone} className={css`padding: 0.75rem; border-left: 3px solid ${z.color}; background: ${theme.colors.obsidian}; border-radius: 0 ${theme.radii.md} ${theme.radii.md} 0;`}>
                          <p className={css`color: ${theme.colors.warmCream}; font-size: 0.875rem; font-weight: 500;`}>{z.zone}</p>
                          <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem;`}>{z.note}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>Select a color service type to see placement recommendations.</p>
                  )}
                </div>

                <div>
                  <label className={label}>Additional placement notes</label>
                  <textarea
                    value={data.colorPlacementNotes}
                    onChange={(e) => update({ colorPlacementNotes: e.target.value })}
                    placeholder="Any custom placement notes for this client..."
                    className={css`width: 100%; min-height: 80px; padding: 0.75rem; background: ${theme.colors.obsidian}; border: 1px solid ${theme.colors.borderDefault}; border-radius: ${theme.radii.md}; color: ${theme.colors.warmCream}; font-size: 0.875rem; resize: vertical; &:focus { border-color: ${theme.colors.borderFocus}; outline: none; }`}
                  />
                </div>
              </Card>

              <Card>
                <h3 className={css`color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Stylist Skill Level</h3>
                <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem; margin-bottom: 1rem;`}>Set your skill level to filter technique recommendations.</p>
                <div className={css`display: flex; flex-direction: column; gap: 0.5rem;`}>
                  {(['beginner', 'intermediate', 'advanced', 'master'] as SkillLevel[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => update({ stylistSkillLevel: level })}
                      className={css`
                        padding: 0.75rem 1rem; border-radius: ${theme.radii.md}; cursor: pointer; text-align: left;
                        border: 1px solid ${data.stylistSkillLevel === level ? skillColors[level] : theme.colors.borderDefault};
                        background: ${data.stylistSkillLevel === level ? `${skillColors[level]}15` : 'transparent'};
                        color: ${data.stylistSkillLevel === level ? skillColors[level] : theme.colors.textSecondary};
                        text-transform: capitalize; font-size: 0.875rem;
                      `}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </Card>
            </div>
            <div className={css`display: flex; gap: 0.75rem; margin-top: 1.5rem;`}>
              <Button variant="secondary" onClick={() => setCurrentStep('consent')}>Back</Button>
              <Button onClick={() => setCurrentStep('techniques')}>Continue to Techniques</Button>
            </div>
          </div>
        )}

        {/* STEP: Techniques */}
        {currentStep === 'techniques' && (
          <div>
            <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; @media (max-width: 768px) { grid-template-columns: 1fr; }`}>
              <div>
                <h3 className={css`color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Recommended Techniques</h3>
                <div className={css`display: flex; flex-direction: column; gap: 0.75rem;`}>
                  {relevantTechniques.length === 0 && (
                    <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>No techniques found for this service type.</p>
                  )}
                  {relevantTechniques.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => update({ techniqueId: t.id })}
                      className={css`
                        padding: 1rem; border-radius: ${theme.radii.md}; cursor: pointer;
                        border: 1px solid ${data.techniqueId === t.id ? theme.colors.roseGold : theme.colors.borderDefault};
                        background: ${data.techniqueId === t.id ? `${theme.colors.roseGold}10` : theme.colors.obsidianMid};
                        transition: all 0.15s;
                        &:hover { border-color: ${theme.colors.roseGold}; }
                      `}
                    >
                      <div className={css`display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;`}>
                        <span className={css`color: ${theme.colors.warmCream}; font-weight: 500; font-size: 0.875rem;`}>{t.name}</span>
                        <Badge color={skillColors[t.skillLevel]}>{t.skillLevel}</Badge>
                      </div>
                      <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem; margin-bottom: 0.5rem;`}>{t.description}</p>
                      <div className={css`display: flex; flex-wrap: wrap; gap: 0.25rem;`}>
                        {t.bestFor.slice(0, 2).map((b) => (
                          <span key={b} className={css`font-size: 0.7rem; color: ${theme.colors.textSecondary}; background: ${theme.colors.obsidian}; padding: 0.125rem 0.5rem; border-radius: 999px;`}>{b}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technique detail + video */}
              <div>
                {selectedTechnique ? (
                  <Card>
                    <h3 className={css`color: ${theme.colors.warmCream}; margin-bottom: 0.5rem;`}>{selectedTechnique.name}</h3>
                    <Badge color={skillColors[selectedTechnique.skillLevel]}>{selectedTechnique.skillLevel}</Badge>
                    <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin: 1rem 0;`}>{selectedTechnique.description}</p>

                    <div className={css`margin-bottom: 1rem;`}>
                      <p className={css`color: ${theme.colors.roseGold}; font-size: 0.75rem; font-weight: 600; margin-bottom: 0.5rem;`}>PLACEMENT</p>
                      <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.8rem;`}>{selectedTechnique.placementNotes}</p>
                    </div>
                    <div className={css`margin-bottom: 1rem;`}>
                      <p className={css`color: ${theme.colors.roseGold}; font-size: 0.75rem; font-weight: 600; margin-bottom: 0.5rem;`}>PROCESSING</p>
                      <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.8rem;`}>{selectedTechnique.processingNotes}</p>
                    </div>
                    <div className={css`margin-bottom: 1rem;`}>
                      <p className={css`color: ${theme.colors.roseGold}; font-size: 0.75rem; font-weight: 600; margin-bottom: 0.5rem;`}>BEST FOR</p>
                      <ul className={css`margin: 0; padding-left: 1.25rem;`}>
                        {selectedTechnique.bestFor.map((b) => (
                          <li key={b} className={css`color: ${theme.colors.textSecondary}; font-size: 0.8rem;`}>{b}</li>
                        ))}
                      </ul>
                    </div>

                    {selectedTechnique.videoUrl && (
                      <div>
                        <p className={css`color: ${theme.colors.roseGold}; font-size: 0.75rem; font-weight: 600; margin-bottom: 0.5rem;`}>REFERENCE VIDEO</p>
                        <div className={css`position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: ${theme.radii.md};`}>
                          <iframe
                            src={selectedTechnique.videoUrl}
                            title={selectedTechnique.videoTitle}
                            className={css`position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                        {selectedTechnique.videoTitle && (
                          <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem; margin-top: 0.5rem;`}>{selectedTechnique.videoTitle}</p>
                        )}
                      </div>
                    )}
                  </Card>
                ) : (
                  <Card>
                    <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>Select a technique to see details and reference video.</p>
                  </Card>
                )}
              </div>
            </div>
            <div className={css`display: flex; gap: 0.75rem; margin-top: 1.5rem;`}>
              <Button variant="secondary" onClick={() => setCurrentStep('color-plan')}>Back</Button>
              <Button onClick={() => setCurrentStep('summary')}>Continue to Summary</Button>
            </div>
          </div>
        )}

        {/* STEP: Summary */}
        {currentStep === 'summary' && (
          <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; @media (max-width: 768px) { grid-template-columns: 1fr; }`}>
            <div className={css`display: flex; flex-direction: column; gap: 1rem;`}>
              <Card>
                <h3 className={css`color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Consultation Summary</h3>
                <div className={css`display: flex; flex-direction: column; gap: 0.5rem;`}>
                  {[
                    { label: 'Service', value: data.serviceType?.replace('+', ' + ') ?? '—' },
                    { label: 'Current Level', value: data.currentLevel ? `Level ${data.currentLevel}` : '—' },
                    { label: 'Target Level', value: data.targetLevel ? `Level ${data.targetLevel}` : '—' },
                    { label: 'Gray %', value: `${data.grayPercentage}%` },
                    { label: 'Porosity', value: data.porosity },
                    { label: 'Texture', value: data.texture },
                    { label: 'Hair Condition', value: data.hairCondition },
                    { label: 'Technique', value: selectedTechnique?.name ?? '—' },
                    { label: 'Patch Test', value: data.patchTestResult || 'Not recorded' },
                    { label: 'Consent', value: data.consentSigned ? `Signed by ${data.consentSignature}` : 'Not signed' },
                    { label: 'Before Photos', value: `${data.beforePhotos.length} photo${data.beforePhotos.length !== 1 ? 's' : ''}` },
                  ].map((row) => (
                    <div key={row.label} className={css`display: flex; justify-content: space-between; padding: 0.375rem 0; border-bottom: 1px solid ${theme.colors.borderDefault};`}>
                      <span className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem;`}>{row.label}</span>
                      <span className={css`color: ${theme.colors.warmCream}; font-size: 0.875rem; text-transform: capitalize;`}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {liftResult && liftResult.warnings.length > 0 && (
                <Card>
                  <h3 className={css`color: ${theme.colors.warning}; margin-bottom: 0.75rem;`}>⚠ Safety Notes</h3>
                  {liftResult.warnings.map((w, i) => (
                    <p key={i} className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin-bottom: 0.5rem;`}>• {w}</p>
                  ))}
                </Card>
              )}
            </div>

            <div className={css`display: flex; flex-direction: column; gap: 1rem;`}>
              {data.beforePhotos.length > 0 && (
                <Card>
                  <h3 className={css`color: ${theme.colors.warmCream}; margin-bottom: 0.75rem;`}>Before Photos</h3>
                  <div className={css`display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem;`}>
                    {data.beforePhotos.map((p, i) => (
                      <img key={i} src={p} alt={`Before ${i + 1}`} className={css`width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: ${theme.radii.md};`} />
                    ))}
                  </div>
                </Card>
              )}

              {/* Service checklist — full phase-by-phase reminders */}
              {data.serviceType && (
                <ServiceReminders
                  serviceType={data.serviceType}
                  checklistMode
                  defaultCollapsed={false}
                />
              )}

              <div className={css`display: flex; flex-direction: column; gap: 0.75rem;`}>
                <Button onClick={handleSaveConsultation}>
                  {isSaving ? 'Saving…' : 'Save & Build Formula'}
                </Button>
                <Button variant="secondary" onClick={() => handleSaveConsultation(true)}>
                  {isSaving ? 'Saving…' : 'Save as Draft'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom nav for steps that don't have their own */}
        {currentStep === 'client-hair' && !isColorService && (
          <div className={css`display: flex; gap: 0.75rem; margin-top: 1.5rem;`}>
            <Button variant="secondary" onClick={() => setCurrentStep('service')}>Back</Button>
            <Button onClick={() => setCurrentStep('photos')}>Continue to Photos</Button>
          </div>
        )}
      </MainContent>
    </>
  );
}
