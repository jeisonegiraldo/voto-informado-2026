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
import { ThumbsUp, ThumbsDown, SkipForward, Swords } from 'lucide-react';

type Phase = 'main' | 'tiebreaker-intro' | 'tiebreaker' | 'done';

export function BrujulaEngine() {
  const router = useRouter();
  const shuffled = useMemo(() => selectAndShuffleBrujulaCards(brujulaCardPool), []);

  const [phase, setPhase] = useState<Phase>('main');
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
      <div className="mt-6 flex items-center justify-center gap-3">
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
          variant="ghost"
          size="sm"
          className="h-10 w-10 rounded-full p-0 text-gray-400 hover:text-gray-600"
          onClick={handleSkip}
          disabled={isAnimating}
        >
          <SkipForward className="h-5 w-5" />
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

      <p className="mt-4 text-center text-[11px] text-gray-400">
        También puedes deslizar la tarjeta hacia los lados
      </p>
    </div>
  );
}
