import { Construct } from 'constructs';
import { CdkCode } from './cdk-code';
import { Function, FunctionOptions, Runtime, RuntimeFamily } from '../../../aws-lambda';
import { LatestRuntime } from '../helpers-internal/latest-runtime';

/**
 * Placeholder
 */
export interface CdkFunctionProps extends FunctionOptions {
  /**
   * Placeholder
   */
  readonly code: CdkCode;

  /**
   * Placeholder
   */
  readonly handler: string;
}

/**
 * Placeholder
 */
export class CdkFunction extends Function {
  private static readonly DEFAULT_RUNTIME = Runtime.NODEJS_LATEST;

  private static determineRuntime(compatibleRuntimes: Runtime[]) {
    const compatibleRuntimesLength = compatibleRuntimes.length;
    if (compatibleRuntimesLength < 1) {
      throw new Error('`cdkHandler` must specify at least 1 compatible runtime');
    }

    if (compatibleRuntimes.some(runtime => runtime.runtimeEquals(CdkFunction.DEFAULT_RUNTIME))) {
      return CdkFunction.DEFAULT_RUNTIME;
    }

    const runtimes = new Map<RuntimeFamily, Runtime[]>();
    // categorize runtimes by family
    for (let runtime of runtimes) {

    }

    if (runtimes.has(RuntimeFamily.NODEJS)) {
      const latestNodejsRuntime = LatestRuntime.fromNodejsRuntimes(runtimes.get(RuntimeFamily.NODEJS)!);
      if (latestNodejsRuntime.isDeprecated) {
        throw new Error();
      }
      return latestNodejsRuntime;
    }

    if (runtimes.has(RuntimeFamily.PYTHON)) {
      const latestPythonRuntime = LatestRuntime.fromPythonRuntimes(runtimes.get(RuntimeFamily.PYTHON)!);
      if (latestPythonRuntime.isDeprecated) {
        throw new Error();
      }
      return latestPythonRuntime;
    }

    throw new Error();
  }

  public constructor(scope: Construct, id: string, props: CdkFunctionProps) {
    super(scope, id, {
      ...props,
      runtime: CdkFunction.determineRuntime(props.code.compatibleRuntimes),
      code: props.code.codeFromAsset,
      handler: props.handler,
    });
  }
}
