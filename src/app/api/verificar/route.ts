import Anthropic from '@anthropic-ai/sdk';
import { buildVerificadorPrompt } from '@/lib/verificador-context';
import { NextRequest } from 'next/server';

const anthropic = new Anthropic();

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS) return false;
  entry.count++;
  return true;
}

let cachedPrompt: string | null = null;
function getSystemPrompt(): string {
  if (!cachedPrompt) cachedPrompt = buildVerificadorPrompt();
  return cachedPrompt;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { claim, sessionId } = body;

    if (!claim || typeof claim !== 'string' || claim.trim().length < 10) {
      return Response.json(
        { error: 'La afirmación debe tener al menos 10 caracteres' },
        { status: 400 }
      );
    }

    if (claim.length > 500) {
      return Response.json(
        { error: 'La afirmación no puede exceder 500 caracteres' },
        { status: 400 }
      );
    }

    const rateLimitKey =
      sessionId || req.headers.get('x-forwarded-for') || 'anonymous';
    if (!checkRateLimit(rateLimitKey)) {
      return Response.json(
        { error: 'Has alcanzado el límite de verificaciones por hora.' },
        { status: 429 }
      );
    }

    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: getSystemPrompt(),
      messages: [
        {
          role: 'user',
          content: `Verifica la siguiente afirmación sobre las elecciones presidenciales de Colombia 2026:\n\n"${claim.trim()}"`,
        },
      ],
    });

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
          console.error('[verificar] Stream error:', error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: 'Error verificando la afirmación' })}\n\n`
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
    console.error('[verificar] Error:', error);
    return Response.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
