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
    default: 'VotoInformado 2026 — Compara candidatos y vota informado',
    template: '%s | VotoInformado 2026',
  },
  description:
    'Herramienta ciudadana no-partidista para comparar candidatos presidenciales de Colombia 2026. Compara propuestas, haz el quiz de afinidad y vota informado.',
  keywords: [
    'elecciones colombia 2026',
    'candidatos presidenciales',
    'comparar candidatos',
    'quiz electoral',
    'voto informado',
    'cepeda',
    'espriella',
    'valencia',
    'fajardo',
  ],
  openGraph: {
    title: 'VotoInformado 2026 — Compara candidatos y vota informado',
    description:
      'Compara propuestas de los 4 candidatos presidenciales de Colombia. Quiz de afinidad y noticias actualizadas.',
    type: 'website',
    locale: 'es_CO',
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
