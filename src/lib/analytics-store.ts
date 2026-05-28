import { getRedis } from '@/lib/redis';
import { resolveRegionName } from '@/lib/geo';
import type {
  AnalyticsEvent,
  AnalyticsEventType,
  AnalyticsDashboard,
} from '@/types/analytics';

// ── Redis keys ──────────────────────────────────────
const PREFIX = 'vi:analytics';

/** Recent events list (last 1000) */
const EVENTS_KEY = `${PREFIX}:events`;

/** Aggregate counters — simple hash maps */
const COUNTER_KEYS = {
  byType: `${PREFIX}:by_type`,
  byPage: `${PREFIX}:by_page`,
  byRegion: `${PREFIX}:by_region`,
  byCity: `${PREFIX}:by_city`,
  byDevice: `${PREFIX}:by_device`,
  byBrowser: `${PREFIX}:by_browser`,
  byReferrer: `${PREFIX}:by_referrer`,
  byHour: `${PREFIX}:by_hour`,
  byDay: `${PREFIX}:by_day`,

  brujulaTopCandidate: `${PREFIX}:brujula_top`,
  quizTopCandidate: `${PREFIX}:quiz_top`,
} as const;

/** Scalar counters */
const SCALAR_KEY = `${PREFIX}:scalars`;

/** Set of unique session IDs */
const SESSIONS_KEY = `${PREFIX}:sessions`;

/** Recent search/verificador queries for dashboard */
const VERIFICADOR_QUERIES_KEY = `${PREFIX}:verificador_queries`;
const BUSQUEDA_QUERIES_KEY = `${PREFIX}:busqueda_queries`;

// ── Track an event ──────────────────────────────────

export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    // Use pipeline to batch all Redis commands in one round-trip
    const pipe = redis.pipeline();

    // 1. Store recent event (cap at 2000)
    pipe.lpush(EVENTS_KEY, JSON.stringify(event));
    pipe.ltrim(EVENTS_KEY, 0, 1999);

    // 2. Increment type counter
    pipe.hincrby(COUNTER_KEYS.byType, event.type, 1);

    // 3. Page views
    if (event.page) {
      pipe.hincrby(COUNTER_KEYS.byPage, event.page, 1);
    }

    // 4. Geographic counters
    const regionName = resolveRegionName(event.geo.region) || event.geo.region;
    if (regionName) {
      pipe.hincrby(COUNTER_KEYS.byRegion, regionName, 1);
    }
    if (event.geo.city) {
      pipe.hincrby(COUNTER_KEYS.byCity, event.geo.city, 1);
    }

    // 5. Device & browser
    if (event.device?.type) {
      pipe.hincrby(COUNTER_KEYS.byDevice, event.device.type, 1);
    }
    if (event.device?.browser) {
      pipe.hincrby(COUNTER_KEYS.byBrowser, event.device.browser, 1);
    }

    // 6. Referrer domain
    if (event.referrerDomain) {
      pipe.hincrby(COUNTER_KEYS.byReferrer, event.referrerDomain, 1);
    }

    // 7. Time-based counters
    const dt = new Date(event.timestamp);
    const hour = dt.getUTCHours().toString();
    const day = event.timestamp.slice(0, 10); // YYYY-MM-DD
    pipe.hincrby(COUNTER_KEYS.byHour, hour, 1);
    pipe.hincrby(COUNTER_KEYS.byDay, day, 1);

    // 8. Unique session tracking
    pipe.sadd(SESSIONS_KEY, event.sessionId);

    // 9. Total events counter
    pipe.hincrby(SCALAR_KEY, 'totalEvents', 1);

    // 10. Feature-specific tracking
    if (event.type === 'brujula_complete' && event.meta?.topCandidate) {
      pipe.hincrby(COUNTER_KEYS.brujulaTopCandidate, String(event.meta.topCandidate), 1);
      pipe.hincrby(SCALAR_KEY, 'brujulaCompleted', 1);
      if (event.meta.totalAgreed != null) {
        pipe.hincrbyfloat(SCALAR_KEY, 'brujulaTotalAgreed', Number(event.meta.totalAgreed));
      }
    }
    if (event.type === 'brujula_start') {
      pipe.hincrby(SCALAR_KEY, 'brujulaStarted', 1);
    }
    if (event.type === 'brujula_tiebreaker') {
      pipe.hincrby(SCALAR_KEY, 'brujulaTiebreakers', 1);
    }
    if (event.type === 'quiz_complete' && event.meta?.topCandidate) {
      pipe.hincrby(COUNTER_KEYS.quizTopCandidate, String(event.meta.topCandidate), 1);
      pipe.hincrby(SCALAR_KEY, 'quizCompleted', 1);
    }
    if (event.type === 'quiz_start') {
      pipe.hincrby(SCALAR_KEY, 'quizStarted', 1);
    }
    if (event.type === 'chat_message') {
      pipe.hincrby(SCALAR_KEY, 'chatMessages', 1);
    }
    if (event.type === 'verificador_query') {
      pipe.hincrby(SCALAR_KEY, 'verificaciones', 1);
      if (event.meta?.query) {
        pipe.lpush(VERIFICADOR_QUERIES_KEY, String(event.meta.query).slice(0, 200));
        pipe.ltrim(VERIFICADOR_QUERIES_KEY, 0, 49);
      }
    }
    if (event.type === 'buscar_tema') {
      pipe.hincrby(SCALAR_KEY, 'busquedas', 1);
      if (event.meta?.topic) {
        pipe.lpush(BUSQUEDA_QUERIES_KEY, String(event.meta.topic).slice(0, 200));
        pipe.ltrim(BUSQUEDA_QUERIES_KEY, 0, 49);
      }
    }

    await pipe.exec();
  } catch (error) {
    // Analytics should never break the app
    console.error('[analytics] Track error (non-critical):', error);
  }
}

