import type { IConstruct } from 'constructs';
import { constructInfoFromConstruct } from './helpers-internal';
import type { AssertionError } from '../../assertions/lib/private/error';
import type { CloudAssemblyError } from '../../cx-api/lib/private/error';

const CONSTRUCT_ERROR_SYMBOL = Symbol.for('@aws-cdk/core.SynthesisError');
const VALIDATION_ERROR_SYMBOL = Symbol.for('@aws-cdk/core.ValidationError');
const ASSERTION_ERROR_SYMBOL = Symbol.for('@aws-cdk/assertions.AssertionError');
const ASSEMBLY_ERROR_SYMBOL = Symbol.for('@aws-cdk/cx-api.CloudAssemblyError');
const ASSUMPTION_ERROR_SYMBOL = Symbol.for('@aws-cdk/core.AssumptionError');
const EXECUTION_ERROR_SYMBOL = Symbol.for('@aws-cdk/core.ExecutionError');

/**
 * Helper to check if an error is of a certain type.
 */
export class Errors {
  /**
   * Test whether the given errors is a ConstructionError.
   *
   * A ConstructionError is a generic error that will be thrown during the App construction or synthesis.
   * To check for more specific errors, use the respective methods.
   */
  public static isConstructError(x: any): x is ConstructError {
    return x !== null && typeof(x) === 'object' && CONSTRUCT_ERROR_SYMBOL in x;
  }

  /**
   * Test whether the given error is a ValidationError.
   *
   * A ValidationError is thrown when input props are failing to pass the rules of the construct.
   * It usually means the underlying CloudFormation resource(s) would not deploy with a given configuration.
   */
  public static isValidationError(x: any): x is ValidationError {
    return Errors.isConstructError(x) && VALIDATION_ERROR_SYMBOL in x;
  }

  /**
   * Test whether the given error is a AssertionError.
   *
   * An AssertionError is thrown when an assertion fails.
   */
  public static isAssertionError(x: any): x is AssertionError {
    return Errors.isConstructError(x) && ASSERTION_ERROR_SYMBOL in x;
  }

  /**
   * Test whether the given error is a CloudAssemblyError.
   *
   * A CloudAssemblyError is thrown for unexpected problems with the synthesized assembly.
   */
  public static isCloudAssemblyError(x: any): x is CloudAssemblyError {
    return x !== null && typeof(x) === 'object' && ASSEMBLY_ERROR_SYMBOL in x;
  }

  /**
   * Test whether the given error is an ExecutionError.
   *
   * An ExecutionError is thrown if an externally executed script or code failed.
   */
  public static isExecutionError(x: any): x is ExecutionError {
    return x !== null && typeof(x) === 'object' && EXECUTION_ERROR_SYMBOL in x;
  }

  /**
   * Test whether the given error is an AssumptionError.
   *
   * An AssumptionError is thrown when a construct made an assumption somewhere that doesn't hold true.
   * This error always indicates a bug in the construct.
   */
  public static isAssumptionError(x: any): x is AssumptionError {
    return x !== null && typeof(x) === 'object' && ASSUMPTION_ERROR_SYMBOL in x;
  }
}

interface ConstructInfo {
  readonly fqn: string;
  readonly version: string;
}

/**
 * Generic, abstract error class used for errors thrown from the users app during construction or synth.
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

  constructor(msg: string, scope?: IConstruct, name?: string) {
    super(msg);
    Object.setPrototypeOf(this, ConstructError.prototype);
    Object.defineProperty(this, CONSTRUCT_ERROR_SYMBOL, { value: true });

    this.name = name ?? new.target.name;
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
 * A ValidationError should be used when input props fail to pass the validation rules of a construct
 * or class or late binding. The error indicates that the underlying CloudFormation resource(s) would
 * not deploy with a given configuration, or that some other prerequisites are not met.
 *
 * A ValidationError is always attached to a Construct scope. To a user, the error will present with additional
 * information on the construct that caused the validation to fail.
 *
 * @internal
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

/**
 * An UnscopedValidationError is a ValidationError that is not attached to a specific construct.
 * This can be used to report validation errors that are thrown when no construct scope is available.
 * The common use case here are data classes that assert on props, but are not constructs itself.
 *
 * To a User, these errors still present themselves as a "ValidationError".
 * However they do not contain any information about the location in the construct tree.
 *
 * @internal
 */
export class UnscopedValidationError extends ConstructError {
  public get type(): 'validation' {
    return 'validation';
  }

  constructor(msg: string) {
    super(msg, undefined, ValidationError.name);
    Object.setPrototypeOf(this, UnscopedValidationError.prototype);
    Object.defineProperty(this, VALIDATION_ERROR_SYMBOL, { value: true });
  }
}

/**
 * Some construct code made an assumption somewhere that doesn't hold true
 *
 * This error always indicates a bug in the construct.
 *
 * @internal
 */
export class AssumptionError extends ConstructError {
  public get type(): 'assumption' {
    return 'assumption';
  }

  constructor(msg: string) {
    super(msg, undefined, AssumptionError.name);
    Object.setPrototypeOf(this, AssumptionError.prototype);
    Object.defineProperty(this, ASSUMPTION_ERROR_SYMBOL, { value: true });
  }
}

/**
 * A CDK app may execute external code or shell scripts. If such an execution fails, an ExecutionError is thrown.
 * The output log and error message will provide more details on the actual failure.
 *
 * @internal
 */
export class ExecutionError extends ConstructError {
  public get type(): 'exec' {
    return 'exec';
  }

  constructor(msg: string) {
    super(msg, undefined, ExecutionError.name);
    Object.setPrototypeOf(this, ExecutionError.prototype);
    Object.defineProperty(this, EXECUTION_ERROR_SYMBOL, { value: true });
  }
}
