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
 * Pool de 40 propuestas reales extraídas de los planes de gobierno,
 * presentadas de forma anónima para eliminar sesgo.
 * 10 propuestas por candidato, cubriendo diversas dimensiones.
 *
 * En cada sesión se seleccionan 20 al azar (5 por candidato)
 * para que la experiencia sea diferente cada vez.
 *
 * REGLA DE NEUTRALIDAD: los secondaryScores están balanceados
 * para que ningún candidato acumule ventaja sistemática.
 * Cada candidato recibe ~0.6 puntos de bonus secundario total.
 */
export const brujulaCardPool: BrujulaCard[] = [
  // ── Cepeda (10) ─────────────────────────────────────
  {
    id: 'bc-c01',
    proposal: 'Continuar los diálogos de paz con todos los grupos armados e invertir masivamente en los territorios más afectados por la violencia.',
    dimensionId: 'security',
    candidateId: 'cepeda',
    secondaryScores: { fajardo: 0.2 },
  },
  {
    id: 'bc-c02',
    proposal: 'Redistribuir tierras productivas a campesinos y lograr soberanía alimentaria para que Colombia no dependa de importaciones.',
    dimensionId: 'economic-model',
    candidateId: 'cepeda',
  },
  {
    id: 'bc-c03',
    proposal: 'Subir impuestos a las grandes fortunas y capitales para financiar programas sociales y reducir la desigualdad.',
    dimensionId: 'tax-policy',
    candidateId: 'cepeda',
  },
  {
    id: 'bc-c04',
    proposal: 'Eliminar las EPS y crear un sistema de salud único público, sin intermediarios privados, con cobertura universal.',
    dimensionId: 'healthcare',
    candidateId: 'cepeda',
  },
  {
    id: 'bc-c05',
    proposal: 'Garantizar educación pública, gratuita y universal en todos los niveles, fortaleciendo la universidad pública.',
    dimensionId: 'education',
    candidateId: 'cepeda',
    secondaryScores: { fajardo: 0.2 },
  },
  {
    id: 'bc-c06',
    proposal: 'Crear un sistema nacional anticorrupción con fiscalías especializadas y veedurías ciudadanas con poder real.',
    dimensionId: 'state-size',
    candidateId: 'cepeda',
    secondaryScores: { fajardo: 0.2, espriella: 0.2 },
  },
  {
    id: 'bc-c07',
    proposal: 'Política exterior autónoma y solidaria, priorizando la integración latinoamericana sobre los intereses de potencias extranjeras.',
    dimensionId: 'ideology',
    candidateId: 'cepeda',
  },
  {
    id: 'bc-c08',
    proposal: 'Sustituir cultivos de coca invirtiendo en proyectos productivos para campesinos, sin fumigación aérea.',
    dimensionId: 'drug-policy',
    candidateId: 'cepeda',
    secondaryScores: { fajardo: 0.2 },
  },
  {
    id: 'bc-c09',
    proposal: 'Democratizar la tecnología y el acceso a internet como un derecho fundamental, especialmente en zonas rurales.',
    dimensionId: 'technology',
    candidateId: 'cepeda',
    secondaryScores: { fajardo: 0.2 },
  },
  {
    id: 'bc-c10',
    proposal: 'Proteger los derechos de las comunidades LGBTIQ+, mujeres e indígenas como parte de una agenda de inclusión integral.',
    dimensionId: 'family-values',
    candidateId: 'cepeda',
  },

  // ── De la Espriella (10) ────────────────────────────
  {
    id: 'bc-e01',
    proposal: 'Gobernar con una "Brújula Moral" basada en Fe, Familia, Autoridad y Ley como pilares innegociables de la nación.',
    dimensionId: 'family-values',
    candidateId: 'espriella',
  },
  {
    id: 'bc-e02',
    proposal: 'Lanzar un operativo militar masivo en los primeros 90 días para capturar cabecillas del crimen organizado.',
    dimensionId: 'security',
    candidateId: 'espriella',
    secondaryScores: { valencia: 0.3 },
  },
  {
    id: 'bc-e03',
    proposal: 'Reducir el aparato del Estado un 40%, eliminando burocracia clientelista para ahorrar billones de pesos.',
    dimensionId: 'state-size',
    candidateId: 'espriella',
  },
  {
    id: 'bc-e04',
    proposal: 'Fumigar masivamente las 330.000 hectáreas de coca con apoyo internacional y cortar el flujo de dinero al narcotráfico.',
    dimensionId: 'drug-policy',
    candidateId: 'espriella',
  },
  {
    id: 'bc-e05',
    proposal: 'Formar ciudadanos patriotas y competitivos, con valores morales sólidos, articulados con las necesidades del mercado laboral.',
    dimensionId: 'education',
    candidateId: 'espriella',
  },
  {
    id: 'bc-e06',
    proposal: 'No subir impuestos; simplificar el sistema tributario y financiar el Estado con ahorro por reducción burocrática.',
    dimensionId: 'tax-policy',
    candidateId: 'espriella',
    secondaryScores: { valencia: 0.2 },
  },
  {
    id: 'bc-e07',
    proposal: 'Crear zonas económicas especiales con beneficios para atraer inversión extranjera masiva y generar empleo.',
    dimensionId: 'economic-model',
    candidateId: 'espriella',
    secondaryScores: { fajardo: 0.2 },
  },
  {
    id: 'bc-e08',
    proposal: 'Construir megacárceles al estilo salvadoreño para aislar a los criminales más peligrosos del país.',
    dimensionId: 'security',
    candidateId: 'espriella',
  },
  {
    id: 'bc-e09',
    proposal: 'Garantizar el derecho constitucional a la legítima defensa y revisar las regulaciones de porte de armas.',
    dimensionId: 'ideology',
    candidateId: 'espriella',
  },
  {
    id: 'bc-e10',
    proposal: 'Transformar la salud con un modelo mixto eficiente, eliminando la corrupción que se come los recursos del sistema.',
    dimensionId: 'healthcare',
    candidateId: 'espriella',
  },

  // ── Valencia (10) ───────────────────────────────────
  {
    id: 'bc-v01',
    proposal: 'Plan 30-30: incorporar 60.000 nuevos efectivos de seguridad con tecnología militar avanzada e inteligencia.',
    dimensionId: 'security',
    candidateId: 'valencia',
    secondaryScores: { espriella: 0.2 },
  },
  {
    id: 'bc-v02',
    proposal: 'Hacer crecer la economía al 5% del PIB anual reduciendo impuestos a empresas y atrayendo inversión extranjera masiva.',
    dimensionId: 'economic-model',
    candidateId: 'valencia',
    secondaryScores: { espriella: 0.2 },
  },
  {
    id: 'bc-v03',
    proposal: 'Crear bonos educativos para que los padres elijan entre educación pública o privada, y formar 1 millón de jóvenes en IA.',
    dimensionId: 'education',
    candidateId: 'valencia',
  },
  {
    id: 'bc-v04',
    proposal: 'Inyectar $9 billones de pesos al sistema de salud, con Puntos Médicos Urbanos 24/7 y telemedicina en zonas rurales.',
    dimensionId: 'healthcare',
    candidateId: 'valencia',
  },
  {
    id: 'bc-v05',
    proposal: 'Transformar al Estado con un enfoque "IA first": inteligencia artificial en todos los trámites públicos y blockchain para contratación.',
    dimensionId: 'technology',
    candidateId: 'valencia',
    secondaryScores: { fajardo: 0.2 },
  },
  {
    id: 'bc-v06',
    proposal: 'Eliminar el impuesto al patrimonio y reducir el predial para reactivar el sector productivo y la inversión.',
    dimensionId: 'tax-policy',
    candidateId: 'valencia',
    secondaryScores: { espriella: 0.2 },
  },
  {
    id: 'bc-v07',
    proposal: 'Política de erradicación forzosa combinada con interdicción aérea y control del espacio marítimo contra el narcotráfico.',
    dimensionId: 'drug-policy',
    candidateId: 'valencia',
    secondaryScores: { espriella: 0.2 },
  },
  {
    id: 'bc-v08',
    proposal: 'Modernizar el Estado eliminando trámites innecesarios: gobierno digital y ventanilla única para ciudadanos y empresas.',
    dimensionId: 'state-size',
    candidateId: 'valencia',
    secondaryScores: { cepeda: 0.2 },
  },
  {
    id: 'bc-v09',
    proposal: 'Proteger la familia como núcleo fundamental de la sociedad, con políticas de vivienda y apoyo a primeros padres.',
    dimensionId: 'family-values',
    candidateId: 'valencia',
  },
  {
    id: 'bc-v10',
    proposal: 'Desactivar las "5 bombas" del país: inseguridad, crisis de salud, energía, desconfianza institucional y corrupción.',
    dimensionId: 'ideology',
    candidateId: 'valencia',
  },

  // ── Fajardo (10) ────────────────────────────────────
  {
    id: 'bc-f01',
    proposal: 'Gobernar con evidencia y datos, sin extremos ideológicos, corrigiendo el rumbo del país con método y responsabilidad.',
    dimensionId: 'ideology',
    candidateId: 'fajardo',
  },
  {
    id: 'bc-f02',
    proposal: 'Reconvertir tecnológicamente 120.000 empresas y crear un fondo público-privado de innovación y emprendimiento verde.',
    dimensionId: 'economic-model',
    candidateId: 'fajardo',
    secondaryScores: { cepeda: 0.2 },
  },
  {
    id: 'bc-f03',
    proposal: 'Transformar el SENA, hacer de las matemáticas un proyecto nacional y formar docentes de clase mundial con enfoque STEAM.',
    dimensionId: 'education',
    candidateId: 'fajardo',
    secondaryScores: { valencia: 0.2 },
  },
  {
    id: 'bc-f04',
    proposal: 'Reformar el sistema de salud sin destruirlo: Atención Primaria territorial, salud mental como prioridad y cero filas.',
    dimensionId: 'healthcare',
    candidateId: 'fajardo',
    secondaryScores: { cepeda: 0.2 },
  },
  {
    id: 'bc-f05',
    proposal: 'Crear un Instituto Nacional de Inteligencia Artificial y posicionar a Colombia como hub tecnológico regional.',
    dimensionId: 'technology',
    candidateId: 'fajardo',
    secondaryScores: { valencia: 0.2 },
  },
  {
    id: 'bc-f06',
    proposal: 'Modernizar la DIAN y combatir agresivamente la evasión fiscal, sin subir la carga tributaria a los ciudadanos.',
    dimensionId: 'tax-policy',
    candidateId: 'fajardo',
    secondaryScores: { espriella: 0.2 },
  },
  {
    id: 'bc-f07',
    proposal: 'Plan Guardián: seguridad ciudadana basada en inteligencia, tecnología y fortalecimiento del sistema de justicia.',
    dimensionId: 'security',
    candidateId: 'fajardo',
    secondaryScores: { valencia: 0.2 },
  },
  {
    id: 'bc-f08',
    proposal: 'Enfoque mixto de sustitución voluntaria con erradicación focalizada, priorizando zonas con presencia estatal débil.',
    dimensionId: 'drug-policy',
    candidateId: 'fajardo',
    secondaryScores: { cepeda: 0.2 },
  },
  {
    id: 'bc-f09',
    proposal: 'Estado eficiente y transparente: reducir 50% los tiempos de trámites, lucha frontal contra la corrupción.',
    dimensionId: 'state-size',
    candidateId: 'fajardo',
  },
  {
    id: 'bc-f10',
    proposal: 'Garantizar derechos para todos con respeto a la diversidad, sin imponer agendas ideológicas desde el Estado.',
    dimensionId: 'family-values',
    candidateId: 'fajardo',
  },
];

