import { candidates } from '@/data/candidates';
import { dimensions } from '@/data/dimensions';
import { positions } from '@/data/positions';

/**
 * Builds the full system prompt for the citizen chat.
 * Includes all candidate data, dimensions, and 48 positions
 * so the AI can answer questions grounded in real government plans.
 */
export function buildChatSystemPrompt(): string {
  const candidateInfo = candidates
    .map(
      (c) =>
        `- **${c.name}** (${c.party}, coalición ${c.coalition}): ${c.shortBio} Fórmula vicepresidencial: ${c.runningMate} (${c.runningMateRole}). Ideología: ${c.ideologyLabel}. Lema: "${c.slogan}". Plan de gobierno: ${c.governmentPlanPages} páginas, ${c.keyProposalCount} propuestas clave.`
    )
    .join('\n');

  const positionsByDimension = dimensions
    .map((dim) => {
      const dimPositions = positions
        .filter((p) => p.dimensionId === dim.id)
        .map((p) => {
          const candidate = candidates.find((c) => c.id === p.candidateId);
          return `  **${candidate?.name}** (puntuación: ${p.score}/5):
    Resumen: ${p.summary}
    Propuestas: ${p.keyProposals.join('; ')}
    Fuentes: ${p.sourceRefs.map((s) => s.label + (s.planPage ? ` (pág. ${s.planPage})` : '')).join('; ')}
    Riesgos: ${p.risks.join('; ')}`;
        })
        .join('\n');

      return `### ${dim.name}
Descripción: ${dim.description}
Espectro: ${dim.spectrumLabels[0]} ← → ${dim.spectrumLabels[1]}

${dimPositions}`;
    })
    .join('\n\n');

  return `Eres un asistente electoral no-partidista para las elecciones presidenciales de Colombia 2026. Tu nombre es "AsistenteVotaInformado". Tu misión es ayudar a los ciudadanos a tomar decisiones informadas.

## REGLAS FUNDAMENTALES (NUNCA las violes):
1. NUNCA recomiendes votar por un candidato específico.
2. NUNCA tomes posición ideológica ni expreses preferencia.
3. Solo responde con base en la información proporcionada a continuación. Si no tienes información sobre algo, dilo honestamente.
4. Cuando compares candidatos, presenta TODAS las posiciones de forma equilibrada.
5. Siempre cita la fuente cuando hagas referencia a un dato específico (ej: "Según el plan de gobierno de Valencia, punto 39...").
6. Responde en español colombiano, de forma clara y accesible.
7. Si te preguntan por quién votar, explica que tu rol es informar, no decidir por el ciudadano.
8. Mantén un tono respetuoso hacia todos los candidatos y sus propuestas.
9. Si detectas desinformación en la pregunta del usuario, corrígela amablemente con datos.
10. Sé conciso pero completo. Usa bullets cuando sea útil.

## CANDIDATOS PRESIDENCIALES 2026:
${candidateInfo}

## POSICIONES POR DIMENSIÓN (12 dimensiones, 48 posiciones):

${positionsByDimension}

## CONTEXTO ELECTORAL:
- Primera vuelta: 31 de mayo de 2026
- Segunda vuelta (si aplica): 21 de junio de 2026
- Los datos provienen de los planes de gobierno oficiales inscritos ante el CNE y de análisis comparativos verificados.

Responde las preguntas del ciudadano de forma informativa, neutral y útil. Si la pregunta no está relacionada con las elecciones, redirige amablemente.`;
}
