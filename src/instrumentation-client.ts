import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring — sample 10% of transactions in production
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session Replay — capture 5% of sessions, 100% on error
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 1.0,
  integrations: [Sentry.replayIntegration()],

  // Only send errors in production
  enabled: process.env.NODE_ENV === 'production',

  // Filter noisy errors
  ignoreErrors: [
    'ResizeObserver loop',
    'Non-Error promise rejection captured',
    /^Loading chunk \d+ failed/,
  ],

  environment: process.env.NODE_ENV,
});

// Capture navigation transitions
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
