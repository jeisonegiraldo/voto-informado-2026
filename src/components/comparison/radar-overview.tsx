'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
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

export function RadarOverview({ selectedCandidates }: RadarOverviewProps) {
  const activeCandidates = selectedCandidates
    ? candidates.filter((c) => selectedCandidates.includes(c.id))
    : candidates;

  // Normalize scores from [-5,+5] to [0,10] for radar display
  const data = dimensions.map((dim) => {
    const row: Record<string, string | number> = {
      dimension: dim.name.length > 14 ? dim.name.slice(0, 12) + '...' : dim.name,
      fullName: dim.name,
    };
    for (const c of activeCandidates) {
      const pos = getPosition(c.id, dim.id);
      row[c.id] = pos ? pos.score + 5 : 5; // normalize to 0-10
    }
    return row;
  });

  return (
    <div className="mx-auto w-full max-w-lg">
      <ResponsiveContainer width="100%" height={380}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fontSize: 10, fill: '#6b7280' }}
            tickLine={false}
          />
          {activeCandidates.map((c) => (
            <Radar
              key={c.id}
              name={c.name.split(' ').slice(-1)[0]}
              dataKey={c.id}
              stroke={c.color}
              fill={c.color}
              fillOpacity={0.08}
              strokeWidth={2}
              dot={{ r: 3, fill: c.color }}
            />
          ))}
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
            iconType="circle"
            iconSize={8}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
