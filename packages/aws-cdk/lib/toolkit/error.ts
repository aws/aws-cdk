const TOOLKIT_ERROR_SYMBOL = Symbol.for('@aws-cdk/core.TooklitError');
const AUTHENTICATION_ERROR_SYMBOL = Symbol.for('@aws-cdk/core.AuthenticationError');

/**
 * Represents a general toolkit error in the AWS CDK Toolkit.
 */
class ToolkitError extends Error {
  /**
   * Determines if a given error is an instance of ToolkitError.
   */
  public static isToolkitError(x: any): x is ToolkitError {
    return x !== null && typeof(x) === 'object' && TOOLKIT_ERROR_SYMBOL in x;
  }

  /**
   * Determines if a given error is an instance of AuthenticationError.
   */
  public static isAuthenticationError(x: any): x is AuthenticationError {
    return this.isToolkitError(x) && AUTHENTICATION_ERROR_SYMBOL in x;
  }

  /**
   * The type of the error, defaults to "toolkit".
   */
  public readonly type: string;

  constructor(message: string, type: string = 'toolkit') {
    super(message);
    Object.setPrototypeOf(this, ToolkitError.prototype);
    Object.defineProperty(this, TOOLKIT_ERROR_SYMBOL, { value: true });
    this.name = new.target.name;
    this.type = type;
  }
}

/**
 * Represents an authentication-specific error in the AWS CDK Toolkit.
 */
class AuthenticationError extends ToolkitError {
  constructor(message: string) {
    super(message, 'authentication');
    Object.setPrototypeOf(this, AuthenticationError.prototype);
    Object.defineProperty(this, AUTHENTICATION_ERROR_SYMBOL, { value: true });
  }
}

// Export classes for internal usage only
export { ToolkitError, AuthenticationError };
