'use client';

import { useEffect, useState } from 'react';
import { candidates } from '@/data/candidates';
import { dimensions } from '@/data/dimensions';
import { BarChart3, Users, MapPin } from 'lucide-react';
import type { PetitionStats } from '@/types/petition';

export function PetitionStatsDisplay() {
  const [stats, setStats] = useState<PetitionStats | null>(null);

  useEffect(() => {
    fetch('/api/peticiones')
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {});
  }, []);

  if (!stats || stats.total === 0) {
    return (
      <div className="rounded-xl border bg-gray-50 p-6 text-center">
        <BarChart3 className="mx-auto mb-2 h-8 w-8 text-gray-300" />
        <p className="text-sm text-gray-400">
          Aún no hay mensajes ciudadanos. ¡Sé el primero!
        </p>
      </div>
    );
  }

  const topDimensions = Object.entries(stats.byDimension)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Total count */}
      <div className="rounded-xl border bg-gradient-to-r from-teal-50 to-slate-50 p-4 text-center">
        <p className="text-3xl font-bold text-teal-700">{stats.total}</p>
        <p className="text-xs text-gray-500">mensajes ciudadanos registrados</p>
      </div>

      {/* By candidate */}
      <div className="rounded-xl border bg-white p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Users className="h-4 w-4" />
          Mensajes por candidato
        </h3>
        <div className="space-y-2">
          {candidates.map((c) => {
            const count = stats.byCandidateId[c.id] || 0;
            const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
            return (
              <div key={c.id} className="flex items-center gap-3">
                <span
                  className="w-20 text-xs font-medium"
                  style={{ color: c.color }}
                >
                  {c.name.split(' ').slice(-1)[0]}
                </span>
                <div className="flex-1">
                  <div className="h-4 rounded-full bg-gray-100">
                    <div
                      className="h-4 rounded-full transition-all"
                      style={{
                        width: `${Math.max(pct, 2)}%`,
                        backgroundColor: c.color,
                        opacity: 0.7,
                      }}
                    />
                  </div>
                </div>
                <span className="w-8 text-right text-xs text-gray-500">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top dimensions */}
      {topDimensions.length > 0 && (
        <div className="rounded-xl border bg-white p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <BarChart3 className="h-4 w-4" />
            Temas que más preocupan
          </h3>
          <div className="space-y-1.5">
            {topDimensions.map(([dimId, count]) => {
              const dim = dimensions.find((d) => d.id === dimId);
              return (
                <div key={dimId} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{dim?.name || dimId}</span>
                  <span className="font-medium text-teal-600">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Top regions */}
      {Object.keys(stats.byRegion).length > 0 && (
        <div className="rounded-xl border bg-white p-4">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
            <MapPin className="h-4 w-4" />
            Regiones participantes
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(stats.byRegion)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 10)
              .map(([region, count]) => (
                <span
                  key={region}
                  className="rounded-full bg-gray-100 px-2 py-1 text-[10px] text-gray-600"
                >
                  {region} ({count})
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
