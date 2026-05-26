'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { decodeResults, calculateQuizResults } from '@/lib/quiz-scoring';
import { candidateMap, candidates } from '@/data/candidates';
import { dimensionMap } from '@/data/dimensions';
import { CandidateAvatar } from '@/components/shared/candidate-avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { RefreshCw, Share2, BarChart3 } from 'lucide-react';
import type { CandidateId } from '@/types/candidate';

function ResultsContent() {
  const searchParams = useSearchParams();
  const encoded = searchParams.get('r');

  if (!encoded) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">No hay resultados</h1>
        <p className="mt-2 text-gray-500">Primero debes completar el quiz de afinidad.</p>
        <Link href="/quiz" className="mt-4 inline-block">
          <Button>Hacer el Quiz</Button>
        </Link>
      </div>
    );
  }

  const answers = decodeResults(encoded);
  if (!answers || answers.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Resultados inválidos</h1>
        <Link href="/quiz" className="mt-4 inline-block">
          <Button>Repetir el Quiz</Button>
        </Link>
      </div>
    );
  }

  const result = calculateQuizResults(answers);
  const topCandidate = candidateMap[result.topCandidate];

  // Sort candidates by percentage descending
  const sorted = [...candidates].sort(
    (a, b) => result.candidatePercentages[b.id as CandidateId] - result.candidatePercentages[a.id as CandidateId]
  );

  const handleShare = async () => {
    const url = window.location.href;
    const text = `Mi afinidad política: ${topCandidate?.name} (${result.candidatePercentages[result.topCandidate]}%). Descubre la tuya en VotoInformado 2026.`;
    if (navigator.share) {
      await navigator.share({ title: 'Mi resultado - VotoInformado 2026', text, url });
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      alert('Enlace copiado al portapapeles');
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Top result */}
      <div className="mb-6 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-gray-400">
          Tu mayor afinidad es con
        </p>
        {topCandidate && (
          <div className="mt-3 flex flex-col items-center">
            <CandidateAvatar candidate={topCandidate} size="lg" />
            <h1 className="mt-3 text-3xl font-bold text-gray-900">{topCandidate.name}</h1>
            <p className="text-gray-500">{topCandidate.party}</p>
            <span
              className="mt-2 inline-block rounded-full px-4 py-1 text-lg font-bold text-white"
              style={{ backgroundColor: topCandidate.color }}
            >
              {result.candidatePercentages[result.topCandidate]}% de afinidad
            </span>
          </div>
        )}
      </div>

      {/* All candidates bar chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Afinidad con todos los candidatos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {sorted.map((c) => {
            const pct = result.candidatePercentages[c.id as CandidateId];
            return (
              <div key={c.id}>
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CandidateAvatar candidate={c} size="sm" />
                    <span className="text-sm font-medium text-gray-700">{c.name}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: c.color }}>
                    {pct}%
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: c.color }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Breakdown by dimension */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Desglose por dimensión</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.dimensionBreakdown.map((db) => {
            const dim = dimensionMap[db.dimensionId];
            if (!dim) return null;

            return (
              <div key={db.dimensionId}>
                <p className="text-sm font-semibold text-gray-800">{dim.name}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{db.userChoice}</p>
                <div className="mt-1 flex gap-2">
                  {candidates.map((c) => {
                    const score = db.candidateAlignment[c.id as CandidateId] ?? 0;
                    return (
                      <div key={c.id} className="flex items-center gap-1">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${Math.max(4, score * 16)}px`,
                            backgroundColor: c.color,
                          }}
                        />
                        <span className="text-[10px] text-gray-400">
                          {c.name.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <Separator className="mt-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button onClick={handleShare} variant="outline" className="gap-2">
          <Share2 className="h-4 w-4" />
          Compartir resultado
        </Button>
        <Link href="/quiz">
          <Button variant="outline" className="w-full gap-2 sm:w-auto">
            <RefreshCw className="h-4 w-4" />
            Repetir quiz
          </Button>
        </Link>
        <Link href="/comparar">
          <Button className="w-full gap-2 sm:w-auto">
            <BarChart3 className="h-4 w-4" />
            Ver comparador
          </Button>
        </Link>
      </div>

      <p className="mt-6 text-center text-xs text-gray-400">
        Este resultado es una guía orientativa basada en tus respuestas. Te invitamos a explorar los
        perfiles completos y planes de gobierno de cada candidato.{' '}
        <Link href="/metodologia" className="underline">
          Ver metodología
        </Link>
      </p>
    </div>
  );
}

export default function ResultadoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-gray-400">Calculando resultados...</p>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
