'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  decodeBrujulaResults,
  calculateBrujulaResults,
} from '@/lib/brujula-scoring';
import { brujulaCards } from '@/data/brujula-cards';
import { candidateMap, candidates } from '@/data/candidates';
import { dimensionMap } from '@/data/dimensions';
import { CandidateAvatar } from '@/components/shared/candidate-avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ShareInvite } from '@/components/shared/share-invite';
import {
  RefreshCw,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
  SkipForward,
  Eye,
  Compass,
  Sparkles,
} from 'lucide-react';
import type { CandidateId } from '@/types/candidate';

function RevealContent() {
  const searchParams = useSearchParams();
  const encoded = searchParams.get('r');
  const [showReveal, setShowReveal] = useState(false);
  const [revealStep, setRevealStep] = useState(0); // 0: hidden, 1: revealing, 2: revealed

  if (!encoded) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">No hay resultados</h1>
        <p className="mt-2 text-gray-500">
          Primero debes completar la brújula electoral.
        </p>
        <Link href="/brujula" className="mt-4 inline-block">
          <Button>Hacer la Brújula</Button>
        </Link>
      </div>
    );
  }

  const swipes = decodeBrujulaResults(encoded);
  if (!swipes || swipes.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Resultados inválidos</h1>
        <Link href="/brujula" className="mt-4 inline-block">
          <Button>Repetir la Brújula</Button>
        </Link>
      </div>
    );
  }

  const result = calculateBrujulaResults(swipes, brujulaCards);
  const topCandidate = candidateMap[result.topCandidate];

  const sorted = [...candidates].sort(
    (a, b) =>
      result.candidatePercentages[b.id as CandidateId] -
      result.candidatePercentages[a.id as CandidateId]
  );

  const shareText = `🧭 Mi Brújula Electoral "A Ciegas" en VotoInformado 2026:\n\n${sorted.map((c) => `${c.name}: ${result.candidatePercentages[c.id as CandidateId]}%`).join('\n')}\n\nVoté sin saber quién proponía cada idea. Mi mayor afinidad: ${topCandidate?.name}\n\n¿Y tú? Descúbrelo:`;

  const inviteText = '🧭 ¿Ya sabes cuál candidato se alinea con lo que piensas? Hice la Brújula Electoral "A Ciegas" — 20 propuestas reales sin saber de quién son. ¡Inténtalo!';

  const handleReveal = () => {
    setShowReveal(true);
    setRevealStep(1);
    // After animation, mark as fully revealed
    setTimeout(() => setRevealStep(2), 1500);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Stats summary */}
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-lg">
          <Compass className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Tu Brújula Electoral
        </h1>
        <div className="mt-3 flex justify-center gap-6 text-sm">
          <span className="flex items-center gap-1.5 text-emerald-600">
            <ThumbsUp className="h-4 w-4" />
            {result.totalAgreed} de acuerdo
          </span>
          <span className="flex items-center gap-1.5 text-rose-500">
            <ThumbsDown className="h-4 w-4" />
            {result.totalDisagreed} en desacuerdo
          </span>
          <span className="flex items-center gap-1.5 text-gray-400">
            <SkipForward className="h-4 w-4" />
            {result.totalSkipped} omitidas
          </span>
        </div>
      </div>

      {/* Pre-reveal: anonymous results */}
      <AnimatePresence mode="wait">
        {!showReveal ? (
          <motion.div
            key="pre-reveal"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            {/* Anonymous bars */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Eye className="h-5 w-5 text-gray-400" />
                  Tus resultados están listos...
                </CardTitle>
                <p className="text-sm text-gray-500">
                  Respondiste basándote solo en propuestas.
                  ¿Listo para descubrir con quién coincidiste?
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                {sorted.map((c, i) => {
                  const pct = result.candidatePercentages[c.id as CandidateId];
                  return (
                    <div key={c.id}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">
                          Candidato {i + 1}
                        </span>
                        <span className="text-sm font-bold text-gray-500">
                          {pct}%
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-gray-400 transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <div className="text-center">
              <Button
                size="lg"
                onClick={handleReveal}
                className="gap-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg hover:from-teal-500 hover:to-teal-400"
              >
                <Eye className="h-5 w-5" />
                Revelar candidatos
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Top result with dramatic entrance */}
            {topCandidate && (
              <motion.div
                className="mb-6 text-center"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
              >
                <p className="text-sm font-medium uppercase tracking-wider text-gray-400">
                  Sin saberlo, coincidiste más con
                </p>
                <div className="mt-3 flex flex-col items-center">
                  <motion.div
                    initial={{ rotateY: 180, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <CandidateAvatar candidate={topCandidate} size="lg" />
                  </motion.div>
                  <motion.h2
                    className="mt-3 text-3xl font-bold text-gray-900"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    {topCandidate.name}
                  </motion.h2>
                  <motion.p
                    className="text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    {topCandidate.party}
                  </motion.p>
                  <motion.span
                    className="mt-2 inline-block rounded-full px-4 py-1 text-lg font-bold text-white"
                    style={{ backgroundColor: topCandidate.color }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.2, type: 'spring' }}
                  >
                    {result.candidatePercentages[result.topCandidate]}% de afinidad
                  </motion.span>
                </div>
              </motion.div>
            )}

            {/* Colored bar chart */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BarChart3 className="h-5 w-5 text-teal-600" />
                  Afinidad con todos los candidatos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sorted.map((c, i) => {
                  const pct = result.candidatePercentages[c.id as CandidateId];
                  return (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.15 }}
                    >
                      <div className="mb-1 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CandidateAvatar candidate={c} size="sm" />
                          <span className="text-sm font-medium text-gray-700">
                            {c.name}
                          </span>
                        </div>
                        <span
                          className="text-sm font-bold"
                          style={{ color: c.color }}
                        >
                          {pct}%
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: c.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: 0.5 + i * 0.15, duration: 0.8 }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Agreed proposals reveal */}
            {result.agreedCards.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ThumbsUp className="h-5 w-5 text-emerald-500" />
                    Propuestas con las que coincidiste
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {result.agreedCards.map((card, i) => {
                    const c = candidateMap[card.candidateId];
                    const dim = dimensionMap[card.dimensionId];
                    return (
                      <motion.div
                        key={card.id}
                        className="rounded-lg border p-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 * i }}
                      >
                        <div className="mb-1 flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: c?.color }}
                          />
                          <span
                            className="text-xs font-bold"
                            style={{ color: c?.color }}
                          >
                            {c?.name}
                          </span>
                          {dim && (
                            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
                              {dim.name}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">{card.proposal}</p>
                      </motion.div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {/* Invite friends */}
            <div className="mb-6">
              <ShareInvite
                url={typeof window !== 'undefined' ? `${window.location.origin}/brujula` : '/brujula'}
                shareText={inviteText}
                shareTitle="Brújula Electoral A Ciegas — VotoInformado 2026"
                heading="Invita a alguien a jugar"
                subheading="Comparte la Brújula con amigos y familiares. Que ellos también descubran su candidato sin sesgo."
              />
            </div>

            {/* Profundizar con Quiz */}
            <div className="mb-6 rounded-xl border border-violet-200 bg-gradient-to-r from-violet-50 to-purple-50 p-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-500" />
                <h3 className="text-sm font-bold text-gray-900">
                  ¿Quieres profundizar?
                </h3>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                El Quiz de Afinidad evalúa 12 dimensiones ideológicas para un análisis más detallado.
              </p>
              <Link href="/quiz">
                <Button
                  size="sm"
                  className="mt-3 gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700"
                >
                  <BarChart3 className="h-4 w-4" />
                  Hacer el Quiz de Afinidad
                </Button>
              </Link>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link href="/brujula">
                <Button variant="outline" className="w-full gap-2 sm:w-auto">
                  <RefreshCw className="h-4 w-4" />
                  Repetir brújula
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
              Este resultado es orientativo. Las propuestas son extractos reales de los
              planes de gobierno. Te invitamos a explorar los perfiles completos.{' '}
              <Link href="/metodologia" className="underline">
                Ver metodología
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BrujulaResultadoPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-gray-400">Cargando resultados...</p>
        </div>
      }
    >
      <RevealContent />
    </Suspense>
  );
}
