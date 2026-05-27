import { BrujulaEngine } from '@/components/brujula/brujula-engine';
import { EyeOff, Compass } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brújula Electoral "A Ciegas" — Vota sin sesgo',
  description:
    'Descubre tu candidato ideal basándote solo en propuestas reales, sin saber quién las propone. Elimina el sesgo de colores políticos.',
};

export default function BrujulaPage() {
  return (
    <div className="py-6 sm:py-8">
      {/* Header */}
      <div className="mx-auto max-w-lg px-4 text-center mb-6">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-lg">
          <Compass className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Brújula Electoral
          <span className="text-gradient-teal"> &ldquo;A Ciegas&rdquo;</span>
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          <EyeOff className="mr-1 inline h-4 w-4" />
          20 propuestas reales, sin nombres ni colores. Solo tú y las ideas.
        </p>
      </div>

      <BrujulaEngine />
    </div>
  );
}
