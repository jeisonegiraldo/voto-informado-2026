import type { Redis } from '@upstash/redis';
import { getRedis } from '@/lib/redis';
import type { CitizenReport, ReportStats } from '@/types/report';

const REPORTS_KEY = 'voto_informado:reports';
const REPORT_STATS_KEY = 'voto_informado:report_stats';

export async function saveReport(report: CitizenReport): Promise<boolean> {
  const redis = getRedis();
  if (!redis) {
    console.error('[report-store] Cannot save: Redis not available');
    return false;
  }

  try {
    await redis.lpush(REPORTS_KEY, JSON.stringify(report));

    updateReportStats(redis, report).catch((err) =>
      console.error('[report-store] Stats update failed (non-critical):', err)
    );

    return true;
  } catch (error) {
    console.error('[report-store] Failed to save report:', error);
    return false;
  }
}

async function updateReportStats(redis: Redis, report: CitizenReport): Promise<void> {
  let stats = await redis.get<ReportStats>(REPORT_STATS_KEY);

  if (!stats) {
    stats = {
      total: 0,
      byType: {},
      byCandidateId: {},
      byDimension: {},
    };
  }

  stats.total += 1;

  stats.byType[report.type] = (stats.byType[report.type] || 0) + 1;

  if (report.candidateId) {
    stats.byCandidateId[report.candidateId] =
      (stats.byCandidateId[report.candidateId] || 0) + 1;
  }

  if (report.dimensionId) {
    stats.byDimension[report.dimensionId] =
      (stats.byDimension[report.dimensionId] || 0) + 1;
  }

  await redis.set(REPORT_STATS_KEY, stats);
}

export async function getReportStats(): Promise<ReportStats> {
  const redis = getRedis();
  if (!redis) {
    return { total: 0, byType: {}, byCandidateId: {}, byDimension: {} };
  }

  try {
    const stats = await redis.get<ReportStats>(REPORT_STATS_KEY);
    return stats || { total: 0, byType: {}, byCandidateId: {}, byDimension: {} };
  } catch {
    return { total: 0, byType: {}, byCandidateId: {}, byDimension: {} };
  }
}

export async function getRecentReports(limit = 20): Promise<CitizenReport[]> {
  const redis = getRedis();
  if (!redis) return [];

  try {
    const raw = await redis.lrange(REPORTS_KEY, 0, limit - 1);
    return raw.map((item) =>
      typeof item === 'string' ? JSON.parse(item) : item
    ) as CitizenReport[];
  } catch {
    return [];
  }
}
