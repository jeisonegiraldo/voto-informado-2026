'use client';

import { useState, useMemo, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { SwipeCard } from './swipe-card';
import { brujulaCardPool, selectAndShuffleBrujulaCards } from '@/data/brujula-cards';
import type { BrujulaCard } from '@/data/brujula-cards';
import {
  calculateBrujulaResults,
  encodeBrujulaResults,
  detectTie,
  selectTiebreakerCards,
  type BrujulaSwipe,
} from '@/lib/brujula-scoring';
import { trackClient } from '@/lib/analytics-client';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  ThumbsUp,
  ThumbsDown,
  SkipForward,
  Swords,
  EyeOff,
  ArrowRight,
  Compass,
  ChevronRight,
  Clock,
} from 'lucide-react';

type Phase = 'onboarding' | 'main' | 'tiebreaker-intro' | 'tiebreaker' | 'done';

// ── Onboarding steps ────────────────────────────────

const ONBOARDING_STEPS = [
  {
    icon: EyeOff,
    title: 'Propuestas reales, candidatos ocultos',
    description:
      'Veras 20 propuestas tomadas directamente de los planes de gobierno de los candidatos. No sabras de quien es cada una.',
    accent: 'from-slate-700 to-slate-900',
  },
  {
    icon: ThumbsUp,
    title: 'Desliza o toca los botones',
    description:
      'Desliza la tarjeta o usa los botones para responder:',
    accent: 'from-emerald-500 to-teal-600',
    showDemo: true,
  },
  {
    icon: Compass,
    title: 'Descubre tu candidato',
    description:
      'Al final, te revelaremos con cual candidato coincidiste mas, basado unicamente en tus respuestas a las propuestas. Sin sesgo, sin colores, solo ideas.',
    accent: 'from-teal-500 to-cyan-600',
  },
];

