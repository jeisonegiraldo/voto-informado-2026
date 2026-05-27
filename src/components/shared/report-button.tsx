'use client';

import { useState } from 'react';
import { Flag, X, Send, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import type { CandidateId } from '@/types/candidate';

interface ReportButtonProps {
  /** Pre-filled context */
  candidateId?: CandidateId;
  candidateName?: string;
  dimensionId?: string;
  dimensionLabel?: string;
  /** Page path where this button lives */
  sourcePage: string;
  /** Visual variant */
  variant?: 'inline' | 'card';
}

const REPORT_TYPES = [
  { value: 'dato-incorrecto', label: 'Dato incorrecto', emoji: '❌' },
  { value: 'sesgo', label: 'Sesgo percibido', emoji: '⚖️' },
  { value: 'propuesta-desactualizada', label: 'Propuesta desactualizada', emoji: '📅' },
  { value: 'otro', label: 'Otro', emoji: '💬' },
] as const;

export function ReportButton({
  candidateId,
  candidateName,
  dimensionId,
  dimensionLabel,
  sourcePage,
  variant = 'inline',
}: ReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<string>('');
  const [text, setText] = useState('');
  const [sourceRef, setSourceRef] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function reset() {
    setType('');
    setText('');
    setSourceRef('');
    setEmail('');
    setStatus('idle');
    setErrorMsg('');
  }

  function handleClose() {
    setIsOpen(false);
    // Reset after animation
    setTimeout(reset, 200);
  }

  async function handleSubmit() {
    if (!type || text.trim().length < 10) {
      setErrorMsg('Selecciona un tipo y describe el problema (mín. 10 caracteres).');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/reportes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          candidateId,
          dimensionId,
          dimensionLabel,
          sourcePage,
          text: text.trim(),
          sourceRef: sourceRef.trim() || undefined,
          email: email.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al enviar');
      }

      setStatus('success');
      setTimeout(handleClose, 2000);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Error al enviar. Intenta más tarde.');
    }
  }

  // Context label for the modal header
  const contextParts: string[] = [];
  if (candidateName) contextParts.push(candidateName);
  if (dimensionLabel) contextParts.push(dimensionLabel);
  const contextLabel = contextParts.length > 0 ? contextParts.join(' · ') : null;

  return (
    <>
      {/* Trigger button */}
      {variant === 'inline' ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1 text-[10px] text-gray-400 transition-colors hover:text-rose-500"
          title="Reportar un error en esta información"
        >
          <Flag className="h-3 w-3" />
          <span className="hidden sm:inline">¿Algo incorrecto?</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
        >
          <Flag className="h-3.5 w-3.5" />
          Reportar un error
        </button>
      )}

      {/* Modal overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 backdrop-blur-sm sm:items-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div
            className="w-full max-w-md animate-in slide-in-from-bottom-4 rounded-2xl bg-white shadow-xl sm:slide-in-from-bottom-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Reportar un error</h3>
                {contextLabel && (
                  <p className="text-[11px] text-gray-500">{contextLabel}</p>
                )}
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body */}
            {status === 'success' ? (
              <div className="flex flex-col items-center gap-2 p-6 text-center">
                <CheckCircle className="h-10 w-10 text-teal-500" />
                <p className="text-sm font-medium text-gray-900">¡Gracias por tu reporte!</p>
                <p className="text-xs text-gray-500">Lo revisaremos lo antes posible.</p>
              </div>
            ) : (
              <div className="space-y-3 p-4">
                {/* Report type pills */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    ¿Qué tipo de error es?
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {REPORT_TYPES.map((rt) => (
                      <button
                        key={rt.value}
                        type="button"
                        onClick={() => setType(rt.value)}
                        className={`rounded-full border px-3 py-1 text-xs transition-all ${
                          type === rt.value
                            ? 'border-teal-300 bg-teal-50 font-medium text-teal-700'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {rt.emoji} {rt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="report-text"
                    className="mb-1 block text-xs font-medium text-gray-700"
                  >
                    Describe el problema
                  </label>
                  <textarea
                    id="report-text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Ej: La propuesta sobre educación de este candidato dice X, pero en su plan de gobierno (pág. 15) dice Y..."
                    rows={3}
                    maxLength={2000}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  />
                  <p className="mt-0.5 text-right text-[10px] text-gray-400">
                    {text.length}/2000
                  </p>
                </div>

                {/* Source reference */}
                <div>
                  <label
                    htmlFor="report-source"
                    className="mb-1 block text-xs font-medium text-gray-700"
                  >
                    Fuente que respalda tu corrección{' '}
                    <span className="font-normal text-gray-400">(opcional)</span>
                  </label>
                  <input
                    id="report-source"
                    type="text"
                    value={sourceRef}
                    onChange={(e) => setSourceRef(e.target.value)}
                    placeholder="Ej: Plan de gobierno pág. 23, o un enlace"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  />
                </div>

                {/* Contact email */}
                <div>
                  <label
                    htmlFor="report-email"
                    className="mb-1 block text-xs font-medium text-gray-700"
                  >
                    Tu email{' '}
                    <span className="font-normal text-gray-400">(opcional, para seguimiento)</span>
                  </label>
                  <input
                    id="report-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                  />
                </div>

                {/* Error message */}
                {errorMsg && (
                  <div className="flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-600">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                    {errorMsg}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={status === 'sending'}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-teal-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-teal-500 disabled:opacity-50"
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        Enviar reporte
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
