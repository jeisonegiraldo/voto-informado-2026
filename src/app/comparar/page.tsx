import { ComparisonMatrix } from '@/components/comparison/comparison-matrix';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Comparar Candidatos',
  description:
    'Compara las posiciones de los 4 candidatos presidenciales de Colombia 2026 en 12 dimensiones clave.',
};

export default function CompararPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Comparar Candidatos</h1>
        <p className="mt-2 text-gray-500">
          12 dimensiones clave para entender las diferencias entre los 4 candidatos presidenciales.
          Pasa el cursor sobre cada punto para ver el detalle.
        </p>
      </div>
      <ComparisonMatrix />
    </div>
  );
}
