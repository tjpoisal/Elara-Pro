'use client';
import { useState, useMemo } from 'react';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Badge } from '@/components/Navigation';
import { useSalon } from '@/lib/salon-context';
import { TECHNIQUES, type TechniqueCategory, type SkillLevel } from '@/lib/techniques/data';
import { getVideosForTechnique } from '@/lib/techniques/videos';

const CATEGORIES: { key: TechniqueCategory | 'all'; label: string; icon: string }[] = [
  { key: 'all',       label: 'All',        icon: '◈' },
  { key: 'highlights',label: 'Highlights', icon: '✦' },
  { key: 'balayage',  label: 'Balayage',   icon: '◎' },
  { key: 'lowlights', label: 'Lowlights',  icon: '◑' },
  { key: 'color',     label: 'Color',      icon: '⬡' },
  { key: 'toning',    label: 'Toning',     icon: '◷' },
  { key: 'chemical',  label: 'Chemical',   icon: '⬢' },
  { key: 'cut',       label: 'Cuts',       icon: '◬' },
];

const SKILL_LEVELS: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'master'];

const SKILL_COLOR: Record<SkillLevel, string> = {
  beginner:     theme.colors.emerald,
  intermediate: theme.colors.topaz,
  advanced:     theme.colors.roseGold,
  master:       theme.colors.gold,
};

