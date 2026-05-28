import { getRedis } from '@/lib/redis';
import { resolveRegionName } from '@/lib/geo';
import type { GeoData } from '@/types/analytics';

// ── Redis keys ──────────────────────────────────────

const PFX = 'vi:engagement';

const KEYS = {
  // Lists of full records (capped)
  chatInteractions: `${PFX}:chat:interactions`,
  chatFeedback: `${PFX}:chat:feedback`,
  brujulaResults: `${PFX}:brujula:results`,
  quizResults: `${PFX}:quiz:results`,
  shareEvents: `${PFX}:share:events`,

  // Counters
  chatCount: `${PFX}:chat:count`,
  brujulaCount: `${PFX}:brujula:count`,
  quizCount: `${PFX}:quiz:count`,
  shareCount: `${PFX}:share:count`,

  // Aggregated hashes
  sharePlatform: `${PFX}:share:by_platform`,
  chatFeedbackType: `${PFX}:chat:feedback_type`,
  chatFeedbackCategories: `${PFX}:chat:feedback_categories`,
  chatByCandidateId: `${PFX}:chat:by_candidate`,
  brujulaByCandidateId: `${PFX}:brujula:by_candidate`,
  quizByCandidateId: `${PFX}:quiz:by_candidate`,
  brujulaByRegion: `${PFX}:brujula:by_region`,
  quizByRegion: `${PFX}:quiz:by_region`,
  shareByRegion: `${PFX}:share:by_region`,
} as const;

/** Max records per list (prevents unbounded memory growth) */
const MAX_RECORDS = 5000;

// ── Helper ──────────────────────────────────────────

function geoFields(geo: GeoData) {
  return {
    region: resolveRegionName(geo.region) || geo.region || undefined,
    city: geo.city || undefined,
    country: geo.country || 'CO',
  };
}

function makeId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ── Chat interaction ────────────────────────────────

export interface ChatInteractionRecord {
  question: string;
  response: string;
  candidateId?: string;
  sessionId: string;
  geo: GeoData;
}

export async function saveChatInteraction(data: ChatInteractionRecord): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    const { region, city, country } = geoFields(data.geo);
    const record = {
      id: makeId('chat'),
      question: data.question.slice(0, 1000),
      response: data.response.slice(0, 2000),
      candidateId: data.candidateId || null,
      sessionId: data.sessionId,
      region,
      city,
      country,
      createdAt: new Date().toISOString(),
    };

    const pipe = redis.pipeline();
    pipe.lpush(KEYS.chatInteractions, JSON.stringify(record));
    pipe.ltrim(KEYS.chatInteractions, 0, MAX_RECORDS - 1);
    pipe.incr(KEYS.chatCount);
    if (data.candidateId) {
      pipe.hincrby(KEYS.chatByCandidateId, data.candidateId, 1);
    }
    await pipe.exec();
  } catch (err) {
    console.error('[engagement] saveChatInteraction error:', err);
  }
}

// ── Chat feedback ───────────────────────────────────

export interface ChatFeedbackRecord {
  question: string;
  response: string;
  candidateId?: string;
  feedback: 'up' | 'down';
  category?: string;
  comment?: string;
  sessionId: string;
  geo: GeoData;
}

export async function saveChatFeedback(data: ChatFeedbackRecord): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    const { region, city, country } = geoFields(data.geo);
    const record = {
      id: makeId('fb'),
      question: data.question.slice(0, 500),
      response: data.response.slice(0, 500),
      candidateId: data.candidateId || null,
      feedback: data.feedback,
      category: data.category || null,
      comment: data.comment?.slice(0, 500) || null,
      sessionId: data.sessionId,
      region,
      city,
      country,
      createdAt: new Date().toISOString(),
    };

    const pipe = redis.pipeline();
    pipe.lpush(KEYS.chatFeedback, JSON.stringify(record));
    pipe.ltrim(KEYS.chatFeedback, 0, MAX_RECORDS - 1);
    pipe.hincrby(KEYS.chatFeedbackType, data.feedback, 1);
    if (data.feedback === 'down' && data.category) {
      pipe.hincrby(KEYS.chatFeedbackCategories, data.category, 1);
    }
    await pipe.exec();
  } catch (err) {
    console.error('[engagement] saveChatFeedback error:', err);
  }
}

