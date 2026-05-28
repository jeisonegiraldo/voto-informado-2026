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

/**
 * Detects if there's a meaningful tie at the top of the results.
 * A tie occurs when two or more candidates have the same displayed
 * percentage (what the user actually sees on screen).
 *
 * Uses a small tolerance: candidates within 2 percentage points of the
 * top scorer are considered tied, because visually they appear nearly
 * identical.
 *
 * Returns the tied candidate IDs, or empty array if no tie.
 */
export function detectTie(result: BrujulaResult): CandidateId[] {
  const PERCENTAGE_TOLERANCE = 2; // percentage points

  const topPct = result.candidatePercentages[result.topCandidate];
  if (topPct === 0) return [];

  const tied = CANDIDATE_IDS.filter(
    (cid) => topPct - result.candidatePercentages[cid] <= PERCENTAGE_TOLERANCE
  );

  return tied.length >= 2 ? tied : [];
}

/**
 * Select tiebreaker cards from the unused pool that maximize
 * differentiation between tied candidates.
 *
 * Strategy: pick cards whose primary candidate is one of the tied
 * candidates but whose secondaryScores do NOT benefit the other tied
 * candidate(s). This ensures each swipe drives a wedge between them.
 *
 * Falls back to any unused cards from tied candidates if not enough
 * "pure differentiators" exist.
 */
export function selectTiebreakerCards(
  tiedCandidates: CandidateId[],
  usedCardIds: Set<string>,
  pool: BrujulaCard[],
  count: number = 5,
): BrujulaCard[] {
  const tiedSet = new Set(tiedCandidates);

  // All unused cards belonging to tied candidates
  const unused = pool.filter(
    (c) => !usedCardIds.has(c.id) && tiedSet.has(c.candidateId)
  );

  // Score each card by how "differentiating" it is
  // A card is a good differentiator if it gives points to its primary
  // candidate but NOT to the other tied candidates via secondaryScores
  const scored = unused.map((card) => {
    let secondaryLeakToTied = 0;
    if (card.secondaryScores) {
      for (const cid of tiedCandidates) {
        if (cid !== card.candidateId) {
          secondaryLeakToTied += card.secondaryScores[cid] ?? 0;
        }
      }
    }
    // Lower leak = better differentiator
    return { card, leak: secondaryLeakToTied };
  });

  // Sort: best differentiators first (least leak)
  scored.sort((a, b) => a.leak - b.leak);

  // Try to balance across tied candidates
  const perCandidate = Math.ceil(count / tiedCandidates.length);
  const selected: BrujulaCard[] = [];
  const selectedIds = new Set<string>();

  for (const cid of tiedCandidates) {
    const forThis = scored
      .filter((s) => s.card.candidateId === cid && !selectedIds.has(s.card.id))
      .slice(0, perCandidate);
    for (const s of forThis) {
      selected.push(s.card);
      selectedIds.add(s.card.id);
    }
  }

  // If we don't have enough, fill with remaining unused from tied candidates
  if (selected.length < count) {
    for (const s of scored) {
      if (selected.length >= count) break;
      if (!selectedIds.has(s.card.id)) {
        selected.push(s.card);
        selectedIds.add(s.card.id);
      }
    }
  }

  // Shuffle the tiebreaker cards
  const result = selected.slice(0, count);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
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
