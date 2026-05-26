'use client';

import { useEffect, useState } from 'react';
import { candidates } from '@/data/candidates';
import { CandidateAvatar } from '@/components/shared/candidate-avatar';
import {
  Newspaper,
  ExternalLink,
  Loader2,
  Filter,
  Clock,
} from 'lucide-react';
import type { NewsArticle } from '@/types/news';
import type { CandidateId } from '@/types/candidate';

export function NewsFeed() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CandidateId | 'all'>('all');

  useEffect(() => {
    const url =
      filter === 'all' ? '/api/news' : `/api/news?candidate=${filter}`;
    setLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setArticles(data.articles || []);
      })
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [filter]);

  function formatTimeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Hace menos de 1 hora';
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short' });
  }

  return (
    <div className="space-y-4">
      {/* Candidate filter */}
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="h-4 w-4 text-gray-400" />
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
            filter === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Todas
        </button>
        {candidates.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilter(c.id)}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
              filter === c.id
                ? 'text-white shadow-sm'
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

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      )}

      {/* Empty state */}
      {!loading && articles.length === 0 && (
        <div className="rounded-xl border bg-white p-8 text-center">
          <Newspaper className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <h3 className="font-semibold text-gray-700">No hay noticias aún</h3>
          <p className="mt-1 text-sm text-gray-400">
            El rastreo de noticias se ejecuta diariamente a las 8:00 AM UTC.
            Las fuentes incluyen El Tiempo, Semana, La Silla Vacía, Blu Radio, RCN y Caracol.
          </p>
        </div>
      )}

      {/* Articles */}
      {!loading && articles.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs text-gray-400">
            {articles.length} noticias encontradas
          </p>
          {articles.map((article) => {
            const relatedCandidates = candidates.filter((c) =>
              article.candidateIds.includes(c.id)
            );
            return (
              <a
                key={article.id}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border bg-white p-4 shadow-sm transition-all hover:border-teal-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold leading-snug text-gray-900">
                      {article.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-600">
                      {article.summary}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <span className="text-xs font-medium text-teal-600">
                        {article.sourceName}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(article.publishedAt)}
                      </span>
                      {relatedCandidates.length > 0 && (
                        <div className="flex items-center gap-1">
                          {relatedCandidates.map((c) => (
                            <span
                              key={c.id}
                              className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                              style={{ backgroundColor: c.color }}
                            >
                              {c.name.split(' ').slice(-1)[0]}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-gray-300" />
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
