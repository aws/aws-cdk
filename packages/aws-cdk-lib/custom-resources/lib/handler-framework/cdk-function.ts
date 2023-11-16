import { Construct } from 'constructs';
import { CdkCode } from './cdk-code';
import { Function, FunctionOptions, Runtime, RuntimeFamily } from '../../../aws-lambda';
import { latestNodejsRuntime, latestPythonRuntime } from '../helpers-internal/version-compare';

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
    if (compatibleRuntimes.length === 0) {
      throw new Error('`code` must specify at least one compatible runtime');
    }

    // check for default runtime
    if (compatibleRuntimes.some(runtime => runtime.runtimeEquals(CdkFunction.DEFAULT_RUNTIME))) {
      return CdkFunction.DEFAULT_RUNTIME;
    }

    // first try for latest nodejs runtime
    const nodejsRuntimes = compatibleRuntimes.filter(runtime => runtime.family === RuntimeFamily.NODEJS);
    if (nodejsRuntimes !== undefined && nodejsRuntimes.length > 0) {
      let latestRuntime = nodejsRuntimes[0];
      for (let idx = 1; idx < nodejsRuntimes.length; idx++) {
        latestRuntime = latestNodejsRuntime(latestRuntime, nodejsRuntimes[idx]);
      }
      if (latestRuntime.isDeprecated) {
        throw new Error(`Latest compatible Nodejs runtime found ${latestRuntime} is deprecated`);
      }
      return latestRuntime;
    }

    // next try for latest python runtime
    const pythonRuntimes = compatibleRuntimes.filter(runtime => runtime.family === RuntimeFamily.PYTHON);
    if (pythonRuntimes !== undefined && pythonRuntimes.length > 0) {
      let latestRuntime = pythonRuntimes[0];
      for (let idx = 1; idx < pythonRuntimes.length; idx++) {
        latestRuntime = latestPythonRuntime(latestRuntime, pythonRuntimes[idx]);
      }
      if (latestRuntime.isDeprecated) {
        throw new Error(`Latest compatible Python runtime found ${latestRuntime} is deprecated`);
      }
      return latestRuntime;
    }

    // throw if nodejs or python runtimes aren't specified
    throw new Error('Compatible runtimes can only be python or nodejs');
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
