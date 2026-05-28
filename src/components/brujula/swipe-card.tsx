'use client';

import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, type PanInfo } from 'framer-motion';
import type { BrujulaCard } from '@/data/brujula-cards';
import { dimensionMap } from '@/data/dimensions';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface SwipeCardProps {
  card: BrujulaCard;
  onSwipe: (direction: 'right' | 'left') => void;
  isTop: boolean;
  forcedDirection?: 'right' | 'left' | null;
}

const SWIPE_THRESHOLD = 100;

export function SwipeCard({ card, onSwipe, isTop, forcedDirection }: SwipeCardProps) {
  const x = useMotionValue(0);

  // When a button click triggers a swipe, animate x to the correct
  // side so the visual overlay (green/red) shows AND x.get() returns
  // the right value for the exit animation fallback.
  useEffect(() => {
    if (forcedDirection === 'right') {
      animate(x, 300, { duration: 0.25 });
    } else if (forcedDirection === 'left') {
      animate(x, -300, { duration: 0.25 });
    }
  }, [forcedDirection, x]);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  // Overlay indicators
  const agreeOpacity = useTransform(x, [0, 80], [0, 1]);
  const disagreeOpacity = useTransform(x, [-80, 0], [1, 0]);

  const dim = dimensionMap[card.dimensionId];

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > SWIPE_THRESHOLD) {
      onSwipe('right');
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      onSwipe('left');
    }
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      style={{
        x,
        rotate,
        opacity,
        zIndex: isTop ? 10 : 1,
      }}
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      onDragEnd={handleDragEnd}
      exit={{
        x: forcedDirection === 'right' ? 300 : forcedDirection === 'left' ? -300 : (x.get() > 0 ? 300 : -300),
        opacity: 0,
        transition: { duration: 0.3 },
      }}
    >
      <div className="relative h-full select-none rounded-2xl border-2 border-gray-200 bg-white p-5 shadow-xl sm:p-8">
        {/* Agree overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl border-4 border-emerald-400 bg-emerald-50/80"
          style={{ opacity: agreeOpacity }}
        >
          <div className="flex flex-col items-center gap-2">
            <ThumbsUp className="h-16 w-16 text-emerald-500" strokeWidth={2.5} />
            <span className="text-xl font-extrabold text-emerald-600">DE ACUERDO</span>
          </div>
        </motion.div>

        {/* Disagree overlay */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl border-4 border-rose-400 bg-rose-50/80"
          style={{ opacity: disagreeOpacity }}
        >
          <div className="flex flex-col items-center gap-2">
            <ThumbsDown className="h-16 w-16 text-rose-500" strokeWidth={2.5} />
            <span className="text-xl font-extrabold text-rose-600">EN DESACUERDO</span>
          </div>
        </motion.div>

        {/* Card content */}
        <div className="flex h-full flex-col items-center justify-center text-center">
          {/* Dimension chip */}
          {dim && (
            <span className="mb-6 rounded-full bg-gray-100 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
              {dim.name}
            </span>
          )}

          {/* Proposal text */}
          <p className="text-lg font-semibold leading-relaxed text-gray-800 sm:text-xl sm:leading-relaxed">
            &ldquo;{card.proposal}&rdquo;
          </p>

          {/* Hint */}
          <p className="mt-8 text-xs text-gray-400">
            Desliza → si estás de acuerdo &nbsp;·&nbsp; ← si no
          </p>
        </div>
      </div>
    </motion.div>
  );
}
