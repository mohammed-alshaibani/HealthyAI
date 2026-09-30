import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    console.error(`[AppError ${err.code}] ${err.message}`);
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        isRetryable: err.isRetryable
      },
    });
  }

  // Log unexpected errors securely
  console.error(`[UNEXPECTED_ERROR] ${err.name}: ${err.message}`);

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'The assistant is temporarily unavailable. Please try again.',
      isRetryable: true
    },
  });
}
