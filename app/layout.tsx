import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'QueuePOS — Multi-Tenant SaaS POS & Order Queue System',
  description: 'A cloud-based POS and central real-time order queue system for restaurants, cafes, and fast-food counters.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-50 flex flex-col antialiased">
        <Navbar />
        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
