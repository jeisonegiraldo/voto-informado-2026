'use client';

import { useState, useRef } from 'react';
import { Search, Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Markdown from 'react-markdown';

const POPULAR_TOPICS = [
  'Pensiones',
  'Seguridad',
  'Impuestos',
  'Educación',
  'Salud y EPS',
  'Empleo y emprendimiento',
  'Reforma agraria',
  'Corrupción',
  'Medio ambiente',
  'Tecnología e inteligencia artificial',
  'Relaciones con Venezuela',
  'Drogas y narcotráfico',
];

export function TopicSearch() {
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState('');
  const [searchedTopic, setSearchedTopic] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(
    () => `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  );
  const resultRef = useRef<HTMLDivElement>(null);

  async function handleSearch(text?: string) {
    const searchText = text || topic.trim();
    if (!searchText || isSearching) return;

    setTopic(searchText);
    setSearchedTopic(searchText);
    setError(null);
    setResult('');
    setIsSearching(true);

    try {
      const response = await fetch('/api/buscar-tema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: searchText, sessionId }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Error del servidor');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No se pudo leer la respuesta');

      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) throw new Error(parsed.error);
              if (parsed.text) {
                fullText += parsed.text;
                setResult(fullText);
              }
            } catch {
              // skip
            }
          }
        }
      }

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Error desconocido'
      );
    } finally {
      setIsSearching(false);
    }
  }

  function handleReset() {
    setTopic('');
    setResult('');
    setSearchedTopic('');
    setError(null);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  }

  return (
    <div className="space-y-6">
      {/* Search input */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <label
          htmlFor="topic-input"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          ¿Sobre qué tema quieres comparar?
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              id="topic-input"
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value.slice(0, 200))}
              onKeyDown={handleKeyDown}
              placeholder='Ej: "pensiones", "seguridad", "impuestos"...'
              className="w-full rounded-xl border bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-teal-300 focus:bg-white"
              disabled={isSearching}
            />
          </div>
          <Button
            onClick={() => handleSearch()}
            disabled={topic.trim().length < 3 || isSearching}
            className="shrink-0 gap-2 bg-teal-500 text-white hover:bg-teal-400"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Buscar
          </Button>
        </div>
      </div>

      {/* Popular topics */}
      {!result && !isSearching && (
        <div>
          <p className="mb-2 text-xs font-medium text-gray-400">
            Temas populares:
          </p>
          <div className="flex flex-wrap gap-2">
            {POPULAR_TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => handleSearch(t)}
                className="rounded-full border bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Result */}
      {(result || isSearching) && (
        <div
          ref={resultRef}
          className="rounded-xl border bg-white p-6 shadow-sm"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              {searchedTopic && (
                <>
                  Propuestas sobre:{' '}
                  <span className="text-teal-600">{searchedTopic}</span>
                </>
              )}
            </h3>
            {result && !isSearching && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="gap-1 text-gray-400"
              >
                <RotateCcw className="h-3 w-3" />
                Nueva búsqueda
              </Button>
            )}
          </div>
          {result ? (
            <Markdown
              components={{
                h3: ({ children }) => (
                  <h3 className="mb-1.5 mt-4 text-sm font-bold text-gray-800 first:mt-0">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mb-2 text-sm leading-relaxed text-gray-700 last:mb-0">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-2 space-y-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-2 ml-4 list-decimal space-y-1">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="flex items-start gap-1.5 text-sm text-gray-700">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                    <span>{children}</span>
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-gray-900">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-gray-600">{children}</em>
                ),
                hr: () => <hr className="my-3 border-gray-200" />,
              }}
            >
              {result}
            </Markdown>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">
                Buscando propuestas de los 4 candidatos...
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