// ── Brujula result ──────────────────────────────────

export interface BrujulaResultRecord {
  topCandidate: string;
  percentages: Record<string, number>;
  totalAgreed: number;
  totalDisagreed: number;
  totalSkipped: number;
  hadTiebreaker: boolean;
  sessionId: string;
  geo: GeoData;
}

export async function saveBrujulaResult(data: BrujulaResultRecord): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    const { region, city, country } = geoFields(data.geo);
    const record = {
      id: makeId('brj'),
      topCandidate: data.topCandidate,
      percentages: data.percentages,
      totalAgreed: data.totalAgreed,
      totalDisagreed: data.totalDisagreed,
      totalSkipped: data.totalSkipped,
      hadTiebreaker: data.hadTiebreaker,
      sessionId: data.sessionId,
      region,
      city,
      country,
      createdAt: new Date().toISOString(),
    };

    const pipe = redis.pipeline();
    pipe.lpush(KEYS.brujulaResults, JSON.stringify(record));
    pipe.ltrim(KEYS.brujulaResults, 0, MAX_RECORDS - 1);
    pipe.incr(KEYS.brujulaCount);
    pipe.hincrby(KEYS.brujulaByCandidateId, data.topCandidate, 1);
    if (region) {
      pipe.hincrby(KEYS.brujulaByRegion, region, 1);
    }
    await pipe.exec();
  } catch (err) {
    console.error('[engagement] saveBrujulaResult error:', err);
  }
}

// ── Quiz result ─────────────────────────────────────

export interface QuizResultRecord {
  topCandidate: string;
  percentages: Record<string, number>;
  answeredCount: number;
  skippedCount: number;
  sessionId: string;
  geo: GeoData;
}

export async function saveQuizResult(data: QuizResultRecord): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    const { region, city, country } = geoFields(data.geo);
    const record = {
      id: makeId('quiz'),
      topCandidate: data.topCandidate,
      percentages: data.percentages,
      answeredCount: data.answeredCount,
      skippedCount: data.skippedCount,
      sessionId: data.sessionId,
      region,
      city,
      country,
      createdAt: new Date().toISOString(),
    };

    const pipe = redis.pipeline();
    pipe.lpush(KEYS.quizResults, JSON.stringify(record));
    pipe.ltrim(KEYS.quizResults, 0, MAX_RECORDS - 1);
    pipe.incr(KEYS.quizCount);
    pipe.hincrby(KEYS.quizByCandidateId, data.topCandidate, 1);
    if (region) {
      pipe.hincrby(KEYS.quizByRegion, region, 1);
    }
    await pipe.exec();
  } catch (err) {
    console.error('[engagement] saveQuizResult error:', err);
  }
}

// ── Share event ─────────────────────────────────────

export interface ShareEventRecord {
  platform: string;
  sourcePage: string;
  sessionId: string;
  geo: GeoData;
}

export async function saveShareEvent(data: ShareEventRecord): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  try {
    const { region, city, country } = geoFields(data.geo);
    const record = {
      id: makeId('share'),
      platform: data.platform,
      sourcePage: data.sourcePage,
      sessionId: data.sessionId,
      region,
      city,
      country,
      createdAt: new Date().toISOString(),
    };

    const pipe = redis.pipeline();
    pipe.lpush(KEYS.shareEvents, JSON.stringify(record));
    pipe.ltrim(KEYS.shareEvents, 0, MAX_RECORDS - 1);
    pipe.incr(KEYS.shareCount);
    pipe.hincrby(KEYS.sharePlatform, data.platform, 1);
    if (region) {
      pipe.hincrby(KEYS.shareByRegion, region, 1);
    }
    await pipe.exec();
  } catch (err) {
    console.error('[engagement] saveShareEvent error:', err);
  }
}

