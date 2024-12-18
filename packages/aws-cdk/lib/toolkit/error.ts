/**
 * Represents a general toolkit error in the AWS CDK CLI.
 */
class ToolkitError extends Error {
  /**
   * Determines if a given error is an instance of ToolkitError.
   */
  public static isToolkitError(error: any): error is ToolkitError {
    return error instanceof ToolkitError;
  }

  /**
   * The type of the error, defaults to "toolkit".
   */
  public readonly type: string;

  constructor(message: string, type: string = 'toolkit') {
    super(message);
    Object.setPrototypeOf(this, ToolkitError.prototype);
    this.name = new.target.name;
    this.type = type;
  }
}

/**
 * Represents an authentication-specific error in the AWS CDK CLI.
 */
class AuthenticationError extends ToolkitError {
  constructor(message: string) {
    super(message, 'authentication');
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

// Export classes for internal usage only
export { ToolkitError, AuthenticationError };
