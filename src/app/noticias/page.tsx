import { NewsFeed } from '@/components/news/news-feed';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Noticias de campaña',
  description:
    'Últimas noticias sobre los candidatos presidenciales de Colombia 2026 de fuentes verificadas.',
};

export default function NoticiasPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Noticias de campaña</h1>
        <p className="mt-2 text-gray-500">
          Rastreo automatizado diario de medios colombianos verificados:
          El Tiempo, Semana, La Silla Vacía, Blu Radio, RCN y Caracol.
        </p>
      </div>
      <NewsFeed />
    </div>
  );
}
