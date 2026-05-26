import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
