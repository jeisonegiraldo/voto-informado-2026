import { ChatEngine } from '@/components/chat/chat-engine';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chat Electoral — Pregunta sobre candidatos y propuestas',
  description:
    'Resuelve tus dudas sobre las elecciones presidenciales de Colombia 2026. Respuestas basadas en los planes de gobierno oficiales.',
};

export default function ChatPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Chat Electoral</h1>
        <p className="mt-1 text-sm text-gray-500">
          Pregunta sobre propuestas, compara candidatos o resuelve tus dudas.
          Respuestas basadas en los planes de gobierno oficiales.
        </p>
      </div>
      <ChatEngine />
    </div>
  );
}
