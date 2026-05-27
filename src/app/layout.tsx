import type { Metadata, Viewport } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FloatingChat } from '@/components/chat/floating-chat';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: 'VotaInformado 2026 — Compara candidatos y vota informado',
    template: '%s | VotaInformado 2026',
  },
  description:
    'Herramienta ciudadana no-partidista para comparar candidatos presidenciales de Colombia 2026. Compara propuestas, descubre tu afinidad y vota informado.',
  keywords: [
    'elecciones colombia 2026',
    'candidatos presidenciales',
    'comparar candidatos',
    'test afinidad electoral',
    'vota informado',
    'cepeda',
    'espriella',
    'valencia',
    'fajardo',
  ],
  icons: {
    icon: '/favicon.svg',
  },
  metadataBase: new URL('https://votainformadoco.org'),
  openGraph: {
    title: 'VotaInformado 2026 — Compara candidatos y vota informado',
    description:
      'Compara propuestas de los 4 candidatos presidenciales de Colombia. Descubre tu afinidad y noticias actualizadas.',
    type: 'website',
    locale: 'es_CO',
    url: 'https://votainformadoco.org',
    images: [
      {
        url: '/api/og/home',
        width: 1200,
        height: 630,
        alt: 'VotaInformado 2026 — Compara candidatos presidenciales de Colombia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VotaInformado 2026 — Compara candidatos y vota informado',
    description:
      'Compara propuestas de los 4 candidatos presidenciales de Colombia. Descubre tu afinidad y noticias actualizadas.',
    images: ['/api/og/home'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingChat />
      </body>
    </html>
  );
}
