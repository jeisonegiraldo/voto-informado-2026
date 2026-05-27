import type { CandidateId } from './candidate';

export type DimensionId =
  | 'ideology'
  | 'economic-model'
  | 'tax-policy'
  | 'state-size'
  | 'foreign-investment'
  | 'security'
  | 'drug-policy'
  | 'family-values'
  | 'education'
  | 'technology'
  | 'healthcare'
  | 'petro-stance';

export interface Dimension {
  id: DimensionId;
  name: string;
  description: string;
  icon: string; // lucide icon name
  spectrumLabels: [string, string]; // [left-end, right-end]
}

export interface SourceRef {
  type: 'plan' | 'news' | 'debate' | 'interview' | 'research';
  label: string;
  url?: string;
  planPage?: number;
}

export interface CandidatePosition {
  candidateId: CandidateId;
  dimensionId: DimensionId;
  score: number; // -5 to +5 on the dimension spectrum
  depth: number; // 1-5: profundidad y coherencia del plan en esta dimensión
  summary: string;
  keyProposals: string[];
  sourceRefs: SourceRef[];
  risks: string[];
}
