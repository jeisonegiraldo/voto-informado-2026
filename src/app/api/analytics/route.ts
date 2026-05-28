import { NextRequest } from 'next/server';
import { trackEvent } from '@/lib/analytics-store';
import { extractGeo, detectDevice, detectBrowser } from '@/lib/geo';
import type { AnalyticsEvent, ClientAnalyticsPayload, AnalyticsEventType } from '@/types/analytics';

const ALLOWED_TYPES: AnalyticsEventType[] = [
  'page_view',
  'brujula_start',
  'brujula_complete',
  'brujula_tiebreaker',
  'quiz_start',
  'quiz_complete',
  'comparador_view',
  'candidato_view',
  'share_click',
  'noticias_view',
];

// Simple rate limit: max 60 events per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_EVENTS_PER_MIN = 60;

function checkRate(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= MAX_EVENTS_PER_MIN) return false;
  entry.count++;
  return true;
}

/**
 * POST /api/analytics
 *
 * Receives lightweight events from the browser client.
 * The server enriches them with geo data, device info, and stores in Redis.
 *
 * Accepts a single event or an array of events (batch).
 */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
    if (!checkRate(ip)) {
      return Response.json({ ok: true }); // Silently drop — don't reveal rate limiting to client
    }

    const body = await req.json();

    // Accept single event or array
    const payloads: ClientAnalyticsPayload[] = Array.isArray(body) ? body : [body];

    if (payloads.length > 20) {
      return Response.json({ ok: true }); // Drop oversized batches silently
    }

    const geo = extractGeo(req.headers);
    const ua = req.headers.get('user-agent');
    const device = {
      type: detectDevice(ua),
      browser: detectBrowser(ua),
    };

    const referer = req.headers.get('referer');
    let referrerDomain: string | undefined;
    if (referer) {
      try {
        const u = new URL(referer);
        if (!u.hostname.includes('votainformadoco.org') && !u.hostname.includes('localhost')) {
          referrerDomain = u.hostname;
        }
      } catch { /* skip */ }
    }

    const promises = payloads.map((payload) => {
      // Validate event type
      if (!payload.type || !ALLOWED_TYPES.includes(payload.type)) return null;

      // Extract referrer domain from client-provided referrer too
      let clientReferrer = referrerDomain;
      if (!clientReferrer && payload.referrer) {
        try {
          const u = new URL(payload.referrer);
          if (!u.hostname.includes('votainformadoco.org') && !u.hostname.includes('localhost')) {
            clientReferrer = u.hostname;
          }
        } catch { /* skip */ }
      }

      const event: AnalyticsEvent = {
        id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        type: payload.type,
        timestamp: new Date().toISOString(),
        sessionId: payload.sessionId || ip,
        geo,
        device,
        page: payload.page?.slice(0, 200),
        referrerDomain: clientReferrer,
        meta: sanitizeMeta(payload.meta),
      };

      return trackEvent(event);
    });

    // Fire all tracking in parallel, don't wait
    Promise.allSettled(promises.filter(Boolean)).catch(() => {});

    return Response.json({ ok: true });
  } catch {
    // Always return 200 — analytics endpoint should never error to the client
    return Response.json({ ok: true });
  }
}

/** Sanitize client-provided metadata to prevent abuse */
function sanitizeMeta(
  meta?: Record<string, string | number | boolean>,
): Record<string, string | number | boolean> | undefined {
  if (!meta || typeof meta !== 'object') return undefined;

  const clean: Record<string, string | number | boolean> = {};
  let count = 0;

  for (const [key, value] of Object.entries(meta)) {
    if (count >= 20) break; // Max 20 meta fields
    const k = String(key).slice(0, 50);
    if (typeof value === 'string') {
      clean[k] = value.slice(0, 500);
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      clean[k] = value;
    }
    count++;
  }

  return Object.keys(clean).length > 0 ? clean : undefined;
}
