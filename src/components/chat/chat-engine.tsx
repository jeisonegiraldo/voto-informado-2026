'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Loader2, AlertCircle, MessageSquare, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  '¿Qué propone cada candidato sobre seguridad?',
  '¿En qué se diferencian Cepeda y Valencia en economía?',
  '¿Quién propone eliminar las EPS?',
  '¿Qué dice Fajardo sobre educación?',
  '¿Cuáles son los riesgos de cada candidato?',
  '¿Qué propone Espriella sobre el tamaño del Estado?',
];

export function ChatEngine() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(() => `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  async function handleSend(text?: string) {
    const messageText = text || input.trim();
    if (!messageText || isStreaming) return;

    setError(null);
    setInput('');

    const userMessage: Message = { role: 'user', content: messageText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsStreaming(true);

    // Add empty assistant message for streaming
    const assistantMessage: Message = { role: 'assistant', content: '' };
    setMessages([...newMessages, assistantMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          sessionId,
        }),
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
                setMessages([
                  ...newMessages,
                  { role: 'assistant', content: fullText },
                ]);
              }
            } catch {
              // skip parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      // Remove the empty assistant message on error
      setMessages(newMessages);
    } finally {
      setIsStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col rounded-xl border bg-white shadow-sm">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
            <div className="rounded-full bg-blue-50 p-4">
              <Sparkles className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Pregunta sobre las elecciones 2026
              </h2>
              <p className="mt-1 max-w-md text-sm text-gray-500">
                Resuelve tus dudas sobre propuestas, candidatos y comparaciones.
                Respuestas basadas en los planes de gobierno oficiales.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSend(q)}
                  className="rounded-lg border bg-gray-50 px-3 py-2 text-left text-xs text-gray-700 transition-colors hover:border-blue-300 hover:bg-blue-50"
                >
                  <MessageSquare className="mb-1 inline h-3 w-3 text-blue-500" />{' '}
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="whitespace-pre-wrap">
                      {msg.content || (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      )}
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Disclaimer */}
      <div className="border-t bg-amber-50 px-4 py-1.5 text-center text-[10px] text-amber-700">
        ⚠️ Respuestas generadas por IA basadas en planes de gobierno oficiales. Verifica siempre con las fuentes originales.
      </div>

      {/* Input area */}
      <div className="border-t p-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe tu pregunta sobre las elecciones..."
            rows={1}
            className="max-h-24 min-h-[40px] flex-1 resize-none rounded-xl border bg-gray-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-blue-300 focus:bg-white"
            disabled={isStreaming}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isStreaming}
            size="icon"
            className="h-10 w-10 shrink-0 rounded-xl"
          >
            {isStreaming ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
