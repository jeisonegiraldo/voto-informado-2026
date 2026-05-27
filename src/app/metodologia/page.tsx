import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dimensions } from '@/data/dimensions';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Metodología',
  description:
    'Cómo funciona VotaInformado 2026: fuentes, algoritmo del quiz, dimensiones de comparación y principios de neutralidad.',
};

export default function MetodologiaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Metodología</h1>
      <p className="mt-2 text-gray-500">
        Transparencia total: así funciona VotaInformado 2026.
      </p>

      <div className="mt-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Principios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <p>
              <strong>No-partidista:</strong> Este sitio no tiene filiación con ningún partido,
              candidato ni movimiento político. Su único propósito es que los ciudadanos colombianos
              tengan información clara para votar.
            </p>
            <p>
              <strong>Basado en fuentes oficiales:</strong> Toda la información proviene de los
              planes de gobierno oficiales inscritos ante la Registraduría y de medios de
              comunicación verificados.
            </p>
            <p>
              <strong>Código abierto:</strong> La metodología del quiz, las fuentes de datos y el
              algoritmo de puntuación son completamente transparentes y están documentados aquí.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fuentes de datos</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700">
            <ul className="space-y-2">
              <li>
                <strong>Planes de gobierno:</strong> Documentos oficiales descargados de la
                Registraduría Nacional (4 candidatos, total 522 páginas analizadas).
              </li>
              <li>
                <strong>Medios verificados:</strong> El Tiempo, Semana, La Silla Vacía, Blu Radio,
                RCN, Caracol.
              </li>
              <li>
                <strong>Actualización:</strong> Las noticias se rastrean automáticamente cada 5
                horas con resúmenes generados por IA.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>12 dimensiones de comparación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 sm:grid-cols-2">
              {dimensions.map((dim) => (
                <div key={dim.id} className="rounded-lg bg-gray-50 p-3">
                  <p className="text-sm font-semibold text-gray-800">{dim.name}</p>
                  <p className="text-xs text-gray-500">{dim.description}</p>
                  <div className="mt-1 flex justify-between text-[10px] text-gray-400">
                    <span>{dim.spectrumLabels[0]}</span>
                    <span>{dim.spectrumLabels[1]}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Algoritmo del Quiz de Afinidad</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <p>El quiz tiene 12 preguntas, una por cada dimensión de comparación.</p>
            <p>
              <strong>Cada pregunta tiene 4 opciones</strong> que reflejan posiciones reales de los
              candidatos, sin nombrarlos. El lenguaje es neutro y accesible.
            </p>
            <p>
              <strong>Puntuación:</strong> Cada opción tiene un puntaje oculto de alineación por
              candidato (0 a 3), donde 3 = máxima alineación y 0 = nula alineación.
            </p>
            <p>
              <strong>Fórmula:</strong> Porcentaje de afinidad = (puntaje obtenido / puntaje máximo
              posible) &times; 100. Si respondiste las 12 preguntas, el máximo posible por candidato
              es 36 (12 &times; 3).
            </p>
            <p>
              <strong>Todas las preguntas pesan igual.</strong> No hay ponderaciones ocultas.
            </p>
            <p>
              <strong>Las preguntas omitidas se excluyen</strong> del cálculo. El máximo posible se
              ajusta al número de preguntas respondidas.
            </p>
            <p>
              <strong>El resultado muestra TODOS los candidatos,</strong> no solo el de mayor
              afinidad. Esto permite ver el panorama completo.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Posiciones de los candidatos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <p>
              Cada candidato tiene una posición en cada dimensión, expresada como un puntaje de -5 a
              +5 en el espectro correspondiente. Estas posiciones fueron extraídas directamente de
              los planes de gobierno oficiales.
            </p>
            <p>
              Cada posición incluye: resumen, propuestas clave con citas del plan de gobierno,
              fuentes verificables, y riesgos o críticas identificados para balance editorial.
            </p>
          </CardContent>
        </Card>

        <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">🔍</span>
              Transparencia Algorítmica (IA)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <p>
              La IA de VotaInformado opera bajo instrucciones estrictas de neutralidad que son
              <strong> públicas y auditables</strong>. Publicamos textualmente los
              &ldquo;System Prompts&rdquo; — las instrucciones que recibe cada componente de IA.
            </p>
            <p>
              Hay 5 componentes de IA en la plataforma: Chat Electoral, Verificador de
              Afirmaciones, Buscador por Tema, Resumidor de Noticias y Clasificador de Peticiones.
              Todos tienen prohibido recomendar candidatos o tomar posición ideológica.
            </p>
            <p>
              <strong>Audita tú mismo:</strong> El documento completo con todos los prompts,
              las reglas de neutralidad y la guía de auditoría está disponible en el repositorio
              público:
            </p>
            <a
              href="https://github.com/jeisonegiraldo/voto-informado-2026/blob/main/TRANSPARENCY.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-teal-500"
            >
              Ver Transparencia Algorítmica en GitHub
              <span aria-hidden="true">&rarr;</span>
            </a>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-lg">🤝</span>
              Código Abierto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <p>
              Todo el código fuente de VotaInformado es público. Cualquier persona puede auditar
              la lógica, los datos, los algoritmos y las instrucciones de la IA.
            </p>
            <p>
              Si eres programador y quieres contribuir (mejorar diseño, corregir datos, agregar
              funcionalidades), consulta la guía de contribución en el repositorio.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://github.com/jeisonegiraldo/voto-informado-2026"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Repositorio en GitHub
              </a>
              <a
                href="https://github.com/jeisonegiraldo/voto-informado-2026/blob/main/CONTRIBUTING.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Guía de Contribución
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-400">
          <p>
            Si encuentras un error o sesgo, por favor repórtalo. La herramienta se mejora con la
            participación ciudadana.
          </p>
          <p className="mt-2">
            <Link href="/comparar" className="text-teal-600 underline">
              Ir al comparador
            </Link>{' '}
            &middot;{' '}
            <Link href="/quiz" className="text-teal-600 underline">
              Hacer el quiz
            </Link>{' '}
            &middot;{' '}
            <Link href="/brujula" className="text-teal-600 underline">
              Brújula a ciegas
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
