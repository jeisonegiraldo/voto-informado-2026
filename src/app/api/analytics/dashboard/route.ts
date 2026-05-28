import { NextRequest } from 'next/server';
import { getDashboard } from '@/lib/analytics-store';
import { getEngagementSummary, getRecentRecords } from '@/lib/engagement-store';

/**
 * GET /api/analytics/dashboard
 *
 * Returns aggregated analytics + engagement data.
 * Protected by CRON_SECRET to prevent unauthorized access.
 *
 * Optional query params:
 *   ?records=chat,brujula,quiz,share,feedback — include recent records
 *   ?limit=20 — number of recent records per type (default 20)
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
    const [dashboard, engagement] = await Promise.all([
      getDashboard(),
      getEngagementSummary(),
    ]);

    // Optionally include recent records
    const recordTypes = req.nextUrl.searchParams.get('records')?.split(',') || [];
    const limit = Math.min(Number(req.nextUrl.searchParams.get('limit')) || 20, 100);
    const recentRecords: Record<string, unknown[]> = {};

    if (recordTypes.length > 0) {
      const validTypes = ['chat', 'feedback', 'brujula', 'quiz', 'share'] as const;
      const promises = recordTypes
        .filter((t): t is (typeof validTypes)[number] => validTypes.includes(t as (typeof validTypes)[number]))
        .map(async (type) => {
          recentRecords[type] = await getRecentRecords(type, limit);
        });
      await Promise.all(promises);
    }

    return Response.json(
      {
        ...dashboard,
        engagement,
        ...(Object.keys(recentRecords).length > 0 ? { recentRecords } : {}),
      },
      {
        headers: {
          'Cache-Control': 'private, max-age=60',
        },
      },
    );
  } catch (error) {
    console.error('[analytics/dashboard] Error:', error);
    return Response.json({ error: 'Error loading dashboard' }, { status: 500 });
  }
}
