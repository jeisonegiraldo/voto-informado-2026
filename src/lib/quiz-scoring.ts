import type { CandidateId } from '@/types/candidate';
import type { QuizAnswer, QuizResult, DimensionBreakdown } from '@/types/quiz';
import { quizQuestions } from '@/data/quiz-questions';

const CANDIDATE_IDS: CandidateId[] = ['cepeda', 'espriella', 'valencia', 'fajardo'];
const MAX_SCORE_PER_QUESTION = 3;

export function calculateQuizResults(answers: QuizAnswer[]): QuizResult {
  const candidateScores: Record<CandidateId, number> = {
    cepeda: 0,
    espriella: 0,
    valencia: 0,
    fajardo: 0,
  };

  const dimensionBreakdown: DimensionBreakdown[] = [];

  for (const answer of answers) {
    const question = quizQuestions.find((q) => q.id === answer.questionId);
    if (!question) continue;

    const option = question.options.find((o) => o.id === answer.optionId);
    if (!option) continue;

    const alignment: Record<CandidateId, number> = {
      cepeda: 0,
      espriella: 0,
      valencia: 0,
      fajardo: 0,
    };

    for (const cid of CANDIDATE_IDS) {
      const score = option.candidateScores[cid] ?? 0;
      candidateScores[cid] += score;
      alignment[cid] = score;
    }

    dimensionBreakdown.push({
      dimensionId: question.dimensionId,
      userChoice: option.text,
      candidateAlignment: alignment,
    });
  }

  // Calculate percentages: (actual score / max possible score) * 100
  const answeredCount = answers.length;
  const maxPossible = answeredCount * MAX_SCORE_PER_QUESTION;

  const candidatePercentages: Record<CandidateId, number> = {
    cepeda: 0,
    espriella: 0,
    valencia: 0,
    fajardo: 0,
  };

  if (maxPossible > 0) {
    for (const cid of CANDIDATE_IDS) {
      candidatePercentages[cid] = Math.round((candidateScores[cid] / maxPossible) * 100);
    }
  }

  // Find top candidate
  const topCandidate = CANDIDATE_IDS.reduce((top, cid) =>
    candidateScores[cid] > candidateScores[top] ? cid : top
  );

  return {
    answers,
    candidateScores,
    candidatePercentages,
    topCandidate,
    dimensionBreakdown,
  };
}

export function encodeResults(result: QuizResult): string {
  // Encode answer IDs into a compact URL-safe string
  const answerStr = result.answers.map((a) => `${a.questionId}:${a.optionId}`).join(',');
  return btoa(answerStr);
}

export function decodeResults(encoded: string): QuizAnswer[] | null {
  try {
    const decoded = atob(encoded);
    return decoded.split(',').map((pair) => {
      const [questionId, optionId] = pair.split(':');
      return { questionId, optionId };
    });
  } catch {
    return null;
  }
}
