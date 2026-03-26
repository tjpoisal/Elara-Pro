'use client';
import { useState, useEffect } from 'react';
import { css, keyframes } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card } from '@/components/Navigation';
import { xpForLevel } from '@/lib/gamification/xp';

interface XpData {
  totalXp: number;
  level: number;
  currentLevelXp: number;
  nextLevelXp: number;
  streak: number;
  longestStreak: number;
}

interface BadgeData {
  badge: { id: string; slug: string; name: string; description: string; icon: string; tier: string; category: string; xpReward: number };
  earnedAt: string;
}

interface ChallengeData {
  challenge: { id: string; title: string; description: string; icon: string; xpReward: number };
  progress: number;
  target: number;
  completedAt: string | null;
}

interface XpEvent {
  id: string;
  eventType: string;
  xpAwarded: number;
  description: string;
  createdAt: string;
}

const TIER_COLORS: Record<string, string> = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
  platinum: '#e5e4e2',
  diamond: '#b9f2ff',
};

const LEVEL_TITLES: Record<number, string> = {
  1: 'Apprentice', 2: 'Junior Colorist', 3: 'Colorist', 4: 'Senior Colorist',
  5: 'Color Specialist', 6: 'Master Colorist', 7: 'Color Artist', 8: 'Color Director',
  9: 'Color Visionary', 10: 'Elara Master',
};

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

