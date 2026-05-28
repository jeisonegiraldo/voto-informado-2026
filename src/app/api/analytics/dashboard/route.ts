import { NextRequest } from 'next/server';
import { getDashboard } from '@/lib/analytics-store';

/**
 * GET /api/analytics/dashboard
 *
 * Returns aggregated analytics data.
 * Protected by CRON_SECRET to prevent unauthorized access.
 */
export async function GET(req: NextRequest) {
  // Auth: require CRON_SECRET as Bearer token or query param
  const authHeader = req.headers.get('authorization');
  const querySecret = req.nextUrl.searchParams.get('secret');
  const expectedSecret = process.env.CRON_SECRET;

  if (expectedSecret) {
    const providedSecret =
      authHeader?.replace('Bearer ', '') || querySecret;

    if (providedSecret !== expectedSecret) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const dashboard = await getDashboard();
    return Response.json(dashboard, {
      headers: {
        'Cache-Control': 'private, max-age=60',
      },
    });
  } catch (error) {
    console.error('[analytics/dashboard] Error:', error);
    return Response.json({ error: 'Error loading dashboard' }, { status: 500 });
  }
}
