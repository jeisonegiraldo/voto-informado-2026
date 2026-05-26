import type { CandidateId } from './candidate';
import type { DimensionId } from './dimension';

export interface QuizQuestion {
  id: string;
  dimensionId: DimensionId;
  text: string;
  context?: string;
  options: QuizOption[];
}

export interface QuizOption {
  id: string;
  text: string;
  candidateScores: Record<CandidateId, number>; // 0-3
}

export interface QuizAnswer {
  questionId: string;
  optionId: string;
}

export interface QuizResult {
  answers: QuizAnswer[];
  candidateScores: Record<CandidateId, number>;
  candidatePercentages: Record<CandidateId, number>; // 0-100
  topCandidate: CandidateId;
  dimensionBreakdown: DimensionBreakdown[];
}

export interface DimensionBreakdown {
  dimensionId: DimensionId;
  userChoice: string;
  candidateAlignment: Record<CandidateId, number>; // 0-3 for this question
}
