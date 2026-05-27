'use client';

import { useEffect, useState } from 'react';
import { candidates } from '@/data/candidates';
import { dimensions } from '@/data/dimensions';
import { TrendingUp, MessageSquare } from 'lucide-react';
import type { CandidateId } from '@/types/candidate';

interface TrendingPetition {
  id: string;
  candidateId: CandidateId;
  text: string;
  classification?: string;
  dimension?: string;
  dimensionLabel?: string;
  region?: string;
  createdAt: string;
}

const classificationEmoji: Record<string, string> = {
  comentario: '💬',
  peticion: '📋',
  pregunta: '❓',
  apoyo: '👍',
  critica: '⚠️',
};

export function TrendingPetitions() {
  const [petitions, setPetitions] = useState<TrendingPetition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/peticiones?trending=1')
      .then((r) => r.json())
      .then((data) => {
        setPetitions(data.recentPetitions || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (petitions.length === 0) return null;

  // Group by dimension for a "trending topics" view
  const dimensionCounts = new Map<string, number>();
  for (const p of petitions) {
    if (p.dimension) {
      dimensionCounts.set(p.dimension, (dimensionCounts.get(p.dimension) || 0) + 1);
    }
  }

  const topDimensions = [...dimensionCounts.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  return (
    <div className="space-y-4">
      {/* Trending topics */}
      {topDimensions.length > 0 && (
        <div className="rounded-xl border bg-white p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <TrendingUp className="h-4 w-4 text-teal-600" />
            Temas más mencionados
          </h3>
          <div className="flex flex-wrap gap-2">
            {topDimensions.map(([dimId, count]) => {
              const dim = dimensions.find((d) => d.id === dimId);
              return (
                <span
                  key={dimId}
                  className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-medium text-teal-700"
                >
                  {dim?.name || dimId}
                  <span className="rounded-full bg-teal-100 px-1.5 text-[10px]">
                    {count}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent messages */}
      <div className="rounded-xl border bg-white p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
          <MessageSquare className="h-4 w-4 text-teal-600" />
          Voces ciudadanas recientes
        </h3>
        <div className="space-y-2">
          {petitions.slice(0, 8).map((p) => {
            const candidate = candidates.find((c) => c.id === p.candidateId);
            const emoji =
              classificationEmoji[p.classification || ''] || '💬';
            return (
              <div
                key={p.id}
                className="rounded-lg border bg-gray-50 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="flex-1 text-xs leading-relaxed text-gray-700">
                    {emoji}{' '}
                    {p.text.length > 150
                      ? p.text.slice(0, 150) + '…'
                      : p.text}
                  </p>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
                  {candidate && (
                    <span
                      className="rounded-full px-2 py-0.5 font-medium text-white"
                      style={{ backgroundColor: candidate.color }}
                    >
                      Para {candidate.name.split(' ').slice(-1)[0]}
                    </span>
                  )}
                  {p.dimensionLabel && (
                    <span className="text-gray-400">
                      {p.dimensionLabel}
                    </span>
                  )}
                  {p.region && (
                    <span className="text-gray-400">
                      📍 {p.region}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
