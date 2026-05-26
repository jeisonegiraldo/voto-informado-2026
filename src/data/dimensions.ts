import type { Dimension } from '@/types/dimension';

export const dimensions: Dimension[] = [
  {
    id: 'ideology',
    name: 'Ideología',
    description: 'Posición en el espectro político izquierda-derecha',
    icon: 'Compass',
    spectrumLabels: ['Izquierda', 'Derecha'],
  },
  {
    id: 'economic-model',
    name: 'Modelo económico',
    description: 'Visión sobre el rol del Estado en la economía',
    icon: 'TrendingUp',
    spectrumLabels: ['Intervención estatal', 'Libre mercado'],
  },
  {
    id: 'tax-policy',
    name: 'Política tributaria',
    description: 'Impuestos a empresas, patrimonio y carga fiscal',
    icon: 'Receipt',
    spectrumLabels: ['Más impuestos progresivos', 'Menos impuestos'],
  },
  {
    id: 'state-size',
    name: 'Tamaño del Estado',
    description: 'Ampliar, modernizar o reducir el aparato estatal',
    icon: 'Building2',
    spectrumLabels: ['Estado más grande', 'Estado más pequeño'],
  },
  {
    id: 'foreign-investment',
    name: 'Inversión extranjera',
    description: 'Apertura y condiciones para inversionistas internacionales',
    icon: 'Globe',
    spectrumLabels: ['Selectiva con condiciones', 'Abierta y liberal'],
  },
  {
    id: 'security',
    name: 'Seguridad',
    description: 'Estrategia frente al conflicto armado y la inseguridad',
    icon: 'Shield',
    spectrumLabels: ['Diálogo y paz', 'Mano dura militar'],
  },
  {
    id: 'drug-policy',
    name: 'Política antidrogas',
    description: 'Enfoque para combatir los cultivos de coca y el narcotráfico',
    icon: 'Leaf',
    spectrumLabels: ['Sustitución voluntaria', 'Fumigación aérea'],
  },
  {
    id: 'family-values',
    name: 'Familia y valores',
    description: 'Visión sobre familia, género y diversidad en la sociedad',
    icon: 'Heart',
    spectrumLabels: ['Enfoque de género y diversidad', 'Familia tradicional y fe'],
  },
  {
    id: 'education',
    name: 'Educación',
    description: 'Modelo educativo y prioridades de formación',
    icon: 'GraduationCap',
    spectrumLabels: ['Pública universal', 'Bonos y libre elección'],
  },
  {
    id: 'technology',
    name: 'Tecnología e IA',
    description: 'Transformación digital del Estado e innovación tecnológica',
    icon: 'Cpu',
    spectrumLabels: ['Conectividad básica', 'Estado digital con IA'],
  },
  {
    id: 'healthcare',
    name: 'Salud',
    description: 'Sistema de salud: público, privado o mixto',
    icon: 'Stethoscope',
    spectrumLabels: ['Público sin intermediarios', 'Mixto público-privado'],
  },
  {
    id: 'petro-stance',
    name: 'Posición frente a Petro',
    description: 'Continuidad o cambio respecto al gobierno actual',
    icon: 'ArrowLeftRight',
    spectrumLabels: ['Continuismo', 'Oposición total'],
  },
];

export const dimensionMap = Object.fromEntries(
  dimensions.map((d) => [d.id, d])
) as Record<string, Dimension>;
