'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, Bot, User, Loader2, AlertCircle, MessageSquare, Sparkles, ThumbsUp, ThumbsDown, X, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { candidates } from '@/data/candidates';
import Markdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  feedback?: 'up' | 'down';
  feedbackCategory?: string;
  feedbackComment?: string;
}

const FEEDBACK_CATEGORIES = [
  'Falta de contexto',
  'Información incorrecta',
  'Sesgo político',
  'Respuesta incompleta',
  'Otra',
];

const GENERAL_QUESTIONS = [
  '¿Qué propone cada candidato sobre seguridad?',
  '¿En qué se diferencian Cepeda y Valencia en economía?',
  '¿Quién propone eliminar las EPS?',
  '¿Qué dice Fajardo sobre educación?',
  '¿Cuáles son los riesgos de cada candidato?',
  '¿Qué propone Espriella sobre el tamaño del Estado?',
];

const CANDIDATE_QUESTIONS: Record<string, string[]> = {
  cepeda: [
    '¿Qué propone Cepeda sobre seguridad?',
    '¿Cuál es su modelo económico?',
    '¿Qué dice sobre educación pública?',
    '¿Cuál es su posición frente a Petro?',
    '¿Qué propone sobre reforma agraria?',
    '¿Cuáles son sus riesgos principales?',
  ],
  espriella: [
    '¿Qué propone Espriella sobre seguridad?',
    '¿Qué es el modelo Bukele que propone?',
    '¿Cuál es su política tributaria?',
    '¿Qué dice sobre el tamaño del Estado?',
    '¿Cuál es su posición sobre la familia?',
    '¿Cuáles son sus riesgos principales?',
  ],
  valencia: [
    '¿Qué propone Valencia sobre seguridad?',
    '¿Cuál es su modelo económico?',
    '¿Qué dice sobre inversión extranjera?',
    '¿Cuál es su política de educación?',
    '¿Qué propone sobre tecnología e IA?',
    '¿Cuáles son sus riesgos principales?',
  ],
  fajardo: [
    '¿Qué propone Fajardo sobre educación?',
    '¿Cuál es su modelo económico?',
    '¿Qué dice sobre seguridad?',
    '¿Cuál es su posición sobre salud?',
    '¿Qué propone sobre ciencia y tecnología?',
    '¿Cuáles son sus riesgos principales?',
  ],
};

