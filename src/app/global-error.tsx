'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="es">
      <body className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="mb-4 text-5xl">⚠️</div>
          <h1 className="text-xl font-bold text-gray-900">Algo salio mal</h1>
          <p className="mt-2 text-sm text-gray-500">
            Ocurrio un error inesperado. Nuestro equipo ya fue notificado.
          </p>
          <button
            onClick={reset}
            className="mt-6 rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
          >
            Intentar de nuevo
          </button>
        </div>
      </body>
    </html>
  );
}
