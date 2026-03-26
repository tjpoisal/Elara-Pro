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
        <meta name="theme-color" content="#100d1e" />
      </head>
      <body>
        <SalonProvider>
          {children}
          <ElaraChat />
        </SalonProvider>
      </body>
    </html>
  );
}
