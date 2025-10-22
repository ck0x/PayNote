import type { ProblemDetail } from "@/types/interfaces/ProblemDetail";

/**
 * API Error class for handling HTTP errors with problem details
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public problemDetail: ProblemDetail,
    public response?: Response
  ) {
    super(problemDetail.title || `HTTP ${status} Error`);
    this.name = "ApiError";
  }

  /**
   * Check if error is a specific HTTP status
   */
  is(status: number): boolean {
    return this.status === status;
  }

  /**
   * Check if error is authentication related
   */
  isAuthError(): boolean {
    return this.status === 401;
  }

  /**
   * Check if error is authorization related
   */
  isForbidden(): boolean {
    return this.status === 403;
  }

  /**
   * Check if error is not found
   */
  isNotFound(): boolean {
    return this.status === 404;
  }

  /**
   * Check if error is a conflict
   */
  isConflict(): boolean {
    return this.status === 409;
  }

  /**
   * Check if error is validation related
   */
  isValidationError(): boolean {
    return this.status === 400 || this.status === 422;
  }

  /**
   * Get field-level validation errors
   */
  getFieldErrors(): Record<string, string[]> | undefined {
    return this.problemDetail.errors;
  }
}

/**
 * Rate limit error with retry information
 */
export class RateLimitError extends ApiError {
  constructor(
    problemDetail: ProblemDetail & { retryAfterSeconds?: number },
    response?: Response
  ) {
    super(429, problemDetail, response);
    this.name = "RateLimitError";
  }

  get retryAfterSeconds(): number | undefined {
    return (this.problemDetail as any).retryAfterSeconds;
  }
}
