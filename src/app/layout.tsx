import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Outreach HQ — Harsh Sonavane',
  description: 'Worldwide engineering opportunity outreach dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg-primary text-fg-primary font-body antialiased">
        {children}
      </body>
    </html>
  );
}
