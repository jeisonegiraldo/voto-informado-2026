import { NextRequest } from 'next/server';
import { saveReport, getReportStats } from '@/lib/report-store';
import type { CitizenReport } from '@/types/report';
import type { CandidateId } from '@/types/candidate';

const VALID_CANDIDATES: CandidateId[] = ['cepeda', 'espriella', 'valencia', 'fajardo'];
const VALID_TYPES: CitizenReport['type'][] = [
  'dato-incorrecto',
  'sesgo',
  'propuesta-desactualizada',
  'otro',
];

// Rate limit: max 10 reports per IP per hour
const reportRateMap = new Map<string, { count: number; resetAt: number }>();

function checkReportRate(ip: string): boolean {
  const now = Date.now();
  const entry = reportRateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    reportRateMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, candidateId, dimensionId, dimensionLabel, sourcePage, text, sourceRef, email } =
      body;

    // Validate required fields
    if (!type || !VALID_TYPES.includes(type)) {
      return Response.json({ error: 'Tipo de reporte inválido' }, { status: 400 });
    }

    if (!text || typeof text !== 'string' || text.trim().length < 10) {
      return Response.json(
        { error: 'La descripción debe tener al menos 10 caracteres' },
        { status: 400 }
      );
    }

    if (text.length > 2000) {
      return Response.json(
        { error: 'La descripción no puede exceder 2000 caracteres' },
        { status: 400 }
      );
    }

    if (candidateId && !VALID_CANDIDATES.includes(candidateId)) {
      return Response.json({ error: 'Candidato inválido' }, { status: 400 });
    }

    // Basic email validation if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Email inválido' }, { status: 400 });
    }

    // Rate limit
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
    if (!checkReportRate(ip)) {
      return Response.json(
        { error: 'Has enviado demasiados reportes. Intenta más tarde.' },
        { status: 429 }
      );
    }

    // Geo
    const city = req.headers.get('x-vercel-ip-city') || undefined;
    const region = req.headers.get('x-vercel-ip-country-region') || undefined;
    const country = req.headers.get('x-vercel-ip-country') || 'CO';

    const report: CitizenReport = {
      id: `rep_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type,
      candidateId: candidateId || undefined,
      dimensionId: dimensionId || undefined,
      dimensionLabel: dimensionLabel || undefined,
      sourcePage: sourcePage || 'desconocida',
      text: text.trim(),
      sourceRef: sourceRef?.trim() || undefined,
      email: email?.trim() || undefined,
      region: region ? decodeURIComponent(region) : undefined,
      city: city ? decodeURIComponent(city) : undefined,
      country,
      createdAt: new Date().toISOString(),
    };

    const saved = await saveReport(report);

    if (!saved) {
      const hasRedis = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
      return Response.json(
        {
          error: hasRedis
            ? 'Error al guardar. Intenta más tarde.'
            : 'El servicio no está configurado.',
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      message: 'Gracias por tu reporte. Lo revisaremos lo antes posible.',
    });
  } catch (error) {
    console.error('[reportes] Error:', error);
    return Response.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const stats = await getReportStats();
    return Response.json(stats);
  } catch {
    return Response.json({ total: 0, byType: {}, byCandidateId: {}, byDimension: {} });
  }
}
