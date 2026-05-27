import type { CandidateId } from './candidate';
import type { DimensionId } from './dimension';

export interface CitizenPetition {
  id: string;
  candidateId: CandidateId;
  text: string;
  name?: string; // optional, citizen decides
  likes?: number;
  // LLM-classified fields (filled after submission)
  classification?: 'comentario' | 'peticion' | 'pregunta' | 'apoyo' | 'critica';
  dimension?: DimensionId;
  dimensionLabel?: string;
  // Auto-captured
  region?: string;
  city?: string;
  country?: string;
  createdAt: string;
}

export interface PetitionStats {
  total: number;
  byCandidateId: Record<string, number>;
  byClassification: Record<string, number>;
  byDimension: Record<string, number>;
  byRegion: Record<string, number>;
}
