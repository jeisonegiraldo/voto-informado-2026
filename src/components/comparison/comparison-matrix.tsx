'use client';

import { useState } from 'react';
import { dimensions } from '@/data/dimensions';
import { candidates } from '@/data/candidates';
import { getPosition } from '@/data/positions';
import { SpectrumBar } from './spectrum-bar';
import { CandidateAvatar } from '@/components/shared/candidate-avatar';
import {
  Compass, TrendingUp, Receipt, Building2, Globe, Shield,
  Leaf, Heart, GraduationCap, Cpu, Stethoscope, ArrowLeftRight,
  HelpCircle, ChevronDown, Users, GitCompareArrows,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { CandidateId } from '@/types/candidate';

const iconMap: Record<string, LucideIcon> = {
  Compass, TrendingUp, Receipt, Building2, Globe, Shield,
  Leaf, Heart, GraduationCap, Cpu, Stethoscope, ArrowLeftRight,
};

function getDimensionIcon(iconName: string): LucideIcon {
  return iconMap[iconName] || HelpCircle;
}

type ViewMode = 'all' | 'compare2';

interface ComparisonMatrixProps {
  selectedCandidates?: CandidateId[];
  onSelectedCandidatesChange?: (ids: CandidateId[]) => void;
  viewMode?: ViewMode;
}

export function ComparisonMatrix({
  selectedCandidates,
  onSelectedCandidatesChange,
  viewMode = 'all',
}: ComparisonMatrixProps) {
  const [expandedDimensions, setExpandedDimensions] = useState<Set<string>>(new Set());

  const activeCandidates =
    viewMode === 'compare2' && selectedCandidates && selectedCandidates.length === 2
      ? candidates.filter((c) => selectedCandidates.includes(c.id))
      : candidates;

  function toggleDimension(dimId: string) {
    setExpandedDimensions((prev) => {
      const next = new Set(prev);
      if (next.has(dimId)) {
        next.delete(dimId);
      } else {
        next.add(dimId);
      }
      return next;
    });
  }

  function toggleCandidateSelection(id: CandidateId) {
    if (!onSelectedCandidatesChange || !selectedCandidates) return;
    if (selectedCandidates.includes(id)) {
      onSelectedCandidatesChange(selectedCandidates.filter((cid) => cid !== id));
    } else {
      // Max 2 candidates in compare2 mode
      if (selectedCandidates.length >= 2) {
        // Replace the first selected with the new one
        onSelectedCandidatesChange([selectedCandidates[1], id]);
      } else {
        onSelectedCandidatesChange([...selectedCandidates, id]);
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Candidate header — sticky */}
      <div className="sticky top-14 z-30 rounded-xl border bg-white/95 p-3 shadow-sm backdrop-blur-sm sm:top-16">
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          {candidates.map((c) => {
            const isActive = activeCandidates.some((ac) => ac.id === c.id);
            const isSelectable = viewMode === 'compare2';
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => isSelectable && toggleCandidateSelection(c.id)}
                className={`flex flex-col items-center gap-1 transition-all ${
                  isSelectable ? 'cursor-pointer' : 'cursor-default'
                } ${
                  !isActive ? 'opacity-30 grayscale' : ''
                }`}
              >
                <div
                  className="rounded-full transition-all"
                  style={
                    isActive && isSelectable
                      ? { boxShadow: `0 0 0 2px white, 0 0 0 4px ${c.color}` }
                      : undefined
                  }
                >
                  <CandidateAvatar candidate={c} size="sm" />
                </div>
                <span className="text-[10px] font-medium text-gray-600 sm:text-xs">
                  {c.name.split(' ').slice(-1)[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dimension rows */}
      {dimensions.map((dim) => {
        const Icon = getDimensionIcon(dim.icon);
        const isExpanded = expandedDimensions.has(dim.id);
        const positionsData = activeCandidates.map((c) => {
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
            className="rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Clickable header */}
            <button
              type="button"
              onClick={() => toggleDimension(dim.id)}
              className="flex w-full items-center gap-2 p-4 text-left transition-colors hover:bg-gray-50/50"
            >
              <Icon className="h-5 w-5 shrink-0 text-teal-600" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900">{dim.name}</h3>
                <p className="text-xs text-gray-500">{dim.description}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {!isExpanded && (
                  <span className="hidden text-[10px] font-medium text-teal-600 sm:inline">
                    Ver detalle
                  </span>
                )}
                <ChevronDown
                  className={`h-5 w-5 text-teal-500 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {/* Spectrum bar — always visible */}
            <div className="px-4 pb-2">
              <SpectrumBar labels={dim.spectrumLabels} positions={positionsData} />
            </div>

            {/* Expand hint — visible when collapsed */}
            {!isExpanded && (
              <button
                type="button"
                onClick={() => toggleDimension(dim.id)}
                className="flex w-full items-center justify-center gap-1 border-t border-dashed border-gray-200 py-2 text-[10px] font-medium text-teal-600 transition-colors hover:bg-teal-50/50 hover:text-teal-700"
              >
                <Users className="h-3 w-3" />
                Toca para ver propuestas de cada candidato
                <ChevronDown className="h-3 w-3" />
              </button>
            )}

            {/* Expandable detail panel */}
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="border-t bg-gray-50/50 px-3 py-3 sm:px-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {positionsData.map((pos) => {
                    const fullPos = getPosition(pos.candidate.id, dim.id);
                    return (
                      <div
                        key={pos.candidate.id}
                        className="rounded-lg border bg-white p-3 shadow-sm"
                      >
                        <div className="mb-2 flex items-center gap-2">
                          <CandidateAvatar candidate={pos.candidate} size="sm" />
                          <div>
                            <p
                              className="text-xs font-bold"
                              style={{ color: pos.candidate.color }}
                            >
                              {pos.candidate.name.split(' ').slice(-1)[0]}
                            </p>
                            <p className="text-[10px] text-gray-500">
                              Posición: {pos.score > 0 ? '+' : ''}{pos.score}
                            </p>
                          </div>
                        </div>
                        <p className="mb-2 text-xs leading-relaxed text-gray-700">
                          {pos.summary}
                        </p>
                        {fullPos && fullPos.keyProposals.length > 0 && (
                          <div>
                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                              Propuestas clave
                            </p>
                            <ul className="space-y-1">
                              {fullPos.keyProposals.map((prop, i) => (
                                <li
                                  key={i}
                                  className="flex items-start gap-1.5 text-[11px] leading-tight text-gray-600"
                                >
                                  <span
                                    className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                                    style={{ backgroundColor: pos.candidate.color }}
                                  />
                                  {prop}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {fullPos && fullPos.risks && fullPos.risks.length > 0 && (
                          <div className="mt-2">
                            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-rose-600">
                              Riesgos
                            </p>
                            <ul className="space-y-0.5">
                              {fullPos.risks.map((risk, i) => (
                                <li
                                  key={i}
                                  className="text-[10px] leading-tight text-rose-700"
                                >
                                  ⚠ {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => toggleDimension(dim.id)}
                  className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg py-1.5 text-[10px] font-medium text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                >
                  <ChevronDown className="h-3 w-3 rotate-180" />
                  Cerrar detalle
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
