import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Reality Forecast — Future Intelligence for Real Decisions',
  description: 'Evidence-based forecasting, realistic scenario simulation, risk evaluation, and decision-support tool.',
  manifest: '/manifest.json',
  themeColor: '#1D0C38',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
