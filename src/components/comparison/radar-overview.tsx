'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { dimensions } from '@/data/dimensions';
import { candidates } from '@/data/candidates';
import { getPosition } from '@/data/positions';
import type { CandidateId } from '@/types/candidate';

interface RadarOverviewProps {
  selectedCandidates?: CandidateId[];
}

// Short labels for radar axes
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

  // Build combined data: one row per dimension with each candidate's depth score
  const data = dimensions.map((dim) => {
    const row: Record<string, string | number> = {
      dimension: SHORT_LABELS[dim.id] || dim.name.slice(0, 8),
    };
    for (const c of activeCandidates) {
      const pos = getPosition(c.id, dim.id);
      row[c.id] = pos ? pos.depth : 0;
    }
    return row;
  });

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-2 text-center">
        <h3 className="text-sm font-semibold text-gray-700">
          Profundidad del plan de gobierno
        </h3>
        <p className="text-xs text-gray-400">
          Puntaje 1-5 por coherencia y detalle de las propuestas en cada tema
        </p>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#e5e7eb" />
          <PolarRadiusAxis
            domain={[0, 5]}
            tickCount={6}
            tick={{ fontSize: 9, fill: '#9ca3af' }}
            axisLine={false}
          />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fontSize: 11, fill: '#6b7280' }}
            tickLine={false}
          />
          {activeCandidates.map((c) => (
            <Radar
              key={c.id}
              name={c.name.split(' ').slice(-1)[0]}
              dataKey={c.id}
              stroke={c.color}
              fill={c.color}
              fillOpacity={0.1}
              strokeWidth={2}
              dot={{ r: 3, fill: c.color, strokeWidth: 0 }}
            />
          ))}
          <Legend
            iconType="circle"
            iconSize={10}
            wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
