'use client';

import { useEffect, useState } from 'react';
import { getTimeUntilElection } from '@/lib/utils';

export function ElectionCountdown() {
  const [time, setTime] = useState(getTimeUntilElection());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeUntilElection());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const blocks = [
    { value: time.days, label: 'Días' },
    { value: time.hours, label: 'Horas' },
    { value: time.minutes, label: 'Min' },
    { value: time.seconds, label: 'Seg' },
  ];

  return (
    <div className="flex gap-3">
      {blocks.map((block) => (
        <div
          key={block.label}
          className="flex flex-col items-center rounded-xl bg-white/10 px-3 py-2 backdrop-blur-sm sm:px-4 sm:py-3"
        >
          <span className="text-2xl font-bold tabular-nums text-white sm:text-3xl">
            {String(block.value).padStart(2, '0')}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-white/70 sm:text-xs">
            {block.label}
          </span>
        </div>
      ))}
    </div>
  );
}
