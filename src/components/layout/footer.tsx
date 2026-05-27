import Link from 'next/link';
import { ShareInvite } from '@/components/shared/share-invite';

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="font-extrabold text-gray-900">
              Vota<span className="text-teal-600">Informado</span>
              <span className="ml-1.5 text-xs font-bold text-gray-400">2026</span>
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              Herramienta ciudadana no-partidista para comparar candidatos y votar informado en las
              elecciones presidenciales de Colombia 2026.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Explorar</h3>
            <ul className="mt-3 space-y-2">
              {[
                { href: '/resumen', label: 'Resumen ejecutivo' },
                { href: '/comparar', label: 'Comparador' },
                { href: '/quiz', label: 'Descubre tu Afinidad' },
                { href: '/verificador', label: 'Verificador' },
                { href: '/buscar', label: 'Buscar por tema' },
                { href: '/guia-votante', label: 'Guía del votante' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 transition-colors hover:text-teal-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Transparencia
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/metodologia"
                  className="text-sm text-gray-500 transition-colors hover:text-teal-600"
                >
                  Metodología
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/jeisonegiraldo/voto-informado-2026"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-teal-600"
                >
                  <GitHubIcon className="h-4 w-4" />
                  Código abierto
                </a>
              </li>
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-gray-400">
              ¿Error en los datos o sesgo?{' '}
              <a
                href="mailto:contacto@votainformadoco.org"
                className="text-teal-600 hover:underline"
              >
                contacto@votainformadoco.org
              </a>
            </p>
            <p className="mt-1 text-xs leading-relaxed text-gray-400">
              Fuentes: planes de gobierno oficiales, medios verificados.
            </p>
          </div>
        </div>

        {/* Share invite */}
        <div className="mt-8">
          <ShareInvite
            url="https://votainformadoco.org"
            shareText="🗳️ Conoce las propuestas de los candidatos presidenciales de Colombia 2026. Compara, descubre tu afinidad y vota informado."
            shareTitle="VotaInformado 2026"
            heading="Comparte con amigos y familiares"
            subheading="Que todos puedan comparar candidatos y votar informados. Comparte esta herramienta."
          />
        </div>

        {/* GitHub contribution banner */}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900">
              <GitHubIcon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">
                Este proyecto es de código abierto
              </p>
              <p className="mt-0.5 text-xs text-gray-500">
                Cualquier ciudadano puede auditar los datos, el algoritmo y los prompts de IA.
                Las contribuciones son bienvenidas.
              </p>
            </div>
            <a
              href="https://github.com/jeisonegiraldo/voto-informado-2026"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
            >
              <GitHubIcon className="h-4 w-4" />
              Ver en GitHub
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200/60 pt-5 text-center text-xs text-gray-400">
          Este sitio no tiene filiación con ningún partido ni candidato. Primera vuelta: 31 de mayo
          de 2026.
        </div>
      </div>
    </footer>
  );
}
