export type CandidateId = 'cepeda' | 'espriella' | 'valencia' | 'fajardo';

export type PoliticalSpectrum =
  | 'far-left'
  | 'left'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'right'
  | 'far-right';

export interface Candidate {
  id: CandidateId;
  name: string;
  fullName: string;
  party: string;
  coalition: string;
  slogan: string;
  ideology: PoliticalSpectrum;
  ideologyLabel: string;
  ideologyScore: number; // -5 (far-left) to +5 (far-right)
  color: string;
  colorLight: string;
  slug: string;
  runningMate: string;
  runningMateRole: string;
  shortBio: string;
  governmentPlanPdf: string;
  governmentPlanPages: number;
  keyProposalCount: number;
}
