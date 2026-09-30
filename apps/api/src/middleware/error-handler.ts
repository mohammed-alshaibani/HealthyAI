import type { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Log for debugging but never expose internals to clients
  console.error(`[ERROR] ${err.message}`);

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'The assistant is temporarily unavailable. Please try again.',
    },
  });
}
