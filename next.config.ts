import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, {
  // Suppresses Sentry SDK build logs during build
  silent: true,

  // Upload source maps for better stack traces
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers
  tunnelRoute: "/monitoring",

  // Delete source maps after upload so they are not publicly accessible
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },

  // Reduce bundle size
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
  },

  // Prevents Sentry from erroring if no auth token is set (e.g. local dev)
  authToken: process.env.SENTRY_AUTH_TOKEN,
});
