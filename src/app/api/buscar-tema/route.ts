import Anthropic from '@anthropic-ai/sdk';
import { buildChatSystemPrompt } from '@/lib/chat-context';
import { track } from '@/lib/track';
import { NextRequest } from 'next/server';

const anthropic = new Anthropic();

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 15) return false;
  entry.count++;
  return true;
}

let cachedPrompt: string | null = null;
function getSystemPrompt(): string {
  if (!cachedPrompt) {
    const base = buildChatSystemPrompt();
    cachedPrompt = base + `

## INSTRUCCIÓN ADICIONAL PARA BÚSQUEDA POR TEMA:
Cuando el usuario pregunte sobre un tema específico, responde con un formato ESTRUCTURADO que muestre la posición de CADA candidato lado a lado:

### [Nombre del tema]

**Iván Cepeda (Pacto Histórico):**
[Su posición y propuestas en 2-3 oraciones]

**Abelardo de la Espriella (Defensores de la Patria):**
[Su posición y propuestas en 2-3 oraciones]

**Paloma Valencia (Centro Democrático):**
[Su posición y propuestas en 2-3 oraciones]

**Sergio Fajardo (Dignidad y Compromiso):**
[Su posición y propuestas en 2-3 oraciones]

### Diferencias clave
[Resumen de 2-3 puntos donde difieren más]

Siempre usa este formato estructurado para mantener la comparación equilibrada.`;
  }
  return cachedPrompt;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, sessionId } = body;

    if (!topic || typeof topic !== 'string' || topic.trim().length < 3) {
      return Response.json(
        { error: 'El tema debe tener al menos 3 caracteres' },
        { status: 400 }
      );
    }

    if (topic.length > 200) {
      return Response.json(
        { error: 'El tema no puede exceder 200 caracteres' },
        { status: 400 }
      );
    }

    // Track search usage
    track(req, 'buscar_tema', { topic: topic.trim().slice(0, 200) });

    const rateLimitKey =
      sessionId || req.headers.get('x-forwarded-for') || 'anonymous';
    if (!checkRateLimit(rateLimitKey)) {
      return Response.json(
        { error: 'Has alcanzado el límite de búsquedas por hora.' },
        { status: 429 }
      );
    }

    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1200,
      system: getSystemPrompt(),
      messages: [
        {
          role: 'user',
          content: `¿Qué propone cada candidato sobre: ${topic.trim()}? Muestra sus posiciones lado a lado de forma equilibrada.`,
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
          console.error('[buscar-tema] Stream error:', error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: 'Error buscando el tema' })}\n\n`
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
    console.error('[buscar-tema] Error:', error);
    return Response.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
