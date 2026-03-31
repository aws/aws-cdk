import * as fs from 'fs';
import type { IConstruct } from 'constructs';
import { constructInfoFromConstruct } from './private/runtime-info';
import { captureCallStack, renderCallStackJustMyCode } from './stack-trace';
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

    const ctr = this.constructor;

    Object.setPrototypeOf(this, ConstructError.prototype);
    Object.defineProperty(this, CONSTRUCT_ERROR_SYMBOL, { value: true });

    this.name = name ?? ctr.name;
    this.#time = new Date().toISOString();
    this.#constructPath = scope?.node.path;

    if (scope) {
      try {
        this.#constructInfo = constructInfoFromConstruct(scope);
      } catch (_) {
        // we don't want to fail if construct info is not available
      }
    }

    // The "stack" field in Node.js includes the error description. If it doesn't, Node will fall back to an
    // ugly way of rendering the error.
    this.stack = `«${this.name}» ${msg}\n${renderCallStackJustMyCode(captureCallStack(ctr)).join('\n')}`;

    if (scope) {
      this.stack += `\nRelates to construct:\n${renderConstructRootPath(scope)}`;
    }

    maybeWriteErrorCode(this.name);
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

  constructor(name: string, msg: string, scope: IConstruct) {
    super(msg, scope, name);
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

  constructor(name: string, msg: string) {
    super(msg, undefined, name);
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

  constructor(name: string, msg: string) {
    super(msg, undefined, name);
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

  constructor(name: string, msg: string) {
    super(msg, undefined, name);
    Object.setPrototypeOf(this, ExecutionError.prototype);
    Object.defineProperty(this, EXECUTION_ERROR_SYMBOL, { value: true });
  }
}

export function renderConstructRootPath(construct: IConstruct) {
  const rootPath = [];

  let cur: IConstruct | undefined = construct;
  while (cur !== undefined) {
    rootPath.push(cur);
    cur = cur.node.scope;
  }
  rootPath.reverse();

  const ret = new Array<string>();
  for (let i = 0; i < rootPath.length; i++) {
    const constructId = rootPath[i].node.id || '<.>';

    let suffix = '';
    try {
      const constructInfo = constructInfoFromConstruct(rootPath[i]);
      suffix = ` (${constructInfo?.fqn})`;
    } catch (_) {
      // we don't want to fail if construct info is not available
    }

    const branch = ' └─ ';
    const indent = i > 0 ? ' '.repeat(branch.length * (i - 1)) + branch : '';

    ret.push(`    ${indent}${constructId}${suffix}`);
  }

  return ret.join('\n');
}

/**
 * If the appropriate environment variable is set, write this error code the given file.
 *
 * The reason we do this is so that the CLI can see the error code that led to the
 * termination of the CDK application.
 *
 * This is not a guarantee: this exception could be caught and a different one
 * thrown in its stead, in which case we would pick up the wrong error code.
 * We will take that risk, and assume such cases are rare. The CLI only looks
 * at the error file if the subprocess terminates with an error, and the most
 * likely culprit in that case is the most recently thrown error regardless.
 *
 * Why not use `process.onUncaughtException()`? That will work for pure Node
 * programs, but in a jsii language no exception is uncaught (the kernel
 * is always the outermost loop) so that event handler would never fire.
 */
function maybeWriteErrorCode(errorCode: string) {
  const file = process.env.CDK_ERROR_FILE;
  if (!file) {
    return;
  }

  // Update the indicated file
  fs.writeFileSync(file, errorCode, 'utf-8');
}
