'use client';

import { useState, useRef } from 'react';
import { Search, Loader2, AlertCircle, ShieldCheck, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Markdown from 'react-markdown';

const EXAMPLE_CLAIMS = [
  'Cepeda quiere expropiar la propiedad privada',
  'Espriella va a construir megacárceles como en El Salvador',
  'Valencia propone eliminar las EPS',
  'Fajardo no tiene propuestas concretas sobre seguridad',
  'Cepeda quiere eliminar el 4x1000',
  'Espriella propone bajar todos los impuestos a cero',
];

export function ClaimChecker() {
  const [claim, setClaim] = useState('');
  const [result, setResult] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(
    () => `v_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  );
  const resultRef = useRef<HTMLDivElement>(null);

  async function handleVerify(text?: string) {
    const claimText = text || claim.trim();
    if (!claimText || isVerifying) return;

    setClaim(claimText);
    setError(null);
    setResult('');
    setIsVerifying(true);

    try {
      const response = await fetch('/api/verificar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim: claimText, sessionId }),
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
              // skip parse errors
            }
          }
        }
      }

      // Scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  }

  function handleReset() {
    setClaim('');
    setResult('');
    setError(null);
  }

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <label
          htmlFor="claim-input"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          ¿Qué afirmación quieres verificar?
        </label>
        <p className="mb-3 text-xs text-gray-400">
          Escribe lo que escuchaste, leíste en redes sociales o te contaron
          sobre un candidato.
        </p>
        <textarea
          id="claim-input"
          value={claim}
          onChange={(e) => setClaim(e.target.value.slice(0, 500))}
          placeholder='Ej: "Cepeda quiere eliminar la propiedad privada"'
          rows={3}
          className="w-full resize-none rounded-xl border bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-300 focus:bg-white"
          disabled={isVerifying}
        />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {claim.length}/500 caracteres
          </span>
          <div className="flex gap-2">
            {result && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="gap-1 text-gray-400"
              >
                <RotateCcw className="h-3 w-3" />
                Nueva verificación
              </Button>
            )}
            <Button
              onClick={() => handleVerify()}
              disabled={claim.trim().length < 10 || isVerifying}
              className="gap-2 bg-teal-500 text-white hover:bg-teal-400"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Verificar
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Example claims */}
      {!result && !isVerifying && (
        <div>
          <p className="mb-2 text-xs font-medium text-gray-400">
            <Search className="mr-1 inline h-3 w-3" />
            Ejemplos de afirmaciones para verificar:
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {EXAMPLE_CLAIMS.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => handleVerify(example)}
                className="rounded-lg border bg-gray-50 px-3 py-2 text-left text-xs text-gray-700 transition-colors hover:border-teal-300 hover:bg-teal-50"
              >
                &ldquo;{example}&rdquo;
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
      {(result || isVerifying) && (
        <div
          ref={resultRef}
          className="rounded-xl border bg-white p-6 shadow-sm"
        >
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-teal-600" />
            <h3 className="font-semibold text-gray-900">
              Resultado de la verificación
            </h3>
          </div>
          {result ? (
            <div className="prose-sm">
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
                }}
              >
                {result}
              </Markdown>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Analizando la afirmación...</span>
            </div>
          )}
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-center text-[10px] text-gray-400">
        Las verificaciones se basan en los planes de gobierno oficiales inscritos
        ante el CNE. Para afirmaciones sobre hechos recientes o declaraciones en
        medios, consulta fuentes periodísticas verificadas.
      </p>
    </div>
  );
}
