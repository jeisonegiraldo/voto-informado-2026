import { NextRequest } from 'next/server';
import { extractGeo } from '@/lib/geo';
import {
  saveChatInteraction,
  saveChatFeedback,
  saveBrujulaResult,
  saveQuizResult,
  saveShareEvent,
} from '@/lib/engagement-store';

const VALID_CANDIDATES = ['cepeda', 'espriella', 'valencia', 'fajardo'];
const VALID_PLATFORMS = ['whatsapp', 'x', 'instagram', 'copy', 'native'];
const VALID_FEEDBACK = ['up', 'down'];

// Rate limit: max 30 records per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRate(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 30) return false;
  entry.count++;
  return true;
}

/**
 * POST /api/registrar
 *
 * Unified endpoint for saving engagement records.
 * Accepts: chat_interaction, chat_feedback, brujula_result, quiz_result, share_event.
 *
 * The server enriches every record with geo data from Vercel headers.
 * Always returns 200 to avoid leaking info to the client.
 */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
    if (!checkRate(ip)) {
      return Response.json({ ok: true });
    }

    const body = await req.json();
    const { type, sessionId } = body;

    if (!type || !sessionId || typeof sessionId !== 'string') {
      return Response.json({ ok: true });
    }

    const geo = extractGeo(req.headers);
    const sid = sessionId.slice(0, 100); // Cap session ID length

    switch (type) {
      case 'chat_interaction': {
        const { question, response, candidateId } = body;
        if (!question || typeof question !== 'string') break;
        if (!response || typeof response !== 'string') break;

        await saveChatInteraction({
          question,
          response,
          candidateId:
            candidateId && VALID_CANDIDATES.includes(candidateId)
              ? candidateId
              : undefined,
          sessionId: sid,
          geo,
        });
        break;
      }

      case 'chat_feedback': {
        const { question, response, candidateId, feedback, category, comment } =
          body;
        if (!question || typeof question !== 'string') break;
        if (!feedback || !VALID_FEEDBACK.includes(feedback)) break;

        await saveChatFeedback({
          question,
          response: typeof response === 'string' ? response : '',
          candidateId:
            candidateId && VALID_CANDIDATES.includes(candidateId)
              ? candidateId
              : undefined,
          feedback,
          category: typeof category === 'string' ? category.slice(0, 100) : undefined,
          comment: typeof comment === 'string' ? comment.slice(0, 500) : undefined,
          sessionId: sid,
          geo,
        });
        break;
      }

      case 'brujula_result': {
        const {
          topCandidate,
          percentages,
          totalAgreed,
          totalDisagreed,
          totalSkipped,
          hadTiebreaker,
        } = body;
        if (!topCandidate || !VALID_CANDIDATES.includes(topCandidate)) break;
        if (!percentages || typeof percentages !== 'object') break;

        // Validate percentages object
        const cleanPct: Record<string, number> = {};
        for (const cid of VALID_CANDIDATES) {
          cleanPct[cid] = typeof percentages[cid] === 'number' ? percentages[cid] : 0;
        }

        await saveBrujulaResult({
          topCandidate,
          percentages: cleanPct,
          totalAgreed: Number(totalAgreed) || 0,
          totalDisagreed: Number(totalDisagreed) || 0,
          totalSkipped: Number(totalSkipped) || 0,
          hadTiebreaker: !!hadTiebreaker,
          sessionId: sid,
          geo,
        });
        break;
      }

      case 'quiz_result': {
        const { topCandidate, percentages, answeredCount, skippedCount } = body;
        if (!topCandidate || !VALID_CANDIDATES.includes(topCandidate)) break;
        if (!percentages || typeof percentages !== 'object') break;

        const cleanPct: Record<string, number> = {};
        for (const cid of VALID_CANDIDATES) {
          cleanPct[cid] = typeof percentages[cid] === 'number' ? percentages[cid] : 0;
        }

        await saveQuizResult({
          topCandidate,
          percentages: cleanPct,
          answeredCount: Number(answeredCount) || 0,
          skippedCount: Number(skippedCount) || 0,
          sessionId: sid,
          geo,
        });
        break;
      }

      case 'share_event': {
        const { platform, sourcePage } = body;
        if (!platform || !VALID_PLATFORMS.includes(platform)) break;

        await saveShareEvent({
          platform,
          sourcePage: typeof sourcePage === 'string' ? sourcePage.slice(0, 200) : '/',
          sessionId: sid,
          geo,
        });
        break;
      }

      default:
        // Unknown type — silently ignore
        break;
    }

    return Response.json({ ok: true });
  } catch {
    // Always return 200 — engagement endpoint should never error to the client
    return Response.json({ ok: true });
  }
}
