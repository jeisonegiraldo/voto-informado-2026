import { NextRequest } from 'next/server';
import { classifyPetition } from '@/lib/petition-classifier';
import { savePetition, getPetitionStats, getRecentPetitions, likePetition } from '@/lib/petition-store';
import { track } from '@/lib/track';
import type { CitizenPetition } from '@/types/petition';
import type { CandidateId } from '@/types/candidate';

const VALID_CANDIDATES: CandidateId[] = ['cepeda', 'espriella', 'valencia', 'fajardo'];

// Simple rate limit: max 5 petitions per IP per hour
const petitionRateMap = new Map<string, { count: number; resetAt: number }>();

function checkPetitionRate(ip: string): boolean {
  const now = Date.now();
  const entry = petitionRateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    petitionRateMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { candidateId, text, name } = body;

    // Validate
    if (!candidateId || !VALID_CANDIDATES.includes(candidateId)) {
      return Response.json({ error: 'Candidato inválido' }, { status: 400 });
    }

    if (!text || typeof text !== 'string' || text.trim().length < 10) {
      return Response.json(
        { error: 'El mensaje debe tener al menos 10 caracteres' },
        { status: 400 }
      );
    }

    if (text.length > 1000) {
      return Response.json(
        { error: 'El mensaje no puede exceder 1000 caracteres' },
        { status: 400 }
      );
    }

    // Rate limit
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
    if (!checkPetitionRate(ip)) {
      return Response.json(
        { error: 'Has enviado demasiados mensajes. Intenta más tarde.' },
        { status: 429 }
      );
    }

    // Track petition submission
    track(req, 'petition_submit', { candidateId });

    // Capture geo from Vercel headers (automatically set on Vercel)
    const city = req.headers.get('x-vercel-ip-city') || undefined;
    const region = req.headers.get('x-vercel-ip-country-region') || undefined;
    const country = req.headers.get('x-vercel-ip-country') || 'CO';

    // Classify with LLM — non-blocking, use defaults if it fails
    let classificationResult: {
      classification: 'comentario' | 'peticion' | 'pregunta' | 'apoyo' | 'critica';
      dimensionId: string;
      dimensionLabel: string;
    } = {
      classification: 'comentario',
      dimensionId: 'ideology',
      dimensionLabel: 'General',
    };

    try {
      classificationResult = await classifyPetition(text.trim(), candidateId);
    } catch (err) {
      console.error('[peticiones] Classification failed, using defaults:', err);
    }

    // Build petition object
    const petition: CitizenPetition = {
      id: `pet_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      candidateId,
      text: text.trim(),
      name: name?.trim() || undefined,
      classification: classificationResult.classification,
      dimension: classificationResult.dimensionId as CitizenPetition['dimension'],
      dimensionLabel: classificationResult.dimensionLabel,
      region: region ? decodeURIComponent(region) : undefined,
      city: city ? decodeURIComponent(city) : undefined,
      country,
      createdAt: new Date().toISOString(),
    };

    // Save
    const saved = await savePetition(petition);

    if (!saved) {
      // Check what's missing to give a useful error
      const hasRedis = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
      console.error(
        `[peticiones] Save failed. Redis configured: ${hasRedis}`
      );
      return Response.json(
        {
          error: hasRedis
            ? 'Error al guardar. Intenta más tarde.'
            : 'El servicio de almacenamiento no está configurado. Contacta al administrador.',
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      classification: petition.classification,
      dimension: petition.dimensionLabel,
      message: 'Tu mensaje ha sido registrado. Gracias por participar.',
    });
  } catch (error) {
    console.error('[peticiones] Error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { petitionId } = body;

    if (!petitionId || typeof petitionId !== 'string') {
      return Response.json({ error: 'ID de petición inválido' }, { status: 400 });
    }

    const success = await likePetition(petitionId);
    if (!success) {
      return Response.json({ error: 'No se pudo registrar el apoyo' }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('[peticiones] Like error:', error);
    return Response.json({ error: 'Error interno' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const includeTrending = searchParams.get('trending') === '1';

  try {
    const stats = await getPetitionStats();
    if (includeTrending) {
      const recent = await getRecentPetitions(15);
      return Response.json({ ...stats, recentPetitions: recent });
    }
    return Response.json(stats);
  } catch {
    return Response.json(
      { total: 0, byCandidateId: {}, byClassification: {}, byDimension: {}, byRegion: {} }
    );
  }
}