export default function AchievementsPage() {
  const [xp, setXp] = useState<XpData | null>(null);
  const [badges, setBadges] = useState<BadgeData[]>([]);
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);
  const [recentXp, setRecentXp] = useState<XpEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'badges' | 'challenges' | 'history'>('overview');

  useEffect(() => {
    fetch('/api/gamification')
      .then((r) => r.json())
      .then((d) => {
        setXp(d.xp);
        setBadges(d.badges ?? []);
        setChallenges(d.challenges ?? []);
        setRecentXp(d.recentXp ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const levelTitle = xp ? (LEVEL_TITLES[xp.level] ?? `Level ${xp.level}`) : '';
  const xpPct = xp ? Math.min(100, Math.round((xp.currentLevelXp / xp.nextLevelXp) * 100)) : 0;

  const tabBtn = (t: typeof tab, label: string) => (
    <button onClick={() => setTab(t)} className={css`
      padding: 0.4rem 0.875rem; border-radius: ${theme.radii.sm}; font-size: 0.8rem; cursor: pointer;
      border: 1px solid ${tab === t ? theme.colors.roseGold : theme.colors.borderDefault};
      background: ${tab === t ? theme.colors.roseGold + '20' : 'transparent'};
      color: ${tab === t ? theme.colors.roseGold : theme.colors.textSecondary};
    `}>{label}</button>
  );

  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader title="Achievements" subtitle="Your progress, badges, and challenges" />

        {/* XP Card */}
        {xp && (
          <div className={css`
            background: linear-gradient(135deg, ${theme.colors.obsidianMid}, ${theme.colors.obsidian});
            border: 1px solid ${theme.colors.roseGold}40;
            border-radius: ${theme.radii.xl};
            padding: 2rem;
            margin-bottom: 1.5rem;
            position: relative; overflow: hidden;
          `}>
            <div className={css`
              position: absolute; top: 0; right: 0; width: 200px; height: 200px;
              background: radial-gradient(circle, ${theme.colors.roseGold}15 0%, transparent 70%);
              pointer-events: none;
            `} />
            <div className={css`display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem;`}>
              <div>
                <div className={css`
                  display: inline-block;
                  font-size: 2.5rem; font-family: ${theme.fonts.heading};
                  background: linear-gradient(135deg, ${theme.colors.warmCream} 40%, ${theme.colors.roseGold});
                  background-size: 200% auto;
                  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                  background-clip: text;
                  animation: ${shimmer} 3s linear infinite;
                `}>Level {xp.level}</div>
                <p className={css`color: ${theme.colors.roseGold}; font-size: 1rem; margin: 0.25rem 0 0;`}>{levelTitle}</p>
              </div>
              <div className={css`text-align: right;`}>
                <p className={css`color: ${theme.colors.warmCream}; font-size: 1.5rem; font-weight: 700; margin: 0;`}>{xp.totalXp.toLocaleString()} XP</p>
                <p className={css`color: ${theme.colors.textMuted}; font-size: 0.8rem; margin: 0.25rem 0 0;`}>Total earned</p>
              </div>
            </div>

            {/* XP progress bar */}
            <div className={css`margin-bottom: 0.5rem;`}>
              <div className={css`display: flex; justify-content: space-between; margin-bottom: 0.375rem;`}>
                <span className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem;`}>{xp.currentLevelXp} XP</span>
                <span className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem;`}>{xp.nextLevelXp} XP to Level {xp.level + 1}</span>
              </div>
              <div className={css`height: 8px; background: ${theme.colors.borderDefault}; border-radius: 4px; overflow: hidden;`}>
                <div className={css`
                  height: 100%; border-radius: 4px;
                  background: linear-gradient(90deg, ${theme.colors.roseGold}, ${theme.colors.roseGoldLight});
                  width: ${xpPct}%;
                  transition: width 0.5s ease;
                  box-shadow: 0 0 8px ${theme.colors.roseGold}60;
                `} />
              </div>
            </div>

            {/* Streak */}
            <div className={css`display: flex; gap: 1.5rem; margin-top: 1rem;`}>
              <div className={css`display: flex; align-items: center; gap: 0.5rem;`}>
                <span className={css`font-size: 1.25rem;`}>🔥</span>
                <div>
                  <p className={css`color: ${theme.colors.warmCream}; font-weight: 700; font-size: 1rem; margin: 0;`}>{xp.streak}</p>
                  <p className={css`color: ${theme.colors.textMuted}; font-size: 0.7rem; margin: 0;`}>Day streak</p>
                </div>
              </div>
              <div className={css`display: flex; align-items: center; gap: 0.5rem;`}>
                <span className={css`font-size: 1.25rem;`}>🏆</span>
                <div>
                  <p className={css`color: ${theme.colors.warmCream}; font-weight: 700; font-size: 1rem; margin: 0;`}>{badges.length}</p>
                  <p className={css`color: ${theme.colors.textMuted}; font-size: 0.7rem; margin: 0;`}>Badges earned</p>
                </div>
              </div>
              <div className={css`display: flex; align-items: center; gap: 0.5rem;`}>
                <span className={css`font-size: 1.25rem;`}>⚡</span>
                <div>
                  <p className={css`color: ${theme.colors.warmCream}; font-weight: 700; font-size: 1rem; margin: 0;`}>{xp.longestStreak}</p>
                  <p className={css`color: ${theme.colors.textMuted}; font-size: 0.7rem; margin: 0;`}>Best streak</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!xp && !loading && (
          <Card>
            <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem;`}>
              Complete your first consultation or formula to start earning XP and badges.
            </p>
          </Card>
        )}

        <div className={css`display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap;`}>
          {tabBtn('overview', 'Overview')}
          {tabBtn('badges', `Badges (${badges.length})`)}
          {tabBtn('challenges', `Challenges (${challenges.length})`)}
          {tabBtn('history', 'XP History')}
        </div>

        {/* Badges */}
        {tab === 'badges' && (
          <div className={css`display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;`}>
            {badges.length === 0 && (
              <Card><p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>No badges yet. Complete services and consultations to earn them.</p></Card>
            )}
            {badges.map(({ badge, earnedAt }) => (
              <div key={badge.id} className={css`
                background: ${theme.colors.obsidianMid};
                border: 1px solid ${TIER_COLORS[badge.tier] ?? theme.colors.borderDefault}60;
                border-radius: ${theme.radii.lg};
                padding: 1.25rem;
                text-align: center;
                position: relative;
              `}>
                <div className={css`font-size: 2.5rem; margin-bottom: 0.75rem;`}>{badge.icon}</div>
                <div className={css`
                  position: absolute; top: 0.625rem; right: 0.625rem;
                  font-size: 0.65rem; padding: 0.15rem 0.4rem; border-radius: 999px;
                  background: ${TIER_COLORS[badge.tier] ?? theme.colors.roseGold}20;
                  color: ${TIER_COLORS[badge.tier] ?? theme.colors.roseGold};
                  text-transform: capitalize;
                `}>{badge.tier}</div>
                <p className={css`color: ${theme.colors.warmCream}; font-weight: 600; font-size: 0.875rem; margin: 0 0 0.375rem;`}>{badge.name}</p>
                <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; margin: 0 0 0.5rem; line-height: 1.4;`}>{badge.description}</p>
                <p className={css`color: ${theme.colors.textMuted}; font-size: 0.7rem; margin: 0;`}>
                  {new Date(earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Challenges */}
        {tab === 'challenges' && (
          <div className={css`display: flex; flex-direction: column; gap: 0.75rem;`}>
            {challenges.length === 0 && (
              <Card><p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>No active challenges. Check back soon.</p></Card>
            )}
            {challenges.map(({ challenge, progress, target, completedAt }) => {
              const pct = Math.min(100, Math.round((progress / target) * 100));
              return (
                <div key={challenge.id} className={css`
                  background: ${theme.colors.obsidianMid};
                  border: 1px solid ${completedAt ? theme.colors.success + '40' : theme.colors.borderDefault};
                  border-radius: ${theme.radii.md};
                  padding: 1.25rem;
                `}>
                  <div className={css`display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 0.75rem;`}>
                    <div className={css`display: flex; align-items: center; gap: 0.625rem;`}>
                      <span className={css`font-size: 1.5rem;`}>{challenge.icon}</span>
                      <div>
                        <p className={css`color: ${theme.colors.warmCream}; font-weight: 600; font-size: 0.9rem; margin: 0;`}>{challenge.title}</p>
                        <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.78rem; margin: 0.2rem 0 0;`}>{challenge.description}</p>
                      </div>
                    </div>
                    <span className={css`color: ${theme.colors.roseGold}; font-size: 0.8rem; font-weight: 600; white-space: nowrap;`}>+{challenge.xpReward} XP</span>
                  </div>
                  <div className={css`display: flex; align-items: center; gap: 0.75rem;`}>
                    <div className={css`flex: 1; height: 6px; background: ${theme.colors.borderDefault}; border-radius: 3px; overflow: hidden;`}>
                      <div className={css`height: 100%; background: ${completedAt ? theme.colors.success : theme.colors.roseGold}; width: ${pct}%; border-radius: 3px; transition: width 0.3s;`} />
                    </div>
                    <span className={css`color: ${completedAt ? theme.colors.success : theme.colors.textMuted}; font-size: 0.75rem; white-space: nowrap;`}>
                      {completedAt ? '✓ Complete' : `${progress}/${target}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* XP History */}
        {tab === 'history' && (
          <div className={css`display: flex; flex-direction: column; gap: 0.5rem;`}>
            {recentXp.length === 0 && (
              <Card><p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>No XP events yet.</p></Card>
            )}
            {recentXp.map((e) => (
              <div key={e.id} className={css`
                display: flex; align-items: center; justify-content: space-between;
                padding: 0.75rem 1rem;
                background: ${theme.colors.obsidianMid};
                border: 1px solid ${theme.colors.borderDefault};
                border-radius: ${theme.radii.sm};
              `}>
                <div>
                  <p className={css`color: ${theme.colors.warmCream}; font-size: 0.875rem; margin: 0;`}>{e.description}</p>
                  <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem; margin: 0.2rem 0 0;`}>
                    {new Date(e.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                  </p>
                </div>
                <span className={css`color: ${theme.colors.roseGold}; font-weight: 700; font-size: 0.9rem;`}>+{e.xpAwarded}</span>
              </div>
            ))}
          </div>
        )}

        {/* Overview tab */}
        {tab === 'overview' && (
          <div className={css`display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;`}>
            <Card>
              <p className={css`color: ${theme.colors.roseGold}; font-size: 0.75rem; font-weight: 600; margin: 0 0 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;`}>Recent Badges</p>
              {badges.slice(0, 3).map(({ badge }) => (
                <div key={badge.id} className={css`display: flex; align-items: center; gap: 0.625rem; margin-bottom: 0.5rem;`}>
                  <span className={css`font-size: 1.25rem;`}>{badge.icon}</span>
                  <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.8rem; margin: 0;`}>{badge.name}</p>
                </div>
              ))}
              {badges.length === 0 && <p className={css`color: ${theme.colors.textMuted}; font-size: 0.8rem;`}>No badges yet</p>}
            </Card>
            <Card>
              <p className={css`color: ${theme.colors.roseGold}; font-size: 0.75rem; font-weight: 600; margin: 0 0 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;`}>Active Challenges</p>
              {challenges.filter((c) => !c.completedAt).slice(0, 3).map(({ challenge, progress, target }) => (
                <div key={challenge.id} className={css`margin-bottom: 0.625rem;`}>
                  <div className={css`display: flex; justify-content: space-between; margin-bottom: 0.25rem;`}>
                    <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.8rem; margin: 0;`}>{challenge.icon} {challenge.title}</p>
                    <span className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem;`}>{progress}/{target}</span>
                  </div>
                  <div className={css`height: 4px; background: ${theme.colors.borderDefault}; border-radius: 2px; overflow: hidden;`}>
                    <div className={css`height: 100%; background: ${theme.colors.roseGold}; width: ${Math.min(100, Math.round((progress / target) * 100))}%;`} />
                  </div>
                </div>
              ))}
              {challenges.filter((c) => !c.completedAt).length === 0 && <p className={css`color: ${theme.colors.textMuted}; font-size: 0.8rem;`}>No active challenges</p>}
            </Card>
          </div>
        )}
      </MainContent>
    </>
  );
}
