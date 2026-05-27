# Guia de Contribucion

Gracias por tu interes en contribuir a VotaInformado 2026. Este es un proyecto civico no-partidista y toda ayuda es bienvenida.

## Antes de Contribuir

1. Lee el [README](README.md) para entender el proyecto
2. Lee [TRANSPARENCY.md](TRANSPARENCY.md) para entender como funciona la IA
3. Revisa los [Issues abiertos](https://github.com/jeisonegiraldo/voto-informado-2026/issues) para ver si alguien ya esta trabajando en lo que quieres hacer

## Tipos de Contribucion

### Correccion de Datos (tag: `datos`)
Si encuentras un error en las posiciones de un candidato, una propuesta mal citada, o un dato desactualizado:
- Abre un Issue con el tag `datos`
- Incluye la fuente que respalda tu correccion (pagina del plan de gobierno, articulo verificable, etc.)
- Los datos sin fuente no seran aceptados

### Reporte de Sesgo (tag: `sesgo`)
Si percibes que el quiz, la brujula, o cualquier componente favorece a un candidato:
- Abre un Issue con el tag `sesgo`
- Explica especificamente donde percibes el sesgo
- Sugiere como corregirlo de forma neutral
- Estas contribuciones son las mas importantes y seran priorizadas

### Mejoras de Codigo (tag: `mejora`)
- Mejoras de accesibilidad (a11y)
- Optimizacion de rendimiento
- Mejor soporte mobile
- Nuevas visualizaciones de datos
- Correccion de bugs

### Mejoras de Diseno (tag: `diseno`)
- Mejoras de UX/UI
- Accesibilidad visual (contraste, tamano de fuente)
- Soporte para modo oscuro

## Como Contribuir Codigo

### 1. Fork y Clone

```bash
# Fork el repo en GitHub, luego:
git clone https://github.com/TU-USUARIO/voto-informado-2026.git
cd voto-informado-2026
npm install
cp .env.example .env.local
```

### 2. Crear una Rama

```bash
git checkout -b tipo/descripcion-corta
# Ejemplos:
# fix/quiz-scoring-rounding
# feat/dark-mode
# data/cepeda-education-update
```

Convenciones de nombre de rama:
- `fix/` — correccion de bug
- `feat/` — nueva funcionalidad
- `data/` — correccion o actualizacion de datos
- `docs/` — documentacion
- `a11y/` — accesibilidad

### 3. Desarrollar

```bash
npm run dev
```

Asegurate de que:
- El build pasa: `npm run build`
- No hay errores de TypeScript
- La app funciona correctamente en mobile (375px)

### 4. Commit

Usamos commits convencionales:

```
tipo: descripcion corta en espanol

Cuerpo opcional con mas contexto.
```

Tipos validos: `feat`, `fix`, `data`, `docs`, `refactor`, `test`, `chore`

### 5. Pull Request

- Titulo claro y descriptivo
- Describe que cambia y por que
- Si modifica datos de candidatos, incluye las fuentes
- Si modifica el quiz o la brujula, explica por que es mas neutral

## Reglas de Neutralidad para Contribuciones

Estas reglas son **obligatorias** para que un PR sea aceptado:

1. **Ningun candidato debe ser favorecido visualmente** — mismo tamano de foto, mismo espacio, mismo formato
2. **El orden de candidatos debe ser aleatorio o alfabetico** — nunca fijo con un candidato primero
3. **Las propuestas deben citarse con fuente** — pagina del plan de gobierno o articulo verificable
4. **Los prompts de IA no deben modificarse sin discusion** — cambios a prompts requieren un Issue previo con tag `transparencia` y aprobacion del equipo
5. **No se aceptan opiniones editoriales en el codigo** — comentarios en codigo deben ser tecnicos, no politicos

## Que NO Aceptamos

- PRs que favorezcan a un candidato especifico
- Modificaciones a prompts de IA sin justificacion neutral
- Datos sin fuente verificable
- Funcionalidades que requieran datos personales de los usuarios
- Dependencias con vulnerabilidades conocidas

## Stack Tecnico (para referencia)

- Next.js 16 (App Router)
- TypeScript estricto
- Tailwind CSS v4 + shadcn/ui
- Framer Motion para animaciones
- Claude API (Anthropic) para IA
- Vercel KV (Redis) para datos dinamicos

## Preguntas?

Abre un Issue con el tag `pregunta` o escribe a jeisonegiraldo@gmail.com.

---

*Gracias por ayudar a construir democracia digital en Colombia.*
