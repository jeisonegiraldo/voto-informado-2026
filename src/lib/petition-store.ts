import { Redis } from '@upstash/redis';
import { getRedis } from '@/lib/redis';
import type { CitizenPetition, PetitionStats } from '@/types/petition';

const PETITIONS_KEY = 'voto_informado:petitions';
const STATS_KEY = 'voto_informado:petition_stats';

export async function savePetition(petition: CitizenPetition): Promise<boolean> {
  const redis = getRedis();
  if (!redis) {
    console.error('[petition-store] Cannot save: Redis not available');
    return false;
  }

  try {
    // Store as list (push to front for latest-first)
    await redis.lpush(PETITIONS_KEY, JSON.stringify(petition));

    // Update aggregate stats (non-blocking — don't fail the save if stats fail)
    updateStats(redis, petition).catch((err) =>
      console.error('[petition-store] Stats update failed (non-critical):', err)
    );

    return true;
  } catch (error) {
    console.error('[petition-store] Failed to save petition:', error);
    return false;
  }
}

async function updateStats(redis: Redis, petition: CitizenPetition): Promise<void> {
  let stats = await redis.get<PetitionStats>(STATS_KEY);

  if (!stats) {
    stats = {
      total: 0,
      byCandidateId: {},
      byClassification: {},
      byDimension: {},
      byRegion: {},
    };
  }

  stats.total += 1;

  stats.byCandidateId[petition.candidateId] =
    (stats.byCandidateId[petition.candidateId] || 0) + 1;

  if (petition.classification) {
    stats.byClassification[petition.classification] =
      (stats.byClassification[petition.classification] || 0) + 1;
  }

  if (petition.dimension) {
    stats.byDimension[petition.dimension] =
      (stats.byDimension[petition.dimension] || 0) + 1;
  }

  if (petition.region) {
    stats.byRegion[petition.region] =
      (stats.byRegion[petition.region] || 0) + 1;
  }

  await redis.set(STATS_KEY, stats);
}

export async function getPetitionStats(): Promise<PetitionStats> {
  const redis = getRedis();
  if (!redis) {
    return { total: 0, byCandidateId: {}, byClassification: {}, byDimension: {}, byRegion: {} };
  }

  try {
    const stats = await redis.get<PetitionStats>(STATS_KEY);
    return stats || { total: 0, byCandidateId: {}, byClassification: {}, byDimension: {}, byRegion: {} };
  } catch {
    return { total: 0, byCandidateId: {}, byClassification: {}, byDimension: {}, byRegion: {} };
  }
}

export async function getAllPetitions(): Promise<CitizenPetition[]> {
  const redis = getRedis();
  if (!redis) return [];

  try {
    const raw = await redis.lrange(PETITIONS_KEY, 0, -1);
    return raw.map((item) =>
      typeof item === 'string' ? JSON.parse(item) : item
    ) as CitizenPetition[];
  } catch {
    return [];
  }
}
