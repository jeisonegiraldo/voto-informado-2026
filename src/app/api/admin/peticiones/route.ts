import { NextRequest } from 'next/server';
import { getAllPetitions, getPetitionStats } from '@/lib/petition-store';

export async function GET(req: NextRequest) {
  // Simple auth with CRON_SECRET (reuse the same secret)
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const [petitions, stats] = await Promise.all([
      getAllPetitions(),
      getPetitionStats(),
    ]);

    return Response.json({
      stats,
      petitions,
    });
  } catch (error) {
    console.error('[admin/peticiones] Error:', error);
    return Response.json({ error: 'Error interno' }, { status: 500 });
  }
}
