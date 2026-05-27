import type { CandidateId } from '@/types/candidate';
import type { DimensionId } from '@/types/dimension';

export interface BrujulaCard {
  id: string;
  proposal: string;
  dimensionId: DimensionId;
  /** Primary candidate this proposal belongs to */
  candidateId: CandidateId;
  /** Some proposals partially align with other candidates */
  secondaryScores?: Partial<Record<CandidateId, number>>;
}

/**
 * 20 propuestas reales extraídas de los planes de gobierno,
 * presentadas de forma anónima para eliminar sesgo.
 * 5 propuestas por candidato, distribuidas en diferentes dimensiones.
 */
export const brujulaCards: BrujulaCard[] = [
  // ── Cepeda (5) ──────────────────────────────────────
  {
    id: 'bc-1',
    proposal: 'Continuar los diálogos de paz con todos los grupos armados e invertir masivamente en los territorios más afectados por la violencia.',
    dimensionId: 'security',
    candidateId: 'cepeda',
    secondaryScores: { fajardo: 0.3 },
  },
  {
    id: 'bc-2',
    proposal: 'Redistribuir tierras productivas a campesinos y lograr soberanía alimentaria para que Colombia no dependa de importaciones.',
    dimensionId: 'economic-model',
    candidateId: 'cepeda',
  },
  {
    id: 'bc-3',
    proposal: 'Subir impuestos a las grandes fortunas y capitales para financiar programas sociales y reducir la desigualdad.',
    dimensionId: 'tax-policy',
    candidateId: 'cepeda',
  },
  {
    id: 'bc-4',
    proposal: 'Eliminar las EPS y crear un sistema de salud único público, sin intermediarios privados, con cobertura universal.',
    dimensionId: 'healthcare',
    candidateId: 'cepeda',
    secondaryScores: { fajardo: 0.2 },
  },
  {
    id: 'bc-5',
    proposal: 'Garantizar educación pública, gratuita y universal en todos los niveles, fortaleciendo la universidad pública.',
    dimensionId: 'education',
    candidateId: 'cepeda',
    secondaryScores: { fajardo: 0.3 },
  },

  // ── De la Espriella (5) ─────────────────────────────
  {
    id: 'bc-6',
    proposal: 'Gobernar con una "Brújula Moral" basada en Fe, Familia, Autoridad y Ley como pilares innegociables de la nación.',
    dimensionId: 'family-values',
    candidateId: 'espriella',
  },
  {
    id: 'bc-7',
    proposal: 'Lanzar un operativo militar masivo en los primeros 90 días para capturar cabecillas del crimen organizado.',
    dimensionId: 'security',
    candidateId: 'espriella',
    secondaryScores: { valencia: 0.3 },
  },
  {
    id: 'bc-8',
    proposal: 'Reducir el aparato del Estado un 40%, eliminando burocracia clientelista para ahorrar billones de pesos.',
    dimensionId: 'state-size',
    candidateId: 'espriella',
  },
  {
    id: 'bc-9',
    proposal: 'Fumigar masivamente las 330.000 hectáreas de coca con apoyo internacional y cortar el flujo de dinero al narcotráfico.',
    dimensionId: 'drug-policy',
    candidateId: 'espriella',
  },
  {
    id: 'bc-10',
    proposal: 'Formar ciudadanos patriotas y competitivos, con valores morales sólidos, articulados con las necesidades del mercado laboral.',
    dimensionId: 'education',
    candidateId: 'espriella',
  },

  // ── Valencia (5) ────────────────────────────────────
  {
    id: 'bc-11',
    proposal: 'Plan 30-30: incorporar 60.000 nuevos efectivos de seguridad con tecnología militar avanzada e inteligencia.',
    dimensionId: 'security',
    candidateId: 'valencia',
    secondaryScores: { espriella: 0.2 },
  },
  {
    id: 'bc-12',
    proposal: 'Hacer crecer la economía al 5% del PIB anual reduciendo impuestos a empresas y atrayendo inversión extranjera masiva.',
    dimensionId: 'economic-model',
    candidateId: 'valencia',
    secondaryScores: { espriella: 0.3 },
  },
  {
    id: 'bc-13',
    proposal: 'Crear bonos educativos para que los padres elijan entre educación pública o privada, y formar 1 millón de jóvenes en IA.',
    dimensionId: 'education',
    candidateId: 'valencia',
  },
  {
    id: 'bc-14',
    proposal: 'Inyectar $9 billones de pesos al sistema de salud, con Puntos Médicos Urbanos 24/7 y telemedicina en zonas rurales.',
    dimensionId: 'healthcare',
    candidateId: 'valencia',
    secondaryScores: { fajardo: 0.2 },
  },
  {
    id: 'bc-15',
    proposal: 'Transformar al Estado con un enfoque "IA first": inteligencia artificial en todos los trámites públicos y blockchain para contratación.',
    dimensionId: 'technology',
    candidateId: 'valencia',
    secondaryScores: { fajardo: 0.2 },
  },

  // ── Fajardo (5) ─────────────────────────────────────
  {
    id: 'bc-16',
    proposal: 'Gobernar con evidencia y datos, sin extremos ideológicos, corrigiendo el rumbo del país con método y responsabilidad.',
    dimensionId: 'ideology',
    candidateId: 'fajardo',
  },
  {
    id: 'bc-17',
    proposal: 'Reconvertir tecnológicamente 120.000 empresas y crear un fondo público-privado de innovación y emprendimiento verde.',
    dimensionId: 'economic-model',
    candidateId: 'fajardo',
    secondaryScores: { valencia: 0.2 },
  },
  {
    id: 'bc-18',
    proposal: 'Transformar el SENA, hacer de las matemáticas un proyecto nacional y formar docentes de clase mundial con enfoque STEAM.',
    dimensionId: 'education',
    candidateId: 'fajardo',
  },
  {
    id: 'bc-19',
    proposal: 'Reformar el sistema de salud sin destruirlo: Atención Primaria territorial, salud mental como prioridad y cero filas.',
    dimensionId: 'healthcare',
    candidateId: 'fajardo',
    secondaryScores: { valencia: 0.2 },
  },
  {
    id: 'bc-20',
    proposal: 'Crear un Instituto Nacional de Inteligencia Artificial y posicionar a Colombia como hub tecnológico regional.',
    dimensionId: 'technology',
    candidateId: 'fajardo',
    secondaryScores: { valencia: 0.3 },
  },
];

/**
 * Shuffle cards with Fisher-Yates ensuring no two consecutive cards
 * belong to the same candidate.
 */
export function shuffleBrujulaCards(cards: BrujulaCard[]): BrujulaCard[] {
  // First: Fisher-Yates shuffle
  const arr = [...cards];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  // Second pass: try to avoid consecutive same-candidate cards
  for (let i = 1; i < arr.length; i++) {
    if (arr[i].candidateId === arr[i - 1].candidateId) {
      // Find next card with different candidate and swap
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[j].candidateId !== arr[i - 1].candidateId) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          break;
        }
      }
    }
  }

  return arr;
}
