import Anthropic from '@anthropic-ai/sdk';
import { dimensions } from '@/data/dimensions';
import { candidates } from '@/data/candidates';

const anthropic = new Anthropic();

interface ClassificationResult {
  classification: 'comentario' | 'peticion' | 'pregunta' | 'apoyo' | 'critica';
  dimensionId: string;
  dimensionLabel: string;
}

const dimensionList = dimensions
  .map((d) => `- "${d.id}": ${d.name} (${d.description})`)
  .join('\n');

const candidateNames = candidates.map((c) => c.name).join(', ');

export async function classifyPetition(
  text: string,
  candidateId: string
): Promise<ClassificationResult> {
  try {
    const candidate = candidates.find((c) => c.id === candidateId);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 150,
      messages: [
        {
          role: 'user',
          content: `Clasifica el siguiente mensaje de un ciudadano colombiano dirigido al candidato presidencial ${candidate?.name || candidateId}.

MENSAJE: "${text}"

Responde SOLO con un JSON válido (sin markdown, sin backticks) con estos campos:
- "classification": una de ["comentario", "peticion", "pregunta", "apoyo", "critica"]
- "dimensionId": la dimensión más relevante entre las siguientes:
${dimensionList}
Si no encaja en ninguna, usa "ideology" como default.
- "dimensionLabel": el nombre legible de la dimensión elegida

JSON:`,
        },
      ],
    });

    const block = message.content[0];
    if (block.type === 'text') {
      // Parse the JSON response, handling potential markdown wrapping
      let jsonText = block.text.trim();
      // Remove markdown code blocks if present
      jsonText = jsonText.replace(/^```json?\s*/i, '').replace(/\s*```$/i, '');
      const parsed = JSON.parse(jsonText);
      return {
        classification: parsed.classification || 'comentario',
        dimensionId: parsed.dimensionId || 'ideology',
        dimensionLabel: parsed.dimensionLabel || 'Ideología',
      };
    }

    return { classification: 'comentario', dimensionId: 'ideology', dimensionLabel: 'Ideología' };
  } catch (error) {
    console.error('[petition-classifier] Failed to classify:', error);
    return { classification: 'comentario', dimensionId: 'ideology', dimensionLabel: 'Ideología' };
  }
}