function OnboardingScreen({ onStart }: { onStart: () => void }) {
  const [step, setStep] = useState(0);
  const current = ONBOARDING_STEPS[step];
  const isLast = step === ONBOARDING_STEPS.length - 1;
  const Icon = current.icon;

  return (
    <div className="mx-auto max-w-md px-4 py-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          {/* Icon */}
          <motion.div
            className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${current.accent} text-white shadow-lg`}
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          >
            <Icon className="h-8 w-8" />
          </motion.div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
            {current.title}
          </h2>

          {/* Description */}
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-500">
            {current.description}
          </p>

          {/* Swipe demo */}
          {current.showDemo && (
            <motion.div
              className="mx-auto mt-5 max-w-xs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {/* Main buttons row */}
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-rose-200 text-rose-400">
                    <ThumbsDown className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-medium text-rose-400">En desacuerdo</span>
                </div>

                <div className="flex flex-col items-center gap-1.5">
                  <motion.div
                    className="flex h-20 w-14 items-center justify-center rounded-xl border-2 border-gray-200 bg-white shadow-md"
                    animate={{ x: [0, 20, -20, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                  >
                    <span className="text-[10px] font-medium text-gray-400">Propuesta</span>
                  </motion.div>
                  <span className="text-[10px] text-gray-400">Desliza</span>
                </div>

                <div className="flex flex-col items-center gap-1.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-emerald-200 text-emerald-400">
                    <ThumbsUp className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-medium text-emerald-400">De acuerdo</span>
                </div>
              </div>

              {/* Skip option — visually distinct */}
              <motion.div
                className="mt-4 flex flex-col items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-2 rounded-full border-2 border-dashed border-gray-300 px-4 py-1.5 text-gray-400">
                  <SkipForward className="h-4 w-4" />
                  <span className="text-xs font-medium">Omitir</span>
                </div>
                <span className="text-[10px] text-gray-400">
                  ¿No tienes posicion? Omitela, no afecta tu resultado
                </span>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Step indicators */}
      <div className="mt-8 flex items-center justify-center gap-2">
        {ONBOARDING_STEPS.map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step ? 'w-6 bg-teal-500' : 'w-2 bg-gray-200'
            }`}
            aria-label={`Paso ${i + 1}`}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="mt-6 flex flex-col items-center gap-3">
        {isLast ? (
          <Button
            size="lg"
            onClick={onStart}
            className="w-full max-w-xs gap-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg hover:from-teal-500 hover:to-teal-400"
          >
            Comenzar
            <ArrowRight className="h-5 w-5" />
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={() => setStep(step + 1)}
            className="w-full max-w-xs gap-2 bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg hover:from-teal-500 hover:to-teal-400"
          >
            Siguiente
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}

        {!isLast && (
          <button
            onClick={onStart}
            className="text-xs text-gray-400 underline-offset-2 hover:text-gray-600 hover:underline"
          >
            Saltar tutorial
          </button>
        )}

        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Clock className="h-3.5 w-3.5" />
          <span>Toma menos de 5 minutos</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Engine ─────────────────────────────────────

export function BrujulaEngine() {
  const router = useRouter();
  const shuffled = useMemo(() => selectAndShuffleBrujulaCards(brujulaCardPool), []);

  const [phase, setPhase] = useState<Phase>('onboarding');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipes, setSwipes] = useState<BrujulaSwipe[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const startTracked = useRef(false);

  // Tiebreaker state
  const [tiebreakerCards, setTiebreakerCards] = useState<BrujulaCard[]>([]);
  const [tiebreakerIndex, setTiebreakerIndex] = useState(0);
  // Track whether we already attempted a tiebreaker (only once)
  const tiebreakerAttempted = useRef(false);

  const activeCards = phase === 'tiebreaker' ? tiebreakerCards : shuffled;
  const activeIndex = phase === 'tiebreaker' ? tiebreakerIndex : currentIndex;
  const totalMain = shuffled.length;
  const totalActive = activeCards.length;
  const isFinished = activeIndex >= totalActive;

  // Progress: in tiebreaker phase, show combined progress
  const mainProgress = phase === 'main'
    ? (currentIndex / totalMain) * 100
    : 100;
  const tiebreakerProgress = phase === 'tiebreaker'
    ? (tiebreakerIndex / tiebreakerCards.length) * 100
    : 0;

  /** Navigate to results page */
  const goToResults = useCallback(
    (allSwipes: BrujulaSwipe[]) => {
      const result = calculateBrujulaResults(allSwipes, brujulaCardPool);
      const encoded = encodeBrujulaResults(result.swipes);

      // Track completion
      trackClient('brujula_complete', {
        topCandidate: result.topCandidate,
        totalAgreed: result.totalAgreed,
        totalDisagreed: result.totalDisagreed,
        totalSkipped: result.totalSkipped,
        totalCards: allSwipes.length,
        hadTiebreaker: tiebreakerAttempted.current,
      });

      router.push(`/brujula/resultado?r=${encoded}`);
    },
    [router]
  );

  /** Check for ties and either start tiebreaker or go to results */
  const handleRoundComplete = useCallback(
    (allSwipes: BrujulaSwipe[]) => {
      // Only attempt tiebreaker once
      if (tiebreakerAttempted.current) {
        goToResults(allSwipes);
        return;
      }

      const result = calculateBrujulaResults(allSwipes, brujulaCardPool);
      const tied = detectTie(result);

      if (tied.length >= 2) {
        tiebreakerAttempted.current = true;
        const usedIds = new Set(allSwipes.map((s) => s.cardId));
        const extras = selectTiebreakerCards(tied, usedIds, brujulaCardPool, 5);

        if (extras.length > 0) {
          trackClient('brujula_tiebreaker', {
            tiedCandidates: tied.join(','),
            extraCards: extras.length,
          });
          setTiebreakerCards(extras);
          setTiebreakerIndex(0);
          setPhase('tiebreaker-intro');
          return;
        }
      }

      goToResults(allSwipes);
    },
    [goToResults]
  );

  const handleSwipe = useCallback(
    (direction: 'right' | 'left') => {
      if (isAnimating || isFinished) return;
      setIsAnimating(true);

      // Track start on first interaction
      if (!startTracked.current) {
        startTracked.current = true;
        trackClient('brujula_start');
      }

      const card = activeCards[activeIndex];
      const newSwipes = [...swipes, { cardId: card.id, direction }];
      setSwipes(newSwipes);

      setTimeout(() => {
        if (phase === 'tiebreaker') {
          setTiebreakerIndex((prev) => prev + 1);
        } else {
          setCurrentIndex((prev) => prev + 1);
        }
        setIsAnimating(false);

        const nextIdx = activeIndex + 1;
        if (nextIdx >= totalActive) {
          handleRoundComplete(newSwipes);
        }
      }, 300);
    },
    [isAnimating, isFinished, activeCards, activeIndex, swipes, totalActive, phase, handleRoundComplete]
  );

  const handleSkip = useCallback(() => {
    if (isAnimating || isFinished) return;
    setIsAnimating(true);

    const card = activeCards[activeIndex];
    const newSwipes = [...swipes, { cardId: card.id, direction: 'skip' as const }];
    setSwipes(newSwipes);

    setTimeout(() => {
      if (phase === 'tiebreaker') {
        setTiebreakerIndex((prev) => prev + 1);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
      setIsAnimating(false);

      const nextIdx = activeIndex + 1;
      if (nextIdx >= totalActive) {
        handleRoundComplete(newSwipes);
      }
    }, 200);
  }, [isAnimating, isFinished, activeCards, activeIndex, swipes, totalActive, phase, handleRoundComplete]);

  // ── Onboarding screen ──
  if (phase === 'onboarding') {
    return <OnboardingScreen onStart={() => setPhase('main')} />;
  }

  // ── Tiebreaker intro screen ──
  if (phase === 'tiebreaker-intro') {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="text-center"
        >
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg">
            <Swords className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Ronda de desempate
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm text-gray-500">
            Tus respuestas muestran afinidad similar con varios candidatos.
            Responde {tiebreakerCards.length} propuestas adicionales para
            definir con cual te identificas mas.
          </p>
          <Button
            size="lg"
            className="mt-8 gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:from-amber-400 hover:to-orange-400"
            onClick={() => setPhase('tiebreaker')}
          >
            <Swords className="h-5 w-5" />
            Continuar ({tiebreakerCards.length} propuestas)
          </Button>
        </motion.div>
      </div>
    );
  }

  // ── Loading / calculating screen ──
  if (isFinished || phase === 'done') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-teal-200 border-t-teal-600" />
          <p className="text-lg font-semibold text-gray-700">Calculando tu afinidad...</p>
        </motion.div>
      </div>
    );
  }

  const currentCard = activeCards[activeIndex];
  const nextCard = activeIndex + 1 < totalActive ? activeCards[activeIndex + 1] : null;

  const displayIndex = phase === 'tiebreaker'
    ? tiebreakerIndex + 1
    : currentIndex + 1;
  const displayTotal = phase === 'tiebreaker'
    ? tiebreakerCards.length
    : totalMain;
  const displayProgress = phase === 'tiebreaker'
    ? tiebreakerProgress
    : mainProgress;

  return (
    <div className="mx-auto max-w-lg px-4">
      {/* Tiebreaker badge */}
      {phase === 'tiebreaker' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 flex items-center justify-center gap-2 rounded-full bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-700"
        >
          <Swords className="h-3.5 w-3.5" />
          Ronda de desempate
        </motion.div>
      )}

      {/* Progress bar */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
          <span>
            Propuesta {displayIndex} de {displayTotal}
          </span>
          <span>{Math.round(displayProgress)}%</span>
        </div>
        <Progress
          value={displayProgress}
          className={`h-2 ${phase === 'tiebreaker' ? '[&>div]:bg-amber-500' : ''}`}
        />
      </div>

      {/* Swipe stats */}
      <div className="mb-4 flex justify-center gap-6 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <ThumbsUp className="h-3 w-3 text-emerald-400" />
          {swipes.filter((s) => s.direction === 'right').length}
        </span>
        <span className="flex items-center gap-1">
          <ThumbsDown className="h-3 w-3 text-rose-400" />
          {swipes.filter((s) => s.direction === 'left').length}
        </span>
        <span className="flex items-center gap-1">
          <SkipForward className="h-3 w-3 text-gray-400" />
          {swipes.filter((s) => s.direction === 'skip').length}
        </span>
      </div>

      {/* Card stack */}
      <div className="relative mx-auto aspect-[3/4] w-full max-w-sm">
        {/* Next card (background) */}
        {nextCard && (
          <div className={`absolute inset-0 scale-95 rounded-2xl border-2 bg-gray-50 opacity-60 ${phase === 'tiebreaker' ? 'border-amber-200' : 'border-gray-100'}`} />
        )}

        {/* Current card */}
        <AnimatePresence mode="popLayout">
          <SwipeCard
            key={currentCard.id}
            card={currentCard}
            onSwipe={handleSwipe}
            isTop={true}
          />
        </AnimatePresence>
      </div>

      {/* Button controls (alternative to swiping) */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="lg"
          className="h-14 w-14 rounded-full border-2 border-rose-200 p-0 text-rose-500 hover:bg-rose-50 hover:text-rose-600 active:scale-95"
          onClick={() => handleSwipe('left')}
          disabled={isAnimating}
        >
          <ThumbsDown className="h-6 w-6" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="h-14 w-14 rounded-full border-2 border-emerald-200 p-0 text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 active:scale-95"
          onClick={() => handleSwipe('right')}
          disabled={isAnimating}
        >
          <ThumbsUp className="h-6 w-6" />
        </Button>
      </div>

      {/* Skip button — separate row, clearly labeled */}
      <div className="mt-3 flex justify-center">
        <button
          onClick={handleSkip}
          disabled={isAnimating}
          className="flex items-center gap-1.5 rounded-full border border-dashed border-gray-300 px-4 py-2 text-xs font-medium text-gray-400 transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-600 disabled:opacity-50"
        >
          <SkipForward className="h-3.5 w-3.5" />
          No tengo posicion, omitir
        </button>
      </div>

      <p className="mt-3 text-center text-[11px] text-gray-400">
        Tambien puedes deslizar la tarjeta hacia los lados
      </p>
    </div>
  );
}