// ── Dashboard aggregation ───────────────────────────

export async function getDashboard(): Promise<AnalyticsDashboard> {
  const redis = getRedis();
  const empty: AnalyticsDashboard = {
    period: { from: '', to: new Date().toISOString() },
    totalEvents: 0,
    uniqueSessions: 0,
    byType: {},
    topPages: {},
    byRegion: {},
    byCity: {},
    byDevice: {},
    byBrowser: {},
    brujula: {
      started: 0, completed: 0, tiebreakers: 0,
      topCandidateResults: {}, avgCardsAgreed: 0,
    },
    quiz: { started: 0, completed: 0, topCandidateResults: {} },
    ai: {
      chatMessages: 0, verificaciones: 0, busquedas: 0,
      topVerificadorClaims: [], topBusquedas: [],
    },
    byReferrer: {},
    byHour: {},
    byDay: {},
  };

  if (!redis) return empty;

  try {
    const pipe = redis.pipeline();

    pipe.hgetall(COUNTER_KEYS.byType);       // 0
    pipe.hgetall(COUNTER_KEYS.byPage);        // 1
    pipe.hgetall(COUNTER_KEYS.byRegion);      // 2
    pipe.hgetall(COUNTER_KEYS.byCity);        // 3
    pipe.hgetall(COUNTER_KEYS.byDevice);      // 4
    pipe.hgetall(COUNTER_KEYS.byBrowser);     // 5
    pipe.hgetall(COUNTER_KEYS.byReferrer);    // 6
    pipe.hgetall(COUNTER_KEYS.byHour);        // 7
    pipe.hgetall(COUNTER_KEYS.byDay);         // 8
    pipe.hgetall(COUNTER_KEYS.brujulaTopCandidate); // 9
    pipe.hgetall(COUNTER_KEYS.quizTopCandidate);    // 10
    pipe.hgetall(SCALAR_KEY);                        // 11
    pipe.scard(SESSIONS_KEY);                        // 12
    pipe.lrange(VERIFICADOR_QUERIES_KEY, 0, 19);     // 13
    pipe.lrange(BUSQUEDA_QUERIES_KEY, 0, 19);        // 14

    const results = await pipe.exec();

    const byType = toNumberRecord(results[0] as Record<string, string> | null);
    const topPages = toNumberRecord(results[1] as Record<string, string> | null);
    const byRegion = toNumberRecord(results[2] as Record<string, string> | null);
    const byCity = toNumberRecord(results[3] as Record<string, string> | null);
    const byDevice = toNumberRecord(results[4] as Record<string, string> | null);
    const byBrowser = toNumberRecord(results[5] as Record<string, string> | null);
    const byReferrer = toNumberRecord(results[6] as Record<string, string> | null);
    const byHour = toNumberRecord(results[7] as Record<string, string> | null);
    const byDay = toNumberRecord(results[8] as Record<string, string> | null);
    const brujulaTop = toNumberRecord(results[9] as Record<string, string> | null);
    const quizTop = toNumberRecord(results[10] as Record<string, string> | null);
    const scalars = results[11] as Record<string, string> | null || {};
    const uniqueSessions = (results[12] as number) || 0;
    const verificadorQueries = (results[13] as string[]) || [];
    const busquedaQueries = (results[14] as string[]) || [];

    const s = (key: string) => Number(scalars[key]) || 0;
    const brujulaCompleted = s('brujulaCompleted');

    // Find earliest day for period.from
    const days = Object.keys(byDay).sort();
    const firstDay = days.length > 0 ? days[0] : new Date().toISOString().slice(0, 10);

    return {
      period: {
        from: `${firstDay}T00:00:00Z`,
        to: new Date().toISOString(),
      },
      totalEvents: s('totalEvents'),
      uniqueSessions,
      byType,
      topPages,
      byRegion,
      byCity,
      byDevice,
      byBrowser,
      brujula: {
        started: s('brujulaStarted'),
        completed: brujulaCompleted,
        tiebreakers: s('brujulaTiebreakers'),
        topCandidateResults: brujulaTop,
        avgCardsAgreed: brujulaCompleted > 0
          ? Math.round(s('brujulaTotalAgreed') / brujulaCompleted * 10) / 10
          : 0,
      },
      quiz: {
        started: s('quizStarted'),
        completed: s('quizCompleted'),
        topCandidateResults: quizTop,
      },
      ai: {
        chatMessages: s('chatMessages'),
        verificaciones: s('verificaciones'),
        busquedas: s('busquedas'),
        topVerificadorClaims: verificadorQueries,
        topBusquedas: busquedaQueries,
      },
      byReferrer,
      byHour,
      byDay,
    };
  } catch (error) {
    console.error('[analytics] Dashboard error:', error);
    return empty;
  }
}

// ── Helpers ─────────────────────────────────────────

function toNumberRecord(raw: Record<string, string> | null): Record<string, number> {
  if (!raw) return {};
  const result: Record<string, number> = {};
  for (const [key, value] of Object.entries(raw)) {
    result[key] = Number(value) || 0;
  }
  return result;
}
