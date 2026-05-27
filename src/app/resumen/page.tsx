import type { Metadata } from 'next';
import { candidates } from '@/data/candidates';
import { CandidateAvatar } from '@/components/shared/candidate-avatar';
import { PartyBadge } from '@/components/shared/party-badge';
import { positions } from '@/data/positions';
import { dimensionMap } from '@/data/dimensions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Clock, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Resumen Ejecutivo — Los 4 candidatos en 2 minutos',
  description:
    'Resumen rápido de los 4 candidatos presidenciales de Colombia 2026. Compara posiciones clave en seguridad, economía, salud, educación y más.',
};

const KEY_DIMENSIONS = [
  'security',
  'economic-model',
  'healthcare',
  'education',
  'petro-stance',
];

export default function ResumenPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
          <Clock className="h-3 w-3" />
          Lectura de 2 minutos
        </span>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">
          Resumen Ejecutivo
        </h1>
        <p className="mt-2 text-gray-500">
          Los 4 candidatos, sus propuestas esenciales y las diferencias clave —
          todo en una sola página.
        </p>
      </div>

      {/* Candidate summaries */}
      <div className="space-y-6">
        {candidates.map((c) => {
          const candidatePositions = positions.filter(
            (p) => p.candidateId === c.id
          );
          const topProposals = candidatePositions
            .flatMap((p) => p.keyProposals.slice(0, 1))
            .slice(0, 4);

          return (
            <div
              key={c.id}
              className="overflow-hidden rounded-2xl border bg-white shadow-sm"
            >
              <div
                className="h-1.5"
                style={{ backgroundColor: c.color }}
              />
              <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <CandidateAvatar candidate={c} size="lg" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold text-gray-900">
                        {c.name}
                      </h2>
                      <PartyBadge party={c.party} color={c.color} />
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                        style={{
                          backgroundColor: c.colorLight,
                          color: c.color,
                        }}
                      >
                        {c.ideologyLabel}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {c.coalition} · Fórmula vicepresidencial: {c.runningMate}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-gray-700">
                      {c.shortBio}
                    </p>

                    <div className="mt-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Propuestas insignia
                      </p>
                      <ul className="mt-1.5 space-y-1">
                        {topProposals.map((prop, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <span
                              className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{ backgroundColor: c.color }}
                            />
                            {prop}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      href={`/candidatos/${c.slug}`}
                      className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700"
                    >
                      Ver perfil completo
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison — top 5 dimensions */}
      <div className="mt-12">
        <h2 className="mb-4 text-center text-xl font-bold text-gray-900">
          Comparación rápida — 5 temas clave
        </h2>

        {/* Mobile: stacked cards per dimension */}
        <div className="space-y-4 sm:hidden">
          {KEY_DIMENSIONS.map((dimId) => {
            const dim = dimensionMap[dimId];
            if (!dim) return null;
            return (
              <div key={dimId} className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-4 py-2.5">
                  <p className="font-semibold text-gray-800">{dim.name}</p>
                  <p className="text-[11px] text-gray-400">
                    {dim.spectrumLabels[0]} ← → {dim.spectrumLabels[1]}
                  </p>
                </div>
                <div className="divide-y">
                  {candidates.map((c) => {
                    const pos = positions.find(
                      (p) => p.candidateId === c.id && p.dimensionId === dimId
                    );
                    return (
                      <div key={c.id} className="flex items-start gap-2.5 px-4 py-3">
                        <CandidateAvatar candidate={c} size="sm" />
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold" style={{ color: c.color }}>
                            {c.name.split(' ').slice(-1)[0]}
                          </span>
                          <p className="mt-0.5 text-xs leading-relaxed text-gray-600">
                            {pos
                              ? pos.summary.length > 140
                                ? pos.summary.slice(0, 140) + '…'
                                : pos.summary
                              : '—'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop: table */}
        <div className="hidden overflow-x-auto rounded-xl border bg-white shadow-sm sm:block">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">
                  Tema
                </th>
                {candidates.map((c) => (
                  <th key={c.id} className="px-3 py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <CandidateAvatar candidate={c} size="sm" />
                      <span
                        className="text-xs font-bold"
                        style={{ color: c.color }}
                      >
                        {c.name.split(' ').slice(-1)[0]}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {KEY_DIMENSIONS.map((dimId) => {
                const dim = dimensionMap[dimId];
                if (!dim) return null;
                return (
                  <tr key={dimId} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800">{dim.name}</p>
                      <p className="text-[11px] text-gray-400">
                        {dim.spectrumLabels[0]} ← → {dim.spectrumLabels[1]}
                      </p>
                    </td>
                    {candidates.map((c) => {
                      const pos = positions.find(
                        (p) =>
                          p.candidateId === c.id && p.dimensionId === dimId
                      );
                      return (
                        <td
                          key={c.id}
                          className="px-3 py-3 text-xs leading-relaxed text-gray-600"
                        >
                          {pos
                            ? pos.summary.length > 120
                              ? pos.summary.slice(0, 120) + '…'
                              : pos.summary
                            : '—'}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTAs */}
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link href="/quiz">
          <Button size="lg" className="bg-teal-500 text-white hover:bg-teal-400">
            Descubre tu Afinidad
          </Button>
        </Link>
        <Link href="/comparar">
          <Button size="lg" variant="outline">
            Ver comparador completo
          </Button>
        </Link>
      </div>
    </div>
  );
}
