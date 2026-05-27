'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { SwipeCard } from './swipe-card';
import { brujulaCards, shuffleBrujulaCards } from '@/data/brujula-cards';
import {
  calculateBrujulaResults,
  encodeBrujulaResults,
  type BrujulaSwipe,
} from '@/lib/brujula-scoring';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, SkipForward } from 'lucide-react';

export function BrujulaEngine() {
  const router = useRouter();
  const shuffled = useMemo(() => shuffleBrujulaCards(brujulaCards), []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipes, setSwipes] = useState<BrujulaSwipe[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const totalCards = shuffled.length;
  const progress = (currentIndex / totalCards) * 100;
  const isFinished = currentIndex >= totalCards;

  const handleSwipe = useCallback(
    (direction: 'right' | 'left') => {
      if (isAnimating || isFinished) return;
      setIsAnimating(true);

      const card = shuffled[currentIndex];
      const newSwipes = [...swipes, { cardId: card.id, direction }];
      setSwipes(newSwipes);

      // Small delay for exit animation
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsAnimating(false);

        // Check if finished
        if (currentIndex + 1 >= totalCards) {
          const result = calculateBrujulaResults(newSwipes, brujulaCards);
          const encoded = encodeBrujulaResults(result.swipes);
          router.push(`/brujula/resultado?r=${encoded}`);
        }
      }, 300);
    },
    [isAnimating, isFinished, shuffled, currentIndex, swipes, totalCards, router]
  );

  const handleSkip = useCallback(() => {
    if (isAnimating || isFinished) return;
    setIsAnimating(true);

    const card = shuffled[currentIndex];
    const newSwipes = [...swipes, { cardId: card.id, direction: 'skip' as const }];
    setSwipes(newSwipes);

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsAnimating(false);

      if (currentIndex + 1 >= totalCards) {
        const result = calculateBrujulaResults(newSwipes, brujulaCards);
        const encoded = encodeBrujulaResults(result.swipes);
        router.push(`/brujula/resultado?r=${encoded}`);
      }
    }, 200);
  }, [isAnimating, isFinished, shuffled, currentIndex, swipes, totalCards, router]);

  if (isFinished) {
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

  const currentCard = shuffled[currentIndex];
  const nextCard = currentIndex + 1 < totalCards ? shuffled[currentIndex + 1] : null;

  return (
    <div className="mx-auto max-w-lg px-4">
      {/* Progress bar */}
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
          <span>
            Propuesta {currentIndex + 1} de {totalCards}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
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
          <div className="absolute inset-0 scale-95 rounded-2xl border-2 border-gray-100 bg-gray-50 opacity-60" />
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
