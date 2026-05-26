import type { CandidateId } from './candidate';
import type { DimensionId } from './dimension';

export type NewsSourceId =
  | 'eltiempo'
  | 'semana'
  | 'lasillavacia'
  | 'bluradio'
  | 'rcn'
  | 'caracol';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: NewsSourceId;
  sourceName: string;
  url: string;
  publishedAt: string;
  scrapedAt: string;
  candidateIds: CandidateId[];
  dimensionIds: DimensionId[];
}

export interface NewsSourceConfig {
  id: NewsSourceId;
  name: string;
  baseUrl: string;
  rssUrl?: string;
  electionKeywords: string[];
}
