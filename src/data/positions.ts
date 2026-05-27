import type { CandidatePosition } from '@/types/dimension';

export const positions: CandidatePosition[] = [
  // ============================================================
  // 1. IDEOLOGÍA — Espectro izquierda-derecha
  // ============================================================
  {
    candidateId: 'cepeda',
    dimensionId: 'ideology',
    score: -4,
    summary:
      'Izquierda continuista. Candidato del Pacto Histórico, propone profundizar el modelo del gobierno Petro con énfasis en justicia social, reforma agraria, paz total y transformación del Estado.',
    keyProposals: [
      'Continuidad de la Paz Total y diálogos con todos los grupos armados',
      'Revolución agraria: redistribución de tierras y soberanía alimentaria',
      'Sistema Nacional contra la Macrocorrupción',
      'Política exterior autónoma y solidaria',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Plan de gobierno Cepeda', planPage: 8 },
      { type: 'research', label: 'Análisis comparativo candidatos 2026' },
    ],
    risks: [
      'Polarización por asociación directa con gobierno Petro',
      'Dependencia de continuidad de procesos de paz inconclusos',
    ],
  },
  {
    candidateId: 'espriella',
    dimensionId: 'ideology',
    score: 4,
    summary:
      'Derecha disruptiva. Se define como "el Bukele colombiano". Propone una transformación radical basada en fe, familia, autoridad y ética pública como principios innegociables.',
    keyProposals: [
      'Brújula Moral: Fe, Familia, Autoridad y Ley, Ética Pública',
      '10 pilares de gobierno para transformar Colombia',
      'Modelo Bukele: megacárceles y mano dura',
      'Economía libertaria con reducción radical del Estado',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Plan Colombia Patria Milagro', planPage: 2 },
      { type: 'research', label: 'Análisis comparativo candidatos 2026' },
    ],
    risks: [
      'Sin experiencia previa en cargos públicos',
      'Propuestas con potencial tensión con derechos fundamentales',
    ],
  },
  {
    candidateId: 'valencia',
    dimensionId: 'ideology',
    score: 3,
    summary:
      'Centro-derecha uribista. Primera mujer candidata del Centro Democrático. Propone orden, firmeza en seguridad y crecimiento económico con responsabilidad social.',
    keyProposals: [
      '111 puntos del plan de gobierno con metas medibles',
      'Desactivar 5 "bombas": seguridad, salud, energía, confianza, corrupción',
      'Gobierno que ejecuta, mide y corrige',
      'Crecimiento del 5% del PIB anual',
    ],
    sourceRefs: [
      { type: 'plan', label: '111 Puntos Plan Colombia Más Grande', planPage: 1 },
      { type: 'research', label: 'Análisis comparativo candidatos 2026' },
    ],
    risks: [
      'Percepción de continuidad uribista puede generar rechazo en sectores progresistas',
      'Ambición fiscal (reducir impuestos + aumentar gasto en seguridad) difícil de cuadrar',
    ],
  },
  {
    candidateId: 'fajardo',
    dimensionId: 'ideology',
    score: 0,
    summary:
      'Centro institucional. Tercera candidatura presidencial. Propone un modelo basado en evidencia, sin extremos, con énfasis en educación, institucionalidad y desarrollo productivo.',
    keyProposals: [
      'Tres capítulos: Crisis (recuperar), Esperanza (crecer), Dignidad (incluir)',
      'Gobierno basado en evidencia y resultados',
      'Corregir el rumbo sin extremos ideológicos',
      'Coalición amplia: Nuevo Liberalismo + MIRA + Dignidad y Compromiso',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Programa Cambio Serio Seguro', planPage: 3 },
      { type: 'research', label: 'Análisis comparativo candidatos 2026' },
    ],
    risks: [
      'Percepción de indecisión por posición centrista',
      'Tercera candidatura genera fatiga electoral en ciertos votantes',
    ],
  },

  // ============================================================
  // 2. MODELO ECONÓMICO — Intervención estatal vs. Libre mercado
  // ============================================================
  {
    candidateId: 'cepeda',
    dimensionId: 'economic-model',
    score: -4,
    summary:
      'Intervención estatal fuerte. Propone austeridad republicana, protección de la industria nacional, revolución agraria y redistribución de la riqueza como motor económico.',
    keyProposals: [
      'Revolución agraria con redistribución de tierras productivas',
      'Fortalecimiento de la industria nacional y soberanía alimentaria',
      'Austeridad republicana: recorte de gastos suntuarios del Estado',
      'Capital social como eje de transformación económica',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Plan de gobierno Cepeda', planPage: 172 },
      { type: 'plan', label: 'Plan de gobierno Cepeda — Revolución Agraria', planPage: 88 },
    ],
    risks: [
      'Reforma agraria masiva puede generar incertidumbre jurídica',
      'Proteccionismo podría reducir competitividad exportadora',
    ],
  },
  {
    candidateId: 'espriella',
    dimensionId: 'economic-model',
    score: 4,
    summary:
      'Economía libertaria. Propone crecimiento explosivo basado en libre mercado, empleo masivo, zonas económicas especiales y reducción drástica de la intervención estatal.',
    keyProposals: [
      'Crecimiento explosivo y empleo masivo',
      'Zonas económicas especiales para atraer inversión',
      'Simplificación fiscal sin subir impuestos',
      'Reducción del 40% del aparato estatal para liberar recursos productivos',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Plan Colombia Patria Milagro — Pilar 5', planPage: 4 },
    ],
    risks: [
      'Reducción estatal abrupta puede afectar servicios públicos esenciales',
      'Metas de crecimiento sin respaldo técnico detallado',
    ],
  },
  {
    candidateId: 'valencia',
    dimensionId: 'economic-model',
    score: 3,
    summary:
      'Libre mercado con seguridad jurídica. Busca crecer al 5% del PIB con inversión al 25%, sector exportador como motor, reducción de impuestos empresariales y confianza inversionista.',
    keyProposals: [
      'Crecimiento del 5% del PIB, inversión al 25% del PIB',
      'Reducir tarifas de impuesto de renta empresarial',
      'Eliminar impuesto al patrimonio y reducir predial',
      '$10 mil millones USD adicionales en exportaciones',
    ],
    sourceRefs: [
      { type: 'plan', label: '111 Puntos — Puntos 36-40', planPage: 8 },
    ],
    risks: [
      'Reducción tributaria puede agravar el déficit fiscal',
      'Meta del 5% de crecimiento es ambiciosa dado el contexto global',
    ],
  },
  {
    candidateId: 'fajardo',
    dimensionId: 'economic-model',
    score: 1,
    summary:
      'Economía mixta con vocación exportadora. Desarrollo productivo con reconversión tecnológica, diversificación de la economía, Estado como facilitador del emprendimiento.',
    keyProposals: [
      'Reconversión productiva y tecnológica de 120.000 empresas',
      'FONIEV: Fondo público-privado de innovación y emprendimiento verde',
      'Colombia Coinvierte: USD 1.000M en capital de crecimiento',
      'Menos trámites: reducir 50% tiempos empresariales',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Programa Fajardo — Emprendimiento', planPage: 25 },
      { type: 'plan', label: 'Programa Fajardo — Desarrollo Productivo', planPage: 27 },
    ],
    risks: [
      'Múltiples fondos y programas pueden dispersar recursos',
      'Falta de fuentes claras de financiación para todos los programas',
    ],
  },

  // ============================================================
  // 3. POLÍTICA TRIBUTARIA — Más impuestos progresivos vs. Menos impuestos
  // ============================================================
  {
    candidateId: 'cepeda',
    dimensionId: 'tax-policy',
    score: -4,
    summary:
      'Reforma tributaria progresiva. Propone aumentar impuestos a grandes capitales y fortunas para financiar programas sociales, redistribución fiscal y lucha contra la evasión.',
    keyProposals: [
      'Impuestos progresivos a grandes capitales y fortunas',
      'Persecución agresiva de la evasión y elusión fiscal',
      'Financiación de programas sociales con recaudo tributario ampliado',
      'Austeridad en gastos del Estado para liberar recursos',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Plan de gobierno Cepeda — Austeridad', planPage: 172 },
      { type: 'research', label: 'Análisis comparativo candidatos 2026' },
    ],
    risks: [
      'Mayor carga tributaria puede desincentivar inversión privada',
      'Riesgo de fuga de capitales ante impuestos más altos',
    ],
  },
  {
    candidateId: 'espriella',
    dimensionId: 'tax-policy',
    score: 4,
    summary:
      'Simplificación fiscal sin subir impuestos. Propone reforma tributaria libertaria: menos impuestos, menos trámites, y financiar el Estado con ahorro por reducción burocrática ($25-30B).',
    keyProposals: [
      'No subir impuestos; simplificar el sistema tributario',
      'Ahorro de $25-30 billones anuales por reducción del Estado',
      'Reasignación fiscal hacia seguridad, justicia e infraestructura',
      'Saneamiento fiscal de choque desde el día 1',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Plan Colombia Patria Milagro — Pilar 6', planPage: 4 },
      { type: 'plan', label: 'Plan Colombia Patria Milagro — Reforma del Estado', planPage: 7 },
    ],
    risks: [
      'Ahorro de $25-30B por reducción estatal es una cifra no sustentada técnicamente',
      'Riesgo de desfinanciamiento de servicios públicos',
    ],
  },
  {
    candidateId: 'valencia',
    dimensionId: 'tax-policy',
    score: 3,
    summary:
      'Menos impuestos para reactivar la economía. Reducir renta empresarial, eliminar impuesto al patrimonio, simplificar el estatuto tributario y respetar la regla fiscal.',
    keyProposals: [
      'Reducir tarifas del impuesto de renta empresarial',
      'Eliminar el impuesto al patrimonio',
      'Reducir el impuesto predial',
      'Simplificar el estatuto tributario y eliminar trámites innecesarios',
    ],
    sourceRefs: [
      { type: 'plan', label: '111 Puntos — Punto 39', planPage: 8 },
    ],
    risks: [
      'Reducción tributaria simultánea con aumento de gasto en seguridad crea tensión fiscal',
      'Déficit de $50B requiere fuentes alternas de financiación',
    ],
  },
  {
    candidateId: 'fajardo',
    dimensionId: 'tax-policy',
    score: 0,
    summary:
      'Modernizar el recaudo sin subir la carga fiscal. Modernizar la DIAN, combatir evasión agresivamente, revisar beneficios tributarios y ordenar los subsidios energéticos.',
    keyProposals: [
      'Modernización profunda de la DIAN para combatir evasión y elusión',
      'Revisión de beneficios tributarios con evaluaciones rigurosas',
      'Cerrar déficit del Fondo de Estabilización de Combustibles (hasta 2% del PIB)',
      'Consolidación fiscal responsable con apoyo multilateral',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Programa Fajardo — Finanzas Públicas', planPage: 10 },
    ],
    risks: [
      'Modernización de la DIAN es un proceso lento que no genera ingresos inmediatos',
      'Ajuste de subsidios de combustibles es políticamente costoso',
    ],
  },

  // ============================================================
  // 4. TAMAÑO DEL ESTADO — Estado más grande vs. Estado más pequeño
  // ============================================================
  {
    candidateId: 'cepeda',
    dimensionId: 'state-size',
    score: -3,
    summary:
      'Estado ampliado con presencia territorial. Más programas sociales, más presencia del Estado en regiones, la política social como centro del programa, fortalecimiento de lo público.',
    keyProposals: [
      'La política social es el centro del programa de gobierno',
      'Fortalecimiento de la transformación social en todos los territorios',
      'Ampliación de servicios públicos y programas de inclusión',
      'Mayor presencia estatal en zonas históricamente abandonadas',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Plan de gobierno Cepeda — Política Social', planPage: 179 },
      { type: 'plan', label: 'Plan de gobierno Cepeda — Transformación Social', planPage: 220 },
    ],
    risks: [
      'Expansión estatal sin fuentes claras de financiación sostenible',
      'Riesgo de burocratización y captura clientelista',
    ],
  },
  {
    candidateId: 'espriella',
    dimensionId: 'state-size',
    score: 5,
    summary:
      'Reducción radical del 40% del aparato estatal. Eliminar ministerios inútiles, meritocracia estricta, depuración de funcionarios, ahorro de $25-30 billones anuales.',
    keyProposals: [
      'Reducción del 40% del tamaño del Estado',
      'Eliminación de ministerios y burocracia clientelista',
      'Meritocracia estricta con estándares internacionales',
      'Ahorro de $25-30 billones anuales reasignados a seguridad e infraestructura',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Plan Colombia Patria Milagro — Reforma del Estado', planPage: 7 },
    ],
    risks: [
      'Reducción del 40% puede paralizar servicios esenciales',
      'Despido masivo de funcionarios genera crisis social y política',
    ],
  },
  {
    candidateId: 'valencia',
    dimensionId: 'state-size',
    score: 3,
    summary:
      'Estado eficiente, pequeño y digital. Reducir 25% ministerios, congelar OPS en 30%, IA al servicio del Estado, Plan Nacional de Inteligencia Artificial como política pública.',
    keyProposals: [
      'Reducir al máximo ministerios y entidades, liberar recursos',
      'Reducción del 25% de gastos de funcionamiento',
      'Congelar órdenes de prestación de servicios (OPS) en 30%',
      'Estado plataforma: blockchain, IA, "AI first" en trámites públicos',
    ],
    sourceRefs: [
      { type: 'plan', label: '111 Puntos — Puntos 107-108', planPage: 18 },
    ],
    risks: [
      'Transición digital abrupta puede excluir a poblaciones sin acceso tecnológico',
      'Reducción burocrática puede afectar atención en zonas rurales',
    ],
  },
  {
    candidateId: 'fajardo',
    dimensionId: 'state-size',
    score: 1,
    summary:
      'Estado eficiente y descentralizado. Modernizar sin desmantelar, gasto público con propósito, presupuesto transparente, reducir gastos duplicados sin afectar cobertura social.',
    keyProposals: [
      'Gasto público con propósito: cada programa debe generar resultados reales',
      'Reducir gastos administrativos innecesarios (sedes, vehículos, duplicidades)',
      'Presupuesto por programas transparente y accesible al ciudadano',
      'Descentralización real con municipios y departamentos fortalecidos',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Programa Fajardo — Finanzas Públicas', planPage: 10 },
    ],
    risks: [
      'Reformas graduales pueden ser insuficientes ante la urgencia fiscal',
      'Descentralización sin capacidad local puede generar ineficiencia',
    ],
  },

  // ============================================================
  // 5. INVERSIÓN EXTRANJERA — Selectiva con condiciones vs. Abierta y liberal
  // ============================================================
  {
    candidateId: 'cepeda',
    dimensionId: 'foreign-investment',
    score: -3,
    summary:
      'Inversión extranjera condicionada a soberanía nacional. Prioriza la industria local, condiciones estrictas para inversión extranjera, política exterior autónoma.',
    keyProposals: [
      'Política exterior autónoma y solidaria con los migrantes',
      'Soberanía sobre recursos naturales y territorio',
      'Condiciones de transferencia tecnológica para inversionistas',
      'Prioridad a la industria y el empleo nacional',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Plan de gobierno Cepeda — Política Exterior', planPage: 38 },
      { type: 'plan', label: 'Plan de gobierno Cepeda — Soberanía', planPage: 212 },
    ],
    risks: [
      'Condiciones estrictas pueden ahuyentar inversión necesaria',
      'Aislamiento diplomático si se confrontan aliados tradicionales',
    ],
  },
  {
    candidateId: 'espriella',
    dimensionId: 'foreign-investment',
    score: 4,
    summary:
      'Apertura total con alianzas estratégicas. Plan Colombia II con EE.UU., cooperación con Israel, diplomacia comercial agresiva, zonas económicas especiales desreguladas.',
    keyProposals: [
      'Lanzamiento del Plan Colombia II con apoyo internacional',
      'Cooperación estratégica con EE.UU. e Israel',
      'Zonas económicas especiales para atraer inversión masiva',
      'Diplomacia comercial y alianza con socios estratégicos',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Plan Colombia Patria Milagro — Pilar 9', planPage: 4 },
      { type: 'plan', label: 'Plan Colombia Patria Milagro — Seguridad', planPage: 5 },
    ],
    risks: [
      'Alineación excesiva con un solo bloque reduce margen diplomático',
      'Desregulación puede generar conflictos sociales y ambientales',
    ],
  },
  {
    candidateId: 'valencia',
    dimensionId: 'foreign-investment',
    score: 4,
    summary:
      'Inversión abierta con seguridad jurídica. Atraer $2 mil millones USD/año en IED, respeto a contratos, Escudo de las Américas contra narcotráfico, libre competencia con China.',
    keyProposals: [
      'Atraer al menos $2.000M USD/año en inversión extranjera directa',
      'Seguridad jurídica: respeto a contratos y estabilidad normativa',
      'Integración al Escudo de las Américas con apoyo de EE.UU.',
      'Relación con China basada en libre competencia y transparencia',
    ],
    sourceRefs: [
      { type: 'plan', label: '111 Puntos — Puntos 38, 43-45', planPage: 8 },
    ],
    risks: [
      'Apertura amplia requiere capacidad de negociación para proteger intereses nacionales',
      'Competencia con China puede generar tensiones diplomáticas',
    ],
  },
  {
    candidateId: 'fajardo',
    dimensionId: 'foreign-investment',
    score: 2,
    summary:
      'Inversión con reglas claras y equilibrio diplomático. Ventanilla Única de Inversiones modernizada, marco de protección actualizado, relación pragmática con todos los bloques.',
    keyProposals: [
      'Reestructurar la Ventanilla Única de Inversiones como plataforma moderna',
      'Actualizar el marco de protección y facilitación de inversiones',
      'Relación equilibrada: EE.UU., UE, China, América Latina',
      'Preparación para reapertura económica con Venezuela',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Programa Fajardo — Desarrollo Productivo', planPage: 27 },
      { type: 'plan', label: 'Programa Fajardo — Política Exterior', planPage: 18 },
    ],
    risks: [
      'Posición equilibrada puede percibirse como falta de liderazgo en alianzas',
      'Apertura con Venezuela depende de factores externos incontrolables',
    ],
  },

  // ============================================================
  // 6. SEGURIDAD — Diálogo y paz vs. Mano dura militar
  // ============================================================
  {
    candidateId: 'cepeda',
    dimensionId: 'security',
    score: -4,
    summary:
      'Paz Total y diálogo como estrategia central. Continuar negociaciones con todos los grupos armados, inversión social como antídoto a la violencia, justicia transicional.',
    keyProposals: [
      'Continuidad de la Paz Total: diálogos con ELN, Clan del Golfo y disidencias',
      'Inversión social masiva en territorios afectados por el conflicto',
      'Defensa de la JEP y la justicia transicional',
      'Protección de líderes sociales y defensores de derechos humanos',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Plan de gobierno Cepeda — Víctimas y Paz', planPage: 80 },
      { type: 'research', label: 'Análisis comparativo candidatos 2026' },
    ],
    risks: [
      'Diálogos sin resultados pueden profundizar la violencia territorial',
      'Percepción de impunidad para grupos armados',
    ],
  },
  {
    candidateId: 'espriella',
    dimensionId: 'security',
    score: 5,
    summary:
      'Mano dura militar total. 90 días para recuperar control territorial, ofensiva masiva contra el crimen, captura de 10 cabecillas, Plan Colombia II con apoyo internacional.',
    keyProposals: [
      'Plan de Choque: 90 días para recuperar control total del territorio',
      'Capturar o dar de baja a 10 cabecillas de alto valor',
      'Bloque de búsqueda especializado contra la extorsión',
      'Plan Colombia II con cooperación de EE.UU. e Israel',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Plan Colombia Patria Milagro — Seguridad', planPage: 5 },
    ],
    risks: [
      'Operativo militar masivo en 90 días es logísticamente cuestionable',
      'Riesgo de violaciones de DDHH en operaciones de choque',
    ],
  },
  {
    candidateId: 'valencia',
    dimensionId: 'security',
    score: 3,
    summary:
      'Seguridad articulada con justicia e inteligencia. Plan 30-30 (30 mil militares + 30 mil policías), $20 billones en defensa, drones y ciberinteligencia, pero también oferta social.',
    keyProposals: [
      'Plan 30-30: 30.000 nuevos militares y 30.000 nuevos policías',
      'Aumentar gasto en defensa en $20 billones (4% del PIB)',
      'Drones de última generación y ciberinteligencia',
      'Asfixia financiera a los ilegales y extinción de dominio exprés',
    ],
    sourceRefs: [
      { type: 'plan', label: '111 Puntos — Puntos 1-7', planPage: 2 },
    ],
    risks: [
      'Costo fiscal de $20B adicionales en defensa difícil de financiar',
      'Enfoque militar puede descuidar causas estructurales de violencia',
    ],
  },
  {
    candidateId: 'fajardo',
    dimensionId: 'security',
    score: 1,
    summary:
      'Seguridad institucional e integral. Plan Guardián con 40.000 policías, inteligencia estratégica, atacar rentas criminales, protección de niños y jóvenes frente al reclutamiento.',
    keyProposals: [
      'Plan Guardián: 40.000 nuevos policías profesionales',
      'Atacar rentas criminales: lavado, narcotráfico, minería ilegal',
      'Duplicar grupos Gaula contra extorsión y secuestro',
      'Protección de niños, niñas y jóvenes frente al crimen (Entornos Protectores)',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Programa Fajardo — Seguridad Plan Guardián', planPage: 6 },
    ],
    risks: [
      'Incorporar 40.000 policías toma años de formación',
      'Enfoque institucional puede ser insuficiente ante violencia extrema en algunas regiones',
    ],
  },

  // ============================================================
  // 7. POLÍTICA ANTIDROGAS — Sustitución voluntaria vs. Fumigación aérea
  // ============================================================
  {
    candidateId: 'cepeda',
    dimensionId: 'drug-policy',
    score: -4,
    summary:
      'Sustitución voluntaria y reforma de la política de drogas. Privilegia programas de sustitución de cultivos, desarrollo alternativo y reformas al enfoque prohibicionista.',
    keyProposals: [
      'Sustitución voluntaria de cultivos ilícitos con acompañamiento integral',
      'Desarrollo alternativo con inversión productiva en zonas cocaleras',
      'Reforma de la política de drogas en foros internacionales',
      'No fumigación aérea: priorizar la salud y el medio ambiente',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Plan de gobierno Cepeda — Revolución Agraria', planPage: 88 },
      { type: 'research', label: 'Análisis comparativo candidatos 2026' },
    ],
    risks: [
      'Sustitución voluntaria ha tenido resultados limitados históricamente',
      'Sin fumigación, cultivos pueden expandirse en zonas sin presencia estatal',
    ],
  },
  {
    candidateId: 'espriella',
    dimensionId: 'drug-policy',
    score: 5,
    summary:
      'Fumigación aérea masiva y erradicación total. 330.000 hectáreas de fumigación, Plan Colombia II para desmantelar narcotráfico, cero tolerancia con cultivos ilícitos.',
    keyProposals: [
      'Fumigación aérea de 330.000 hectáreas de cultivos ilícitos',
      'Plan Colombia II con apoyo internacional contra el narcotráfico',
      'Captura de los 10 principales cabecillas del narco',
      'Tecnología de punta e inteligencia para la Fuerza Pública',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Plan Colombia Patria Milagro — Seguridad', planPage: 5 },
    ],
    risks: [
      'Fumigación aérea genera daños ambientales y de salud documentados',
      'Experiencia histórica muestra que la fumigación sola no elimina el narcotráfico',
    ],
  },
  {
    candidateId: 'valencia',
    dimensionId: 'drug-policy',
    score: 2,
    summary:
      'Enfoque mixto: sustitución donde funcione, fumigación donde haya cultivos industriales. Incautación de precursores químicos, hacer la legalidad más rentable que el crimen.',
    keyProposals: [
      'Reactivar fumigación en zonas de cultivos ilícitos industriales',
      'Sustitución generosa: apoyar campesinos con cultivos lícitos',
      'Hacer al campesino socio de empresas que transformen los cultivos',
      'Política antidrogas eficaz en incautación de precursores químicos',
    ],
    sourceRefs: [
      { type: 'plan', label: '111 Puntos — Punto 7', planPage: 3 },
    ],
    risks: [
      'Definición de "cultivos industriales" puede ser ambigua',
      'Doble enfoque puede generar inconsistencias en la implementación',
    ],
  },
  {
    candidateId: 'fajardo',
    dimensionId: 'drug-policy',
    score: -1,
    summary:
      'Enfoque institucional: atacar rentas y economías ilícitas, desarrollo territorial integral. Prioriza inteligencia financiera y presencia estatal sobre fumigación masiva.',
    keyProposals: [
      'Atacar las finanzas del crimen organizado desde el día 1',
      'Desmantelamiento de redes de lavado de activos y minería ilegal',
      'Planes de desarrollo integral de seguridad y bienestar territorial',
      'Inteligencia estratégica coordinada entre Fiscalía, UIAF y Fuerzas',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Programa Fajardo — Seguridad Plan Guardián', planPage: 6 },
    ],
    risks: [
      'Atacar finanzas del narco es proceso largo sin resultados visibles inmediatos',
      'No toma posición clara sobre la fumigación',
    ],
  },

  // ============================================================
  // 8. FAMILIA Y VALORES — Enfoque de género y diversidad vs. Familia tradicional y fe
  // ============================================================
  {
    candidateId: 'cepeda',
    dimensionId: 'family-values',
    score: -4,
    summary:
      'Enfoque de género, diversidad e inclusión. Derechos LGBTIQ+, reconocimiento de pueblos indígenas y afro, igualdad de género como eje transversal del programa.',
    keyProposals: [
      'Igualdad de género como principio transversal de política pública',
      'Reconocimiento y derechos de pueblos indígenas y afrocolombianos',
      'Inclusión de población LGBTIQ+ y comunidades diversas',
      'Reparación efectiva a víctimas del conflicto armado',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Plan de gobierno Cepeda — Pueblos Indígenas', planPage: 227 },
      { type: 'plan', label: 'Plan de gobierno Cepeda — Transformación Social', planPage: 220 },
    ],
    risks: [
      'Enfoque de género puede polarizar a sectores conservadores',
      'Tensiones con comunidades religiosas en temas de diversidad',
    ],
  },
  {
    candidateId: 'espriella',
    dimensionId: 'family-values',
    score: 5,
    summary:
      'Familia tradicional y fe como pilares de la nación. Brújula Moral: familia como núcleo sagrado, fe en Dios como cimiento ético, valores cristianos como base social.',
    keyProposals: [
      'Fe y Valores: valores cristianos como cimiento ético de la nación',
      'Familia: núcleo central y sagrado de la sociedad',
      'Subsidios focalizados a madres y erradicación del hambre',
      'Educación y valores: ciudadanos autónomos, competitivos y patriotas',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Plan Colombia Patria Milagro — Brújula Moral', planPage: 3 },
      { type: 'plan', label: 'Plan Colombia Patria Milagro — Pilar 8', planPage: 4 },
    ],
    risks: [
      'Enfoque exclusivamente cristiano puede excluir a minorías religiosas',
      'Tensión entre valores tradicionales y derechos civiles de población diversa',
    ],
  },
  {
    candidateId: 'valencia',
    dimensionId: 'family-values',
    score: 1,
    summary:
      'Protección de la mujer y la familia con perspectiva moderada. Cerrar brechas de género en mujeres cabeza de hogar, autonomía económica, pero dentro de un marco institucional.',
    keyProposals: [
      'Juzgados especializados para mujeres víctimas de violencia ("una familia, un solo juez")',
      'Autonomía económica: 100.000 mujeres con acceso a crédito',
      'Cerrar brechas de género con subsidio directo y crédito a mujeres',
      'Licencia de paternidad de al menos 4 semanas',
    ],
    sourceRefs: [
      { type: 'plan', label: '111 Puntos — Puntos 12, 66, 69, 71', planPage: 4 },
    ],
    risks: [
      'Propuestas de género dentro de partido conservador pueden encontrar resistencia interna',
      'No aborda explícitamente derechos LGBTIQ+',
    ],
  },
  {
    candidateId: 'fajardo',
    dimensionId: 'family-values',
    score: -2,
    summary:
      'Inclusión, diversidad y cuidado como políticas de Estado. Reconoce a LGBTIQ+, pueblos indígenas, afro y comunidades diversas; enfoque de género en política exterior.',
    keyProposals: [
      'Participación efectiva de poblaciones históricamente excluidas',
      'Compromisos internacionales en igualdad de género y diversidad',
      'Sistema Nacional de Cuidado fortalecido para mujeres',
      'Educación inclusiva: etnoeducación, educación rural, discapacidad',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Programa Fajardo — Inclusión Social', planPage: 38 },
      { type: 'plan', label: 'Programa Fajardo — Política Exterior', planPage: 18 },
    ],
    risks: [
      'Enfoque progresivo puede perder votos del centro conservador',
      'Implementación depende de voluntad política del Congreso',
    ],
  },

  // ============================================================
  // 9. EDUCACIÓN — Pública universal vs. Bonos y libre elección
  // ============================================================
  {
    candidateId: 'cepeda',
    dimensionId: 'education',
    score: -4,
    summary:
      'Educación pública universal y gratuita. Fortalecimiento de la universidad pública, formación integral, educación como derecho fundamental y motor de transformación social.',
    keyProposals: [
      'Educación pública gratuita y de calidad en todos los niveles',
      'Fortalecimiento de la universidad pública con más presupuesto',
      'Educación como herramienta de superación de la pobreza',
      'Formación para el trabajo y la transformación social',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Plan de gobierno Cepeda — Transformación Social', planPage: 220 },
      { type: 'research', label: 'Análisis comparativo candidatos 2026' },
    ],
    risks: [
      'Financiación de educación pública universal requiere recursos masivos',
      'Calidad puede sacrificarse por cobertura si no hay inversión sostenida',
    ],
  },
  {
    candidateId: 'espriella',
    dimensionId: 'education',
    score: 3,
    summary:
      'Educación para ciudadanos autónomos, competitivos y patriotas. Enfoque en valores, competitividad individual y formación para el trabajo dentro del marco libertario.',
    keyProposals: [
      'Educación y valores: formar ciudadanos patriotas y competitivos',
      'Formación técnica y práctica orientada al empleo',
      'Articulación educación-empresa para inserción laboral rápida',
      'Libertad de elección educativa dentro del modelo libertario',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Plan Colombia Patria Milagro — Pilar 8', planPage: 4 },
    ],
    risks: [
      'Plan educativo poco detallado en el programa de gobierno',
      'Énfasis en valores patrióticos puede limitar pensamiento crítico',
    ],
  },
  {
    candidateId: 'valencia',
    dimensionId: 'education',
    score: 3,
    summary:
      'Libertad de elección y bonos educativos. 150.000 bonos para los más vulnerables, libre elección entre colegios públicos y privados, 1 millón de jóvenes formados en IA.',
    keyProposals: [
      '150.000 bonos educativos para los más vulnerables',
      'Libertad de elegir colegio público o privado',
      '1 millón de jóvenes formados en inteligencia artificial',
      'ICETEX reformado: créditos pagados solo cuando haya trabajo',
    ],
    sourceRefs: [
      { type: 'plan', label: '111 Puntos — Puntos 55-63', planPage: 10 },
    ],
    risks: [
      'Bonos educativos pueden desviar recursos de la educación pública',
      'Formación en IA para 1M de jóvenes requiere infraestructura inexistente',
    ],
  },
  {
    candidateId: 'fajardo',
    dimensionId: 'education',
    score: -1,
    summary:
      'Educación pública de calidad con enfoque STEAM. Transformar la escuela pública, fortalecer docentes, educación inclusiva, infraestructura digna y conectada en todo el territorio.',
    keyProposals: [
      'Enfoques STEAM en el currículo escolar con IA y tecnología',
      'Enseñanza de matemáticas como proyecto nacional',
      'Transformar el SENA: más estudiantes, mejor empleabilidad',
      'Recuperar el Icetex: créditos con pagos contingentes al ingreso',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Programa Fajardo — Educación', planPage: 21 },
    ],
    risks: [
      'Reforma curricular profunda es proceso de largo plazo, no se ve en un cuatrienio',
      'Múltiples frentes (STEAM, matemáticas, SENA, Icetex) pueden dispersar esfuerzos',
    ],
  },

  // ============================================================
  // 10. TECNOLOGÍA E IA — Conectividad básica vs. Estado digital con IA
  // ============================================================
  {
    candidateId: 'cepeda',
    dimensionId: 'technology',
    score: -2,
    summary:
      'Conectividad y soberanía tecnológica. Prioriza cerrar la brecha digital, llevar internet a territorios rurales, soberanía sobre datos y tecnología al servicio de lo público.',
    keyProposals: [
      'Conectividad para territorios rurales y comunidades apartadas',
      'Soberanía tecnológica: control nacional sobre infraestructura digital',
      'Tecnología al servicio de programas sociales y participación ciudadana',
      'Formación digital básica para comunidades vulnerables',
    ],
    sourceRefs: [
      { type: 'research', label: 'Análisis comparativo candidatos 2026' },
    ],
    risks: [
      'Enfoque de soberanía puede limitar adopción de tecnologías globales',
      'Poco detalle en transformación digital del Estado',
    ],
  },
  {
    candidateId: 'espriella',
    dimensionId: 'technology',
    score: 2,
    summary:
      'Tecnología de punta para seguridad y eficiencia estatal. Foco en tecnología militar e inteligencia, modernización del Estado con eficiencia, pero sin plan digital detallado.',
    keyProposals: [
      'Tecnología de punta e inteligencia para la Fuerza Pública',
      'Modernización tecnológica del Estado como máquina de resultados',
      'Auditorías digitales y transparencia total con tecnología',
      'Estado eficiente con estándares internacionales',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Plan Colombia Patria Milagro — Seguridad y Reforma', planPage: 5 },
    ],
    risks: [
      'Plan de tecnología centrado en seguridad, no en desarrollo digital amplio',
      'Sin plan específico de transformación digital para ciudadanos',
    ],
  },
  {
    candidateId: 'valencia',
    dimensionId: 'technology',
    score: 4,
    summary:
      'Estado digital con IA como política central. Plan Nacional de IA (PNIA), Estado plataforma con blockchain, IA en trámites públicos, centros de datos de bajo costo para IA global.',
    keyProposals: [
      'Plan Nacional de Inteligencia Artificial: Estado "AI first"',
      'IA para resolver trámites automáticamente (afiliaciones, renovaciones)',
      'Blockchain para títulos, contratación pública y trazabilidad',
      'Centros de datos y procesamiento para participar en revolución IA',
    ],
    sourceRefs: [
      { type: 'plan', label: '111 Puntos — Puntos 108-109', planPage: 18 },
      { type: 'plan', label: '111 Puntos — Punto 28', planPage: 7 },
    ],
    risks: [
      'Implementación de Estado "AI first" requiere inversión masiva en infraestructura',
      'Riesgo de exclusión digital de poblaciones sin acceso tecnológico',
    ],
  },
  {
    candidateId: 'fajardo',
    dimensionId: 'technology',
    score: 3,
    summary:
      'Transformación digital integral con Instituto Nacional de IA. Estado Digital 2030, Colombia Hub tech, Plan de Talento Digital, IA desde la educación media.',
    keyProposals: [
      'Instituto Nacional de Inteligencia Artificial y Ciencia de Datos',
      'Estado Digital 2030: conectividad total e interoperabilidad',
      'Colombia Hub regional de tecnología e inteligencia artificial',
      'Plan Nacional de Talento Digital: formación masiva en IA y programación',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Programa Fajardo — Ciencia, Tecnología e Innovación', planPage: 23 },
    ],
    risks: [
      'Crear un Instituto de IA desde cero toma años antes de generar impacto',
      'Múltiples programas tecnológicos pueden competir por los mismos recursos',
    ],
  },

  // ============================================================
  // 11. SALUD — Público sin intermediarios vs. Mixto público-privado
  // ============================================================
  {
    candidateId: 'cepeda',
    dimensionId: 'healthcare',
    score: -4,
    summary:
      'Sistema público sin intermediarios. Eliminar las EPS, sistema único público de salud, salud como derecho fundamental no sujeto a intermediación del sector privado.',
    keyProposals: [
      'Eliminación de las EPS como intermediarias del sistema',
      'Sistema único público de salud con cobertura universal',
      'Salud preventiva y comunitaria como base del modelo',
      'Fortalecimiento de la red pública hospitalaria',
    ],
    sourceRefs: [
      { type: 'research', label: 'Análisis comparativo candidatos 2026' },
    ],
    risks: [
      'Eliminación de EPS puede crear vacío operativo en la atención',
      'Sistema único público requiere capacidad estatal que hoy no existe',
    ],
  },
  {
    candidateId: 'espriella',
    dimensionId: 'healthcare',
    score: 2,
    summary:
      'Salud eficiente con autoridad y sin burocracia. $10 billones de plan de choque, APP para hospitales, intervención implacable a EPS ineficientes, prevención desde la infancia.',
    keyProposals: [
      'Plan de choque de $10 billones en los primeros 90 días',
      'Alianzas Público-Privadas (APP) para construir hospitales regionales',
      'Intervención técnica implacable a EPS que no cumplan',
      'Brigadas médicas móviles y telemedicina satelital para zonas rurales',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Plan Colombia Patria Milagro — Salud', planPage: 6 },
    ],
    risks: [
      'Origen de los $10B del plan de choque no está detallado',
      'APP en salud pueden priorizar rentabilidad sobre acceso universal',
    ],
  },
  {
    candidateId: 'valencia',
    dimensionId: 'healthcare',
    score: 2,
    summary:
      'Sistema mixto público-privado estabilizado. $9 billones de inyección, PMU 24/7, resolver 10M de atenciones represadas, telemedicina en zonas rurales, hospitales padrinos.',
    keyProposals: [
      'Inyección de $9 billones: $3B en medicamentos + $6B en deudas',
      'PMU presidencial 24/7 para coordinar la crisis',
      'Resolver 10 millones de atenciones represadas en 100 días',
      'Hospitales padrinos: especialistas llegan al campo, no al revés',
    ],
    sourceRefs: [
      { type: 'plan', label: '111 Puntos — Puntos 18-22', planPage: 5 },
    ],
    risks: [
      '$9B de inyección es medida de choque, no solución estructural',
      'Hospitales padrinos dependen de voluntad y capacidad de centros urbanos',
    ],
  },
  {
    candidateId: 'fajardo',
    dimensionId: 'healthcare',
    score: 0,
    summary:
      'Ordenar el sistema sin destruirlo. Fortalecer lo que funciona, corregir lo que falló. Modelo territorial con Atención Primaria en Salud, transparencia financiera, salud mental.',
    keyProposals: [
      'Plan de Recuperación del Sistema en los primeros 100 días',
      'Modelo territorial con Atención Primaria en Salud como base',
      'Reforma financiera: recalcular UPC con criterios técnicos',
      'Estrategia Nacional de Salud Mental con rutas ágiles para jóvenes',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Programa Fajardo — Salud', planPage: 8 },
    ],
    risks: [
      'Enfoque gradual puede ser insuficiente ante el colapso actual del sistema',
      'Reformar sin eliminar las EPS puede no resolver los problemas estructurales',
    ],
  },

  // ============================================================
  // 12. POSICIÓN FRENTE A PETRO — Continuismo vs. Oposición total
  // ============================================================
  {
    candidateId: 'cepeda',
    dimensionId: 'petro-stance',
    score: -5,
    summary:
      'Continuismo total. Candidato del Pacto Histórico, busca profundizar y completar las reformas del gobierno Petro. Defiende la Paz Total, la reforma agraria y el modelo social.',
    keyProposals: [
      'Profundizar las reformas del gobierno Petro que quedaron inconclusas',
      'Continuar y fortalecer la Paz Total y los diálogos con grupos armados',
      'Mantener y expandir los programas sociales del gobierno actual',
      'Defender la JEP y la justicia transicional como legado',
    ],
    sourceRefs: [
      { type: 'research', label: 'Análisis comparativo candidatos 2026' },
    ],
    risks: [
      'Hereda el desgaste y los errores del gobierno actual',
      'Continuismo puede ser rechazado por votantes que quieren cambio',
    ],
  },
  {
    candidateId: 'espriella',
    dimensionId: 'petro-stance',
    score: 5,
    summary:
      'Oposición total y radical. Propone desmontar completamente el modelo del gobierno Petro: eliminar la JEP, revertir reformas, reducir el Estado y aplicar un modelo opuesto.',
    keyProposals: [
      'Eliminar la JEP y tribunales de justicia transicional',
      'Revertir todas las reformas del gobierno Petro',
      'Reducir el Estado en 40% (opuesto a la expansión de Petro)',
      'Modelo de seguridad opuesto: mano dura vs. Paz Total',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Plan Colombia Patria Milagro — Justicia', planPage: 8 },
      { type: 'research', label: 'Análisis comparativo candidatos 2026' },
    ],
    risks: [
      'Desmontar la JEP requiere reforma constitucional y genera conflicto jurídico',
      'Reversión radical puede generar inestabilidad institucional',
    ],
  },
  {
    candidateId: 'valencia',
    dimensionId: 'petro-stance',
    score: 4,
    summary:
      'Oposición fuerte e institucional. Desactivar las "5 bombas" heredadas del gobierno Petro: seguridad, salud, energía, confianza y corrupción. Cambio de rumbo sin ruptura institucional.',
    keyProposals: [
      'Desactivar 5 bombas dejadas por el gobierno actual',
      'Recuperar la confianza inversionista perdida en el gobierno Petro',
      'Reactivar exploración de hidrocarburos que Petro frenó',
      'Restaurar relaciones internacionales deterioradas',
    ],
    sourceRefs: [
      { type: 'plan', label: '111 Puntos — Sección "Orden y Firmeza"', planPage: 2 },
      { type: 'research', label: 'Análisis comparativo candidatos 2026' },
    ],
    risks: [
      'Narrativa de "bombas" puede ser percibida como catastrofista',
      'Oposición fuerte puede dificultar gobernabilidad si hereda coaliciones de Petro',
    ],
  },
  {
    candidateId: 'fajardo',
    dimensionId: 'petro-stance',
    score: 2,
    summary:
      'Crítico moderado que busca corregir el rumbo. Reconoce errores del gobierno Petro sin negar todo. Propone recuperar lo perdido con método, seriedad y sin extremos.',
    keyProposals: [
      'Corregir el rumbo sin repetir los errores del gobierno actual',
      'Recuperar sectores en crisis por improvisación y falta de planeación',
      'Institucionalidad seria: no gobernar con ideología sino con evidencia',
      'Ni continuismo ni destrucción: cambio serio y seguro',
    ],
    sourceRefs: [
      { type: 'plan', label: 'Programa Fajardo — Introducción', planPage: 3 },
    ],
    risks: [
      'Posición moderada puede no satisfacer a quienes quieren ruptura total',
      'Riesgo de ser percibido como tibio por ambos lados del espectro',
    ],
  },
];

export const positionMap = new Map<string, CandidatePosition>();
for (const p of positions) {
  positionMap.set(`${p.candidateId}-${p.dimensionId}`, p);
}

export function getPosition(
  candidateId: string,
  dimensionId: string
): CandidatePosition | undefined {
  return positionMap.get(`${candidateId}-${dimensionId}`);
}

export function getCandidatePositions(candidateId: string): CandidatePosition[] {
  return positions.filter((p) => p.candidateId === candidateId);
}

export function getDimensionPositions(dimensionId: string): CandidatePosition[] {
  return positions.filter((p) => p.dimensionId === dimensionId);
}
