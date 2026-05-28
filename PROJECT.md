# VotaInformado 2026 — Documento de Proyecto

Documento tecnico y de contexto para equipos de desarrollo. Ultima actualizacion: 27 de mayo de 2026.

---

## 1. Vision General

**VotaInformado 2026** es una plataforma web civica no-partidista para las elecciones presidenciales de Colombia 2026. Su objetivo es que los ciudadanos comparen candidatos, descubran su afinidad politica, y accedan a informacion verificable — todo sin sesgo ni recomendaciones de voto.

**Elecciones:** Primera vuelta el 31 de mayo de 2026; posible segunda vuelta el 21 de junio de 2026.

**URL:** [votainformadoco.org](https://votainformadoco.org)

**Contacto:** contacto@votainformadoco.org

**Repositorio:** [github.com/jeisonegiraldo/voto-informado-2026](https://github.com/jeisonegiraldo/voto-informado-2026) (publico, MIT)

---

## 2. Candidatos

| Candidato | Partido | Espectro | Color |
|-----------|---------|----------|-------|
| Ivan Cepeda | Pacto Historico | Izquierda | `#7B2D8E` (purpura) |
| Abelardo de la Espriella | Defensores de la Patria | Derecha | `#1A1A5E` (navy) |
| Paloma Valencia | Centro Democratico | Centro-derecha | `#003399` (azul) |
| Sergio Fajardo | Dignidad y Compromiso | Centro | `#F5A623` (naranja) |

**Fuentes de datos:** Planes de gobierno oficiales (PDFs en `public/planes_gobierno/`):
- `P000A.pdf` — Paloma Valencia (19 pags, 111 puntos)
- `P000B.pdf` — Ivan Cepeda (433 pags, libro con discursos)
- `P000C.pdf` — Abelardo de la Espriella (8 pags, slides)
- `P000D.pdf` — Sergio Fajardo (62 pags, 3 capitulos)

---

## 3. Stack Tecnico

| Capa | Tecnologia | Version |
|------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.6 |
| Runtime | React | 19.2.4 |
| Lenguaje | TypeScript | 5.x |
| Estilos | Tailwind CSS | v4 |
| Componentes UI | shadcn/ui + @base-ui/react | latest |
| Animaciones | Framer Motion | 12.x |
| Graficos | Recharts | 3.x |
| Iconos | Lucide React | 1.x |
| IA | Claude API (Anthropic SDK) | 0.98.x |
| Cache/DB | Upstash Redis (Vercel KV) | 1.38.x |
| Scraping | RSS Parser + Cheerio | 3.x / 1.x |
| Markdown | react-markdown | 10.x |
| OG Images | @vercel/og | 0.11.x |
| Error Monitoring | Sentry (@sentry/nextjs) | 10.54.x |
| Analytics | Vercel Analytics + Speed Insights | 2.x |
| Hosting | Vercel | - |
| Bundler | Turbopack (default en Next.js 16) | - |

### Nota sobre Turbopack

Next.js 16 usa Turbopack por defecto en desarrollo y build. Esto tiene implicaciones:
- Los archivos `sentry.client.config.ts` en la raiz del proyecto **no se cargan automaticamente** (eso solo funciona con Webpack).
- La inicializacion de Sentry se hace via `src/instrumentation-client.ts` (cliente) y `src/instrumentation.ts` (servidor/edge).
- Siempre leer la documentacion relevante en `node_modules/next/dist/docs/` antes de asumir que una API funciona igual que en versiones anteriores.

---

## 4. Features Principales

### 4.1 Brujula Electoral "A Ciegas"

**Rutas:** `/brujula`, `/brujula/resultado`
**Archivos clave:** `src/data/brujula-cards.ts`, `src/lib/brujula-scoring.ts`, `src/components/brujula/`

**Concepto:** El usuario ve propuestas reales de candidatos sin saber de quien son. Desliza a la derecha (de acuerdo) o izquierda (en desacuerdo), estilo Tinder. Al final se revela con que candidato coincide mas.

**Pool de datos:**
- 40 propuestas en total: 10 por candidato, cubriendo las 12 dimensiones.
- En cada sesion se seleccionan 20 al azar (exactamente 5 por candidato).
- El pool esta en `brujulaCardPool` con la interfaz `BrujulaCard`.

**Algoritmo de seleccion (`selectAndShuffleBrujulaCards`):**
1. Agrupa las 40 cartas por candidato.
2. Para cada candidato, selecciona 5 al azar con Fisher-Yates shuffle.
3. Mezcla las 20 seleccionadas con Fisher-Yates.
4. Segundo pase: si dos cartas consecutivas son del mismo candidato, intercambia la segunda con la siguiente carta que sea de candidato diferente.

**Algoritmo de scoring (`calculateBrujulaResults`):**
- **Swipe derecha (de acuerdo):** +1 punto al candidato primario de la propuesta. Si la propuesta tiene `secondaryScores`, se suman puntos parciales (0.2-0.3) a otros candidatos con posiciones similares.
- **Swipe izquierda (en desacuerdo):** 0 puntos.
- **Skip:** Se omite del calculo.
- **Porcentajes:** Normalizados al candidato con mayor score (el top siempre muestra ~100%).

**Balance de secondary scores:**
Los `secondaryScores` estan calibrados para que cada candidato reciba un bonus total similar del pool completo (~0.6-1.4 puntos). Esto fue verificado estadisticamente con 10,000 simulaciones aleatorias donde cada candidato gana entre 23-27% de las veces.

**UX del resultado:**
1. Se muestran barras anonimas ("Candidato 1", "Candidato 2"...) con porcentajes.
2. Boton "Revelar candidatos" con animacion dramatica.
3. Se revela el candidato con mayor afinidad, seguido del ranking completo con barras de colores.
4. Se muestran las propuestas con las que el usuario coincidio, ahora con nombre del candidato.
5. Invitacion a compartir y a profundizar con "Descubre tu Afinidad".

**Compartir:**
Los resultados se codifican en base64 en la URL (`?r=...`) usando `encodeBrujulaResults`/`decodeBrujulaResults`. Formato: `cardId:r|l|s` separados por coma.

---

### 4.2 Descubre tu Afinidad (Quiz)

**Rutas:** `/quiz`, `/quiz/resultado`
**Archivos clave:** `src/data/quiz-questions.ts`, `src/lib/quiz-scoring.ts`, `src/components/quiz/`

**Concepto:** 12 preguntas (1 por dimension), cada una con 4 opciones que reflejan posiciones reales de los candidatos sin nombrarlos. El usuario selecciona la opcion mas cercana a su pensamiento.

**Algoritmo de scoring (`calculateQuizResults`):**
- Cada opcion tiene `candidateScores: Record<CandidateId, number>` con valores de 0-3.
- Se suman los scores por candidato para todas las preguntas respondidas.
- Porcentaje = `(scoreReal / scoreMaximoPosible) * 100`, donde max posible = `preguntasRespondidas * 3`.
- Preguntas omitidas se excluyen del calculo (no penalizan).
- Todas las preguntas pesan igual.

**Diferencia con la Brujula:**
| Aspecto | Brujula | Quiz |
|---------|---------|------|
| Preguntas | 20 propuestas concretas | 12 preguntas tematicas |
| Formato | Swipe binario (si/no/skip) | 4 opciones por pregunta |
| Scoring | Primary + secondary | Score directo 0-3 por candidato |
| Porcentajes | Relativos al max scorer | Absolutos sobre max posible |
| Tiempo | ~5 min | ~3-4 min |
| Repetibilidad | Propuestas rotan | Siempre las mismas 12 preguntas |

---

### 4.3 Comparador Visual

**Ruta:** `/comparar`
**Archivos clave:** `src/data/positions.ts`, `src/data/dimensions.ts`, `src/components/comparison/`

**Concepto:** Matriz interactiva de 4 candidatos x 12 dimensiones. Cada celda muestra la posicion del candidato en esa dimension con un resumen, propuestas clave, y posicion en el espectro.

**Datos:**
- 12 dimensiones definidas en `dimensions.ts`, cada una con nombre, descripcion, y espectro (ej: "Intervencion estatal" <-> "Libre mercado").
- 48 posiciones en `positions.ts` (4 candidatos x 12 dimensiones). Cada posicion incluye: resumen, propuestas clave (array de strings), posicion en el espectro (-3 a +3), fuentes con pagina del plan de gobierno, y riesgos identificados.

**Las 12 dimensiones:**
1. Ideologia (izquierda-derecha)
2. Modelo economico (intervencion estatal vs. libre mercado)
3. Politica tributaria (mas impuestos vs. menos impuestos)
4. Tamano del Estado (ampliar vs. reducir)
5. Inversion extranjera (condicional vs. desregulada)
6. Seguridad (paz total vs. mano dura)
7. Politica antidrogas (sustitucion vs. fumigacion)
8. Familia y valores (diversidad vs. familia tradicional)
9. Educacion (publica universal vs. bonos/privada)
10. Tecnologia e IA (estado digital, formacion, hubs)
11. Salud (publica sin intermediarios vs. mixto/privado)
12. Posicion frente a Petro (continuismo vs. oposicion)

---

### 4.4 Chat Electoral con IA

**Ruta:** Chat flotante global (burbuja en todas las paginas) + `/chat`
**Archivos clave:** `src/lib/chat-context.ts`, `src/app/api/chat/route.ts`, `src/components/shared/floating-chat.tsx`

**Concepto:** Asistente de IA que responde preguntas sobre candidatos y propuestas, basado exclusivamente en los planes de gobierno oficiales.

**Modelo:** Claude (Anthropic) via `@anthropic-ai/sdk`.

**System prompt:** Publicado integramente en [TRANSPARENCY.md](TRANSPARENCY.md). Las 10 reglas fundamentales incluyen: nunca recomendar candidato, nunca tomar posicion ideologica, citar fuentes, y responder en espanol colombiano.

**Datos inyectados al contexto:** Las 48 posiciones completas (4 candidatos x 12 dimensiones).

---

### 4.5 Verificador de Afirmaciones

**Ruta:** `/verificador`
**Archivos clave:** `src/lib/verificador-context.ts`, `src/app/api/verificar/route.ts`

**Concepto:** El ciudadano ingresa una afirmacion o rumor sobre un candidato. La IA la verifica contra los planes de gobierno y emite un veredicto estandarizado.

**Veredictos posibles:** VERDADERO | PARCIALMENTE CIERTO | FALSO | SIN EVIDENCIA SUFICIENTE

---

### 4.6 Buscador por Tema

**Ruta:** `/buscar`
**Archivos clave:** `src/app/api/buscar-tema/route.ts`

**Concepto:** El usuario busca un tema (ej: "educacion") y ve la posicion de cada candidato lado a lado, en formato estructurado e igual para todos.

---

### 4.7 Buzon Ciudadano

**Ruta:** `/buzon`
**Archivos clave:** `src/lib/petition-classifier.ts`, `src/lib/petition-store.ts`

**Concepto:** Muro publico donde ciudadanos envian mensajes a candidatos especificos. Los mensajes se clasifican automaticamente con IA (comentario, peticion, pregunta, apoyo, critica) y por dimension tematica.

**Almacenamiento:** Upstash Redis con TTL.

---

### 4.8 Feed de Noticias

**Ruta:** `/noticias`
**Archivos clave:** `src/lib/news-scraper.ts`, `src/lib/news-summarizer.ts`, `src/app/api/cron/scrape-news/route.ts`

**Concepto:** Rastreo automatico de noticias electorales de medios verificados. Los articulos se resumen con IA y se presentan con filtros por candidato.

**Fuentes:** El Tiempo, Semana, La Silla Vacia, Blu Radio, RCN, Caracol.

**Frecuencia:** Cron job diario (Vercel Hobby plan permite 1/dia).

**Cache:** Vercel KV (Redis) con TTL de 48h, maximo 50 articulos.

---

### 4.9 Perfiles de Candidatos

**Ruta:** `/candidatos`, `/candidatos/[slug]`

**Concepto:** Vista general de los 4 candidatos con cards, y perfil individual detallado con posiciones, propuestas, y resumen del plan de gobierno.

---

### 4.10 Otros Features

| Feature | Ruta | Descripcion |
|---------|------|-------------|
| Guia del Votante | `/guia-votante` | Informacion practica para el dia de la eleccion |
| Resumen Ejecutivo | `/resumen` | Resumen de cada candidato en formato conciso |
| Metodologia | `/metodologia` | Transparencia: como funciona el quiz, la brujula, y las fuentes |
| Reportes Ciudadanos | `/api/reportar` | Formulario para reportar problemas o sesgo |

---

## 5. Arquitectura de Datos

### 5.1 Datos Estaticos (no cambian)

Los datos de candidatos, posiciones, y preguntas estan en archivos TypeScript en `src/data/`. No usan base de datos porque los planes de gobierno no cambian a dias de la eleccion. Esto simplifica el deploy y garantiza reproducibilidad.

```
src/data/
  candidates.ts      → CandidateId: 'cepeda' | 'espriella' | 'valencia' | 'fajardo'
  dimensions.ts       → DimensionId: 12 dimensiones con espectros
  positions.ts        → 48 posiciones (nucleo de datos, con fuentes citadas)
  quiz-questions.ts   → 12 preguntas con scores 0-3 por candidato
  brujula-cards.ts    → 40 propuestas con secondaryScores balanceados
  sources.ts          → Referencias y fuentes
```

### 5.2 Datos Dinamicos (Redis)

| Dato | Key Pattern | TTL | Proposito |
|------|------------|-----|-----------|
| Noticias | `news:*` | 48h | Cache de articulos scraped |
| Peticiones | `petitions:*` | - | Mensajes del buzon ciudadano |
| Reportes | `reports:*` | - | Reportes ciudadanos |

Conexion: `@upstash/redis` via `src/lib/redis.ts`. Acepta ambos formatos de env vars (`KV_REST_API_*` y `UPSTASH_REDIS_REST_*`).

### 5.3 Tipos TypeScript

```
src/types/
  candidate.ts  → CandidateId, Candidate, PoliticalSpectrum
  dimension.ts  → DimensionId, Dimension, CandidatePosition
  quiz.ts       → QuizQuestion, QuizOption, QuizAnswer, QuizResult, DimensionBreakdown
  news.ts       → NewsArticle, NewsSource
```

---

## 6. Principios de Neutralidad

Estos principios son el fundamento del proyecto y deben respetarse en toda contribucion:

1. **Orden justo:** Los candidatos aparecen en orden aleatorio o alfabetico. Nunca un candidato fijo primero.
2. **Colores institucionales:** Cada candidato usa el color de su partido, no colores valorativos (rojo=mal, verde=bien).
3. **Misma estructura:** Todos los perfiles y posiciones tienen el mismo formato y profundidad.
4. **Fuentes citadas:** Toda posicion referencia la pagina exacta del plan de gobierno.
5. **Brujula verificada:** 10,000 simulaciones estadisticas confirman que ningun candidato tiene ventaja sistematica.
6. **Quiz equitativo:** Todas las preguntas pesan igual. Preguntas omitidas se excluyen (no penalizan).
7. **IA neutral:** Los system prompts prohiben recomendaciones de voto. Publicados integramente en TRANSPARENCY.md.
8. **Codigo abierto:** Cualquiera puede auditar la logica, los datos, y los algoritmos.

---

## 7. Observabilidad y Monitoreo

### 7.1 Sentry (Error Monitoring)

**Archivos:**
- `next.config.ts` — `withSentryConfig` wrapper con `tunnelRoute: "/monitoring"`
- `src/instrumentation.ts` — Server/edge init via `register()` hook + `onRequestError`
- `src/instrumentation-client.ts` — Client init con Session Replay
- `sentry.server.config.ts` — Config del servidor (importado por instrumentation.ts)
- `sentry.edge.config.ts` — Config del edge runtime
- `src/app/global-error.tsx` — Error boundary global

**Configuracion:**
- Solo activo en produccion (`enabled: process.env.NODE_ENV === 'production'`)
- Traces: 10% en produccion, 100% en desarrollo
- Session Replay: 5% de sesiones, 100% en errores
- Sourcemaps se eliminan despues del upload
- Tunnel route `/monitoring` para evitar bloqueo por ad-blockers

### 7.2 Vercel Analytics

Tracking automatico de page views, insertado en `src/app/layout.tsx` via `<Analytics />`.

### 7.3 Vercel Speed Insights

Core Web Vitals en tiempo real, insertado en `src/app/layout.tsx` via `<SpeedInsights />`.

---

## 8. API Routes

| Ruta | Metodo | Descripcion | Auth |
|------|--------|-------------|------|
| `/api/chat` | POST | Chat electoral con IA | No |
| `/api/verificar` | POST | Verificador de afirmaciones | No |
| `/api/buscar-tema` | POST | Busqueda por tema con IA | No |
| `/api/news` | GET | Noticias cacheadas | No |
| `/api/peticiones` | GET/POST | CRUD de peticiones ciudadanas | No |
| `/api/reportar` | POST | Reportes ciudadanos | No |
| `/api/cron/scrape-news` | GET | Cron job de scraping | Bearer token (`CRON_SECRET`) |
| `/api/og` | GET | OG Image dinamica | No |
| `/monitoring` | POST | Tunnel de Sentry | No (proxy) |

---

## 9. Variables de Entorno

| Variable | Tipo | Requerida | Descripcion |
|----------|------|-----------|-------------|
| `ANTHROPIC_API_KEY` | Secret | Si* | API key de Anthropic (chat, verificador, resumenes) |
| `KV_REST_API_URL` | Secret | Si* | URL de Upstash Redis |
| `KV_REST_API_TOKEN` | Secret | Si* | Token de Upstash Redis |
| `CRON_SECRET` | Secret | Si* | Autenticacion de cron jobs |
| `NEXT_PUBLIC_BASE_URL` | Public | No | URL base (default: votainformadoco.org) |
| `NEXT_PUBLIC_SENTRY_DSN` | Public | No | DSN de Sentry |
| `SENTRY_ORG` | Build | No | Org de Sentry (para sourcemaps) |
| `SENTRY_PROJECT` | Build | No | Proyecto de Sentry |
| `SENTRY_AUTH_TOKEN` | Build | No | Auth token de Sentry |

*Requeridas para features de IA, noticias, y buzon. La app funciona sin ellas pero con funcionalidad reducida (comparador, quiz, brujula, y perfiles funcionan sin API keys).

**Nota importante:** Las variables `NEXT_PUBLIC_*` se incrustan en build time, no en runtime. Si se agregan despues del build, se debe hacer redeploy.

---

## 10. Deploy

**Plataforma:** Vercel  
**Dominio:** votainformadoco.org  
**Branch de produccion:** `main`

**Configuracion de Vercel:**
- Framework: Next.js (auto-detectado)
- Build command: `next build`
- Output: `.next`
- Cron: definido en `vercel.json` (diario para scraping)

**Primer deploy:**
1. Conectar repositorio de GitHub en Vercel
2. Configurar todas las env vars en Settings > Environment Variables
3. Deploy automatico al pushear a `main`

---

## 11. Desarrollo Local

```bash
git clone https://github.com/jeisonegiraldo/voto-informado-2026.git
cd voto-informado-2026
npm install
cp .env.example .env.local
# Editar .env.local con las API keys necesarias
npm run dev
```

**Sin API keys:** El comparador, quiz, brujula, y perfiles de candidatos funcionan completamente sin configurar ninguna variable de entorno. Solo el chat, verificador, noticias, y buzon requieren las keys.

**Tests de imparcialidad de la Brujula:**
```bash
npx tsx scripts/test-brujula-fairness.ts
```

---

## 12. Decisiones de Diseno Relevantes

### Por que datos estaticos en TypeScript y no una base de datos?
Los planes de gobierno no cambian a dias de la eleccion. Archivos TS dan type-safety, versionado con git, y zero-latency. Se pueden auditar facilmente en GitHub.

### Por que pool de 40 con seleccion de 20 en la Brujula?
Con 20 fijas, todos los usuarios veian las mismas propuestas — se podian memorizar las respuestas "correctas". Con 40 y seleccion aleatoria de 20, cada sesion es diferente (~50% overlap entre sesiones).

### Por que normalizar al max scorer en la Brujula pero al max posible en el Quiz?
La Brujula es un swipe rapido donde pocas propuestas reciben "de acuerdo" — normalizar al max posible daria porcentajes muy bajos (20-30%) que se sienten insatisfactorios. Normalizar al max scorer hace que el top candidato siempre muestre un porcentaje alto y los demas se vean relativos.

### Por que secondary scores en la Brujula?
Algunas propuestas se alinean parcialmente con mas de un candidato. Sin secondary scores, un candidato con propuestas muy "unicas" (sin overlap) tendria ventaja porque sus puntos nunca se comparten.

### Por que Turbopack y no Webpack?
Next.js 16 usa Turbopack por defecto. Es significativamente mas rapido en desarrollo. La unica implicacion es que la inicializacion de Sentry se hace via instrumentation hooks en vez de archivos en la raiz.

### Por que tunnel route para Sentry?
Los ad-blockers bloquean requests a `*.sentry.io`. El tunnel route (`/monitoring`) hace proxy de los eventos via nuestro propio dominio, evitando el bloqueo.

---

## 13. Guia para Nuevos Desarrolladores

1. **Leer primero:** README.md, TRANSPARENCY.md, y este documento.
2. **Antes de escribir codigo:** Leer la documentacion relevante en `node_modules/next/dist/docs/` — esta version de Next.js tiene breaking changes respecto a versiones anteriores.
3. **Datos de candidatos:** Cualquier cambio en `src/data/positions.ts` debe incluir la referencia a la pagina del plan de gobierno. No se aceptan datos sin fuente.
4. **Neutralidad:** Antes de hacer PR, verificar que ningun candidato recibe trato preferencial (visual, textual, o algoritmico).
5. **Tests de la Brujula:** Despues de modificar `brujula-cards.ts`, ejecutar `npx tsx scripts/test-brujula-fairness.ts` y verificar que la distribucion de ganadores aleatorios esta entre 20-30% por candidato.
6. **System prompts de IA:** Cambios a los prompts requieren un Issue previo con tag `transparencia` y deben reflejarse en TRANSPARENCY.md.

---

*Documento mantenido por el equipo de VotaInformado. Para preguntas: contacto@votainformadoco.org*
