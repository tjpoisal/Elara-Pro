'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Button, Input, Badge } from '@/components/Navigation';

interface ProductResult {
  id: string;
  name: string;
  shade: string | null;
  upc: string | null;
  sizeGrams: string | null;
  category: string | null;
}

export default function ScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [manualUpc, setManualUpc] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProductResult | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsScanning(true);
      }
    } catch {
      setError('Camera access denied. Use manual entry below.');
    }
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const lookup = async (upc: string) => {
    if (!upc.trim()) return;
    setLoading(true);
    setResult(null);
    setNotFound(false);
    setError('');
    try {
      const res = await fetch(`/api/inventory?upc=${encodeURIComponent(upc.trim())}`);
      const data = await res.json();
      if (res.status === 404) { setNotFound(true); return; }
      if (!res.ok) { setError(data.error ?? 'Lookup failed.'); return; }
      setResult(data.product);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader title="Barcode Scanner" subtitle="Scan UPC codes to look up products" />
        <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; @media (max-width: 768px) { grid-template-columns: 1fr; }`}>
          <Card>
            <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Camera Scanner</h3>
            <div className={css`aspect-ratio: 4/3; background: ${theme.colors.obsidian}; border-radius: ${theme.radii.md}; overflow: hidden; margin-bottom: 1rem; display: flex; align-items: center; justify-content: center;`}>
              {isScanning ? (
                <video ref={videoRef} playsInline className={css`width: 100%; height: 100%; object-fit: cover;`} />
              ) : (
                <p className={css`color: ${theme.colors.textMuted}; font-size: 0.875rem;`}>Camera preview</p>
              )}
            </div>
            <div className={css`display: flex; gap: 0.75rem;`}>
              {!isScanning ? (
                <Button onClick={startScanning}>Start Camera</Button>
              ) : (
                <Button variant="danger" onClick={stopScanning}>Stop</Button>
              )}
            </div>
            <p className={css`color: ${theme.colors.textMuted}; font-size: 0.75rem; margin-top: 0.75rem;`}>
              Point camera at a UPC barcode. For best results, use manual entry below.
            </p>
          </Card>

          <Card>
            <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Manual Entry</h3>
            <div className={css`margin-bottom: 1rem;`}>
              <label className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.25rem;`}>UPC Code</label>
              <Input
                placeholder="Enter UPC barcode number"
                value={manualUpc}
                onChange={(e) => setManualUpc(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && lookup(manualUpc)}
              />
            </div>
            <Button onClick={() => lookup(manualUpc)} disabled={!manualUpc.trim() || loading}>
              {loading ? 'Looking up…' : 'Look Up Product'}
            </Button>

            {error && (
              <p className={css`color: ${theme.colors.error}; font-size: 0.8rem; margin-top: 0.75rem;`}>{error}</p>
            )}

            {notFound && (
              <div className={css`
                margin-top: 1rem; padding: 1rem;
                background: ${theme.colors.topaz}10;
                border: 1px solid ${theme.colors.topaz}40;
                border-radius: ${theme.radii.md};
              `}>
                <p className={css`color: ${theme.colors.topaz}; font-size: 0.875rem; margin: 0 0 0.5rem;`}>
                  Product not found for UPC: {manualUpc}
                </p>
                <p className={css`color: ${theme.colors.textMuted}; font-size: 0.78rem; margin: 0;`}>
                  This product isn't in the catalog yet. Ask Elara about it to add it.
                </p>
              </div>
            )}

            {result && (
              <div className={css`
                margin-top: 1rem; padding: 1rem;
                background: ${theme.colors.success}10;
                border: 1px solid ${theme.colors.success}40;
                border-radius: ${theme.radii.md};
              `}>
                <div className={css`display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem;`}>
                  <div>
                    <p className={css`color: ${theme.colors.warmCream}; font-weight: 600; font-size: 0.9rem; margin: 0 0 0.25rem;`}>
                      {result.name}
                      {result.shade ? ` — ${result.shade}` : ''}
                    </p>
                    <div className={css`display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.375rem;`}>
                      {result.category && <Badge variant="default">{result.category}</Badge>}
                      {result.sizeGrams && <Badge variant="default">{result.sizeGrams}g</Badge>}
                      {result.upc && <span className={css`color: ${theme.colors.textMuted}; font-size: 0.72rem;`}>UPC: {result.upc}</span>}
                    </div>
                  </div>
                  <Button variant="secondary" onClick={() => router.push('/inventory')}>
                    View Inventory
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </MainContent>
    </>
  );
}
