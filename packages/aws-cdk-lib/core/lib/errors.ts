import { IConstruct } from 'constructs';
import { constructInfoFromConstruct } from './helpers-internal';

const CONSTRUCT_ERROR_SYMBOL = Symbol.for('@aws-cdk/core.SynthesisError');
const VALIDATION_ERROR_SYMBOL = Symbol.for('@aws-cdk/core.ValidationError');

/**
 * Helper to check if an error is a SynthesisErrors
 */
export class Errors {
  /**
   * Test whether the given errors is a ConstructionError
   */
  public static isConstructError(x: any): x is ConstructError {
    return x !== null && typeof(x) === 'object' && CONSTRUCT_ERROR_SYMBOL in x;
  }

  /**
   * Test whether the given error is a ValidationError
   */
  public static isValidationError(x: any): x is ValidationError {
    return Errors.isConstructError(x) && VALIDATION_ERROR_SYMBOL in x;
  }
}

interface ConstructInfo {
  readonly fqn: string;
  readonly version: string;
}

/**
 * Generic, abstract error that is thrown from the users app during app construction or synth.
 */
abstract class ConstructError extends Error {
  #time: string;
  #constructPath?: string;
  #constructInfo?: ConstructInfo;

  /**
   * The time the error was thrown.
   */
  public get time(): string {
    return this.#time;
  }

  /**
   * The level. Always `'error'`.
   */
  public get level(): 'error' {
    return 'error';
  }

  /**
   * The type of the error.
   */
  public abstract get type(): string;

  /**
   * The path of the construct this error is thrown from, if available.
   */
  public get constructPath(): string | undefined {
    return this.#constructPath;
  }

  /**
   * Information on the construct this error is thrown from, if available.
   */
  public get constructInfo(): ConstructInfo | undefined {
    return this.#constructInfo;
  }

  constructor(msg: string, scope?: IConstruct) {
    super(msg);
    Object.setPrototypeOf(this, ConstructError.prototype);
    Object.defineProperty(this, CONSTRUCT_ERROR_SYMBOL, { value: true });

    this.name = new.target.name;
    this.#time = new Date().toISOString();
    this.#constructPath = scope?.node.path;

    if (scope) {
      Error.captureStackTrace(this, scope.constructor);
      try {
        this.#constructInfo = scope ? constructInfoFromConstruct(scope) : undefined;
      } catch (_) {
        // we don't want to fail if construct info is not available
      }
    }

    const stack = [
      `${this.name}: ${this.message}`,
    ];

    if (this.constructInfo) {
      stack.push(`in ${this.constructInfo?.fqn} at [${this.constructPath}]`);
    } else {
      stack.push(`in [${this.constructPath}]`);
    }

    if (this.stack) {
      stack.push(this.stack);
    }

    this.stack = this.constructStack(this.stack);
  }

  /**
   * Helper message to clean-up the stack and amend with construct information.
   */
  private constructStack(prev?: string) {
    const indent = ' '.repeat(4);

    const stack = [
      `${this.name}: ${this.message}`,
    ];

    if (this.constructInfo) {
      stack.push(`${indent}at path [${this.constructPath}] in ${this.constructInfo?.fqn}`);
    } else {
      stack.push(`${indent}at path [${this.constructPath}]`);
    }

    if (prev) {
      stack.push('');
      stack.push(...prev.split('\n').slice(1));
    }

    return stack.join('\n');
  }
}

/**
 * An Error that is thrown when a construct has validation errors.
 */
export class ValidationError extends ConstructError {
  public get type(): 'validation' {
    return 'validation';
  }

  constructor(msg: string, scope: IConstruct) {
    super(msg, scope);
    Object.setPrototypeOf(this, ValidationError.prototype);
    Object.defineProperty(this, VALIDATION_ERROR_SYMBOL, { value: true });
  }
}
