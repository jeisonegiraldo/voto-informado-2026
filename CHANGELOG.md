# Changelog

Todos los cambios notables en VotaInformado 2026 se documentan en este archivo.

El formato esta basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

---

## [1.4.0] - 2026-05-27

### Cambiado
- **Brujula Electoral imparcial**: Pool ampliado de 20 a 40 propuestas (10 por candidato). Cada sesion selecciona 20 al azar (5 por candidato), garantizando que la experiencia sea diferente cada vez.
- Secondary scores balanceados para que ningun candidato acumule ventaja sistematica (~0.6 puntos de bonus por candidato).
- Fisher-Yates shuffle con proteccion anti-consecutivo para evitar que dos propuestas del mismo candidato aparezcan seguidas.

### Agregado
- `selectAndShuffleBrujulaCards()` — nueva funcion de seleccion aleatoria con balance de candidatos.
- Script de pruebas exhaustivas (`scripts/test-brujula-fairness.ts`) con 6 tests de imparcialidad: distribucion del pool, balance de secondary scores, seleccion correcta, test "solo apruebo las de X", 10,000 simulaciones aleatorias, y variedad entre sesiones.

### Corregido
- Sesgo detectado en simulaciones aleatorias (Cepeda 19% vs Valencia 28%) corregido redistribuyendo secondary scores en 3 iteraciones hasta lograr <8% de desviacion para todos los candidatos.

---

## [1.3.0] - 2026-05-27

### Agregado
- **Sentry error monitoring**: Integracion completa con captura de errores en cliente, servidor y edge.
- `src/instrumentation.ts` y `src/instrumentation-client.ts` para inicializacion via hooks de Next.js (compatible con Turbopack).
- `src/app/global-error.tsx` — Error boundary global con UI en espanol.
- Session Replay al 5% y 100% en errores.
- **Vercel Analytics** — tracking automatico de page views y metricas web.
- **Vercel Speed Insights** — monitoreo de Core Web Vitals en tiempo real.

### Corregido
- Sentry no capturaba errores porque `sentry.client.config.ts` en la raiz solo se carga con Webpack; Turbopack requiere `instrumentation-client.ts`.
- API `hideSourceMaps` deprecada en Sentry v10 — migrado a `sourcemaps.deleteSourcemapsAfterUpload`.

---

## [1.2.0] - 2026-05-27

### Agregado
- **OG Image dinamica** para WhatsApp y redes sociales (`/api/og`).
- Banner de contribucion en el footer con enlace a GitHub.
- Sistema de compartir mejorado en footer y resultados.

### Cambiado
- Quiz renombrado de "Quiz de Afinidad" a "Descubre tu Afinidad" en toda la UI.
- Iniciales del espectro ideologico basadas en apellido del candidato.

### Corregido
- Pagina `/chat` generaba error de build por uso de `headers()` — convertida a estatica con chat flotante.

---

## [1.1.0] - 2026-05-27

### Agregado
- **Sistema de reportes ciudadanos** con formulario de contacto oficial y almacenamiento en Redis.
- Correo de contacto oficial: contacto@votainformadoco.org.
- **README.md**, **LICENSE** (MIT), **SECURITY.md** para repo publico.
- **TRANSPARENCY.md** — todos los System Prompts de IA publicados.
- **CONTRIBUTING.md** — guia de contribucion con reglas de neutralidad.

---

## [1.0.0] - 2026-05-27

### Agregado
- **Brujula Electoral "A Ciegas"** — Feature principal: 20 propuestas anonimas con swipe (Tinder-style). Resultados con reveal dramatico del candidato mas afin.
- **Chat flotante global** — Burbuja de chat disponible en todas las paginas de la app.
- Feedback modal en chat flotante para que usuarios reporten problemas.
- **Sistema de compartir/invitar** — ShareInvite component con Web Share API, copiado al portapapeles, y links a WhatsApp/Twitter/Telegram.

### Cambiado
- Brujula posicionada como feature principal en la landing page.
- Comparador con UX mas intuitiva: tooltips y mejor navegacion.

---

## [0.9.0] - 2026-05-27

### Agregado
- **4 nuevas features:**
  - Brujula a ciegas (version inicial con 20 propuestas fijas)
  - Feedback en chat
  - Text-to-Speech para propuestas
  - Muro ciudadano (peticiones a candidatos)

### Mejorado
- Optimizacion mobile-first en toda la app (375px como base).
- Tipografia premium con Inter + Plus Jakarta Sans.
- Animaciones suaves con Framer Motion.

---

## [0.8.0] - 2026-05-27

### Agregado
- **8 features de alto impacto:**
  - Verificador de afirmaciones con IA
  - Buscador por tema (comparacion al instante)
  - Guia del votante (dia de elecciones)
  - Resumen ejecutivo de cada candidato
  - Buzon ciudadano (peticiones publicas)
  - Pagina de metodologia
  - Clasificador de peticiones con IA
  - Filtros avanzados en noticias

### Cambiado
- Paleta de colores neutral sin asociacion partidista.
- Eliminado radar chart — barras de espectro son superiores para comparacion.

---

## [0.7.0] - 2026-05-26

### Agregado
- **Feed de noticias dinamico** con scraping de medios verificados (El Tiempo, Semana, La Silla Vacia, Blu Radio, RCN, Caracol).
- Cron job diario para rastreo automatico.
- Endpoint admin para gestion de peticiones.

---

## [0.6.0] - 2026-05-26

### Agregado
- **Chat electoral con IA** — Asistente basado en planes de gobierno oficiales con reglas de neutralidad.
- **Buzon ciudadano** — Mensajes publicos a candidatos con clasificacion automatica.
- Renderizado de Markdown en respuestas del chat.

### Corregido
- Manejo de errores en buzon ciudadano.
- Tipos de classificationResult en API de peticiones.
- Compatibilidad con ambos formatos de env vars de Upstash Redis.

---

## [0.5.0] - 2026-05-26

### Agregado
- **Comparador visual** con radar chart, tarjetas expandibles y modo "Comparar 2".
- Nombres de candidatos visibles en la interfaz del comparador.

---

## [0.1.0] - 2026-05-26

### Agregado
- **MVP inicial** — Estructura completa del proyecto:
  - Landing page con hero y countdown al 31 de mayo.
  - Comparador de 12 dimensiones para 4 candidatos.
  - Perfiles individuales con posiciones detalladas y fuentes.
  - Quiz de afinidad (12 preguntas, scoring transparente).
  - Paginas de candidatos con resumenes de planes de gobierno.
  - Datos de posiciones extraidos de los planes de gobierno oficiales (PDFs).
  - Layout responsive con header, footer y navegacion mobile.
