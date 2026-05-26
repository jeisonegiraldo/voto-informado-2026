'use client';

import { dimensions } from '@/data/dimensions';
import { candidates } from '@/data/candidates';
import { getPosition } from '@/data/positions';
import { SpectrumBar } from './spectrum-bar';
import { CandidateAvatar } from '@/components/shared/candidate-avatar';
import {
  Compass, TrendingUp, Receipt, Building2, Globe, Shield,
  Leaf, Heart, GraduationCap, Cpu, Stethoscope, ArrowLeftRight, HelpCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Compass, TrendingUp, Receipt, Building2, Globe, Shield,
  Leaf, Heart, GraduationCap, Cpu, Stethoscope, ArrowLeftRight,
};

function getDimensionIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || HelpCircle;
}

export function ComparisonMatrix() {
  return (
    <div className="space-y-4">
      {/* Candidate header - sticky on mobile */}
      <div className="sticky top-16 z-30 rounded-xl border bg-white/95 p-3 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          {candidates.map((c) => (
            <div key={c.id} className="flex flex-col items-center gap-1">
              <CandidateAvatar candidate={c} size="sm" />
              <span className="text-[10px] font-medium text-gray-600 sm:text-xs">{c.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dimension rows */}
      {dimensions.map((dim) => {
        const Icon = getDimensionIcon(dim.icon);
        const positionsData = candidates.map((c) => {
          const pos = getPosition(c.id, dim.id);
          return {
            candidate: c,
            score: pos?.score ?? 0,
            summary: pos?.summary ?? '',
          };
        });

        return (
          <div
            key={dim.id}
            className="rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex items-center gap-2">
              <Icon className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-gray-900">{dim.name}</h3>
                <p className="text-xs text-gray-500">{dim.description}</p>
              </div>
            </div>

            <SpectrumBar labels={dim.spectrumLabels} positions={positionsData} />

            {/* Expanded detail on larger screens */}
            <div className="mt-3 hidden grid-cols-4 gap-2 lg:grid">
              {positionsData.map((pos) => {
                const fullPos = getPosition(pos.candidate.id, dim.id);
                return (
                  <div key={pos.candidate.id} className="rounded-lg bg-gray-50 p-2">
                    <p
                      className="text-[10px] font-semibold"
                      style={{ color: pos.candidate.color }}
                    >
                      {pos.candidate.name.split(' ').slice(-1)[0]}
                    </p>
                    {fullPos && (
                      <ul className="mt-1 space-y-0.5">
                        {fullPos.keyProposals.slice(0, 2).map((prop, i) => (
                          <li key={i} className="text-[10px] leading-tight text-gray-600">
                            {prop}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