export default function SchoolPage() {
  const { settings } = useSalon();
  const [category, setCategory] = useState<TechniqueCategory | 'all'>('all');
  const [skillFilter, setSkillFilter] = useState<SkillLevel | 'all'>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return TECHNIQUES.filter((t) => {
      if (category !== 'all' && t.category !== category) return false;
      if (skillFilter !== 'all' && t.skillLevel !== skillFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.includes(q))
        );
      }
      return true;
    });
  }, [category, skillFilter, search]);

  const selectedTechnique = selected ? TECHNIQUES.find((t) => t.id === selected) : null;
  const videos = selectedTechnique
    ? getVideosForTechnique(selectedTechnique.id, settings.selectedBrands)
    : [];

  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader title="Education" subtitle="Technique library and video references" />

        {/* Search + skill filter */}
        <div className={css`display: flex; gap: 0.75rem; margin-bottom: 1.25rem; flex-wrap: wrap; align-items: center;`}>
          <input
            placeholder="Search techniques…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={css`
              flex: 1; min-width: 200px; max-width: 320px;
              padding: 0.5rem 0.875rem; min-height: ${theme.tapTarget};
              background: ${theme.colors.obsidian};
              border: 1px solid ${theme.colors.borderDefault};
              border-radius: ${theme.radii.md};
              color: ${theme.colors.textPrimary}; font-size: 0.875rem;
              &:focus { border-color: ${theme.colors.gold}; outline: none; }
              &::placeholder { color: ${theme.colors.textDisabled}; }
            `}
          />
          <div className={css`display: flex; gap: 0.375rem; flex-wrap: wrap;`}>
            {(['all', ...SKILL_LEVELS] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSkillFilter(s)}
                className={css`
                  padding: 0.3rem 0.75rem; border-radius: ${theme.radii.full};
                  border: 1px solid ${skillFilter === s
                    ? (s === 'all' ? theme.colors.gold : SKILL_COLOR[s])
                    : theme.colors.borderDefault};
                  background: ${skillFilter === s
                    ? (s === 'all' ? theme.colors.gold : SKILL_COLOR[s]) + '20'
                    : 'transparent'};
                  color: ${skillFilter === s
                    ? (s === 'all' ? theme.colors.gold : SKILL_COLOR[s])
                    : theme.colors.textMuted};
                  font-size: 0.75rem; cursor: pointer; text-transform: capitalize;
                  transition: all 0.15s;
                `}
              >{s}</button>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div className={css`display: flex; gap: 0.375rem; margin-bottom: 1.5rem; flex-wrap: wrap;`}>
          {CATEGORIES.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={css`
                display: flex; align-items: center; gap: 0.375rem;
                padding: 0.4rem 0.875rem; border-radius: ${theme.radii.sm};
                border: 1px solid ${category === key ? theme.colors.roseGold : theme.colors.borderDefault};
                background: ${category === key ? theme.colors.roseGold + '15' : 'transparent'};
                color: ${category === key ? theme.colors.roseGold : theme.colors.textMuted};
                font-size: 0.8rem; cursor: pointer;
                transition: all 0.15s;
              `}
            >
              <span className={css`font-size: 0.75rem;`}>{icon}</span>
              {label}
            </button>
          ))}
        </div>

        <div className={css`display: grid; grid-template-columns: ${selected ? '1fr 420px' : '1fr'}; gap: 1.5rem; align-items: start;`}>
          {/* Technique list */}
          <div className={css`display: flex; flex-direction: column; gap: 0.5rem;`}>
            {filtered.length === 0 ? (
              <Card>
                <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem; margin: 0;`}>No techniques match your filters.</p>
              </Card>
            ) : (
              filtered.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelected(selected === t.id ? null : t.id)}
                  className={css`
                    background: ${selected === t.id ? theme.colors.obsidianLight : theme.colors.obsidianMid};
                    border: 1px solid ${selected === t.id ? theme.colors.roseGold + '60' : theme.colors.borderDefault};
                    border-radius: ${theme.radii.md};
                    padding: 1rem 1.25rem;
                    cursor: pointer;
                    transition: all 0.15s;
                    &:hover { border-color: ${theme.colors.roseGold}40; background: ${theme.colors.obsidianLight}; }
                  `}
                >
                  <div className={css`display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem;`}>
                    <div className={css`flex: 1;`}>
                      <div className={css`display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.375rem; flex-wrap: wrap;`}>
                        <p className={css`color: ${theme.colors.warmCream}; font-weight: 600; font-size: 0.9rem; margin: 0; font-family: ${theme.fonts.heading};`}>
                          {t.name}
                        </p>
                        <Badge color={SKILL_COLOR[t.skillLevel]}>{t.skillLevel}</Badge>
                        <Badge variant="default">{t.category}</Badge>
                      </div>
                      <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.8rem; margin: 0; line-height: 1.5;`}>
                        {t.description}
                      </p>
                      {t.bestFor.length > 0 && (
                        <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem; margin: 0.375rem 0 0;`}>
                          Best for: {t.bestFor.slice(0, 2).join(', ')}{t.bestFor.length > 2 ? '…' : ''}
                        </p>
                      )}
                    </div>
                    {getVideosForTechnique(t.id, settings.selectedBrands).length > 0 && (
                      <span className={css`color: ${theme.colors.roseGold}; font-size: 0.75rem; flex-shrink: 0; opacity: 0.8;`}>
                        ▶ {getVideosForTechnique(t.id, settings.selectedBrands).length} video{getVideosForTechnique(t.id, settings.selectedBrands).length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Detail panel */}
          {selectedTechnique && (
            <div className={css`
              background: ${theme.colors.obsidianMid};
              border: 1px solid ${theme.colors.borderDefault};
              border-radius: ${theme.radii.lg};
              padding: 1.5rem;
              position: sticky; top: 1.5rem;
            `}>
              <div className={css`display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1rem;`}>
                <div>
                  <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin: 0 0 0.375rem; font-size: 1.1rem;`}>
                    {selectedTechnique.name}
                  </h3>
                  <div className={css`display: flex; gap: 0.375rem;`}>
                    <Badge color={SKILL_COLOR[selectedTechnique.skillLevel]}>{selectedTechnique.skillLevel}</Badge>
                    <Badge variant="default">{selectedTechnique.category}</Badge>
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className={css`
                    background: transparent; border: none; color: ${theme.colors.textMuted};
                    cursor: pointer; font-size: 1rem; padding: 0.25rem;
                    &:hover { color: ${theme.colors.textPrimary}; }
                  `}
                >✕</button>
              </div>

              <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.85rem; line-height: 1.6; margin: 0 0 1rem;`}>
                {selectedTechnique.description}
              </p>

              <Section label="Best For">
                <ul className={css`margin: 0; padding-left: 1.25rem; color: ${theme.colors.textSecondary}; font-size: 0.82rem; line-height: 1.7;`}>
                  {selectedTechnique.bestFor.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </Section>

              <Section label="Placement">
                <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.82rem; line-height: 1.6; margin: 0;`}>
                  {selectedTechnique.placementNotes}
                </p>
              </Section>

              <Section label="Processing">
                <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.82rem; line-height: 1.6; margin: 0;`}>
                  {selectedTechnique.processingNotes}
                </p>
              </Section>

              {/* Videos */}
              {videos.length > 0 && (
                <div className={css`margin-top: 1.25rem;`}>
                  <p className={css`color: ${theme.colors.textMuted}; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 0.75rem;`}>
                    Reference Videos
                  </p>
                  <div className={css`display: flex; flex-direction: column; gap: 0.75rem;`}>
                    {videos.slice(0, 3).map((v) => (
                      <div key={v.id} className={css`
                        background: ${theme.colors.obsidian};
                        border: 1px solid ${theme.colors.borderDefault};
                        border-radius: ${theme.radii.md};
                        overflow: hidden;
                      `}>
                        <div className={css`position: relative; padding-bottom: 56.25%; height: 0;`}>
                          <iframe
                            src={`https://www.youtube.com/embed/${v.youtubeId}`}
                            title={v.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className={css`position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;`}
                          />
                        </div>
                        <div className={css`padding: 0.625rem 0.75rem;`}>
                          <p className={css`color: ${theme.colors.warmCream}; font-size: 0.78rem; font-weight: 600; margin: 0 0 0.125rem;`}>{v.title}</p>
                          <a
                            href={v.channelUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={css`color: ${theme.colors.textMuted}; font-size: 0.72rem; text-decoration: none; &:hover { color: ${theme.colors.gold}; }`}
                          >
                            {v.channelName}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </MainContent>
    </>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={css`margin-bottom: 1rem;`}>
      <p className={css`color: ${theme.colors.textMuted}; font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 0.375rem;`}>
        {label}
      </p>
      {children}
    </div>
  );
}
