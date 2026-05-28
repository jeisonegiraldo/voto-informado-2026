import type { CandidateId } from './candidate';
import type { DimensionId } from './dimension';

// ── Event types ─────────────────────────────────────

export type AnalyticsEventType =
  | 'page_view'
  | 'brujula_start'
  | 'brujula_complete'
  | 'brujula_tiebreaker'
  | 'quiz_start'
  | 'quiz_complete'
  | 'chat_message'
  | 'verificador_query'
  | 'buscar_tema'
  | 'comparador_view'
  | 'candidato_view'
  | 'share_click'
  | 'petition_submit'
  | 'report_submit'
  | 'noticias_view';

export interface GeoData {
  city?: string;
  region?: string; // departamento
  country?: string;
  /** Latitude (from Vercel headers) */
  lat?: string;
  /** Longitude (from Vercel headers) */
  lon?: string;
}

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  timestamp: string;
  /** Anonymous session identifier (no PII) */
  sessionId: string;
  geo: GeoData;
  /** Device info */
  device?: {
    type: 'mobile' | 'tablet' | 'desktop';
    /** User-Agent family (e.g. "Chrome", "Safari") — not full UA string */
    browser?: string;
  };
  /** Page path where the event occurred */
  page?: string;
  /** Referrer domain (not full URL) */
  referrerDomain?: string;
  /** Event-specific metadata */
  meta?: Record<string, string | number | boolean>;
}

// ── Aggregated stats ────────────────────────────────

export interface AnalyticsDashboard {
  /** Period of the data */
  period: {
    from: string;
    to: string;
  };
  /** Total events */
  totalEvents: number;
  /** Unique sessions */
  uniqueSessions: number;
  /** Events by type */
  byType: Record<string, number>;
  /** Page view counts */
  topPages: Record<string, number>;
  /** Geographic distribution */
  byRegion: Record<string, number>;
  byCity: Record<string, number>;
  /** Device breakdown */
  byDevice: Record<string, number>;
  byBrowser: Record<string, number>;
  /** Brujula stats */
  brujula: {
    started: number;
    completed: number;
    tiebreakers: number;
    topCandidateResults: Record<string, number>;
    avgCardsAgreed: number;
  };
  /** Quiz stats */
  quiz: {
    started: number;
    completed: number;
    topCandidateResults: Record<string, number>;
  };
  /** Chat & AI usage */
  ai: {
    chatMessages: number;
    verificaciones: number;
    busquedas: number;
    topVerificadorClaims: string[];
    topBusquedas: string[];
  };
  /** Referrer distribution */
  byReferrer: Record<string, number>;
  /** Hourly distribution (0-23) */
  byHour: Record<string, number>;
  /** Daily counts */
  byDay: Record<string, number>;
}

/**
 * Lightweight event payload sent from the client.
 * The server enriches it with geo data and device info.
 */
export interface ClientAnalyticsPayload {
  type: AnalyticsEventType;
  sessionId: string;
  page?: string;
  referrer?: string;
  meta?: Record<string, string | number | boolean>;
}
