'use client';
/**
 * Salon context — stores the salon's selected brands/lines from onboarding.
 * In production this would be persisted to the DB (salons.settings jsonb column).
 * For now it uses localStorage so selections survive page refreshes.
 */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { US_PROFESSIONAL_BRANDS, type BrandSeed } from '@/lib/brands/data';

interface SalonSettings {
  selectedBrands: string[];       // brand slugs
  selectedLines: Record<string, string[]>; // brandSlug → lineSlug[]
}

interface SalonContextValue {
  settings: SalonSettings;
  updateBrands: (brands: string[], lines: Record<string, string[]>) => void;
  carriedBrands: BrandSeed[];     // full brand objects for carried brands
}

const DEFAULT: SalonSettings = { selectedBrands: [], selectedLines: {} };

const SalonContext = createContext<SalonContextValue>({
  settings: DEFAULT,
  updateBrands: () => {},
  carriedBrands: [],
});

export function SalonProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SalonSettings>(DEFAULT);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('elara_salon_settings');
      if (stored) setSettings(JSON.parse(stored));
    } catch {}
  }, []);

  const updateBrands = (brands: string[], lines: Record<string, string[]>) => {
    const next = { selectedBrands: brands, selectedLines: lines };
    setSettings(next);
    try { localStorage.setItem('elara_salon_settings', JSON.stringify(next)); } catch {}
  };

  const carriedBrands = settings.selectedBrands.length > 0
    ? US_PROFESSIONAL_BRANDS.filter((b) => settings.selectedBrands.includes(b.slug)).map((b) => ({
        ...b,
        lines: settings.selectedLines[b.slug]?.length
          ? b.lines.filter((l) => settings.selectedLines[b.slug]!.includes(l.slug))
          : b.lines,
      }))
    : US_PROFESSIONAL_BRANDS; // fallback: show all if nothing selected yet

  return (
    <SalonContext.Provider value={{ settings, updateBrands, carriedBrands }}>
      {children}
    </SalonContext.Provider>
  );
}

export function useSalon() {
  return useContext(SalonContext);
}
