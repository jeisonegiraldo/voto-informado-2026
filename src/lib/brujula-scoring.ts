import type { CandidateId } from '@/types/candidate';
import type { BrujulaCard } from '@/data/brujula-cards';

const CANDIDATE_IDS: CandidateId[] = ['cepeda', 'espriella', 'valencia', 'fajardo'];

export interface BrujulaSwipe {
  cardId: string;
  direction: 'right' | 'left' | 'skip';
}

export interface BrujulaResult {
  swipes: BrujulaSwipe[];
  candidateScores: Record<CandidateId, number>;
  candidatePercentages: Record<CandidateId, number>;
  topCandidate: CandidateId;
  totalAgreed: number;
  totalDisagreed: number;
  totalSkipped: number;
  /** Which cards the user agreed with, for the reveal */
  agreedCards: BrujulaCard[];
  disagreedCards: BrujulaCard[];
}

export function calculateBrujulaResults(
  swipes: BrujulaSwipe[],
  cards: BrujulaCard[]
): BrujulaResult {
  const cardMap = new Map(cards.map((c) => [c.id, c]));

  const candidateScores: Record<CandidateId, number> = {
    cepeda: 0,
    espriella: 0,
    valencia: 0,
    fajardo: 0,
  };

  const agreedCards: BrujulaCard[] = [];
  const disagreedCards: BrujulaCard[] = [];
  let totalAgreed = 0;
  let totalDisagreed = 0;
  let totalSkipped = 0;

  for (const swipe of swipes) {
    const card = cardMap.get(swipe.cardId);
    if (!card) continue;

    if (swipe.direction === 'right') {
      // Agree: +1 to primary candidate, partial to secondary
      candidateScores[card.candidateId] += 1;
      if (card.secondaryScores) {
        for (const [cid, score] of Object.entries(card.secondaryScores)) {
          candidateScores[cid as CandidateId] += score;
        }
      }
      agreedCards.push(card);
      totalAgreed++;
    } else if (swipe.direction === 'left') {
      // Disagree: no points
      disagreedCards.push(card);
      totalDisagreed++;
    } else {
      totalSkipped++;
    }
  }

  // Calculate percentages
  const maxScore = Math.max(...CANDIDATE_IDS.map((cid) => candidateScores[cid]), 1);
  const candidatePercentages: Record<CandidateId, number> = {
    cepeda: 0,
    espriella: 0,
    valencia: 0,
    fajardo: 0,
  };

  for (const cid of CANDIDATE_IDS) {
    // Normalize relative to max scorer (the top candidate always gets ~100%)
    // Then scale to a realistic range
    candidatePercentages[cid] = Math.round((candidateScores[cid] / maxScore) * 100);
  }

  const topCandidate = CANDIDATE_IDS.reduce((top, cid) =>
    candidateScores[cid] > candidateScores[top] ? cid : top
  );

  return {
    swipes,
    candidateScores,
    candidatePercentages,
    topCandidate,
    totalAgreed,
    totalDisagreed,
    totalSkipped,
    agreedCards,
    disagreedCards,
  };
}

export function encodeBrujulaResults(swipes: BrujulaSwipe[]): string {
  // Compact: cardId:direction(r/l/s) joined by comma
  const str = swipes
    .map((s) => `${s.cardId}:${s.direction[0]}`)
    .join(',');
  return btoa(str);
}

export function decodeBrujulaResults(encoded: string): BrujulaSwipe[] | null {
  try {
    const decoded = atob(encoded);
    return decoded.split(',').map((pair) => {
      const [cardId, dir] = pair.split(':');
      const direction =
        dir === 'r' ? 'right' : dir === 'l' ? 'left' : 'skip';
      return { cardId, direction } as BrujulaSwipe;
    });
  } catch {
    return null;
  }
}
