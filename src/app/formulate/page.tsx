'use client';
import { Navigation, MainContent, PageHeader } from '@/components/Navigation';

export default function FormulatePage() {
  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader title="Formulate" subtitle="Create and manage hair color formulas" />
      </MainContent>
    </>
  );
}
