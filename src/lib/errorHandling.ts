// Error handling utilities for production
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleApiError = (error: any): string => {
  if (error instanceof AppError) {
    return error.message;
  }
  
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
};

export const logError = (error: any, context?: string) => {
  if (import.meta.env.DEV) {
    console.error(`[${context || 'Error'}]:`, error);
  }
  
  // In production, you might want to send to error tracking service
  // Example: Sentry.captureException(error, { extra: { context } });
};

export const withErrorHandling = <T extends (...args: any[]) => any>(
  fn: T,
  context?: string
): T => {
  return ((...args: any[]) => {
    try {
      const result = fn(...args);
      if (result instanceof Promise) {
        return result.catch((error) => {
          logError(error, context);
          throw error;
        });
      }
      return result;
    } catch (error) {
      logError(error, context);
      throw error;
    }
  }) as T;
};