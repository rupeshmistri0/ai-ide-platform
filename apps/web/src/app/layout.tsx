import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import { AppProviders } from '@/providers/app-providers';

export const metadata: Metadata = {
  title: 'Enterprise AI Web Platform | Next.js 15 App Router',
  description: 'Scalable Next.js 15 enterprise architecture with TailwindCSS, shadcn/ui, Zustand, and TanStack Query',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased min-h-screen">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
