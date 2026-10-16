/**
 * Thrown when a web function or endpoint is configured with values the service does not accept
 */
export class WebFunctionValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WebFunctionValidationError';
  }
}
