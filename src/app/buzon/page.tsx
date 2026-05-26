import { PetitionForm } from '@/components/buzon/petition-form';
import { PetitionStatsDisplay } from '@/components/buzon/petition-stats-display';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buzón Ciudadano — Tu voz cuenta',
  description:
    'Envía comentarios, peticiones o preguntas a los candidatos presidenciales de Colombia 2026. Tu mensaje será clasificado y compilado.',
};

export default function BuzonPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Buzón Ciudadano</h1>
        <p className="mt-2 text-gray-500">
          Envía un comentario, petición o pregunta a un candidato.
          Tu mensaje será clasificado automáticamente por tema y compilado para los equipos de campaña.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form - wider column */}
        <div className="lg:col-span-3">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <PetitionForm />
          </div>
        </div>

        {/* Stats sidebar */}
        <div className="lg:col-span-2">
          <div className="sticky top-20">
            <h2 className="mb-4 text-sm font-semibold text-gray-500">
              📊 Participación ciudadana
            </h2>
            <PetitionStatsDisplay />
          </div>
        </div>
      </div>
    </div>
  );
}
