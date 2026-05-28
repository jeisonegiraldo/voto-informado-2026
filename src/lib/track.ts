import { NextRequest } from 'next/server';
import { trackEvent } from '@/lib/analytics-store';
import { extractGeo, detectDevice, detectBrowser } from '@/lib/geo';
import type { AnalyticsEvent, AnalyticsEventType } from '@/types/analytics';

/**
 * Track an analytics event from a server-side API route.
 *
 * This is fire-and-forget: it never throws or blocks the response.
 * Call it at the START of your route handler — it runs in the background.
 *
 * Usage:
 *   track(req, 'chat_message', { candidateFilter: 'cepeda' });
 */
export function track(
  req: NextRequest,
  type: AnalyticsEventType,
  meta?: Record<string, string | number | boolean>,
): void {
  try {
    const geo = extractGeo(req.headers);
    const ua = req.headers.get('user-agent');
    const sessionId =
      req.headers.get('x-session-id') ||
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'anonymous';

    const referer = req.headers.get('referer');
    let referrerDomain: string | undefined;
    if (referer) {
      try {
        const u = new URL(referer);
        // Only track external referrers
        if (!u.hostname.includes('votainformadoco.org') && !u.hostname.includes('localhost')) {
          referrerDomain = u.hostname;
        }
      } catch { /* invalid URL, skip */ }
    }

    const event: AnalyticsEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type,
      timestamp: new Date().toISOString(),
      sessionId,
      geo,
      device: {
        type: detectDevice(ua),
        browser: detectBrowser(ua),
      },
      page: req.nextUrl?.pathname,
      referrerDomain,
      meta,
    };

    // Fire and forget — don't await, don't catch
    trackEvent(event).catch((err) =>
      console.error('[track] Non-critical error:', err)
    );
  } catch {
    // Never let analytics break the API
  }
}
