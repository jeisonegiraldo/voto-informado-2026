import { ChatEngine } from '@/components/chat/chat-engine';
import { candidates } from '@/data/candidates';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Chat Electoral — Pregunta sobre candidatos y propuestas',
  description:
    'Resuelve tus dudas sobre las elecciones presidenciales de Colombia 2026. Respuestas basadas en los planes de gobierno oficiales.',
};

function ChatContent({
  searchParams,
}: {
  searchParams: Promise<{ candidato?: string }>;
}) {
  // We need to make this async to await searchParams in Next.js 16
  return <ChatContentInner searchParamsPromise={searchParams} />;
}

async function ChatContentInner({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ candidato?: string }>;
}) {
  const params = await searchParamsPromise;
  const candidateSlug = params.candidato;
  const candidate = candidateSlug
    ? candidates.find((c) => c.slug === candidateSlug)
    : undefined;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {candidate
            ? `Pregúntale al plan de ${candidate.name}`
            : 'Chat Electoral'}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {candidate
            ? `Pregunta sobre las propuestas de ${candidate.name} (${candidate.party}). Respuestas basadas en su plan de gobierno.`
            : 'Pregunta sobre propuestas, compara candidatos o resuelve tus dudas. Respuestas basadas en los planes de gobierno oficiales.'}
        </p>
      </div>
      <ChatEngine
        candidateFilter={candidate?.id}
        candidateName={candidate?.name}
      />
    </div>
  );
}

export default function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ candidato?: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-6 text-center text-gray-400">
          Cargando...
        </div>
      }
    >
      <ChatContent searchParams={searchParams} />
    </Suspense>
  );
}
