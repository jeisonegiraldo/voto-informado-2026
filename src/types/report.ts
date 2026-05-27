import type { CandidateId } from './candidate';
import type { DimensionId } from './dimension';

export interface CitizenReport {
  id: string;
  /** What section/area the report is about */
  type: 'dato-incorrecto' | 'sesgo' | 'propuesta-desactualizada' | 'otro';
  /** Pre-filled from context */
  candidateId?: CandidateId;
  dimensionId?: DimensionId;
  dimensionLabel?: string;
  /** Page where the report originated */
  sourcePage: string;
  /** Free text: what's incorrect */
  text: string;
  /** Optional source URL or reference supporting the correction */
  sourceRef?: string;
  /** Optional contact email for follow-up */
  email?: string;
  /** Auto-captured */
  region?: string;
  city?: string;
  country?: string;
  createdAt: string;
}

export interface ReportStats {
  total: number;
  byType: Record<string, number>;
  byCandidateId: Record<string, number>;
  byDimension: Record<string, number>;
}
