import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export async function summarizeArticle(
  title: string,
  content: string
): Promise<string> {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: `Eres un periodista neutral colombiano. Resume este artículo sobre las elecciones presidenciales de Colombia 2026 en 2-3 oraciones informativas y no-partidistas. No uses lenguaje emocional ni tomes posición. Solo presenta los hechos.

Título: ${title}
Contenido: ${content}

Resumen neutral (2-3 oraciones):`,
        },
      ],
    });

    const block = message.content[0];
    if (block.type === 'text') {
      return block.text.trim();
    }
    return '';
  } catch (error) {
    console.error('[news-summarizer] Failed to summarize:', error);
    return '';
  }
}
