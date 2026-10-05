import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const viewport: Viewport = {
  themeColor: '#090d14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: 'THRYVE | Drone Threat Simulation Trainer',
  description: 'AI-enabled adaptive drone threat simulation and training assessment platform for Defence Services Staff College (MoD). Train in realistic scenarios, measure target acquisition decisions, and adapt future drills.',
  keywords: [
    'Drone Threat Simulation',
    'Counter-Drone Trainer',
    'Swarm Threat Assessment',
    'Defence Training Platform',
    'SIH 2026',
    'DSSC'
  ],
  authors: [{ name: 'THRYVE Defence Tech Team' }],
  openGraph: {
    title: 'THRYVE | Drone Threat Simulation Trainer',
    description: 'AI-enabled adaptive drone threat simulation & assessment platform for Ministry of Defence (MoD).',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased`}>
        <Navbar />
        <main className="flex-1 bg-tactical-grid">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
