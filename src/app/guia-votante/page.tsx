import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Calendar,
  Users,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Guía del Votante — Todo lo que necesitas saber',
  description:
    'Guía práctica para votar en las elecciones presidenciales de Colombia 2026: documentos, horarios, puestos de votación y preguntas frecuentes.',
};

const faqs = [
  {
    q: '¿Puedo votar con la cédula vencida?',
    a: 'Sí. Según la Registraduría Nacional, la cédula de ciudadanía es válida para votar incluso si está vencida. Lo importante es que el documento sea original.',
  },
  {
    q: '¿Qué pasa si no aparezco en el censo electoral?',
    a: 'Puedes consultar tu puesto de votación en la web de la Registraduría (registraduria.gov.co) o llamando al 018000112286. Si no apareces, acércate a la registraduría de tu municipio.',
  },
  {
    q: '¿Puedo votar si estoy en el extranjero?',
    a: 'Sí, si inscribiste tu cédula en un consulado colombiano. Los colombianos en el exterior votan en consulados y embajadas. Consulta las fechas y horarios locales.',
  },
  {
    q: '¿Puedo llevar mi celular al puesto de votación?',
    a: 'Sí, puedes llevar tu celular, pero está prohibido tomar fotos del tarjetón dentro del cubículo de votación.',
  },
  {
    q: '¿Qué pasa si me equivoco al marcar?',
    a: 'Si marcas más de un candidato o marcas fuera de los recuadros, tu voto será nulo. No puedes pedir un nuevo tarjetón. Marca con cuidado.',
  },
  {
    q: '¿Es obligatorio votar en Colombia?',
    a: 'No. El voto en Colombia es un derecho, no una obligación. Sin embargo, votar te da el certificado electoral que otorga beneficios como descuentos en trámites, medio día libre laboral y prioridad en becas.',
  },
  {
    q: '¿Qué es el voto en blanco?',
    a: 'El voto en blanco es una opción válida y legítima. Si el voto en blanco supera a todos los candidatos, se deben repetir las elecciones con candidatos diferentes (Artículo 258, Constitución).',
  },
  {
    q: '¿Hay segunda vuelta?',
    a: 'Sí, si ningún candidato obtiene más del 50% de los votos en primera vuelta (31 de mayo), habrá segunda vuelta el 21 de junio entre los dos candidatos más votados.',
  },
];

export default function GuiaVotantePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Guía Práctica del Votante
        </h1>
        <p className="mt-2 text-gray-500">
          Todo lo que necesitas saber para votar el 31 de mayo de 2026.
        </p>
      </div>

      <div className="space-y-6">
        {/* Key dates */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-teal-600" />
              Fechas clave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg bg-teal-50 p-3">
                <span className="text-2xl font-bold text-teal-700">31</span>
                <div>
                  <p className="font-semibold text-gray-900">
                    Mayo 2026 — Primera vuelta
                  </p>
                  <p className="text-sm text-gray-500">
                    Elección entre los 4 candidatos presidenciales
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
                <span className="text-2xl font-bold text-gray-400">21</span>
                <div>
                  <p className="font-semibold text-gray-900">
                    Junio 2026 — Segunda vuelta (si aplica)
                  </p>
                  <p className="text-sm text-gray-500">
                    Solo si ningún candidato supera el 50% en primera vuelta
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What to bring */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-teal-600" />
              ¿Qué llevar?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <span className="text-sm text-gray-700">
                  <strong>Cédula de ciudadanía original</strong> — no se
                  aceptan copias, contraseñas ni pasaportes
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                <span className="text-sm text-gray-700">
                  La cédula sirve aunque esté vencida
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                <span className="text-sm text-gray-700">
                  <strong>No llevar:</strong> armas, propaganda electoral, ni
                  bebidas alcohólicas
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-teal-600" />
              Horario de votación
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700">
            <p>
              Los puestos de votación abren a las{' '}
              <strong>8:00 a.m.</strong> y cierran a las{' '}
              <strong>4:00 p.m.</strong> hora colombiana (UTC-5).
            </p>
            <p className="mt-2">
              Si estás en la fila antes de las 4:00 p.m., tienes derecho a
              votar aunque la fila avance después de la hora de cierre.
            </p>
            <div className="mt-3 rounded-lg bg-gray-50 p-3">
              <p className="text-xs font-medium uppercase text-gray-400">
                Beneficio por votar temprano
              </p>
              <p className="text-sm text-gray-600">
                El certificado electoral te da medio día libre laboral,
                descuentos en trámites de notaría, matrícula universitaria,
                pasaporte, y prioridad en becas del ICETEX.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Where to vote */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-teal-600" />
              ¿Dónde votar?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-700">
            <p>Consulta tu puesto de votación con tu número de cédula:</p>
            <div className="mt-3 space-y-2">
              <a
                href="https://wsp.registraduria.gov.co/censo/consultar/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border p-3 transition-colors hover:bg-gray-50"
              >
                <MapPin className="h-4 w-4 text-teal-600" />
                <div>
                  <p className="font-medium text-gray-900">
                    Consultar puesto de votación
                  </p>
                  <p className="text-xs text-gray-400">
                    registraduria.gov.co — servicio oficial
                  </p>
                </div>
              </a>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs">
                  <strong>Por teléfono:</strong> Línea gratuita 018000112286
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to vote */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-600" />
              ¿Cómo votar? Paso a paso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm text-gray-700">
              {[
                'Llega a tu puesto de votación y ubica tu mesa según el último dígito de tu cédula.',
                'Presenta tu cédula de ciudadanía original al jurado.',
                'Recibe el tarjetón electoral y dirígete al cubículo de votación.',
                'Marca con una X dentro del recuadro del candidato de tu preferencia. También puedes votar en blanco.',
                'Dobla el tarjetón y deposítalo en la urna.',
                'Firma el formulario E-11 y sumerge tu dedo meñique en la tinta indeleble.',
                'Recibe tu certificado electoral. ¡Listo!',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-teal-600" />
              Preguntas frecuentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i}>
                <p className="text-sm font-semibold text-gray-900">{faq.q}</p>
                <p className="mt-1 text-sm text-gray-600">{faq.a}</p>
                {i < faqs.length - 1 && <hr className="mt-3 border-gray-100" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* CTAs */}
      <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link href="/quiz">
          <Button
            size="lg"
            className="bg-teal-500 text-white hover:bg-teal-400"
          >
            ¿No sabes por quién votar? Descubre tu Afinidad
          </Button>
        </Link>
        <Link href="/resumen">
          <Button size="lg" variant="outline">
            Ver resumen de candidatos
          </Button>
        </Link>
      </div>
    </div>
  );
}
