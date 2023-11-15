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
      throw new Error('`code` must specify at least 1 compatible runtime');
    }

    if (compatibleRuntimes.some(runtime => runtime.runtimeEquals(CdkFunction.DEFAULT_RUNTIME))) {
      return CdkFunction.DEFAULT_RUNTIME;
    }

    const runtimesByFamily = new Map<RuntimeFamily, Runtime[]>();
    // categorize runtimes by family
    for (let runtime of compatibleRuntimes) {
      if (runtime.family !== undefined) {
        if (runtimesByFamily.has(runtime.family)) {
          const runtimesForFamily = runtimesByFamily.get(runtime.family);
          if (runtimesForFamily !== undefined) {
            runtimesForFamily.push(runtime);
            runtimesByFamily.set(runtime.family, runtimesForFamily);
          }
        } else {
          runtimesByFamily.set(runtime.family, [runtime]);
        }
      }
    }

    const nodejsRuntimes = runtimesByFamily.get(RuntimeFamily.NODEJS);
    if (nodejsRuntimes !== undefined && nodejsRuntimes.length > 0) {
      const latestRuntime = LatestRuntime.fromNodejsRuntimes(nodejsRuntimes);
      if (latestRuntime.isDeprecated) {
        throw new Error();
      }
      return latestRuntime;
    }

    const pythonRuntimes = runtimesByFamily.get(RuntimeFamily.PYTHON);
    if (pythonRuntimes !== undefined && pythonRuntimes.length > 0) {
      const latestRuntime = LatestRuntime.fromPythonRuntimes(pythonRuntimes);
      if (latestRuntime.isDeprecated) {
        throw new Error();
      }
      return latestRuntime;
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