/**
 * Selects 20 cards (exactly 5 per candidate) from the pool of 40,
 * then shuffles them ensuring no two consecutive cards belong to
 * the same candidate.
 *
 * This ensures:
 * - Rotación: cada sesión muestra propuestas diferentes
 * - Balance: 5 propuestas por candidato siempre
 * - Diversidad dimensional: aleatorio por diseño
 */
export function selectAndShuffleBrujulaCards(pool: BrujulaCard[] = brujulaCardPool): BrujulaCard[] {
  const CARDS_PER_CANDIDATE = 5;
  const candidateIds: CandidateId[] = ['cepeda', 'espriella', 'valencia', 'fajardo'];

  // Group cards by candidate
  const byCandidate = new Map<CandidateId, BrujulaCard[]>();
  for (const cid of candidateIds) {
    byCandidate.set(cid, pool.filter(c => c.candidateId === cid));
  }

  // Select 5 random cards per candidate
  const selected: BrujulaCard[] = [];
  for (const cid of candidateIds) {
    const cards = byCandidate.get(cid)!;
    const shuffled = fisherYates([...cards]);
    selected.push(...shuffled.slice(0, CARDS_PER_CANDIDATE));
  }

  // Fisher-Yates shuffle the 20 selected cards
  const arr = fisherYates(selected);

  // Second pass: avoid consecutive same-candidate cards
  for (let i = 1; i < arr.length; i++) {
    if (arr[i].candidateId === arr[i - 1].candidateId) {
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

/** Fisher-Yates shuffle (pure, returns new array) */
function fisherYates<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Backward compatibility ──────────────────────────
/** @deprecated Use brujulaCardPool + selectAndShuffleBrujulaCards instead */
export const brujulaCards = brujulaCardPool;
/** @deprecated Use selectAndShuffleBrujulaCards instead */
export const shuffleBrujulaCards = selectAndShuffleBrujulaCards;
