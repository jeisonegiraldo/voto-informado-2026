'use client';

import * as Sentry from '@sentry/nextjs';

export default function SentryExamplePage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-gray-900">Prueba de Sentry</h1>
      <p className="mt-2 text-sm text-gray-500">
        Haz clic en el boton para enviar un error de prueba a Sentry.
      </p>
      <button
        type="button"
        className="mt-8 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        onClick={() => {
          Sentry.startSpan(
            { name: 'Example Frontend Span', op: 'test' },
            async () => {
              const res = await fetch('/api/sentry-example-api');
              if (!res.ok) {
                throw new Error('Sentry Example Frontend Error');
              }
            }
          );
        }}
      >
        Disparar error de prueba
      </button>
    </div>
  );
}
