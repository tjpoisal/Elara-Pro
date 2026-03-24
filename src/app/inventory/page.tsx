'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Button } from '@/components/Navigation';

interface InventoryItem {
  id: string;
  productId: string;
  currentStockGrams: string;
  minimumStockGrams: string;
  reorderPointGrams: string | null;
  location: string | null;
  lastRestockedAt: string | null;
  updatedAt: string;
}

interface Product {
  id: string;
  name: string;
  shade: string | null;
  sizeGrams: string | null;
}

type StockStatus = 'ok' | 'low' | 'critical' | 'out';

function getStatus(current: number, minimum: number): StockStatus {
  if (current <= 0) return 'out';
  if (current <= minimum * 0.5) return 'critical';
  if (current <= minimum) return 'low';
  return 'ok';
}

const STATUS_STYLE: Record<StockStatus, { label: string; color: string }> = {
  ok: { label: 'In Stock', color: theme.colors.success },
  low: { label: 'Low', color: '#f59e0b' },
  critical: { label: 'Critical', color: theme.colors.error },
  out: { label: 'Out', color: theme.colors.error },
};

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'low' | 'critical' | 'out'>('all');
  const [adjustItem, setAdjustItem] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustType, setAdjustType] = useState<'restock' | 'waste'>('restock');
  const [adjusting, setAdjusting] = useState(false);

  const load = () => {
    setLoading(true);
    fetch('/api/inventory')
      .then((r) => r.json())
      .then((d) => setItems(d.inventory ?? []))
      .catch(() => setError('Failed to load inventory'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const filtered = items.filter((item) => {
    if (filter === 'all') return true;
    const status = getStatus(parseFloat(item.currentStockGrams), parseFloat(item.minimumStockGrams));
    return status === filter;
  });

  const lowCount = items.filter((i) => {
    const s = getStatus(parseFloat(i.currentStockGrams), parseFloat(i.minimumStockGrams));
    return s === 'low' || s === 'critical' || s === 'out';
  }).length;

  const handleAdjust = async (itemId: string) => {
    if (!adjustAmount || isNaN(parseFloat(adjustAmount))) return;
    setAdjusting(true);
    try {
      await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inventoryItemId: itemId,
          amountGrams: parseFloat(adjustAmount),
          usageType: adjustType,
        }),
      });
      setAdjustItem(null);
      setAdjustAmount('');
      load();
    } catch {
      // silent
    } finally {
      setAdjusting(false);
    }
  };

  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader
          title="Inventory"
          subtitle={loading ? 'Loading…' : `${items.length} items tracked · ${lowCount} alert${lowCount !== 1 ? 's' : ''}`}
        />

        <div className={css`display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap;`}>
          <Link href="/inventory/scan"><Button>Scan Barcode</Button></Link>
          {(['all', 'low', 'critical', 'out'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={css`
                padding: 0.4rem 0.875rem;
                border-radius: ${theme.radii.sm};
                border: 1px solid ${filter === f ? theme.colors.roseGold : theme.colors.borderDefault};
                background: ${filter === f ? theme.colors.roseGold + '20' : 'transparent'};
                color: ${filter === f ? theme.colors.roseGold : theme.colors.textSecondary};
                font-size: 0.8rem; cursor: pointer; text-transform: capitalize;
              `}
            >{f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>

        {loading && (
          <div className={css`text-align: center; padding: 3rem; color: ${theme.colors.textMuted};`}>Loading inventory…</div>
        )}
        {error && <Card><p className={css`color: ${theme.colors.error}; font-size: 0.875rem;`}>{error}</p></Card>}

        {!loading && !error && filtered.length === 0 && (
          <Card>
            <p className={css`color: ${theme.colors.textSecondary}; font-size: 0.875rem;`}>
              {filter === 'all'
                ? 'No inventory items yet. Scan a barcode or add products to get started.'
                : `No ${filter} stock items.`}
            </p>
          </Card>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className={css`display: flex; flex-direction: column; gap: 0.5rem;`}>
            {filtered.map((item) => {
              const current = parseFloat(item.currentStockGrams);
              const minimum = parseFloat(item.minimumStockGrams);
              const status = getStatus(current, minimum);
              const { label, color } = STATUS_STYLE[status];
              const pct = minimum > 0 ? Math.min(100, (current / (minimum * 2)) * 100) : 100;

              return (
                <div
                  key={item.id}
                  className={css`
                    background: ${theme.colors.obsidianMid};
                    border: 1px solid ${status !== 'ok' ? color + '40' : theme.colors.borderDefault};
                    border-radius: ${theme.radii.md};
                    padding: 1rem 1.25rem;
                  `}
                >
                  <div className={css`display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;`}>
                    <div className={css`flex: 1; min-width: 200px;`}>
                      <div className={css`display: flex; align-items: center; gap: 0.625rem; margin-bottom: 0.375rem;`}>
                        <p className={css`color: ${theme.colors.warmCream}; font-weight: 600; margin: 0; font-size: 0.9rem;`}>
                          Product #{item.productId.slice(0, 8)}
                        </p>
                        <span className={css`
                          font-size: 0.7rem; padding: 0.15rem 0.5rem;
                          border-radius: 999px;
                          background: ${color}20; color: ${color};
                        `}>{label}</span>
                      </div>
                      <div className={css`
                        height: 4px; background: ${theme.colors.borderDefault};
                        border-radius: 2px; overflow: hidden; width: 180px; margin-bottom: 0.375rem;
                      `}>
                        <div className={css`
                          height: 100%; width: ${pct}%;
                          background: ${color};
                          border-radius: 2px;
                          transition: width 0.3s;
                        `} />
                      </div>
                      <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem; margin: 0;`}>
                        {current.toFixed(1)}g / {minimum.toFixed(1)}g min
                        {item.location ? ` · ${item.location}` : ''}
                      </p>
                    </div>

                    <div className={css`display: flex; gap: 0.5rem;`}>
                      {adjustItem === item.id ? (
                        <div className={css`display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;`}>
                          <select
                            value={adjustType}
                            onChange={(e) => setAdjustType(e.target.value as 'restock' | 'waste')}
                            className={css`
                              padding: 0.35rem 0.5rem;
                              background: ${theme.colors.obsidian};
                              border: 1px solid ${theme.colors.borderDefault};
                              border-radius: ${theme.radii.sm};
                              color: ${theme.colors.warmCream};
                              font-size: 0.8rem;
                            `}
                          >
                            <option value="restock">Restock</option>
                            <option value="waste">Waste</option>
                            <option value="service">Service Use</option>
                          </select>
                          <input
                            type="number"
                            placeholder="grams"
                            value={adjustAmount}
                            onChange={(e) => setAdjustAmount(e.target.value)}
                            className={css`
                              width: 80px; padding: 0.35rem 0.5rem;
                              background: ${theme.colors.obsidian};
                              border: 1px solid ${theme.colors.borderDefault};
                              border-radius: ${theme.radii.sm};
                              color: ${theme.colors.warmCream};
                              font-size: 0.8rem;
                            `}
                          />
                          <Button onClick={() => handleAdjust(item.id)}>
                            {adjusting ? '…' : 'Save'}
                          </Button>
                          <Button variant="secondary" onClick={() => setAdjustItem(null)}>Cancel</Button>
                        </div>
                      ) : (
                        <Button variant="secondary" onClick={() => setAdjustItem(item.id)}>
                          Adjust
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </MainContent>
    </>
  );
}
