# Politica de Seguridad

## Reportar Vulnerabilidades

Si encuentras una vulnerabilidad de seguridad, **no abras un Issue publico**. En su lugar:

1. Envia un correo a **contacto@votainformadoco.org** con el asunto "Seguridad - VotaInformado"
2. Describe la vulnerabilidad con el mayor detalle posible
3. Te responderemos en un plazo de 48 horas

## Que Reportar

- Exposicion de datos personales de usuarios
- Vulnerabilidades en las API routes
- Posibilidad de inyeccion de contenido malicioso
- Bypass de rate limiting o anti-spam
- Cualquier forma de manipulacion de datos electorales

## Que NO Reportar Como Vulnerabilidad

- Errores en datos de candidatos (usar Issues con tag `datos`)
- Sesgo percibido en el test de afinidad (usar Issues con tag `sesgo`)
- Bugs de UI/UX (usar Issues normales)

## Arquitectura de Seguridad

- **Secretos:** Todas las API keys y tokens estan en variables de entorno, nunca en el codigo fuente
- **Auth:** Los cron jobs requieren `CRON_SECRET` via Bearer token
- **Rate limiting:** Anti-spam por sesion en el buzon ciudadano (localStorage)
- **Datos:** Los datos de candidatos son estaticos y verificables contra los PDFs fuente
- **IA:** El chat tiene un system prompt con reglas de neutralidad que impiden sesgo
- **Monitoreo:** Sentry captura errores en cliente, servidor y edge runtime. Tunnel route (`/monitoring`) evita bloqueo por ad-blockers
- **Sourcemaps:** Se eliminan automaticamente despues del upload a Sentry para no exponer codigo fuente
- **Privacidad:** No se recopilan datos personales. Analytics de Vercel son anonimos. Session Replay de Sentry se limita a 5% de sesiones
