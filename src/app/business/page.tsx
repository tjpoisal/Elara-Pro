'use client';
import { useState, useEffect } from 'react';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Button } from '@/components/Navigation';

type Tab = 'overview' | 'social' | 'pricing' | 'retention';

const PLATFORMS = ['instagram', 'facebook', 'tiktok', 'twitter'] as const;
const CONTENT_TYPES = ['before_after', 'tip', 'promotion', 'behind_scenes', 'product', 'testimonial'] as const;

interface SocialPost {
  platform: string;
  caption: string;
  hashtags: string[];
  callToAction: string;
  bestPostTime: string;
  contentType: string;
}

interface CalendarWeek {
  week: string;
  posts: Array<{ day: string; platform: string; type: string; topic: string }>;
}

export default function BusinessPage() {
  const [tab, setTab] = useState<Tab>('overview');
  const [analysis, setAnalysis] = useState('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [salonName, setSalonName] = useState('');

  // Social
  const [platform, setPlatform] = useState<typeof PLATFORMS[number]>('instagram');
  const [contentType, setContentType] = useState<typeof CONTENT_TYPES[number]>('before_after');
  const [serviceHighlight, setServiceHighlight] = useState('');
  const [generatedPost, setGeneratedPost] = useState<SocialPost | null>(null);
  const [calendar, setCalendar] = useState<CalendarWeek[]>([]);
  const [calendarLoading, setCalendarLoading] = useState(false);

  // Pricing
  const [marketArea, setMarketArea] = useState('');
  const [salonTier, setSalonTier] = useState<'budget' | 'mid' | 'luxury'>('mid');
  const [pricingRec, setPricingRec] = useState('');

  // Retention
  const [retentionStrategy, setRetentionStrategy] = useState('');

  useEffect(() => {
    // Load initial analysis
    fetch('/api/business', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) })
      .then((r) => r.json())
      .then((d) => { setAnalysis(d.analysis ?? ''); setSalonName(d.salonName ?? ''); })
      .catch(() => {});
  }, []);

  const askQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
    const res = await fetch('/api/business', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    const d = await res.json();
    setAnalysis(d.analysis ?? '');
    setLoading(false);
  };

  const generatePost = async () => {
    setLoading(true);
    const res = await fetch('/api/business?action=social-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform, contentType, salonName, serviceHighlight }),
    });
    const d = await res.json();
    setGeneratedPost(d.post);
    setLoading(false);
  };

  const generateCalendar = async () => {
    setCalendarLoading(true);
    const res = await fetch('/api/business?action=content-calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salonName, month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }) }),
    });
    const d = await res.json();
    setCalendar(d.calendar ?? []);
    setCalendarLoading(false);
  };

  const getPricing = async () => {
    setLoading(true);
    const res = await fetch('/api/business?action=pricing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ marketArea, salonTier, salonName }),
    });
    const d = await res.json();
    setPricingRec(d.recommendation ?? '');
    setLoading(false);
  };

  const getRetention = async () => {
    setLoading(true);
    const res = await fetch('/api/business?action=retention', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ salonName, lapsedClients: 0, avgDaysBetweenVisits: 60, retentionRate: 65 }),
    });
    const d = await res.json();
    setRetentionStrategy(d.strategy ?? '');
    setLoading(false);
  };

  const tabBtn = (t: Tab, label: string) => (
    <button onClick={() => setTab(t)} className={css`
      padding: 0.5rem 1rem; border-radius: ${theme.radii.sm};
      border: 1px solid ${tab === t ? theme.colors.roseGold : theme.colors.borderDefault};
      background: ${tab === t ? theme.colors.roseGold + '20' : 'transparent'};
      color: ${tab === t ? theme.colors.roseGold : theme.colors.textSecondary};
      font-size: 0.85rem; cursor: pointer;
    `}>{label}</button>
  );

  const inputCls = css`
    width: 100%; padding: 0.625rem 0.875rem;
    background: ${theme.colors.obsidian};
    border: 1px solid ${theme.colors.borderDefault};
    border-radius: ${theme.radii.sm};
    color: ${theme.colors.warmCream}; font-size: 0.875rem;
    box-sizing: border-box;
    &:focus { border-color: ${theme.colors.roseGold}; outline: none; }
  `;

  const aiBlock = (text: string) => text ? (
    <div className={css`
      background: ${theme.colors.obsidian};
      border: 1px solid ${theme.colors.borderDefault};
      border-left: 3px solid ${theme.colors.roseGold};
      border-radius: ${theme.radii.md};
      padding: 1.25rem;
      white-space: pre-wrap;
      color: ${theme.colors.textSecondary};
      font-size: 0.875rem;
      line-height: 1.7;
    `}>{text}</div>
  ) : null;

  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader title="Business Manager" subtitle="AI-powered salon business intelligence" />

        <div className={css`display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;`}>
          {tabBtn('overview', '📊 Overview')}
          {tabBtn('social', '📱 Social Media')}
          {tabBtn('pricing', '💰 Pricing')}
          {tabBtn('retention', '🔄 Retention')}
        </div>

        {/* ── Overview ── */}
        {tab === 'overview' && (
          <div className={css`display: flex; flex-direction: column; gap: 1.5rem;`}>
            <Card>
              <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin: 0 0 1rem;`}>
                AI Business Analysis
              </h3>
              {analysis ? aiBlock(analysis) : (
                <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>Loading analysis…</p>
              )}
            </Card>
            <Card>
              <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin: 0 0 1rem;`}>
                Ask Elara Business Manager
              </h3>
              <div className={css`display: flex; gap: 0.75rem;`}>
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && askQuestion()}
                  placeholder="e.g. How can I increase my average ticket? Why is retention dropping?"
                  className={css`${inputCls} flex: 1;`}
                />
                <Button onClick={askQuestion}>{loading ? '…' : 'Ask'}</Button>
              </div>
            </Card>
          </div>
        )}

        {/* ── Social Media ── */}
        {tab === 'social' && (
          <div className={css`display: flex; flex-direction: column; gap: 1.5rem;`}>
            <Card>
              <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin: 0 0 1.25rem;`}>
                Generate Social Post
              </h3>
              <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;`}>
                <div>
                  <label className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.25rem;`}>Platform</label>
                  <div className={css`display: flex; flex-wrap: wrap; gap: 0.375rem;`}>
                    {PLATFORMS.map((p) => (
                      <button key={p} onClick={() => setPlatform(p)} className={css`
                        padding: 0.3rem 0.625rem; border-radius: ${theme.radii.sm}; font-size: 0.78rem; cursor: pointer;
                        border: 1px solid ${platform === p ? theme.colors.roseGold : theme.colors.borderDefault};
                        background: ${platform === p ? theme.colors.roseGold + '20' : 'transparent'};
                        color: ${platform === p ? theme.colors.roseGold : theme.colors.textSecondary};
                        text-transform: capitalize;
                      `}>{p}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.25rem;`}>Content Type</label>
                  <div className={css`display: flex; flex-wrap: wrap; gap: 0.375rem;`}>
                    {CONTENT_TYPES.map((c) => (
                      <button key={c} onClick={() => setContentType(c)} className={css`
                        padding: 0.3rem 0.625rem; border-radius: ${theme.radii.sm}; font-size: 0.72rem; cursor: pointer;
                        border: 1px solid ${contentType === c ? theme.colors.roseGold : theme.colors.borderDefault};
                        background: ${contentType === c ? theme.colors.roseGold + '20' : 'transparent'};
                        color: ${contentType === c ? theme.colors.roseGold : theme.colors.textSecondary};
                        text-transform: capitalize;
                      `}>{c.replace('_', ' ')}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className={css`margin-bottom: 1rem;`}>
                <label className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.25rem;`}>Service or highlight to feature</label>
                <input value={serviceHighlight} onChange={(e) => setServiceHighlight(e.target.value)} placeholder="e.g. Summer balayage special, Olaplex treatment" className={inputCls} />
              </div>
              <Button onClick={generatePost}>{loading ? 'Generating…' : 'Generate Post'}</Button>

              {generatedPost && (
                <div className={css`margin-top: 1.5rem; padding: 1.25rem; background: ${theme.colors.obsidian}; border-radius: ${theme.radii.md}; border: 1px solid ${theme.colors.borderDefault};`}>
                  <div className={css`display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.875rem;`}>
                    <span className={css`font-size: 0.7rem; padding: 0.15rem 0.5rem; border-radius: 999px; background: ${theme.colors.roseGold}20; color: ${theme.colors.roseGold}; text-transform: capitalize;`}>
                      {generatedPost.platform}
                    </span>
                    <span className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem;`}>Best time: {generatedPost.bestPostTime}</span>
                  </div>
                  <p className={css`color: ${theme.colors.warmCream}; font-size: 0.875rem; line-height: 1.6; margin: 0 0 0.875rem; white-space: pre-wrap;`}>{generatedPost.caption}</p>
                  <p className={css`color: ${theme.colors.roseGold}; font-size: 0.8rem; margin: 0 0 0.5rem;`}>{generatedPost.hashtags.map((h) => `#${h.replace('#', '')}`).join(' ')}</p>
                  <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.8rem; font-style: italic; margin: 0;`}>{generatedPost.callToAction}</p>
                  <button
                    onClick={() => navigator.clipboard.writeText(`${generatedPost.caption}\n\n${generatedPost.hashtags.join(' ')}\n\n${generatedPost.callToAction}`)}
                    className={css`margin-top: 0.875rem; padding: 0.375rem 0.875rem; background: transparent; border: 1px solid ${theme.colors.borderDefault}; border-radius: ${theme.radii.sm}; color: ${theme.colors.textSecondary}; font-size: 0.78rem; cursor: pointer; &:hover { border-color: ${theme.colors.roseGold}; color: ${theme.colors.roseGold}; }`}
                  >Copy to clipboard</button>
                </div>
              )}
            </Card>

            <Card>
              <div className={css`display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;`}>
                <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin: 0;`}>Content Calendar</h3>
                <Button variant="secondary" onClick={generateCalendar}>{calendarLoading ? 'Generating…' : 'Generate Month'}</Button>
              </div>
              {calendar.length > 0 ? (
                <div className={css`display: flex; flex-direction: column; gap: 1rem;`}>
                  {calendar.map((week) => (
                    <div key={week.week}>
                      <p className={css`color: ${theme.colors.roseGold}; font-size: 0.8rem; font-weight: 600; margin: 0 0 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;`}>{week.week}</p>
                      <div className={css`display: flex; flex-direction: column; gap: 0.375rem;`}>
                        {week.posts.map((post, i) => (
                          <div key={i} className={css`display: flex; gap: 0.75rem; align-items: flex-start; padding: 0.5rem 0.75rem; background: ${theme.colors.obsidian}; border-radius: ${theme.radii.sm};`}>
                            <span className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem; min-width: 60px;`}>{post.day}</span>
                            <span className={css`color: ${theme.colors.roseGold}; font-size: 0.75rem; min-width: 70px; text-transform: capitalize;`}>{post.platform}</span>
                            <span className={css`color: ${theme.colors.textSecondary}; font-size: 0.8rem;`}>{post.topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>Generate a content calendar to see your month planned out.</p>
              )}
            </Card>
          </div>
        )}

        {/* ── Pricing ── */}
        {tab === 'pricing' && (
          <div className={css`display: flex; flex-direction: column; gap: 1.5rem; max-width: 640px;`}>
            <Card>
              <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin: 0 0 1.25rem;`}>Pricing Analysis</h3>
              <div className={css`display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1rem;`}>
                <div>
                  <label className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.25rem;`}>Market Area</label>
                  <input value={marketArea} onChange={(e) => setMarketArea(e.target.value)} placeholder="e.g. Austin TX, Manhattan NYC, suburban Atlanta" className={inputCls} />
                </div>
                <div>
                  <label className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.5rem;`}>Salon Tier</label>
                  <div className={css`display: flex; gap: 0.5rem;`}>
                    {(['budget', 'mid', 'luxury'] as const).map((t) => (
                      <button key={t} onClick={() => setSalonTier(t)} className={css`
                        padding: 0.4rem 0.875rem; border-radius: ${theme.radii.sm}; font-size: 0.8rem; cursor: pointer;
                        border: 1px solid ${salonTier === t ? theme.colors.roseGold : theme.colors.borderDefault};
                        background: ${salonTier === t ? theme.colors.roseGold + '20' : 'transparent'};
                        color: ${salonTier === t ? theme.colors.roseGold : theme.colors.textSecondary};
                        text-transform: capitalize;
                      `}>{t}</button>
                    ))}
                  </div>
                </div>
              </div>
              <Button onClick={getPricing}>{loading ? 'Analyzing…' : 'Get Pricing Recommendations'}</Button>
              {pricingRec && <div className={css`margin-top: 1.25rem;`}>{aiBlock(pricingRec)}</div>}
            </Card>
          </div>
        )}

        {/* ── Retention ── */}
        {tab === 'retention' && (
          <div className={css`display: flex; flex-direction: column; gap: 1.5rem; max-width: 640px;`}>
            <Card>
              <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin: 0 0 1rem;`}>Client Retention Strategy</h3>
              <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem; margin-bottom: 1.25rem;`}>
                Elara will analyze your retention metrics and generate a personalized win-back campaign strategy.
              </p>
              <Button onClick={getRetention}>{loading ? 'Generating…' : 'Generate Retention Strategy'}</Button>
              {retentionStrategy && <div className={css`margin-top: 1.25rem;`}>{aiBlock(retentionStrategy)}</div>}
            </Card>
          </div>
        )}
      </MainContent>
    </>
  );
}
