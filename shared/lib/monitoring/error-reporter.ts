interface ErrorContext {
  route?: string;
  userId?: string;
  tags?: Record<string, string>;
}

export function reportError(error: unknown, context: ErrorContext = {}) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  // Log to console (always)
  console.error('[error-reporter]', {
    message: errorMessage,
    stack,
    ...context,
    timestamp: new Date().toISOString(),
  });

  // Optional: Sentry integration (if SENTRY_DSN set)
  if (process.env.SENTRY_DSN) {
    // Placeholder for Sentry SDK integration
    // Currently logs only; add @sentry/nextjs when ready
  }
}

export function reportWarning(message: string, context: ErrorContext = {}) {
  console.warn('[warning]', { message, ...context, timestamp: new Date().toISOString() });
}
