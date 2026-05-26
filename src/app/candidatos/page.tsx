import { candidates } from '@/data/candidates';
import { CandidatePreviewCard } from '@/components/landing/candidate-preview-card';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Candidatos Presidenciales',
  description:
    'Conoce a los 4 candidatos presidenciales de Colombia 2026: propuestas, perfiles y planes de gobierno.',
};

export default function CandidatosPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Candidatos Presidenciales 2026</h1>
        <p className="mt-2 text-gray-500">
          Explora los perfiles completos, propuestas clave y planes de gobierno de cada candidato.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {candidates.map((candidate) => (
          <CandidatePreviewCard key={candidate.id} candidate={candidate} />
        ))}
      </div>
    </div>
  );
}
