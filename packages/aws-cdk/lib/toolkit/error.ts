const TOOLKIT_ERROR_SYMBOL = Symbol.for('@aws-cdk/toolkit.ToolkitError');
const AUTHENTICATION_ERROR_SYMBOL = Symbol.for('@aws-cdk/toolkit.AuthenticationError');
const ASSEMBLY_ERROR_SYMBOL = Symbol.for('@aws-cdk/toolkit.AssemblyError');
const CONTEXT_PROVIDER_ERROR_SYMBOL = Symbol.for('@aws-cdk/toolkit.ContextProviderError');

/**
 * Represents a general toolkit error in the AWS CDK Toolkit.
 */
export class ToolkitError extends Error {
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
   * Determines if a given error is an instance of AssemblyError.
   */
  public static isAssemblyError(x: any): x is AssemblyError {
    return this.isToolkitError(x) && ASSEMBLY_ERROR_SYMBOL in x;
  }

  /**
   * Determines if a given error is an instance of AssemblyError.
   */
  public static isContextProviderError(x: any): x is ContextProviderError {
    return this.isToolkitError(x) && CONTEXT_PROVIDER_ERROR_SYMBOL in x;
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
export class AuthenticationError extends ToolkitError {
  constructor(message: string) {
    super(message, 'authentication');
    Object.setPrototypeOf(this, AuthenticationError.prototype);
    Object.defineProperty(this, AUTHENTICATION_ERROR_SYMBOL, { value: true });
  }
}

/**
 * Represents an authentication-specific error in the AWS CDK Toolkit.
 */
export class AssemblyError extends ToolkitError {
  constructor(message: string) {
    super(message, 'assembly');
    Object.setPrototypeOf(this, AssemblyError.prototype);
    Object.defineProperty(this, ASSEMBLY_ERROR_SYMBOL, { value: true });
  }
}

/**
 * Represents an error originating from a Context Provider
 */
export class ContextProviderError extends ToolkitError {
  constructor(message: string) {
    super(message, 'context-provider');
    Object.setPrototypeOf(this, ContextProviderError.prototype);
    Object.defineProperty(this, CONTEXT_PROVIDER_ERROR_SYMBOL, { value: true });
  }
}
