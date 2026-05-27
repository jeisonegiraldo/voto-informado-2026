'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { dimensions } from '@/data/dimensions';
import { candidates } from '@/data/candidates';
import { getPosition } from '@/data/positions';
import { CandidateAvatar } from '@/components/shared/candidate-avatar';
import type { CandidateId } from '@/types/candidate';

interface RadarOverviewProps {
  selectedCandidates?: CandidateId[];
}

// Short labels for radar axes — max ~8 chars
const SHORT_LABELS: Record<string, string> = {
  ideology: 'Ideología',
  'economic-model': 'Economía',
  'tax-policy': 'Impuestos',
  'state-size': 'Estado',
  'foreign-investment': 'Inversión',
  security: 'Seguridad',
  'drug-policy': 'Drogas',
  'family-values': 'Familia',
  education: 'Educación',
  technology: 'Tecnología',
  healthcare: 'Salud',
  'petro-stance': 'vs Petro',
};

export function RadarOverview({ selectedCandidates }: RadarOverviewProps) {
  const activeCandidates = selectedCandidates
    ? candidates.filter((c) => selectedCandidates.includes(c.id))
    : candidates;

  // Build data per candidate for individual radars
  const buildCandidateData = (candidateId: string) =>
    dimensions.map((dim) => {
      const pos = getPosition(candidateId as CandidateId, dim.id);
      return {
        dimension: SHORT_LABELS[dim.id] || dim.name.slice(0, 8),
        value: pos ? Math.abs(pos.score) : 0,
      };
    });

  // For compare-2 mode: overlay both on single chart
  if (activeCandidates.length === 2) {
    const data = dimensions.map((dim) => {
      const row: Record<string, string | number> = {
        dimension: SHORT_LABELS[dim.id] || dim.name.slice(0, 8),
      };
      for (const c of activeCandidates) {
        const pos = getPosition(c.id, dim.id);
        row[c.id] = pos ? Math.abs(pos.score) : 0;
      }
      return row;
    });

    return (
      <div className="mx-auto w-full max-w-lg">
        <ResponsiveContainer width="100%" height={360}>
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="#e5e7eb" />
            <PolarRadiusAxis domain={[0, 5]} tick={false} axisLine={false} />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
            />
            {activeCandidates.map((c) => (
              <Radar
                key={c.id}
                dataKey={c.id}
                stroke={c.color}
                fill={c.color}
                fillOpacity={0.15}
                strokeWidth={2.5}
                dot={{ r: 4, fill: c.color }}
              />
            ))}
          </RadarChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-6">
          {activeCandidates.map((c) => (
            <div key={c.id} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: c.color }}
              />
              <span className="text-xs font-medium text-gray-600">
                {c.name.split(' ').slice(-1)[0]}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default: 2x2 grid of individual candidate radars
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4">
      {activeCandidates.map((c) => {
        const data = buildCandidateData(c.id);
        // Calculate average "definition" score
        const avgScore =
          data.reduce((sum, d) => sum + d.value, 0) / data.length;

        return (
          <div
            key={c.id}
            className="rounded-xl border bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Candidate header */}
            <div className="mb-1 flex items-center gap-2">
              <CandidateAvatar candidate={c} size="sm" />
              <div className="min-w-0">
                <p
                  className="text-sm font-bold leading-tight"
                  style={{ color: c.color }}
                >
                  {c.name.split(' ').slice(-1)[0]}
                </p>
                <p className="text-[10px] text-gray-400">{c.party}</p>
              </div>
            </div>

            {/* Individual radar */}
            <ResponsiveContainer width="100%" height={180}>
              <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#e5e7eb" strokeWidth={0.5} />
                <PolarRadiusAxis
                  domain={[0, 5]}
                  tick={false}
                  axisLine={false}
                />
                <PolarAngleAxis
                  dataKey="dimension"
                  tick={{ fontSize: 8, fill: '#9ca3af' }}
                  tickLine={false}
                />
                <Radar
                  dataKey="value"
                  stroke={c.color}
                  fill={c.color}
                  fillOpacity={0.2}
                  strokeWidth={2}
                  dot={{ r: 2.5, fill: c.color }}
                />
              </RadarChart>
            </ResponsiveContainer>

            {/* Insight tag */}
            <div className="flex justify-center">
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{
                  backgroundColor: `${c.color}15`,
                  color: c.color,
                }}
              >
                {avgScore >= 4
                  ? 'Posiciones muy definidas'
                  : avgScore >= 3
                    ? 'Posiciones definidas'
                    : avgScore >= 2
                      ? 'Posiciones moderadas'
                      : 'Posiciones centradas'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
