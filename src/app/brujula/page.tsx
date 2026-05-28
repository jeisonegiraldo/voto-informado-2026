import { BrujulaEngine } from '@/components/brujula/brujula-engine';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Brújula Electoral "A Ciegas" — Vota sin sesgo',
  description:
    'Descubre tu candidato ideal basándote solo en propuestas reales, sin saber quién las propone. Elimina el sesgo de colores políticos.',
};

export default function BrujulaPage() {
  return (
    <div className="py-6 sm:py-8">
      <BrujulaEngine />
    </div>
  );
}
