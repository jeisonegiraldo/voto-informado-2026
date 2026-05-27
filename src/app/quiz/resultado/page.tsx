'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { decodeResults, calculateQuizResults } from '@/lib/quiz-scoring';
import { quizQuestions } from '@/data/quiz-questions';
import { positions } from '@/data/positions';
import { candidateMap, candidates } from '@/data/candidates';
import { dimensionMap } from '@/data/dimensions';
import { CandidateAvatar } from '@/components/shared/candidate-avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { RefreshCw, Share2, BarChart3, MessageCircle, Copy, ChevronDown } from 'lucide-react';
import type { CandidateId } from '@/types/candidate';

function DimensionBreakdownCard({
  dimensionBreakdown,
}: {
  dimensionBreakdown: { dimensionId: string; userChoice: string; candidateAlignment: Record<CandidateId, number> }[];
  candidatePercentages: Record<CandidateId, number>;
}) {
  const [expandedDim, setExpandedDim] = useState<string | null>(null);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-base">
          Desglose por dimensión — ¿Por qué este resultado?
        </CardTitle>
        <p className="text-xs text-gray-500">
          Haz clic en una dimensión para ver qué elegiste y qué propone cada candidato.
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        {dimensionBreakdown.map((db) => {
          const dim = dimensionMap[db.dimensionId];
          if (!dim) return null;
          const isExpanded = expandedDim === db.dimensionId;

          // Find the matching quiz question to show what user chose
          const question = quizQuestions.find((q) => q.dimensionId === db.dimensionId);

          // Find the best-aligned candidate for this dimension
          const bestCandidateId = (Object.entries(db.candidateAlignment) as [CandidateId, number][])
            .sort(([, a], [, b]) => b - a)[0]?.[0];
          const bestCandidate = candidates.find((c) => c.id === bestCandidateId);

          return (
            <div key={db.dimensionId} className="rounded-lg border">
              <button
                type="button"
                onClick={() => setExpandedDim(isExpanded ? null : db.dimensionId)}
                className="flex w-full items-center gap-3 p-3 text-left"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-gray-800">{dim.name}</p>
                    {bestCandidate && (
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[10px] font-medium text-white"
                        style={{ backgroundColor: bestCandidate.color }}
                      >
                        {bestCandidate.name.split(' ').slice(-1)[0]}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex gap-1.5">
                    {candidates.map((c) => {
                      const score = db.candidateAlignment[c.id as CandidateId] ?? 0;
                      return (
                        <div
                          key={c.id}
                          className="h-2 rounded-full"
                          style={{
                            width: `${Math.max(8, score * 20)}px`,
                            backgroundColor: c.color,
                            opacity: score > 0 ? 1 : 0.2,
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isExpanded && (
                <div className="border-t bg-gray-50/50 p-3">
                  {/* What the user chose */}
                  <div className="mb-3 rounded-lg bg-teal-50 p-2.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-teal-600">
                      Tu respuesta
                    </p>
                    <p className="mt-0.5 text-xs text-gray-700">{db.userChoice}</p>
                  </div>

                  {/* What the question asked */}
                  {question && (
                    <p className="mb-2 text-[10px] italic text-gray-400">
                      Pregunta: {question.text}
                    </p>
                  )}

                  {/* Each candidate's alignment and real position */}
                  <div className="space-y-2">
                    {(
                      [...candidates].sort(
                        (a, b) =>
                          (db.candidateAlignment[b.id as CandidateId] ?? 0) -
                          (db.candidateAlignment[a.id as CandidateId] ?? 0)
                      )
                    ).map((c) => {
                      const score = db.candidateAlignment[c.id as CandidateId] ?? 0;
                      const pos = positions.find(
                        (p) => p.candidateId === c.id && p.dimensionId === db.dimensionId
                      );
                      const alignLabel =
                        score === 3
                          ? 'Alta afinidad'
                          : score === 2
                            ? 'Afinidad moderada'
                            : score === 1
                              ? 'Afinidad baja'
                              : 'Sin afinidad';

                      return (
                        <div
                          key={c.id}
                          className="rounded-lg border bg-white p-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CandidateAvatar candidate={c} size="sm" />
                              <span
                                className="text-xs font-bold"
                                style={{ color: c.color }}
                              >
                                {c.name.split(' ').slice(-1)[0]}
                              </span>
                            </div>
                            <span
                              className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                              style={{
                                backgroundColor:
                                  score >= 2 ? `${c.color}20` : '#f3f4f6',
                                color: score >= 2 ? c.color : '#9ca3af',
                              }}
                            >
                              {alignLabel} ({score}/3)
                            </span>
                          </div>
                          {pos && (
                            <p className="mt-1.5 text-[11px] leading-relaxed text-gray-600">
                              {pos.summary.length > 150
                                ? pos.summary.slice(0, 150) + '…'
                                : pos.summary}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

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

  const shareText = `🗳️ Mi afinidad política en VotaInformado 2026:\n\n${sorted.map((c) => `${c.name}: ${result.candidatePercentages[c.id as CandidateId]}%`).join('\n')}\n\nMi mayor afinidad: ${topCandidate?.name} (${result.candidatePercentages[result.topCandidate]}%)\n\n¿Y tú con quién tienes más afinidad? Descúbrelo:`;

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: 'Mi resultado - VotaInformado 2026', text: shareText, url });
    } else {
      await navigator.clipboard.writeText(`${shareText}\n${url}`);
      alert('Enlace copiado al portapapeles');
    }
  };

  const handleWhatsApp = () => {
    const url = window.location.href;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${url}`)}`;
    window.open(waUrl, '_blank');
  };

  const handleCopy = async () => {
    const url = window.location.href;
    await navigator.clipboard.writeText(`${shareText}\n${url}`);
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
            <BarChart3 className="h-5 w-5 text-teal-600" />
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

      {/* Breakdown by dimension — expandable */}
      <DimensionBreakdownCard
        dimensionBreakdown={result.dimensionBreakdown}
        candidatePercentages={result.candidatePercentages}
      />

      {/* Share section */}
      <Card className="mb-6">
        <CardContent className="py-4">
          <p className="mb-3 text-center text-sm font-semibold text-gray-700">
            Comparte tu resultado
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              onClick={handleWhatsApp}
              className="gap-2 bg-[#25D366] text-white hover:bg-[#20bd5a]"
            >
              <MessageCircle className="h-4 w-4" />
              Compartir por WhatsApp
            </Button>
            <Button onClick={handleShare} variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Compartir
            </Button>
            <Button onClick={handleCopy} variant="outline" className="gap-2">
              <Copy className="h-4 w-4" />
              Copiar enlace
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
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
