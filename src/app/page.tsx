import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ElectionCountdown } from '@/components/landing/election-countdown';
import { CandidatePreviewCard } from '@/components/landing/candidate-preview-card';
import { candidates } from '@/data/candidates';
import {
  BarChart3,
  CheckCircle,
  Newspaper,
  Users,
  ArrowRight,
  Shield,
  Search,
  MessageSquare,
  Compass,
} from 'lucide-react';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
        {/* Animated grid pattern */}
        <div className="bg-grid-pattern absolute inset-0" />
        {/* Radial glow */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:py-28 lg:py-32">
          <div className="text-center">
            <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-teal-300 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
              Elecciones Presidenciales Colombia 2026
            </span>

            <h1 className="animate-fade-up-delay-1 mt-6 text-4xl font-extrabold tracking-tight text-white sm:mt-8 sm:text-6xl lg:text-7xl">
              Vota{' '}
              <span className="text-gradient-teal">
                Informado
              </span>
            </h1>

            <p className="animate-fade-up-delay-2 mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:mt-6 sm:text-xl">
              Compara propuestas, descubre tu afinidad y decide con claridad.
              Herramienta ciudadana 100% no-partidista.
            </p>

            <div className="animate-fade-up-delay-3 mt-8 flex justify-center sm:mt-10">
              <ElectionCountdown />
            </div>
            <p className="mt-3 text-sm font-medium text-slate-500">
              Primera vuelta: 31 de mayo de 2026
            </p>

            <div className="animate-fade-up-delay-4 mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
              <Link href="/brujula" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="group relative w-full overflow-hidden bg-gradient-to-r from-teal-500 to-emerald-500 px-8 text-white shadow-lg shadow-teal-500/25 transition-all hover:shadow-xl hover:shadow-teal-500/30 hover:brightness-110 sm:w-auto"
                >
                  🧭 Brújula Electoral &ldquo;A Ciegas&rdquo;
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/comparar" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-white/20 bg-white/5 text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30 sm:w-auto"
                >
                  Comparar Candidatos
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 56h1440V28C1320 8 1200 0 1080 8 960 16 840 40 720 44 600 48 480 32 360 24 240 16 120 16 60 20L0 24v32z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Todo lo que necesitas para decidir
            </h2>
            <p className="mt-2 text-gray-500">
              Herramientas objetivas y datos verificados, sin favorecer a nadie.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Compass,
                title: 'Brújula "A Ciegas"',
                desc: '20 propuestas sin nombres. Descubre tu candidato basándote solo en ideas.',
                href: '/brujula',
                gradient: 'from-teal-500 to-emerald-500',
                badge: 'Popular',
              },
              {
                icon: BarChart3,
                title: 'Comparador visual',
                desc: '12 dimensiones para comparar a los 4 candidatos de manera clara y objetiva.',
                href: '/comparar',
                gradient: 'from-slate-700 to-slate-900',
              },
              {
                icon: CheckCircle,
                title: 'Quiz de Afinidad',
                desc: '12 preguntas para descubrir tu afinidad ideológica con cada candidato.',
                href: '/quiz',
                gradient: 'from-violet-500 to-purple-600',
              },
              {
                icon: Users,
                title: 'Perfiles completos',
                desc: 'Propuestas, fuentes y planes de gobierno de cada candidato.',
                href: '/candidatos',
                gradient: 'from-amber-500 to-orange-500',
              },
            ].map((feature) => (
              <Link key={feature.title} href={feature.href}>
                <div className="group relative h-full rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-200">
                  {'badge' in feature && feature.badge && (
                    <span className="absolute -top-2 right-4 rounded-full bg-rose-500 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm">
                      {feature.badge}
                    </span>
                  )}
                  <div className={`inline-flex rounded-xl bg-gradient-to-br ${feature.gradient} p-2.5`}>
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="mt-4 font-bold text-gray-900 group-hover:text-teal-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{feature.desc}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Secondary tools row */}
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Shield,
                title: 'Verificador',
                desc: 'Comprueba si lo que dicen coincide con sus planes.',
                href: '/verificador',
              },
              {
                icon: Search,
                title: 'Buscar por tema',
                desc: 'Compara la postura de cada candidato al instante.',
                href: '/buscar',
              },
              {
                icon: MessageSquare,
                title: 'Chat con IA',
                desc: 'Pregunta lo que quieras sobre candidatos y propuestas.',
                href: '/chat',
              },
              {
                icon: Newspaper,
                title: 'Noticias',
                desc: 'Rastreo automatizado de medios verificados.',
                href: '/noticias',
              },
            ].map((tool) => (
              <Link key={tool.title} href={tool.href}>
                <div className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-gray-200">
                  <div className="rounded-lg bg-gray-100 p-2 transition-colors group-hover:bg-teal-50">
                    <tool.icon className="h-5 w-5 text-gray-500 transition-colors group-hover:text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{tool.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Candidates Section */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Los 4 candidatos principales
            </h2>
            <p className="mt-2 text-gray-500">
              Primera vuelta presidencial — 31 de mayo de 2026
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {candidates.map((candidate) => (
              <CandidatePreviewCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 sm:py-20">
        <div className="bg-grid-pattern absolute inset-0" />
        <div className="absolute right-0 top-0 h-[300px] w-[400px] rounded-full bg-teal-500/10 blur-3xl" />
        <div className="relative mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            No votes a ciegas.
            <br />
            <span className="text-gradient-teal">Vota informado.</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Descubre tu candidato ideal basándote solo en propuestas — sin nombres ni colores.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/brujula">
              <Button
                size="lg"
                className="group w-full bg-gradient-to-r from-teal-500 to-emerald-500 px-8 text-white shadow-lg shadow-teal-500/25 transition-all hover:shadow-xl hover:shadow-teal-500/30 hover:brightness-110 sm:w-auto"
              >
                Brújula "A Ciegas"
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/quiz">
              <Button
                size="lg"
                variant="outline"
                className="w-full border-white/20 bg-white/5 text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/30 sm:w-auto"
              >
                Quiz de Afinidad
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
