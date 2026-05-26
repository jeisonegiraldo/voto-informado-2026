import type { Metadata } from 'next';
import { Card, CardContent } from '@/components/ui/card';
import { Newspaper } from 'lucide-react';

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
          Rastreo automatizado cada 5 horas de medios colombianos verificados.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <Newspaper className="h-12 w-12 text-gray-300" />
          <div>
            <h3 className="font-semibold text-gray-700">Próximamente</h3>
            <p className="mt-1 text-sm text-gray-500">
              El sistema de rastreo de noticias se activará una vez configurado en Vercel con las
              variables de entorno necesarias. Las fuentes incluyen El Tiempo, Semana, La Silla
              Vacía, Blu Radio, RCN y Caracol.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
