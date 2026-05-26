import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ElectionCountdown } from '@/components/landing/election-countdown';
import { CandidatePreviewCard } from '@/components/landing/candidate-preview-card';
import { candidates } from '@/data/candidates';
import { BarChart3, CheckCircle, Newspaper, Users } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:py-24">
          <div className="text-center">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
              Elecciones Presidenciales Colombia 2026
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Vota{' '}
              <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">
                Informado
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100 sm:text-xl">
              Compara propuestas, descubre tu afinidad y decide con claridad. Herramienta ciudadana
              100% no-partidista.
            </p>

            <div className="mt-8 flex justify-center">
              <ElectionCountdown />
            </div>
            <p className="mt-3 text-sm text-blue-200">Primera vuelta: 31 de mayo de 2026</p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/quiz">
                <Button size="lg" className="bg-amber-500 text-gray-900 hover:bg-amber-400">
                  Hacer el Quiz de Afinidad
                </Button>
              </Link>
              <Link href="/comparar">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Comparar Candidatos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: BarChart3,
                title: 'Comparador visual',
                desc: '12 dimensiones para comparar a los 4 candidatos de manera clara y objetiva.',
              },
              {
                icon: CheckCircle,
                title: 'Quiz de afinidad',
                desc: '12 preguntas para descubrir con qué candidato tienes más afinidad.',
              },
              {
                icon: Users,
                title: 'Perfiles completos',
                desc: 'Propuestas, fuentes y planes de gobierno de cada candidato.',
              },
              {
                icon: Newspaper,
                title: 'Noticias en tiempo real',
                desc: 'Rastreo automatizado de medios verificados cada 5 horas.',
              },
            ].map((feature) => (
              <div key={feature.title} className="rounded-xl bg-white p-5 shadow-sm">
                <feature.icon className="h-8 w-8 text-blue-600" />
                <h3 className="mt-3 font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Candidates Section */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Los 4 candidatos principales
            </h2>
            <p className="mt-2 text-gray-500">
              Primera vuelta presidencial — 31 de mayo de 2026
            </p>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {candidates.map((candidate) => (
              <CandidatePreviewCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 py-12 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            No votes a ciegas. Vota informado.
          </h2>
          <p className="mt-3 text-blue-200">
            Responde 12 preguntas y descubre cuál candidato se alinea más con tus ideas.
          </p>
          <Link href="/quiz" className="mt-6 inline-block">
            <Button size="lg" className="bg-amber-500 text-gray-900 hover:bg-amber-400">
              Comenzar el Quiz
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
