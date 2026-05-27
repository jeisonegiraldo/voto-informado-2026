import { ClaimChecker } from '@/components/verificador/claim-checker';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verificador de Afirmaciones — ¿Es verdad que...?',
  description:
    'Verifica rumores y afirmaciones sobre los candidatos presidenciales de Colombia 2026 contra los planes de gobierno oficiales.',
};

export default function VerificadorPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Verificador de Afirmaciones
        </h1>
        <p className="mt-2 text-gray-500">
          ¿Escuchaste algo sobre un candidato y no sabes si es verdad? Pega la
          afirmación y la contrastamos con los planes de gobierno oficiales.
        </p>
      </div>
      <ClaimChecker />
    </div>
  );
}
