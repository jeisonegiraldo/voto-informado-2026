import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">VotoInformado 2026</h3>
            <p className="mt-2 text-sm text-gray-500">
              Herramienta ciudadana no-partidista para comparar candidatos y votar informado en las
              elecciones presidenciales de Colombia 2026.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Explorar</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="/comparar" className="text-sm text-gray-500 hover:text-gray-900">
                  Comparador
                </Link>
              </li>
              <li>
                <Link href="/candidatos" className="text-sm text-gray-500 hover:text-gray-900">
                  Candidatos
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-sm text-gray-500 hover:text-gray-900">
                  Quiz de afinidad
                </Link>
              </li>
              <li>
                <Link href="/noticias" className="text-sm text-gray-500 hover:text-gray-900">
                  Noticias
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Transparencia</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="/metodologia" className="text-sm text-gray-500 hover:text-gray-900">
                  Metodología
                </Link>
              </li>
            </ul>
            <p className="mt-4 text-xs text-gray-400">
              Fuentes: planes de gobierno oficiales, medios verificados (El Tiempo, Semana, La Silla
              Vacía, Blu Radio, RCN, Caracol).
            </p>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-xs text-gray-400">
          Este sitio no tiene filiación con ningún partido ni candidato. Primera vuelta: 31 de mayo
          de 2026.
        </div>
      </div>
    </footer>
  );
}
