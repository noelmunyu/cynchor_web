import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

const inter = localFont({
  src: '../../public/fonts/inter-latin-variable.woff2',
  display: 'swap',
  variable: '--font-inter',
  weight: '100 900',
});

const lexend = localFont({
  src: '../../public/fonts/lexend-latin-variable.woff2',
  display: 'swap',
  variable: '--font-lexend',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Cynchor — Adversarial Cyber Range & Live Training Platform',
  description: 'Simulating reality to secure the future',
  metadataBase: new URL('https://cynchor.com'),
  icons: {
    icon: '/brand/cynchor-mark.png',
  },
  openGraph: {
    title: 'Cynchor — Simulating reality to secure the future',
    description: 'Simulating reality to secure the future. Adversarial cyber range simulation and live training platform.',
    url: 'https://cynchor.com',
    siteName: 'Cynchor',
    images: [
      {
        url: '/brand/og-preview.png',
        width: 1200,
        height: 630,
        alt: 'Cynchor — Simulating reality to secure the future',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cynchor — Simulating reality to secure the future',
    description: 'Simulating reality to secure the future. Adversarial cyber range simulation and live training platform.',
    images: ['/brand/og-preview.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark bg-bg ${inter.variable} ${lexend.variable}`}>
      <body className="min-h-screen flex flex-col bg-bg text-text font-sans selection:bg-teal/30 selection:text-white">
        <Header />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
