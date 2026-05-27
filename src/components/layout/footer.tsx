import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50/50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="font-extrabold text-gray-900">
              Voto<span className="text-teal-600">Informado</span>
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
                { href: '/quiz', label: 'Quiz de afinidad' },
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
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-gray-400">
              Fuentes: planes de gobierno oficiales, medios verificados (El Tiempo, Semana, La Silla
              Vacía, Blu Radio, RCN, Caracol).
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-200/60 pt-5 text-center text-xs text-gray-400">
          Este sitio no tiene filiación con ningún partido ni candidato. Primera vuelta: 31 de mayo
          de 2026.
        </div>
      </div>
    </footer>
  );
}
