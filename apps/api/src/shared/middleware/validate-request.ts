import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../errors';

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('Zod Validation Error:', JSON.stringify(error.format(), null, 2));
        // We throw ValidationError so that the unified error-handler catches it
        next(new ValidationError('Invalid request payload', error.format()));
      } else {
        next(error);
      }
    }
  };
};
