'use client';

import { useEffect, useState } from 'react';
import { getTimeUntilElection } from '@/lib/utils';

export function ElectionCountdown() {
  // Initialize with zeros so server and client render identical HTML
  // (avoids hydration mismatch). useEffect sets the real value client-side.
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Set immediately on mount so there's no visual flash
    setTime(getTimeUntilElection());
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
    <div className="flex items-center gap-2 sm:gap-3">
      {blocks.map((block, i) => (
        <div key={block.label} className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col items-center">
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-md sm:px-5 sm:py-3">
              <span className="text-2xl font-extrabold tabular-nums text-white sm:text-4xl">
                {String(block.value).padStart(2, '0')}
              </span>
            </div>
            <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400 sm:text-xs">
              {block.label}
            </span>
          </div>
          {i < blocks.length - 1 && (
            <span className="text-xl font-bold text-white/20 sm:text-2xl">:</span>
          )}
        </div>
      ))}
    </div>
  );
}
