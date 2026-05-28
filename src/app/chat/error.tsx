'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ChatError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
        <AlertCircle className="h-7 w-7 text-red-500" />
      </div>
      <h1 className="text-xl font-bold text-gray-900">
        Error en el Chat Electoral
      </h1>
      <p className="mt-2 text-sm text-gray-500">
        Ocurrio un error cargando el chat. Intenta recargar la pagina.
      </p>
      <Button onClick={reset} className="mt-6 gap-2">
        <RefreshCw className="h-4 w-4" />
        Intentar de nuevo
      </Button>
    </div>
  );
}
