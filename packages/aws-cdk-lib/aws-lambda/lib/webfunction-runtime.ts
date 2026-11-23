import { RuntimeFamily } from './runtime';
import { Token } from '../../core';
import { UnscopedValidationError } from '../../core/lib/errors';
import { lit } from '../../core/lib/private/literal-string';

/**
 * Runtime environment for WebFunction
 */
export class WebFunctionRuntime {
  /**
   * Node.js 24.x runtime
   */
  public static readonly NODEJS_24_X = new WebFunctionRuntime('nodejs24.x', RuntimeFamily.NODEJS);

  /**
   * Node.js 26.x runtime
   */
  public static readonly NODEJS_26_X = new WebFunctionRuntime('nodejs26.x', RuntimeFamily.NODEJS);

  /**
   * Python 3.15 runtime
   *
   * This runtime is in public preview for Lambda Web Functions. Preview runtimes are not
   * covered by the Lambda SLA or Technical Support, should not be used for production
   * workloads, and may still receive breaking changes.
   *
   * @see https://docs.aws.amazon.com/lambda/latest/dg/web-functions-runtimes.html
   */
  public static readonly PYTHON_3_15 = new WebFunctionRuntime('python3.15', RuntimeFamily.PYTHON);

  /**
   * The latest NodeJS version currently available in ALL regions (not necessarily the latest NodeJS version
   * available in YOUR region).
   *
   * This value changes as new Node.js runtimes become available; it currently resolves to
   * Node.js 24.x. The runtime is part of a revision's build configuration, so when an
   * upgrade of the CDK library moves this to a newer runtime, the next deployment creates a
   * new revision on it and shifts the endpoint's traffic there — without any change to your
   * code. Use a specific version such as `NODEJS_24_X` to control when that happens.
   */
  public static readonly NODEJS_LATEST = new WebFunctionRuntime('nodejs24.x', RuntimeFamily.NODEJS);

  /**
   * Use a custom runtime string not yet supported by the CDK.
   *
   * This allows customers to use a newly released runtime without waiting
   * for a CDK library update.
   *
   * Pass `family` when `name` is a deploy-time value (a token), such as a CloudFormation
   * parameter, so that `entryPoint` is passed in the variable that the runtime reads.
   *
   * @param name The runtime identifier (e.g. 'nodejs26.x')
   * @param family The runtime family. If omitted, it is inferred from the start of `name`
   * (`nodejs` or `python`) when `name` is known at synthesis time. If both are known, they must
   * agree.
   */
  public static of(name: string, family?: RuntimeFamily): WebFunctionRuntime {
    const inferred = inferFamily(name);
    if (family !== undefined && inferred !== undefined && family !== inferred) {
      throw new UnscopedValidationError(
        lit`WebFunctionRuntimeFamilyMismatch`,
        `Runtime '${name}' is a ${RuntimeFamily[inferred]} runtime, but family ${RuntimeFamily[family]} was given`,
      );
    }
    return new WebFunctionRuntime(name, family ?? inferred);
  }

  /**
   * The name of this runtime, as expected by the WebFunction resource.
   */
  public readonly name: string;

  /**
   * The runtime family.
   *
   * @default - inferred from the start of `name` (`nodejs` or `python`); undefined if `name` is a
   * deploy-time value (a token), or isn't a Node.js or Python runtime, and no family was given
   */
  public readonly family?: RuntimeFamily;

  private constructor(name: string, family?: RuntimeFamily) {
    this.name = name;
    this.family = family;
  }

  /**
   * Returns the runtime name
   */
  public toString(): string {
    return this.name;
  }
}

/** The runtime family of a runtime name known at synthesis time, if it is Node.js or Python. */
function inferFamily(name: string): RuntimeFamily | undefined {
  if (Token.isUnresolved(name)) {
    return undefined;
  }
  if (name.startsWith('nodejs')) {
    return RuntimeFamily.NODEJS;
  }
  if (name.startsWith('python')) {
    return RuntimeFamily.PYTHON;
  }
  return undefined;
}
