'use client';
/**
 * ServiceReminders — displays best practice, sanitation, and workspace
 * reminders organized by service phase. Used in consultations and the
 * formula builder. Supports collapsible phases and checklist mode.
 */
import { useState } from 'react';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import {
  getServiceChecklist,
  PRIORITY_META,
  CATEGORY_META,
  type Reminder,
  type ReminderPriority,
} from '@/lib/safety/bestPractices';

interface ServiceRemindersProps {
  serviceType: string;
  /** Show as interactive checklist (default: true) */
  checklistMode?: boolean;
  /** Collapse all phases by default */
  defaultCollapsed?: boolean;
  /** Only show critical + high priority */
  criticalOnly?: boolean;
}

function PriorityDot({ priority }: { priority: ReminderPriority }) {
  const meta = PRIORITY_META[priority];
  return (
    <span className={css`
      display: inline-block;
      width: 8px; height: 8px; border-radius: 50%;
      background: ${meta.color};
      flex-shrink: 0;
      margin-top: 2px;
    `} title={meta.label} />
  );
}

function ReminderCard({
  reminder,
  checked,
  onToggle,
  checklistMode,
}: {
  reminder: Reminder;
  checked: boolean;
  onToggle: () => void;
  checklistMode: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const catMeta = CATEGORY_META[reminder.category];

  return (
    <div className={css`
      background: ${checked ? theme.colors.obsidian + '80' : theme.colors.obsidian};
      border: 1px solid ${checked ? theme.colors.success + '40' : theme.colors.borderDefault};
      border-radius: ${theme.radii.sm};
      padding: 0.75rem;
      transition: all 0.15s;
      opacity: ${checked ? 0.65 : 1};
    `}>
      <div className={css`display: flex; align-items: flex-start; gap: 0.625rem;`}>
        {checklistMode && (
          <button
            onClick={onToggle}
            className={css`
              width: 18px; height: 18px; border-radius: 4px; flex-shrink: 0; margin-top: 1px;
              border: 1.5px solid ${checked ? theme.colors.success : theme.colors.borderDefault};
              background: ${checked ? theme.colors.success : 'transparent'};
              cursor: pointer; display: flex; align-items: center; justify-content: center;
              font-size: 10px; color: white;
              &:hover { border-color: ${theme.colors.success}; }
            `}
          >{checked ? '✓' : ''}</button>
        )}

        <span className={css`font-size: 1rem; flex-shrink: 0; line-height: 1.4;`}>{reminder.icon}</span>

        <div className={css`flex: 1; min-width: 0;`}>
          <div className={css`display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;`}>
            <p className={css`
              color: ${checked ? theme.colors.textMuted : theme.colors.warmCream};
              font-size: 0.825rem; font-weight: 600; margin: 0;
              text-decoration: ${checked ? 'line-through' : 'none'};
            `}>{reminder.title}</p>
            <PriorityDot priority={reminder.priority} />
          </div>

          {expanded && (
            <p className={css`
              color: ${theme.colors.textSecondary}; font-size: 0.78rem;
              line-height: 1.55; margin: 0.375rem 0 0;
            `}>{reminder.detail}</p>
          )}
        </div>

        <button
          onClick={() => setExpanded((e) => !e)}
          className={css`
            background: none; border: none; cursor: pointer;
            color: ${theme.colors.textMuted}; font-size: 0.75rem; flex-shrink: 0;
            padding: 0.125rem 0.25rem;
            &:hover { color: ${theme.colors.roseGold}; }
          `}
        >{expanded ? '▲' : '▼'}</button>
      </div>
    </div>
  );
}

export function ServiceReminders({
  serviceType,
  checklistMode = true,
  defaultCollapsed = false,
  criticalOnly = false,
}: ServiceRemindersProps) {
  const checklist = getServiceChecklist(serviceType);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [collapsed, setCollapsed] = useState<Set<string>>(
    defaultCollapsed ? new Set(checklist.map((p) => p.phase)) : new Set()
  );

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const togglePhase = (phase: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      next.has(phase) ? next.delete(phase) : next.add(phase);
      return next;
    });
  };

  const totalReminders = checklist.reduce((sum, p) => sum + p.reminders.length, 0);
  const checkedCount = checked.size;
  const pct = totalReminders > 0 ? Math.round((checkedCount / totalReminders) * 100) : 0;

  return (
    <div className={css`display: flex; flex-direction: column; gap: 0;`}>
      {/* Progress bar */}
      {checklistMode && (
        <div className={css`
          padding: 0.875rem 1rem;
          background: ${theme.colors.obsidian};
          border: 1px solid ${theme.colors.borderDefault};
          border-radius: ${theme.radii.md};
          margin-bottom: 1rem;
        `}>
          <div className={css`display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;`}>
            <p className={css`color: ${theme.colors.warmCream}; font-size: 0.825rem; font-weight: 600; margin: 0;`}>
              Service Checklist
            </p>
            <span className={css`color: ${pct === 100 ? theme.colors.success : theme.colors.roseGold}; font-size: 0.8rem; font-weight: 600;`}>
              {checkedCount}/{totalReminders} {pct === 100 ? '✓ Complete' : ''}
            </span>
          </div>
          <div className={css`height: 5px; background: ${theme.colors.borderDefault}; border-radius: 3px; overflow: hidden;`}>
            <div className={css`
              height: 100%; border-radius: 3px;
              background: ${pct === 100 ? theme.colors.success : theme.colors.roseGold};
              width: ${pct}%;
              transition: width 0.3s ease;
            `} />
          </div>
        </div>
      )}

      {/* Phases */}
      <div className={css`display: flex; flex-direction: column; gap: 0.75rem;`}>
        {checklist.map(({ phase, icon, reminders }) => {
          const filtered = criticalOnly
            ? reminders.filter((r) => r.priority === 'critical' || r.priority === 'high')
            : reminders;
          if (filtered.length === 0) return null;

          const isCollapsed = collapsed.has(phase);
          const phaseChecked = filtered.filter((r) => checked.has(r.id)).length;
          const phaseComplete = phaseChecked === filtered.length;

          return (
            <div key={phase} className={css`
              border: 1px solid ${phaseComplete ? theme.colors.success + '40' : theme.colors.borderDefault};
              border-radius: ${theme.radii.md};
              overflow: hidden;
            `}>
              {/* Phase header */}
              <button
                onClick={() => togglePhase(phase)}
                className={css`
                  width: 100%; padding: 0.75rem 1rem;
                  display: flex; align-items: center; justify-content: space-between;
                  background: ${phaseComplete ? theme.colors.success + '10' : theme.colors.obsidianMid};
                  border: none; cursor: pointer; text-align: left;
                  &:hover { background: ${theme.colors.obsidian}; }
                `}
              >
                <div className={css`display: flex; align-items: center; gap: 0.625rem;`}>
                  <span className={css`font-size: 1rem;`}>{icon}</span>
                  <span className={css`
                    color: ${phaseComplete ? theme.colors.success : theme.colors.warmCream};
                    font-size: 0.85rem; font-weight: 600;
                  `}>{phase}</span>
                  {checklistMode && (
                    <span className={css`
                      font-size: 0.7rem; padding: 0.1rem 0.5rem;
                      border-radius: 999px;
                      background: ${phaseComplete ? theme.colors.success + '20' : theme.colors.borderDefault};
                      color: ${phaseComplete ? theme.colors.success : theme.colors.textMuted};
                    `}>{phaseChecked}/{filtered.length}</span>
                  )}
                </div>
                <span className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem;`}>
                  {isCollapsed ? '▼' : '▲'}
                </span>
              </button>

              {/* Reminders list */}
              {!isCollapsed && (
                <div className={css`padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; background: ${theme.colors.obsidianMid};`}>
                  {filtered.map((reminder) => (
                    <ReminderCard
                      key={reminder.id}
                      reminder={reminder}
                      checked={checked.has(reminder.id)}
                      onToggle={() => toggle(reminder.id)}
                      checklistMode={checklistMode}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Compact inline reminder strip — shows only critical items */
export function CriticalReminders({ serviceType }: { serviceType: string }) {
  const checklist = getServiceChecklist(serviceType);
  const critical = checklist
    .flatMap((p) => p.reminders)
    .filter((r) => r.priority === 'critical');

  if (critical.length === 0) return null;

  return (
    <div className={css`
      background: ${theme.colors.error}10;
      border: 1px solid ${theme.colors.error}40;
      border-radius: ${theme.radii.md};
      padding: 0.875rem 1rem;
    `}>
      <p className={css`color: ${theme.colors.error}; font-size: 0.75rem; font-weight: 700; margin: 0 0 0.625rem; text-transform: uppercase; letter-spacing: 0.06em;`}>
        ⚠ Critical Reminders
      </p>
      <div className={css`display: flex; flex-direction: column; gap: 0.375rem;`}>
        {critical.map((r) => (
          <div key={r.id} className={css`display: flex; align-items: flex-start; gap: 0.5rem;`}>
            <span className={css`font-size: 0.875rem; flex-shrink: 0;`}>{r.icon}</span>
            <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.8rem; margin: 0; line-height: 1.4;`}>
              <strong className={css`color: ${theme.colors.warmCream};`}>{r.title}</strong>
              {' — '}{r.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
