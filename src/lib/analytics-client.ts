import type { AnalyticsEventType, ClientAnalyticsPayload } from '@/types/analytics';

// ── Session ID ──────────────────────────────────────
// Anonymous, ephemeral session ID stored in sessionStorage.
// Resets on tab close. No cookies, no PII.

let cachedSessionId: string | null = null;

function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr';

  if (cachedSessionId) return cachedSessionId;

  try {
    let id = sessionStorage.getItem('vi_sid');
    if (!id) {
      id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem('vi_sid', id);
    }
    cachedSessionId = id;
    return id;
  } catch {
    cachedSessionId = `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    return cachedSessionId;
  }
}

// ── Event buffer for batching ───────────────────────

const eventBuffer: ClientAnalyticsPayload[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
const FLUSH_INTERVAL = 3000; // 3 seconds
const MAX_BUFFER_SIZE = 10;

function scheduleFlush(): void {
  if (flushTimer) return;
  flushTimer = setTimeout(flush, FLUSH_INTERVAL);
}

function flush(): void {
  flushTimer = null;
  if (eventBuffer.length === 0) return;

  const batch = eventBuffer.splice(0, MAX_BUFFER_SIZE);

  // Use sendBeacon for reliability (survives page navigations)
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(batch)], { type: 'application/json' });
    navigator.sendBeacon('/api/analytics', blob);
  } else {
    // Fallback to fetch
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batch),
      keepalive: true,
    }).catch(() => { /* silently fail */ });
  }

  // If there are more events, schedule another flush
  if (eventBuffer.length > 0) {
    scheduleFlush();
  }
}

// Flush on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flush();
    }
  });
}

// ── Public API ──────────────────────────────────────

/**
 * Track an analytics event from the client.
 *
 * Events are batched and sent every 3 seconds (or on page unload)
 * to minimize network overhead.
 *
 * Usage:
 *   trackClient('brujula_start');
 *   trackClient('brujula_complete', { topCandidate: 'cepeda', totalAgreed: 12 });
 */
export function trackClient(
  type: AnalyticsEventType,
  meta?: Record<string, string | number | boolean>,
): void {
  if (typeof window === 'undefined') return;

  const payload: ClientAnalyticsPayload = {
    type,
    sessionId: getSessionId(),
    page: window.location.pathname,
    referrer: document.referrer || undefined,
    meta,
  };

  eventBuffer.push(payload);

  // Flush immediately if buffer is full
  if (eventBuffer.length >= MAX_BUFFER_SIZE) {
    flush();
  } else {
    scheduleFlush();
  }
}

/**
 * Get the current session ID (for sending with API requests
 * so server-side tracking can correlate with client events).
 */
export function getAnalyticsSessionId(): string {
  return getSessionId();
}
