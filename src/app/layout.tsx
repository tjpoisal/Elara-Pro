import type { Metadata } from 'next';
import './globals.css';
import { SalonProvider } from '@/lib/salon-context';
import { ElaraChat } from '@/components/ElaraChat';

export const metadata: Metadata = {
  title: 'Elara Pro — AI Hair Color Consultation Platform',
  description:
    'Professional hair color consultation, formulation, and salon management platform for licensed stylists.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <meta name="theme-color" content="#1a1a2e" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: '#0f0f1a',
          color: '#f5f0e8',
          fontFamily: "'Inter', sans-serif",
          minHeight: '100vh',
        }}
      >
        <SalonProvider>
          {children}
          <ElaraChat />
        </SalonProvider>
      </body>
    </html>
  );
}
