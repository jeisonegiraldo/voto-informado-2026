'use client';

import { useEffect, useState, useCallback } from 'react';
import { candidates } from '@/data/candidates';
import { dimensions } from '@/data/dimensions';
import { Heart, MessageSquare, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CandidateId } from '@/types/candidate';

interface WallPetition {
  id: string;
  candidateId: CandidateId;
  text: string;
  likes?: number;
  classification?: string;
  dimension?: string;
  dimensionLabel?: string;
  region?: string;
  createdAt: string;
}

const classificationEmoji: Record<string, string> = {
  comentario: '💬',
  peticion: '📋',
  pregunta: '❓',
  apoyo: '👍',
  critica: '⚠️',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'ahora';
  if (mins < 60) return `hace ${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `hace ${days}d`;
}

export function PetitionWall() {
  const [petitions, setPetitions] = useState<WallPetition[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CandidateId | 'all'>('all');
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  // Load liked IDs from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('vi_liked_petitions');
      if (stored) setLikedIds(new Set(JSON.parse(stored)));
    } catch {}
  }, []);

  const fetchPetitions = useCallback(() => {
    fetch('/api/peticiones?trending=1')
      .then((r) => r.json())
      .then((data) => {
        setPetitions(data.recentPetitions || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchPetitions();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchPetitions, 30000);
    return () => clearInterval(interval);
  }, [fetchPetitions]);

  async function handleLike(petitionId: string) {
    if (likedIds.has(petitionId)) return;

    // Optimistic update
    const newLikedIds = new Set(likedIds);
    newLikedIds.add(petitionId);
    setLikedIds(newLikedIds);

    setPetitions((prev) =>
      prev.map((p) =>
        p.id === petitionId ? { ...p, likes: (p.likes || 0) + 1 } : p
      )
    );

    // Persist to localStorage
    try {
      localStorage.setItem(
        'vi_liked_petitions',
        JSON.stringify([...newLikedIds])
      );
    } catch {}

    // Send to API
    try {
      await fetch('/api/peticiones', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ petitionId }),
      });
    } catch {
      // Revert on failure
      newLikedIds.delete(petitionId);
      setLikedIds(newLikedIds);
    }
  }

  const filtered =
    filter === 'all'
      ? petitions
      : petitions.filter((p) => p.candidateId === filter);

  // Sort: most liked first, then newest
  const sorted = [...filtered].sort((a, b) => {
    const likeDiff = (b.likes || 0) - (a.likes || 0);
    if (likeDiff !== 0) return likeDiff;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div>
      {/* Header + filter */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <MessageSquare className="h-5 w-5 text-teal-600" />
          Muro Ciudadano
          {petitions.length > 0 && (
            <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700">
              {petitions.length}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Filter className="h-3.5 w-3.5 shrink-0 text-gray-400" />
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === 'all'
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          {candidates.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter(c.id)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filter === c.id
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={
                filter === c.id
                  ? { backgroundColor: c.color }
                  : undefined
              }
            >
              {c.name.split(' ').slice(-1)[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Wall */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-xl border bg-gray-50 py-12 text-center">
          <MessageSquare className="mx-auto mb-2 h-8 w-8 text-gray-300" />
          <p className="text-sm text-gray-400">
            {filter === 'all'
              ? 'Aún no hay mensajes. ¡Sé el primero en escribir!'
              : 'No hay mensajes para este candidato.'}
          </p>
        </div>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2">
          {sorted.map((p) => {
            const candidate = candidates.find((c) => c.id === p.candidateId);
            const dim = dimensions.find((d) => d.id === p.dimension);
            const emoji = classificationEmoji[p.classification || ''] || '💬';
            const isLiked = likedIds.has(p.id);

            return (
              <div
                key={p.id}
                className="mb-4 break-inside-avoid rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Header */}
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {candidate && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                        style={{ backgroundColor: candidate.color }}
                      >
                        {candidate.name.split(' ').slice(-1)[0]}
                      </span>
                    )}
                    {p.dimensionLabel && (
                      <span className="text-[10px] text-gray-400">
                        {p.dimensionLabel}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {timeAgo(p.createdAt)}
                  </span>
                </div>

                {/* Text */}
                <p className="text-sm leading-relaxed text-gray-700">
                  {emoji} {p.text}
                </p>

                {/* Footer: like + meta */}
                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleLike(p.id)}
                    disabled={isLiked}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                      isLiked
                        ? 'bg-rose-50 text-rose-500'
                        : 'bg-gray-100 text-gray-500 hover:bg-rose-50 hover:text-rose-500 active:scale-95'
                    }`}
                  >
                    <Heart
                      className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`}
                    />
                    {(p.likes || 0) > 0 && (
                      <span>{p.likes}</span>
                    )}
                    {!isLiked && (p.likes || 0) === 0 && (
                      <span>Apoyar</span>
                    )}
                  </button>
                  {p.region && (
                    <span className="text-[10px] text-gray-400">
                      📍 {p.region}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
