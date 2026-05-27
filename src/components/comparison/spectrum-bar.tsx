'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Candidate } from '@/types/candidate';

interface SpectrumBarProps {
  labels: [string, string];
  positions: {
    candidate: Candidate;
    score: number; // -5 to +5
    summary: string;
  }[];
}

export function SpectrumBar({ labels, positions }: SpectrumBarProps) {
  return (
    <div className="w-full">
      <div className="relative h-8 rounded-full bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100">
        {/* Center line */}
        <div className="absolute left-1/2 top-0 h-full w-px bg-gray-300" />

        {/* Candidate dots */}
        <TooltipProvider delay={100}>
          {positions.map((pos) => {
            const pct = ((pos.score + 5) / 10) * 100;
            return (
              <Tooltip key={pos.candidate.id}>
                <TooltipTrigger
                  className="absolute top-1/2 z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white text-[9px] font-bold text-white shadow-md transition-transform hover:scale-125 active:scale-110"
                  style={{
                    left: `${Math.max(5, Math.min(95, pct))}%`,
                    backgroundColor: pos.candidate.color,
                  }}
                >
                  {pos.candidate.name.charAt(0)}
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <p className="font-semibold" style={{ color: pos.candidate.color }}>
                    {pos.candidate.name}
                  </p>
                  <p className="text-xs">{pos.summary}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>

      {/* Spectrum labels + candidate names */}
      <div className="mt-1 flex justify-between">
        <span className="text-[10px] font-medium text-gray-400 sm:text-xs">{labels[0]}</span>
        <span className="text-[10px] font-medium text-gray-400 sm:text-xs">{labels[1]}</span>
      </div>

      {/* Candidate names - positioned relative to dots, hidden on very small screens to avoid overlap */}
      <div className="relative h-4 hidden sm:block">
        {positions.map((pos) => {
          const pct = ((pos.score + 5) / 10) * 100;
          const clampedPct = Math.max(8, Math.min(92, pct));
          const lastName = pos.candidate.name.split(' ').slice(-1)[0];
          return (
            <span
              key={pos.candidate.id}
              className="absolute -translate-x-1/2 text-[10px] font-semibold leading-none"
              style={{
                left: `${clampedPct}%`,
                color: pos.candidate.color,
              }}
            >
              {lastName}
            </span>
          );
        })}
      </div>
    </div>
  );
}
