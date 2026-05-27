import { PetitionForm } from '@/components/buzon/petition-form';
import { PetitionStatsDisplay } from '@/components/buzon/petition-stats-display';
import { PetitionWall } from '@/components/buzon/petition-wall';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buzón Ciudadano — Tu voz cuenta',
  description:
    'Envía comentarios, peticiones o preguntas a los candidatos presidenciales de Colombia 2026. Apoya las mejores ideas del muro ciudadano.',
};

export default function BuzonPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <div className="mb-6 text-center sm:mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Buzón Ciudadano</h1>
        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Publica tu comentario, petición o pregunta a un candidato.
          Apoya las mejores ideas y haz que tu voz cuente.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5 lg:gap-8">
        {/* Form + Wall */}
        <div className="lg:col-span-3 space-y-8">
          <div className="rounded-xl border bg-white p-4 shadow-sm sm:p-6">
            <PetitionForm />
          </div>

          {/* Public Wall */}
          <PetitionWall />
        </div>

        {/* Stats sidebar */}
        <div className="lg:col-span-2">
          <div className="sticky top-16 space-y-6 sm:top-20">
            <div>
              <h2 className="mb-4 text-sm font-semibold text-gray-500">
                📊 Participación ciudadana
              </h2>
              <PetitionStatsDisplay />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
