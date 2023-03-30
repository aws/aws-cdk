const ERROR_SYMBOL = Symbol.for('@aws-cdk/core.PolicyValidationError');

export class PolicyValidationError extends Error {
  static isPolicyValidationError(x: any): x is PolicyValidationError {
    return x !== null && typeof(x) === 'object' && ERROR_SYMBOL in x;
  }

  constructor(message?: string) {
    super(message);

    Object.defineProperty(this, ERROR_SYMBOL, { value: true });
  }
}