export function ChatEngine() {
  // Read candidate filter from URL search params (client-side)
  const searchParams = useSearchParams();
  const candidateSlug = searchParams.get('candidato');
  const candidate = useMemo(
    () => (candidateSlug ? candidates.find((c) => c.slug === candidateSlug) : undefined),
    [candidateSlug]
  );
  const candidateFilter = candidate?.id;
  const candidateName = candidate?.name;

  const suggestedQuestions = candidateFilter
    ? CANDIDATE_QUESTIONS[candidateFilter] || GENERAL_QUESTIONS
    : GENERAL_QUESTIONS;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId] = useState(() => `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Feedback state
  const [feedbackModalIndex, setFeedbackModalIndex] = useState<number | null>(null);
  const [feedbackCategory, setFeedbackCategory] = useState('');
  const [feedbackComment, setFeedbackComment] = useState('');

  // TTS state
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  function handleSpeak(index: number, text: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // If already speaking this message, stop
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    // Strip markdown for cleaner speech
    const cleanText = text
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[-•]\s/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-CO';
    utterance.rate = 1;
    utterance.pitch = 1;

    // Try to find a Spanish voice
    const voices = window.speechSynthesis.getVoices();
    const esVoice = voices.find(
      (v) => v.lang.startsWith('es-CO') || v.lang.startsWith('es-')
    );
    if (esVoice) utterance.voice = esVoice;

    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  }

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  function handleFeedback(index: number, type: 'up' | 'down') {
    const updated = [...messages];
    if (updated[index].feedback === type) {
      // Toggle off if same
      updated[index].feedback = undefined;
      updated[index].feedbackCategory = undefined;
      updated[index].feedbackComment = undefined;
      setMessages(updated);
      return;
    }
    updated[index].feedback = type;
    setMessages(updated);

    if (type === 'down') {
      setFeedbackModalIndex(index);
      setFeedbackCategory('');
      setFeedbackComment('');
    }
  }

  function submitNegativeFeedback() {
    if (feedbackModalIndex === null) return;
    const updated = [...messages];
    updated[feedbackModalIndex].feedbackCategory = feedbackCategory || 'Otra';
    updated[feedbackModalIndex].feedbackComment = feedbackComment;
    setMessages(updated);
    setFeedbackModalIndex(null);

    // Log to console for now (could send to API later)
    console.log('[Feedback]', {
      sessionId,
      messageIndex: feedbackModalIndex,
      type: 'negative',
      category: feedbackCategory || 'Otra',
      comment: feedbackComment,
      messageContent: updated[feedbackModalIndex].content.slice(0, 200),
    });
  }

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
          candidateFilter,
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
    <div className="relative flex h-[calc(100dvh-8rem)] flex-col rounded-xl border bg-white shadow-sm sm:h-[calc(100vh-10rem)]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
            <div className="rounded-full bg-teal-50 p-4">
              <Sparkles className="h-8 w-8 text-teal-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {candidateName
                  ? `Pregunta sobre ${candidateName}`
                  : 'Pregunta sobre las elecciones 2026'}
              </h2>
              <p className="mt-1 max-w-md text-sm text-gray-500">
                {candidateName
                  ? `Resuelve tus dudas sobre las propuestas de ${candidateName}. Respuestas basadas en su plan de gobierno.`
                  : 'Resuelve tus dudas sobre propuestas, candidatos y comparaciones. Respuestas basadas en los planes de gobierno oficiales.'}
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSend(q)}
                  className="rounded-lg border bg-gray-50 px-3 py-2 text-left text-xs text-gray-700 transition-colors hover:border-teal-300 hover:bg-teal-50"
                >
                  <MessageSquare className="mb-1 inline h-3 w-3 text-teal-500" />{' '}
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i}>
                <div
                  className={`flex gap-3 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100">
                      <Bot className="h-4 w-4 text-teal-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      msg.content ? (
                        <Markdown
                          components={{
                            h2: ({ children }) => (
                              <h2 className="mb-2 mt-3 text-base font-bold text-gray-900 first:mt-0">{children}</h2>
                            ),
                            h3: ({ children }) => (
                              <h3 className="mb-1.5 mt-3 text-sm font-bold text-gray-800 first:mt-0">{children}</h3>
                            ),
                            p: ({ children }) => (
                              <p className="mb-2 last:mb-0">{children}</p>
                            ),
                            ul: ({ children }) => (
                              <ul className="mb-2 ml-1 space-y-1 last:mb-0">{children}</ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="mb-2 ml-4 list-decimal space-y-1 last:mb-0">{children}</ol>
                            ),
                            li: ({ children }) => (
                              <li className="flex items-start gap-1.5">
                                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />
                                <span>{children}</span>
                              </li>
                            ),
                            strong: ({ children }) => (
                              <strong className="font-semibold text-gray-900">{children}</strong>
                            ),
                            em: ({ children }) => (
                              <em className="text-gray-600 italic">{children}</em>
                            ),
                            hr: () => <hr className="my-3 border-gray-200" />,
                          }}
                        >
                          {msg.content}
                        </Markdown>
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      )
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
                {/* Feedback + TTS buttons for assistant messages */}
                {msg.role === 'assistant' && msg.content && !isStreaming && (
                  <div className="ml-11 mt-1 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleFeedback(i, 'up')}
                      className={`rounded-md p-1 transition-colors ${
                        msg.feedback === 'up'
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'text-gray-300 hover:bg-gray-100 hover:text-gray-500'
                      }`}
                      title="Buena respuesta"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFeedback(i, 'down')}
                      className={`rounded-md p-1 transition-colors ${
                        msg.feedback === 'down'
                          ? 'bg-rose-100 text-rose-600'
                          : 'text-gray-300 hover:bg-gray-100 hover:text-gray-500'
                      }`}
                      title="Mala respuesta"
                    >
                      <ThumbsDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSpeak(i, msg.content)}
                      className={`rounded-md p-1 transition-colors ${
                        speakingIndex === i
                          ? 'bg-teal-100 text-teal-600'
                          : 'text-gray-300 hover:bg-gray-100 hover:text-gray-500'
                      }`}
                      title={speakingIndex === i ? 'Detener audio' : 'Escuchar respuesta'}
                    >
                      {speakingIndex === i ? (
                        <VolumeX className="h-3.5 w-3.5" />
                      ) : (
                        <Volume2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                    {msg.feedback === 'down' && msg.feedbackCategory && (
                      <span className="ml-1 rounded bg-rose-50 px-1.5 py-0.5 text-[10px] text-rose-500">
                        {msg.feedbackCategory}
                      </span>
                    )}
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
      <div className="border-t bg-gray-100 px-4 py-1.5 text-center text-[10px] text-gray-600">
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
            className="max-h-24 min-h-[40px] flex-1 resize-none rounded-xl border bg-gray-50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-teal-300 focus:bg-white"
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

      {/* Negative feedback modal */}
      {feedbackModalIndex !== null && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-sm rounded-2xl border bg-white p-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                ¿Qué estuvo mal?
              </h3>
              <button
                type="button"
                onClick={() => setFeedbackModalIndex(null)}
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {FEEDBACK_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFeedbackCategory(cat)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    feedbackCategory === cat
                      ? 'border-rose-300 bg-rose-50 text-rose-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <textarea
              value={feedbackComment}
              onChange={(e) => setFeedbackComment(e.target.value)}
              placeholder="Cuéntanos más (opcional)..."
              rows={2}
              className="mt-3 w-full resize-none rounded-lg border bg-gray-50 px-3 py-2 text-xs outline-none focus:border-teal-300 focus:bg-white"
            />
            <div className="mt-3 flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFeedbackModalIndex(null)}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={submitNegativeFeedback}
                disabled={!feedbackCategory}
                className="bg-rose-500 text-white hover:bg-rose-600"
              >
                Enviar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
