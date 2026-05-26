import type { QuizQuestion } from '@/types/quiz';

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q-ideology',
    dimensionId: 'ideology',
    text: 'En términos generales, ¿cómo debería gobernar el próximo presidente?',
    context: 'Piensa en qué tipo de cambio necesita Colombia.',
    options: [
      {
        id: 'q-ideology-a',
        text: 'Profundizar las reformas sociales del gobierno actual, priorizando la redistribución',
        candidateScores: { cepeda: 3, espriella: 0, valencia: 0, fajardo: 1 },
      },
      {
        id: 'q-ideology-b',
        text: 'Un gobierno de centro que corrija errores sin caer en extremos ideológicos',
        candidateScores: { cepeda: 1, espriella: 0, valencia: 1, fajardo: 3 },
      },
      {
        id: 'q-ideology-c',
        text: 'Restaurar el orden, la seguridad y la confianza económica con firmeza institucional',
        candidateScores: { cepeda: 0, espriella: 1, valencia: 3, fajardo: 1 },
      },
      {
        id: 'q-ideology-d',
        text: 'Una transformación radical: mano dura, reducir el Estado y volver a los valores fundamentales',
        candidateScores: { cepeda: 0, espriella: 3, valencia: 1, fajardo: 0 },
      },
    ],
  },
  {
    id: 'q-economic',
    dimensionId: 'economic-model',
    text: '¿Cuál debería ser el rol del Estado en la economía?',
    context: 'Piensa en empleo, crecimiento y bienestar.',
    options: [
      {
        id: 'q-economic-a',
        text: 'El Estado debe intervenir activamente: proteger la industria nacional y redistribuir la riqueza',
        candidateScores: { cepeda: 3, espriella: 0, valencia: 0, fajardo: 1 },
      },
      {
        id: 'q-economic-b',
        text: 'El Estado debe facilitar el emprendimiento con fondos, ciencia y tecnología, pero no controlar',
        candidateScores: { cepeda: 1, espriella: 0, valencia: 1, fajardo: 3 },
      },
      {
        id: 'q-economic-c',
        text: 'Reducir impuestos a empresas, atraer inversión extranjera y crecer al 5% del PIB',
        candidateScores: { cepeda: 0, espriella: 1, valencia: 3, fajardo: 1 },
      },
      {
        id: 'q-economic-d',
        text: 'Reducir el Estado al mínimo, liberar el mercado y dejar que el sector privado lidere todo',
        candidateScores: { cepeda: 0, espriella: 3, valencia: 1, fajardo: 0 },
      },
    ],
  },
  {
    id: 'q-taxes',
    dimensionId: 'tax-policy',
    text: '¿Qué debería hacerse con los impuestos?',
    context: 'Colombia tiene un déficit fiscal significativo.',
    options: [
      {
        id: 'q-taxes-a',
        text: 'Subir impuestos a grandes fortunas y capitales para financiar programas sociales',
        candidateScores: { cepeda: 3, espriella: 0, valencia: 0, fajardo: 1 },
      },
      {
        id: 'q-taxes-b',
        text: 'No subir impuestos, pero modernizar la DIAN y combatir agresivamente la evasión',
        candidateScores: { cepeda: 1, espriella: 1, valencia: 1, fajardo: 3 },
      },
      {
        id: 'q-taxes-c',
        text: 'Reducir impuestos a empresas y eliminar el impuesto al patrimonio para reactivar la economía',
        candidateScores: { cepeda: 0, espriella: 1, valencia: 3, fajardo: 0 },
      },
      {
        id: 'q-taxes-d',
        text: 'Simplificar radicalmente el sistema tributario y financiar el Estado recortando burocracia',
        candidateScores: { cepeda: 0, espriella: 3, valencia: 1, fajardo: 0 },
      },
    ],
  },
  {
    id: 'q-state',
    dimensionId: 'state-size',
    text: '¿Qué tamaño debería tener el Estado colombiano?',
    context: 'El debate entre más servicios públicos o más eficiencia.',
    options: [
      {
        id: 'q-state-a',
        text: 'Más grande: ampliar programas sociales y llevar el Estado a todos los territorios',
        candidateScores: { cepeda: 3, espriella: 0, valencia: 0, fajardo: 1 },
      },
      {
        id: 'q-state-b',
        text: 'Eficiente y descentralizado: gastar mejor, no más; presupuesto transparente',
        candidateScores: { cepeda: 1, espriella: 0, valencia: 1, fajardo: 3 },
      },
      {
        id: 'q-state-c',
        text: 'Más pequeño y digital: reducir ministerios, usar IA y blockchain en trámites públicos',
        candidateScores: { cepeda: 0, espriella: 1, valencia: 3, fajardo: 1 },
      },
      {
        id: 'q-state-d',
        text: 'Reducir el Estado un 40%: eliminar burocracia clientelista y ahorrar billones',
        candidateScores: { cepeda: 0, espriella: 3, valencia: 1, fajardo: 0 },
      },
    ],
  },
  {
    id: 'q-investment',
    dimensionId: 'foreign-investment',
    text: '¿Cómo debería Colombia manejar la inversión extranjera?',
    context: 'Colombia compite con otros países por atraer inversión.',
    options: [
      {
        id: 'q-investment-a',
        text: 'Con condiciones estrictas: proteger la industria nacional y exigir transferencia tecnológica',
        candidateScores: { cepeda: 3, espriella: 0, valencia: 0, fajardo: 1 },
      },
      {
        id: 'q-investment-b',
        text: 'Con reglas claras y equilibrio diplomático: relación pragmática con todos los bloques',
        candidateScores: { cepeda: 1, espriella: 0, valencia: 1, fajardo: 3 },
      },
      {
        id: 'q-investment-c',
        text: 'Atraer $2.000M USD/año con seguridad jurídica y estabilidad normativa',
        candidateScores: { cepeda: 0, espriella: 1, valencia: 3, fajardo: 1 },
      },
      {
        id: 'q-investment-d',
        text: 'Apertura total: zonas especiales desreguladas y alianzas estratégicas con EE.UU. e Israel',
        candidateScores: { cepeda: 0, espriella: 3, valencia: 1, fajardo: 0 },
      },
    ],
  },
  {
    id: 'q-security',
    dimensionId: 'security',
    text: '¿Cómo debería Colombia enfrentar la inseguridad?',
    context: 'El crimen organizado y la violencia territorial son los mayores problemas del país.',
    options: [
      {
        id: 'q-security-a',
        text: 'Diálogo con todos los grupos armados e inversión social masiva en territorios afectados',
        candidateScores: { cepeda: 3, espriella: 0, valencia: 0, fajardo: 1 },
      },
      {
        id: 'q-security-b',
        text: 'Seguridad integral: más policía, inteligencia estratégica y protección de niños y jóvenes',
        candidateScores: { cepeda: 1, espriella: 0, valencia: 1, fajardo: 3 },
      },
      {
        id: 'q-security-c',
        text: 'Plan 30-30: 60.000 nuevos efectivos, más tecnología militar y asfixia financiera a ilegales',
        candidateScores: { cepeda: 0, espriella: 1, valencia: 3, fajardo: 1 },
      },
      {
        id: 'q-security-d',
        text: 'Operativo militar masivo en 90 días, captura de cabecillas y Plan Colombia II',
        candidateScores: { cepeda: 0, espriella: 3, valencia: 1, fajardo: 0 },
      },
    ],
  },
  {
    id: 'q-drugs',
    dimensionId: 'drug-policy',
    text: '¿Cuál es el mejor enfoque para combatir los cultivos de coca?',
    context: 'Colombia tiene más de 200.000 hectáreas de cultivos ilícitos.',
    options: [
      {
        id: 'q-drugs-a',
        text: 'Sustitución voluntaria con desarrollo alternativo: hacer la legalidad más atractiva',
        candidateScores: { cepeda: 3, espriella: 0, valencia: 0, fajardo: 2 },
      },
      {
        id: 'q-drugs-b',
        text: 'Atacar las finanzas del narcotráfico con inteligencia y presencia estatal territorial',
        candidateScores: { cepeda: 1, espriella: 0, valencia: 1, fajardo: 3 },
      },
      {
        id: 'q-drugs-c',
        text: 'Enfoque mixto: sustitución donde funcione y fumigación donde haya cultivos industriales',
        candidateScores: { cepeda: 0, espriella: 1, valencia: 3, fajardo: 1 },
      },
      {
        id: 'q-drugs-d',
        text: 'Fumigación aérea masiva de 330.000 hectáreas con apoyo internacional',
        candidateScores: { cepeda: 0, espriella: 3, valencia: 1, fajardo: 0 },
      },
    ],
  },
  {
    id: 'q-family',
    dimensionId: 'family-values',
    text: '¿Qué visión de familia y sociedad debería tener el gobierno?',
    context: 'Distintas visiones sobre género, diversidad y valores.',
    options: [
      {
        id: 'q-family-a',
        text: 'Enfoque de género e inclusión: igualdad, derechos LGBTIQ+ y diversidad como políticas de Estado',
        candidateScores: { cepeda: 3, espriella: 0, valencia: 0, fajardo: 2 },
      },
      {
        id: 'q-family-b',
        text: 'Inclusión y cuidado: participación de poblaciones excluidas, sistema nacional de cuidado',
        candidateScores: { cepeda: 2, espriella: 0, valencia: 1, fajardo: 3 },
      },
      {
        id: 'q-family-c',
        text: 'Protección de la mujer con perspectiva moderada: autonomía económica y juzgados especializados',
        candidateScores: { cepeda: 0, espriella: 0, valencia: 3, fajardo: 1 },
      },
      {
        id: 'q-family-d',
        text: 'Familia tradicional y fe como pilares de la nación: valores cristianos como cimiento ético',
        candidateScores: { cepeda: 0, espriella: 3, valencia: 1, fajardo: 0 },
      },
    ],
  },
  {
    id: 'q-education',
    dimensionId: 'education',
    text: '¿Cómo debería transformarse la educación en Colombia?',
    context: 'Colombia necesita mejorar calidad y cobertura educativa.',
    options: [
      {
        id: 'q-education-a',
        text: 'Educación pública gratuita y universal en todos los niveles, fortalecer la universidad pública',
        candidateScores: { cepeda: 3, espriella: 0, valencia: 0, fajardo: 2 },
      },
      {
        id: 'q-education-b',
        text: 'Enfoque STEAM, transformar el SENA, matemáticas como proyecto nacional y docentes de calidad',
        candidateScores: { cepeda: 1, espriella: 0, valencia: 1, fajardo: 3 },
      },
      {
        id: 'q-education-c',
        text: 'Bonos educativos para elegir entre público o privado, 1 millón de jóvenes en IA',
        candidateScores: { cepeda: 0, espriella: 1, valencia: 3, fajardo: 0 },
      },
      {
        id: 'q-education-d',
        text: 'Formar ciudadanos patriotas y competitivos con valores, articulados con el mercado laboral',
        candidateScores: { cepeda: 0, espriella: 3, valencia: 1, fajardo: 0 },
      },
    ],
  },
  {
    id: 'q-tech',
    dimensionId: 'technology',
    text: '¿Qué debería hacer Colombia en tecnología e inteligencia artificial?',
    context: 'La revolución digital está transformando todos los sectores.',
    options: [
      {
        id: 'q-tech-a',
        text: 'Cerrar la brecha digital: llevar internet a zonas rurales y garantizar soberanía tecnológica',
        candidateScores: { cepeda: 3, espriella: 0, valencia: 0, fajardo: 1 },
      },
      {
        id: 'q-tech-b',
        text: 'Instituto Nacional de IA, Estado Digital 2030 y Colombia como hub tech regional',
        candidateScores: { cepeda: 0, espriella: 0, valencia: 1, fajardo: 3 },
      },
      {
        id: 'q-tech-c',
        text: 'Estado "AI first": IA en todos los trámites, blockchain para contratación, centros de datos',
        candidateScores: { cepeda: 0, espriella: 1, valencia: 3, fajardo: 1 },
      },
      {
        id: 'q-tech-d',
        text: 'Tecnología de punta para la Fuerza Pública y eficiencia estatal con estándares internacionales',
        candidateScores: { cepeda: 0, espriella: 3, valencia: 1, fajardo: 0 },
      },
    ],
  },
  {
    id: 'q-health',
    dimensionId: 'healthcare',
    text: '¿Cómo debería funcionar el sistema de salud?',
    context: 'El sistema de salud colombiano está en crisis.',
    options: [
      {
        id: 'q-health-a',
        text: 'Eliminar las EPS y crear un sistema único público sin intermediarios privados',
        candidateScores: { cepeda: 3, espriella: 0, valencia: 0, fajardo: 1 },
      },
      {
        id: 'q-health-b',
        text: 'Ordenar el sistema sin destruirlo: reformar lo que falla, Atención Primaria territorial y salud mental',
        candidateScores: { cepeda: 1, espriella: 0, valencia: 1, fajardo: 3 },
      },
      {
        id: 'q-health-c',
        text: 'Inyectar $9 billones, PMU 24/7, resolver 10M de atenciones represadas y telemedicina rural',
        candidateScores: { cepeda: 0, espriella: 1, valencia: 3, fajardo: 1 },
      },
      {
        id: 'q-health-d',
        text: 'Plan de choque de $10 billones, hospitales con APP, intervenir EPS ineficientes y brigadas móviles',
        candidateScores: { cepeda: 0, espriella: 3, valencia: 1, fajardo: 0 },
      },
    ],
  },
  {
    id: 'q-petro',
    dimensionId: 'petro-stance',
    text: '¿Qué debería hacer el próximo gobierno con las políticas del presidente Petro?',
    context: 'El gobierno actual ha sido polarizante. El próximo presidente debe decidir qué hacer con su legado.',
    options: [
      {
        id: 'q-petro-a',
        text: 'Profundizar y completar las reformas: Paz Total, programas sociales, justicia transicional',
        candidateScores: { cepeda: 3, espriella: 0, valencia: 0, fajardo: 0 },
      },
      {
        id: 'q-petro-b',
        text: 'Corregir el rumbo con método: rescatar lo poco bueno, cambiar lo que falló, sin extremos',
        candidateScores: { cepeda: 1, espriella: 0, valencia: 1, fajardo: 3 },
      },
      {
        id: 'q-petro-c',
        text: 'Cambio de rumbo fuerte: desactivar las "bombas" heredadas y restaurar la confianza',
        candidateScores: { cepeda: 0, espriella: 1, valencia: 3, fajardo: 1 },
      },
      {
        id: 'q-petro-d',
        text: 'Revertir todo: eliminar la JEP, reducir el Estado un 40% y aplicar un modelo opuesto',
        candidateScores: { cepeda: 0, espriella: 3, valencia: 1, fajardo: 0 },
      },
    ],
  },
];
