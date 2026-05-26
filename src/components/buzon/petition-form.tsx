'use client';

import { useState } from 'react';
import { candidates } from '@/data/candidates';
import { CandidateAvatar } from '@/components/shared/candidate-avatar';
import {
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CandidateId } from '@/types/candidate';

interface SubmissionResult {
  success: boolean;
  classification?: string;
  dimension?: string;
  message?: string;
  error?: string;
}

const classificationLabels: Record<string, string> = {
  comentario: '💬 Comentario',
  peticion: '📋 Petición',
  pregunta: '❓ Pregunta',
  apoyo: '👍 Apoyo',
  critica: '⚠️ Crítica constructiva',
};

export function PetitionForm() {
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateId | null>(null);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [showName, setShowName] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SubmissionResult | null>(null);

  const charCount = text.length;
  const canSubmit = selectedCandidate && text.trim().length >= 10 && !isSubmitting;

  async function handleSubmit() {
    if (!canSubmit) return;

    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch('/api/peticiones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          candidateId: selectedCandidate,
          text: text.trim(),
          name: showName && name.trim() ? name.trim() : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResult({ success: false, error: data.error || 'Error al enviar' });
      } else {
        setResult({
          success: true,
          classification: data.classification,
          dimension: data.dimension,
          message: data.message,
        });
        // Reset form after success
        setText('');
        setName('');
        setSelectedCandidate(null);
        setShowName(false);
      }
    } catch {
      setResult({ success: false, error: 'Error de conexión. Intenta de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Select candidate */}
      <div>
        <label className="mb-3 block text-sm font-semibold text-gray-700">
          ¿A quién va dirigido tu mensaje?
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {candidates.map((c) => {
            const isSelected = selectedCandidate === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCandidate(c.id)}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                  isSelected
                    ? 'bg-white shadow-md'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
                style={
                  isSelected
                    ? { borderColor: c.color, backgroundColor: `${c.color}08` }
                    : undefined
                }
              >
                <CandidateAvatar candidate={c} size="md" />
                <span
                  className={`text-xs font-semibold ${
                    isSelected ? '' : 'text-gray-600'
                  }`}
                  style={isSelected ? { color: c.color } : undefined}
                >
                  {c.name.split(' ').slice(-1)[0]}
                </span>
                <span className="text-[10px] text-gray-400">{c.party}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Write message */}
      <div>
        <label
          htmlFor="petition-text"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Tu mensaje
        </label>
        <p className="mb-2 text-xs text-gray-400">
          Escribe un comentario, petición o pregunta. Será clasificado automáticamente.
        </p>
        <textarea
          id="petition-text"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 1000))}
          placeholder={
            selectedCandidate
              ? `Escribe tu mensaje para ${candidates.find((c) => c.id === selectedCandidate)?.name}...`
              : 'Primero selecciona un candidato arriba...'
          }
          rows={4}
          className="w-full resize-none rounded-xl border bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-teal-300 focus:bg-white"
          disabled={!selectedCandidate}
        />
        <div className="mt-1 flex items-center justify-between">
          <span
            className={`text-xs ${charCount > 900 ? 'text-rose-600' : 'text-gray-400'}`}
          >
            {charCount}/1000 caracteres
          </span>
          {charCount > 0 && charCount < 10 && (
            <span className="text-xs text-red-400">Mínimo 10 caracteres</span>
          )}
        </div>
      </div>

      {/* Optional name */}
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showName}
            onChange={(e) => setShowName(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-teal-600"
          />
          <span className="text-sm text-gray-600">
            Quiero incluir mi nombre <span className="text-gray-400">(opcional)</span>
          </span>
        </label>
        {showName && (
          <div className="mt-2 flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 100))}
              placeholder="Tu nombre"
              className="flex-1 rounded-lg border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-teal-300 focus:bg-white"
            />
          </div>
        )}
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full gap-2"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Enviar mensaje
          </>
        )}
      </Button>

      {/* Result feedback */}
      {result && (
        <div
          className={`rounded-xl border p-4 ${
            result.success
              ? 'border-green-200 bg-green-50'
              : 'border-red-200 bg-red-50'
          }`}
        >
          {result.success ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold">¡Mensaje registrado!</span>
              </div>
              <p className="text-sm text-green-600">{result.message}</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {result.classification && (
                  <span className="rounded-full bg-green-100 px-2 py-1 text-green-700">
                    {classificationLabels[result.classification] || result.classification}
                  </span>
                )}
                {result.dimension && (
                  <span className="rounded-full bg-teal-100 px-2 py-1 text-teal-700">
                    📊 {result.dimension}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{result.error}</span>
            </div>
          )}
        </div>
      )}

      {/* Privacy note */}
      <p className="text-center text-[10px] text-gray-400">
        <MessageSquare className="mr-1 inline h-3 w-3" />
        Tu mensaje será procesado y clasificado automáticamente por tema.
        Los mensajes son compilados y enviados a los equipos de campaña de forma agregada.
        {!showName && ' Tu mensaje es anónimo.'}
      </p>
    </div>
  );
}
