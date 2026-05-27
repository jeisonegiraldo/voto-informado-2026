import { TopicSearch } from '@/components/buscar/topic-search';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buscar por Tema — ¿Qué proponen sobre...?',
  description:
    'Busca un tema y compara lo que propone cada candidato presidencial de Colombia 2026. Pensiones, seguridad, salud, educación y más.',
};

export default function BuscarPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          ¿Qué proponen sobre...?
        </h1>
        <p className="mt-2 text-gray-500">
          Escribe un tema y ve al instante qué dice cada candidato. Respuestas
          basadas en los planes de gobierno oficiales.
        </p>
      </div>
      <TopicSearch />
    </div>
  );
}
