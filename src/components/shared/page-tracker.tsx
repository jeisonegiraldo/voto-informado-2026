'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { trackClient } from '@/lib/analytics-client';
import type { AnalyticsEventType } from '@/types/analytics';

/**
 * Invisible component that tracks page views on every navigation.
 * Add to the root layout alongside Analytics and SpeedInsights.
 *
 * Also supports tracking a specific event on mount via props
 * (useful for feature-specific pages like /brujula, /quiz).
 */
export function PageTracker({
  event,
  meta,
}: {
  event?: AnalyticsEventType;
  meta?: Record<string, string | number | boolean>;
} = {}) {
  const pathname = usePathname();
  const lastPathname = useRef('');

  useEffect(() => {
    // Avoid double-tracking on first render or same path
    if (pathname === lastPathname.current) return;
    lastPathname.current = pathname;

    trackClient('page_view');
  }, [pathname]);

  // Track custom event on mount (once)
  useEffect(() => {
    if (event) {
      trackClient(event, meta);
    }
    // Only track on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
