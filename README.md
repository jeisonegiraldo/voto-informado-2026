# VotaInformado 2026

Herramienta ciudadana no-partidista para las elecciones presidenciales de Colombia 2026.

**[votainformadoco.org](https://votainformadoco.org)**

---

## Objetivo

Ayudar a los ciudadanos colombianos a tomar decisiones electorales informadas, comparando candidatos de forma objetiva y transparente. Sin filiacion con ningun partido ni candidato.

## Funcionalidades

| Feature | Descripcion |
|---------|-------------|
| **Brujula Electoral "A Ciegas"** | Pool de 40 propuestas reales (10 por candidato). Cada sesion presenta 20 al azar, sin nombres ni colores. Descubre tu candidato basandote solo en ideas. |
| **Comparador Visual** | 12 dimensiones de comparacion con espectros interactivos y propuestas detalladas. |
| **Descubre tu Afinidad** | 12 preguntas para descubrir con cual candidato coincides mas. |
| **Chat IA** | Asistente electoral basado en planes de gobierno oficiales. |
| **Verificador** | Comprueba si afirmaciones de candidatos coinciden con sus planes. |
| **Buscador por Tema** | Busca un tema y compara la postura de cada candidato al instante. |
| **Buzon Ciudadano** | Muro publico de peticiones y comentarios a candidatos. |
| **Noticias** | Rastreo automatizado de medios verificados cada 5 horas. |

## Candidatos (Primera Vuelta - 31 de mayo de 2026)

- **Ivan Cepeda** (Pacto Historico) - Izquierda
- **Abelardo de la Espriella** (Defensores de la Patria) - Derecha
- **Paloma Valencia** (Centro Democratico) - Centro-derecha
- **Sergio Fajardo** (Dignidad y Compromiso) - Centro

## Stack Tecnico

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Estilos:** Tailwind CSS v4 + shadcn/ui
- **Animaciones:** Framer Motion
- **IA:** Claude API (Anthropic) para chat, resumenes y verificacion
- **Base de datos:** Vercel KV (Redis) para noticias y peticiones
- **Hosting:** Vercel
- **Fuentes:** Inter + Plus Jakarta Sans

## Datos y Fuentes

Toda la informacion proviene de:

- **Planes de gobierno oficiales** de cada candidato (PDFs en `public/planes_gobierno/`)
- **Medios verificados:** El Tiempo, Semana, La Silla Vacia, Blu Radio, RCN, Caracol
- **Datos publicos** del Registraduria y CNE

Los datos de posiciones (`src/data/positions.ts`) son el nucleo de la app y fueron extraidos directamente de los planes de gobierno con citas y referencias.

## Principios de Neutralidad

1. **Orden alfabetico o aleatorio** — ningun candidato aparece primero sistematicamente
2. **Colores institucionales** — cada candidato usa el color de su partido, no colores valorativos
3. **Misma estructura** — todos los perfiles tienen el mismo layout y profundidad
4. **Test transparente** — la metodologia y formula estan en `/metodologia`
5. **Brujula sin sesgo** — 40 propuestas anonimas con seleccion aleatoria de 20 por sesion, verificada con 10,000 simulaciones estadisticas
6. **Codigo abierto** — cualquiera puede auditar la logica, los datos y el algoritmo
7. **Transparencia algoritmica** — todos los prompts de IA son publicos. Ver [TRANSPARENCY.md](TRANSPARENCY.md)

## Ejecutar Localmente

```bash
# Clonar
git clone https://github.com/jeisonegiraldo/voto-informado-2026.git
cd voto-informado-2026

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus API keys

# Ejecutar
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Variables de Entorno

| Variable | Descripcion | Requerida |
|----------|-------------|-----------|
| `ANTHROPIC_API_KEY` | API key de Anthropic para chat y IA | Si (para chat/verificador) |
| `KV_REST_API_URL` | URL de Upstash Redis | Si (para noticias/peticiones) |
| `KV_REST_API_TOKEN` | Token de Upstash Redis | Si (para noticias/peticiones) |
| `CRON_SECRET` | Secret para autenticar cron jobs | Si (para scraping noticias) |
| `NEXT_PUBLIC_BASE_URL` | URL base del sitio | No (default: votainformadoco.org) |
| `NEXT_PUBLIC_SENTRY_DSN` | DSN de Sentry para error monitoring | No (desactiva Sentry si falta) |
| `SENTRY_ORG` | Organizacion de Sentry | No |
| `SENTRY_PROJECT` | Proyecto de Sentry | No |
| `SENTRY_AUTH_TOKEN` | Auth token de Sentry para sourcemaps | No |

## Observabilidad

| Herramienta | Proposito |
|-------------|-----------|
| **Vercel Analytics** | Page views y metricas de uso |
| **Vercel Speed Insights** | Core Web Vitals en tiempo real |
| **Sentry** | Error monitoring, Session Replay, tracing |

## Estructura del Proyecto

```
src/
  app/                  # Paginas (App Router)
    api/                # API routes (chat, verificador, noticias, cron)
    brujula/            # Brujula Electoral "A Ciegas"
    quiz/               # Descubre tu Afinidad
    comparar/           # Comparador visual
    candidatos/         # Perfiles individuales
    buzon/              # Buzon ciudadano
    verificador/        # Verificador de afirmaciones
    buscar/             # Buscador por tema
    noticias/           # Feed de noticias
    metodologia/        # Transparencia y metodologia
    guia-votante/       # Guia para el dia de votacion
    resumen/            # Resumen ejecutivo de candidatos
  components/           # Componentes React
    ui/                 # shadcn/ui (button, card, badge, etc.)
    layout/             # Header, footer, mobile-nav
    brujula/            # SwipeCard, BrujulaEngine
    quiz/               # QuizEngine, QuizQuestion
    comparison/         # ComparisonMatrix, DimensionRow
    candidates/         # CandidateCard, CandidateProfile
    news/               # NewsFeed, NewsCard
    shared/             # CandidateAvatar, ShareInvite, PartyBadge
    landing/            # HeroSection, ElectionCountdown
  data/                 # Datos estaticos
    candidates.ts       # 4 candidatos con metadata
    dimensions.ts       # 12 dimensiones de comparacion
    positions.ts        # 48 posiciones (4x12) con fuentes citadas
    quiz-questions.ts   # 12 preguntas con scores por candidato
    brujula-cards.ts    # Pool de 40 propuestas para Brujula
    sources.ts          # Referencias y fuentes
  lib/                  # Logica de negocio
    quiz-scoring.ts     # Algoritmo de afinidad (suma normalizada)
    brujula-scoring.ts  # Scoring de Brujula (primary + secondary)
    chat-context.ts     # System prompt del chat electoral
    verificador-context.ts # System prompt del verificador
    news-scraper.ts     # Scraping RSS + Cheerio
    news-summarizer.ts  # Resumenes con Claude API
    petition-classifier.ts # Clasificacion IA de peticiones
    kv-cache.ts         # Wrapper de Vercel KV (Redis)
    redis.ts            # Conexion Upstash Redis
  types/                # Tipos TypeScript
    candidate.ts        # CandidateId, Candidate
    dimension.ts        # DimensionId, Dimension, CandidatePosition
    quiz.ts             # QuizQuestion, QuizResult
    news.ts             # NewsArticle, NewsSource
public/
  images/               # Fotos de candidatos y partidos
  planes_gobierno/      # PDFs de planes de gobierno oficiales
scripts/
  test-brujula-fairness.ts  # Tests de imparcialidad (10,000 sims)
```

## Transparencia Algoritmica

Publicamos **todos los System Prompts** (instrucciones que recibe la IA) para que cualquier ciudadano pueda verificar que opera de forma neutral. Ver documento completo: **[TRANSPARENCY.md](TRANSPARENCY.md)**

## Contribuir

Las contribuciones son bienvenidas. Consulta la guia completa en **[CONTRIBUTING.md](CONTRIBUTING.md)**.

En resumen:
1. Abre un **Issue** describiendo el problema o mejora
2. Si quieres contribuir codigo, haz un **Fork** y envia un **Pull Request**
3. Para reportar sesgo o inexactitudes en datos, usa el tag `datos` o `sesgo`

## Changelog

Ver [CHANGELOG.md](CHANGELOG.md) para el historial completo de cambios.

## Documentacion Completa

| Documento | Contenido |
|-----------|-----------|
| [PROJECT.md](PROJECT.md) | Arquitectura completa, decisiones tecnicas, algoritmos y guia para equipos nuevos |
| [CHANGELOG.md](CHANGELOG.md) | Historial cronologico de cambios |
| [TRANSPARENCY.md](TRANSPARENCY.md) | System Prompts de IA (auditoria publica) |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Guia de contribucion y reglas de neutralidad |
| [SECURITY.md](SECURITY.md) | Politica de seguridad y reporte de vulnerabilidades |

## Licencia

MIT License. Ver [LICENSE](LICENSE).

---

Hecho con transparencia para Colombia.
