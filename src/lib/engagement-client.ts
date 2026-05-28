/**
 * Client-side helper to send engagement records to the server.
 *
 * Unlike analytics (which batches and uses sendBeacon), engagement
 * records are sent immediately via fetch with keepalive — they
 * represent important business data that shouldn't be lost.
 */

type EngagementType =
  | 'chat_interaction'
  | 'chat_feedback'
  | 'brujula_result'
  | 'quiz_result'
  | 'share_event';

/**
 * Send an engagement record to the server.
 * Fire-and-forget — never throws, never blocks UI.
 */
export function saveEngagement(
  type: EngagementType,
  data: Record<string, unknown>,
): void {
  if (typeof window === 'undefined') return;

  // Get session ID from sessionStorage (same as analytics-client)
  let sessionId = 'unknown';
  try {
    sessionId = sessionStorage.getItem('vi_sid') || sessionId;
  } catch { /* ignore */ }

  fetch('/api/registrar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, sessionId, ...data }),
    keepalive: true,
  }).catch(() => { /* silently fail — never break the UI */ });
}
