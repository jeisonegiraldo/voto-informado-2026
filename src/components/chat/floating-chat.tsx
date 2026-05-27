'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  Minimize2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Markdown from 'react-markdown';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const QUICK_QUESTIONS = [
  '¿Qué propone cada candidato sobre seguridad?',
  '¿Quién propone eliminar las EPS?',
  '¿Qué dice Fajardo sobre educación?',
  '¿En qué se diferencia Cepeda de Valencia?',
];

export function FloatingChat() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId] = useState(
    () => `fc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  );
  const [showPulse, setShowPulse] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Hide on /chat page
  if (pathname === '/chat') return null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Hide pulse after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  async function handleSend(text?: string) {
    const messageText = text || input.trim();
    if (!messageText || isStreaming) return;

    setInput('');
    const userMessage: Message = { role: 'user', content: messageText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsStreaming(true);

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

      if (!response.ok) throw new Error('Error del servidor');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No se pudo leer');

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
              if (parsed.text) {
                fullText += parsed.text;
                setMessages([
                  ...newMessages,
                  { role: 'assistant', content: fullText },
                ]);
              }
            } catch {}
          }
        }
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Lo siento, hubo un error. Intenta de nuevo o usa el [chat completo](/chat).',
        },
      ]);
    } finally {
      setIsStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <>
      {/* Floating bubble */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            onClick={() => {
              setIsOpen(true);
              setShowPulse(false);
            }}
            className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/30 transition-all hover:shadow-xl hover:shadow-teal-500/40 hover:brightness-110 active:scale-95 sm:bottom-6 sm:right-6"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
            aria-label="Abrir chat"
          >
            <MessageSquare className="h-6 w-6" />
            {/* Pulse ring */}
            {showPulse && (
              <span className="absolute inset-0 animate-ping rounded-full bg-teal-400 opacity-30" />
            )}
            {/* Unread dot */}
            {messages.length === 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                ?
              </span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-0 right-0 z-50 flex h-[85dvh] w-full flex-col overflow-hidden rounded-t-2xl border border-gray-200 bg-white shadow-2xl sm:bottom-6 sm:right-6 sm:h-[520px] sm:w-[380px] sm:rounded-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b bg-gradient-to-r from-teal-600 to-emerald-600 px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Asistente Electoral</p>
                  <p className="text-[10px] text-teal-100">
                    Basado en planes de gobierno
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link
                  href="/chat"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  title="Abrir chat completo"
                >
                  <Minimize2 className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="rounded-full bg-teal-50 p-3">
                    <Sparkles className="h-6 w-6 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      ¿Tienes dudas sobre un candidato?
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Pregunta sobre propuestas, posturas o planes de gobierno.
                    </p>
                  </div>
                  <div className="w-full space-y-1.5">
                    {QUICK_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleSend(q)}
                        className="flex w-full items-center gap-2 rounded-lg border bg-gray-50 px-3 py-2 text-left text-[11px] text-gray-600 transition-colors hover:border-teal-300 hover:bg-teal-50"
                      >
                        <ArrowRight className="h-3 w-3 shrink-0 text-teal-500" />
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex gap-2 ${
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100">
                          <Bot className="h-3 w-3 text-teal-600" />
                        </div>
                      )}
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
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
                                  <h2 className="mb-1 mt-2 text-xs font-bold text-gray-900 first:mt-0">{children}</h2>
                                ),
                                h3: ({ children }) => (
                                  <h3 className="mb-1 mt-2 text-xs font-bold text-gray-800 first:mt-0">{children}</h3>
                                ),
                                p: ({ children }) => (
                                  <p className="mb-1.5 last:mb-0">{children}</p>
                                ),
                                ul: ({ children }) => (
                                  <ul className="mb-1.5 ml-1 space-y-0.5 last:mb-0">{children}</ul>
                                ),
                                li: ({ children }) => (
                                  <li className="flex items-start gap-1">
                                    <span className="mt-1 inline-block h-1 w-1 shrink-0 rounded-full bg-teal-400" />
                                    <span>{children}</span>
                                  </li>
                                ),
                                strong: ({ children }) => (
                                  <strong className="font-semibold text-gray-900">{children}</strong>
                                ),
                              }}
                            >
                              {msg.content}
                            </Markdown>
                          ) : (
                            <Loader2 className="h-3 w-3 animate-spin text-gray-400" />
                          )
                        ) : (
                          msg.content
                        )}
                      </div>
                      {msg.role === 'user' && (
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200">
                          <User className="h-3 w-3 text-gray-600" />
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="border-t bg-gray-50 px-3 py-1 text-center text-[9px] text-gray-400">
              ⚠️ IA basada en planes de gobierno oficiales.{' '}
              <Link href="/chat" onClick={() => setIsOpen(false)} className="underline">
                Chat completo
              </Link>
            </div>

            {/* Input */}
            <div className="border-t p-2.5">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Pregunta sobre candidatos..."
                  className="flex-1 rounded-full border bg-gray-50 px-4 py-2 text-xs outline-none transition-colors focus:border-teal-300 focus:bg-white"
                  disabled={isStreaming}
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isStreaming}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-600 text-white transition-all hover:bg-teal-500 disabled:opacity-40 active:scale-95"
                >
                  {isStreaming ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Send className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