// ── Read functions (for dashboard/admin) ────────────

export async function getEngagementSummary() {
  const redis = getRedis();
  if (!redis) {
    return {
      chat: { total: 0, byCandidateId: {}, feedbackUp: 0, feedbackDown: 0, categories: {} },
      brujula: { total: 0, byCandidateId: {}, byRegion: {} },
      quiz: { total: 0, byCandidateId: {}, byRegion: {} },
      share: { total: 0, byPlatform: {}, byRegion: {} },
    };
  }

  try {
    const pipe = redis.pipeline();
    pipe.get(KEYS.chatCount);                    // 0
    pipe.hgetall(KEYS.chatByCandidateId);        // 1
    pipe.hgetall(KEYS.chatFeedbackType);         // 2
    pipe.hgetall(KEYS.chatFeedbackCategories);   // 3
    pipe.get(KEYS.brujulaCount);                 // 4
    pipe.hgetall(KEYS.brujulaByCandidateId);     // 5
    pipe.hgetall(KEYS.brujulaByRegion);          // 6
    pipe.get(KEYS.quizCount);                    // 7
    pipe.hgetall(KEYS.quizByCandidateId);        // 8
    pipe.hgetall(KEYS.quizByRegion);             // 9
    pipe.get(KEYS.shareCount);                   // 10
    pipe.hgetall(KEYS.sharePlatform);            // 11
    pipe.hgetall(KEYS.shareByRegion);            // 12

    const results = await pipe.exec();

    const toNum = (r: Record<string, string> | null): Record<string, number> => {
      if (!r) return {};
      const out: Record<string, number> = {};
      for (const [k, v] of Object.entries(r)) out[k] = Number(v) || 0;
      return out;
    };

    const feedbackTypes = toNum(results[2] as Record<string, string> | null);

    return {
      chat: {
        total: Number(results[0]) || 0,
        byCandidateId: toNum(results[1] as Record<string, string> | null),
        feedbackUp: feedbackTypes['up'] || 0,
        feedbackDown: feedbackTypes['down'] || 0,
        categories: toNum(results[3] as Record<string, string> | null),
      },
      brujula: {
        total: Number(results[4]) || 0,
        byCandidateId: toNum(results[5] as Record<string, string> | null),
        byRegion: toNum(results[6] as Record<string, string> | null),
      },
      quiz: {
        total: Number(results[7]) || 0,
        byCandidateId: toNum(results[8] as Record<string, string> | null),
        byRegion: toNum(results[9] as Record<string, string> | null),
      },
      share: {
        total: Number(results[10]) || 0,
        byPlatform: toNum(results[11] as Record<string, string> | null),
        byRegion: toNum(results[12] as Record<string, string> | null),
      },
    };
  } catch (err) {
    console.error('[engagement] getSummary error:', err);
    return {
      chat: { total: 0, byCandidateId: {}, feedbackUp: 0, feedbackDown: 0, categories: {} },
      brujula: { total: 0, byCandidateId: {}, byRegion: {} },
      quiz: { total: 0, byCandidateId: {}, byRegion: {} },
      share: { total: 0, byPlatform: {}, byRegion: {} },
    };
  }
}

/**
 * Get recent records of a specific type.
 * Returns parsed JSON objects, newest first.
 */
export async function getRecentRecords(
  type: 'chat' | 'feedback' | 'brujula' | 'quiz' | 'share',
  limit: number = 50,
) {
  const redis = getRedis();
  if (!redis) return [];

  const keyMap: Record<string, string> = {
    chat: KEYS.chatInteractions,
    feedback: KEYS.chatFeedback,
    brujula: KEYS.brujulaResults,
    quiz: KEYS.quizResults,
    share: KEYS.shareEvents,
  };

  try {
    const raw = await redis.lrange(keyMap[type], 0, limit - 1);
    return (raw as string[]).map((r) => {
      try { return JSON.parse(r); } catch { return null; }
    }).filter(Boolean);
  } catch {
    return [];
  }
}
