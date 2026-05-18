'use client';
import { Navigation, MainContent, PageHeader } from '@/components/Navigation';

export default function SchoolPage() {
  return (
    <>
      <Navigation />
      <MainContent>
        <PageHeader title="School" subtitle="Education and training resources for stylists" />
      </MainContent>
    </>
  );
}
