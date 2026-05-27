import Anthropic from '@anthropic-ai/sdk';
import { buildChatSystemPrompt } from '@/lib/chat-context';
import { NextRequest } from 'next/server';

const anthropic = new Anthropic();

// Rate limiting: simple in-memory store (resets on deploy)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_SESSION = 15;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(sessionId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(sessionId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(sessionId, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_SESSION) {
    return false;
  }

  entry.count++;
  return true;
}

// Cache the system prompt since it doesn't change
let cachedSystemPrompt: string | null = null;
function getSystemPrompt(): string {
  if (!cachedSystemPrompt) {
    cachedSystemPrompt = buildChatSystemPrompt();
  }
  return cachedSystemPrompt;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, sessionId, candidateFilter } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: 'Se requiere al menos un mensaje' },
        { status: 400 }
      );
    }

    // Rate limiting
    const rateLimitKey = sessionId || req.headers.get('x-forwarded-for') || 'anonymous';
    if (!checkRateLimit(rateLimitKey)) {
      return Response.json(
        {
          error:
            'Has alcanzado el límite de consultas por hora. Intenta de nuevo más tarde.',
        },
        { status: 429 }
      );
    }

    // Validate message format
    const validMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role as 'user' | 'assistant',
      content: String(msg.content).slice(0, 1000), // Cap message length
    }));

    // Build system prompt, optionally filtered by candidate
    let systemPrompt = getSystemPrompt();
    if (candidateFilter && typeof candidateFilter === 'string') {
      systemPrompt += `\n\n## CONTEXTO ADICIONAL:\nEl ciudadano está preguntando específicamente sobre el candidato con ID "${candidateFilter}". Enfoca tus respuestas en este candidato, pero si es relevante compara brevemente con otros. Si la pregunta no menciona a un candidato específico, asume que se refiere a "${candidateFilter}".`;
    }

    // Stream response
    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 800,
      system: systemPrompt,
      messages: validMessages,
    });

    // Return as SSE stream
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              const data = JSON.stringify({ text: event.delta.text });
              controller.enqueue(encoder.encode(`data: ${data}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('[chat] Stream error:', error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: 'Error generando respuesta' })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('[chat] Error:', error);
    return Response.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
