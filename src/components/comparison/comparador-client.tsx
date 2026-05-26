'use client';

import { useState } from 'react';
import { RadarOverview } from './radar-overview';
import { ComparisonMatrix } from './comparison-matrix';
import { candidates } from '@/data/candidates';
import { CandidateAvatar } from '@/components/shared/candidate-avatar';
import { Users, GitCompareArrows } from 'lucide-react';
import type { CandidateId } from '@/types/candidate';

type ViewMode = 'all' | 'compare2';

export function ComparadorClient() {
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [selectedCandidates, setSelectedCandidates] = useState<CandidateId[]>([
    'cepeda',
    'valencia',
  ]);

  return (
    <div className="space-y-6">
      {/* View mode toggle */}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <div className="inline-flex rounded-lg border bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setViewMode('all')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              viewMode === 'all'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="h-4 w-4" />
            Todos los candidatos
          </button>
          <button
            type="button"
            onClick={() => setViewMode('compare2')}
            className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all ${
              viewMode === 'compare2'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <GitCompareArrows className="h-4 w-4" />
            Comparar 2
          </button>
        </div>

        {/* Candidate selector in compare2 mode */}
        {viewMode === 'compare2' && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Selecciona 2:</span>
            <div className="flex gap-2">
              {candidates.map((c) => {
                const isSelected = selectedCandidates.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedCandidates(
                          selectedCandidates.filter((id) => id !== c.id)
                        );
                      } else if (selectedCandidates.length >= 2) {
                        setSelectedCandidates([selectedCandidates[1], c.id]);
                      } else {
                        setSelectedCandidates([...selectedCandidates, c.id]);
                      }
                    }}
                    className={`flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-xs font-medium transition-all ${
                      isSelected
                        ? 'border-current bg-white shadow-sm'
                        : 'border-gray-200 bg-gray-50 opacity-50 grayscale'
                    }`}
                    style={isSelected ? { color: c.color, borderColor: c.color } : undefined}
                  >
                    <CandidateAvatar candidate={c} size="sm" />
                    <span className={isSelected ? '' : 'text-gray-500'}>
                      {c.name.split(' ').slice(-1)[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Radar chart overview */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-center text-sm font-semibold text-gray-700">
          Vista general — Radar de posiciones
        </h2>
        <p className="mb-4 text-center text-xs text-gray-400">
          Cada eje representa una dimensión política. Más lejos del centro = posición más definida.
        </p>
        <RadarOverview
          selectedCandidates={
            viewMode === 'compare2' && selectedCandidates.length === 2
              ? selectedCandidates
              : undefined
          }
        />
      </div>

      {/* Comparison matrix */}
      <ComparisonMatrix
        selectedCandidates={selectedCandidates}
        viewMode={viewMode}
        onSelectedCandidatesChange={setSelectedCandidates}
      />
    </div>
  );
}
