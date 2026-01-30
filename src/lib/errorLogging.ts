/**
 * Error logging utility for application-wide error tracking
 */

interface ErrorContext {
  error: Error;
  errorInfo?: {
    componentStack?: string;
  };
  timestamp: string;
  userAgent?: string;
  url?: string;
}

/**
 * Log errors to console with structured context
 * In production, this could be extended to send to a service like Sentry or Supabase
 */
export const logError = (error: Error, errorInfo?: { componentStack?: string }) => {
  const context: ErrorContext = {
    error,
    errorInfo,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    url: typeof window !== 'undefined' ? window.location.href : undefined,
  };

  // Log to console with structured data
  console.error("Application Error:", {
    message: error.message,
    name: error.name,
    stack: error.stack,
    componentStack: errorInfo?.componentStack,
    timestamp: context.timestamp,
    url: context.url,
  });

  // In the future, you can extend this to send errors to:
  // - Sentry: Sentry.captureException(error, { contexts: { react: errorInfo } });
  // - Supabase: supabase.from('error_logs').insert({ ... });
  // - Custom endpoint: fetch('/api/log-error', { method: 'POST', body: JSON.stringify(context) });
};
