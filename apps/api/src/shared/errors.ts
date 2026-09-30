export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number = 500,
    public readonly isRetryable: boolean = false,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public readonly details?: unknown) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

export class LLMError extends AppError {
  constructor(message: string, isRetryable = true) {
    super(message, 'LLM_UNAVAILABLE', 502, isRetryable);
  }
}

export class ToolError extends AppError {
  constructor(message: string, public readonly toolName: string) {
    super(message, 'TOOL_ERROR', 500);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, 'DATABASE_ERROR', 503, true);
  }
}
