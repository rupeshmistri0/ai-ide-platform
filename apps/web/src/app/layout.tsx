import React from 'react';

export const metadata = {
  title: 'AI IDE Platform Web Console',
  description: 'Enterprise AI Web Agent console',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif', background: '#0a0a0a', color: '#fff' }}>
        {children}
      </body>
    </html>
  );
}
