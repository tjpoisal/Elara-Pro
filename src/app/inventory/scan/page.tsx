'use client';
import { useState, useRef, useEffect } from 'react';
import { css } from '@emotion/css';
import { theme } from '@/lib/theme';
import { Navigation, MainContent, PageHeader, Card, Button, Input } from '@/components/Navigation';

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [manualUpc, setManualUpc] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const startScanning = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
      }
    } catch (err) {
      console.error('Camera access denied');
    }
  };

  const stopScanning = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((t) => t.stop());
      setIsScanning(false);
    }
  };

  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader title="Barcode Scanner" subtitle="Scan UPC codes to look up or add products" />
        <div className={css`display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; @media (max-width: 768px) { grid-template-columns: 1fr; }`}>
          <Card>
            <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Camera Scanner</h3>
            <div className={css`aspect-ratio: 4/3; background: ${theme.colors.obsidian}; border-radius: ${theme.radii.md}; overflow: hidden; margin-bottom: 1rem; display: flex; align-items: center; justify-content: center;`}>
              {isScanning ? (
                <video ref={videoRef} autoPlay playsInline className={css`width: 100%; height: 100%; object-fit: cover;`} />
              ) : (
                <p className={css`color: ${theme.colors.textMuted};`}>Camera preview</p>
              )}
            </div>
            <div className={css`display: flex; gap: 0.75rem;`}>
              {!isScanning ? (
                <Button onClick={startScanning}>Start Scanning</Button>
              ) : (
                <Button variant="danger" onClick={stopScanning}>Stop</Button>
              )}
            </div>
          </Card>
          <Card>
            <h3 className={css`font-family: ${theme.fonts.heading}; color: ${theme.colors.warmCream}; margin-bottom: 1rem;`}>Manual Entry</h3>
            <div className={css`margin-bottom: 1rem;`}>
              <label className={css`color: ${theme.colors.textSecondary}; font-size: 0.75rem; display: block; margin-bottom: 0.25rem;`}>UPC Code</label>
              <Input placeholder="Enter UPC barcode number" value={manualUpc} onChange={(e) => setManualUpc(e.target.value)} />
            </div>
            <Button disabled={!manualUpc}>Look Up Product</Button>
          </Card>
        </div>
      </MainContent>
    </>
  );
}
