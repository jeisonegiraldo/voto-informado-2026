import type { Candidate } from '@/types/candidate';

export const candidates: Candidate[] = [
  {
    id: 'cepeda',
    name: 'Iván Cepeda',
    fullName: 'Iván Cepeda Castro',
    party: 'Pacto Histórico',
    coalition: 'Pacto Histórico',
    slogan: 'El Poder de la Verdad',
    ideology: 'left',
    ideologyLabel: 'Izquierda continuista',
    ideologyScore: -4,
    color: '#7B2D8E',
    colorLight: '#E8D5F0',
    slug: 'cepeda',
    photo: '/images/candidates/cepeda.jpg',
    runningMate: 'Aída Quilcué',
    runningMateRole: 'Senadora indígena',
    shortBio:
      'Senador desde 2014, defensor de derechos humanos, filósofo. Hijo de Manuel Cepeda Vargas (senador UP asesinado). Facilitador en procesos de paz con FARC, ELN y Clan del Golfo. Candidato del continuismo del gobierno Petro.',
    governmentPlanPdf: '/planes_gobierno/P000B.pdf',
    governmentPlanPages: 433,
    keyProposalCount: 50,
  },
  {
    id: 'espriella',
    name: 'Abelardo de la Espriella',
    fullName: 'Abelardo de la Espriella Otero',
    party: 'Defensores de la Patria',
    coalition: 'Defensores de la Patria',
    slogan: 'Colombia, Patria Milagro',
    ideology: 'right',
    ideologyLabel: 'Derecha disruptiva',
    ideologyScore: 4,
    color: '#1A1A5E',
    colorLight: '#D4D4F0',
    slug: 'espriella',
    photo: '/images/candidates/espriella.jpg',
    runningMate: 'José Manuel Restrepo',
    runningMateRole: 'Exministro de Hacienda y Comercio',
    shortBio:
      'Abogado penalista, fundador de De la Espriella Lawyers Enterprise. Se define como "el Bukele colombiano". Primera candidatura sin cargos públicos previos. Inscrito por firmas con más de 2 millones validadas.',
    governmentPlanPdf: '/planes_gobierno/P000C.pdf',
    governmentPlanPages: 8,
    keyProposalCount: 13,
  },
  {
    id: 'valencia',
    name: 'Paloma Valencia',
    fullName: 'Paloma Valencia Laserna',
    party: 'Centro Democrático',
    coalition: 'Colombia Más Grande',
    slogan: 'Firmeza para estabilizar, corazón para transformar, visión para el futuro',
    ideology: 'center-right',
    ideologyLabel: 'Centro-derecha uribista',
    ideologyScore: 3,
    color: '#003399',
    colorLight: '#D0DFFF',
    slug: 'valencia',
    photo: '/images/candidates/valencia.jpg',
    runningMate: 'Juan Daniel Oviedo',
    runningMateRole: 'Exdirector del DANE',
    shortBio:
      'Senadora desde 2014 (tres periodos), abogada y filósofa de los Andes, maestría NYU. Primera mujer candidata del Centro Democrático. Ganó la Gran Consulta por Colombia con 3.2 millones de votos.',
    governmentPlanPdf: '/planes_gobierno/P000A.pdf',
    governmentPlanPages: 19,
    keyProposalCount: 111,
  },
  {
    id: 'fajardo',
    name: 'Sergio Fajardo',
    fullName: 'Sergio Fajardo Valderrama',
    party: 'Dignidad y Compromiso',
    coalition: '¡Ahora Colombia!',
    slogan: 'Cambio. Serio. Seguro.',
    ideology: 'center',
    ideologyLabel: 'Centro institucional',
    ideologyScore: 0,
    color: '#F5A623',
    colorLight: '#FEF0D5',
    slug: 'fajardo',
    photo: '/images/candidates/fajardo.jpg',
    runningMate: 'Por confirmar',
    runningMateRole: 'Coalición ¡Ahora Colombia!',
    shortBio:
      'Matemático, exalcalde de Medellín (2004-2007), exgobernador de Antioquia (2012-2015). Tercera candidatura presidencial. Lema "Adelante con Fajardo", coalición con Nuevo Liberalismo y MIRA.',
    governmentPlanPdf: '/planes_gobierno/P000D.pdf',
    governmentPlanPages: 62,
    keyProposalCount: 21,
  },
];

export const candidateMap = Object.fromEntries(
  candidates.map((c) => [c.id, c])
) as Record<string, Candidate>;

export function getCandidate(id: string): Candidate | undefined {
  return candidateMap[id];
}
