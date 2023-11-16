import { Construct } from 'constructs';
import { CdkCode } from './cdk-code';
import { FunctionOptions, Runtime, SingletonFunction } from '../../../aws-lambda';
import { RuntimeDeterminer } from '../helpers-internal/runtime-determiner';

/**
 * Placeholder
 */
export interface CdkSingletonFunctionProps extends FunctionOptions {
  /**
   * Placeholder
   */
  readonly uuid: string;

  /**
   * Placeholder
   */
  readonly code: CdkCode;

  /**
   * Placeholder
   */
  readonly handler: string;

  /**
   * Placeholder
   */
  readonly lambdaPurpose?: string;
}

/**
 * Placeholder
 */
export class CdkSingletonFunction extends SingletonFunction {
  private static determineRuntime(compatibleRuntimes: Runtime[]) {
    const latestNodeJsRuntime = RuntimeDeterminer.determineLatestNodeJsRuntime(compatibleRuntimes);
    if (latestNodeJsRuntime !== undefined) {
      if (latestNodeJsRuntime.isDeprecated) {
        throw new Error(`Latest nodejs runtime ${latestNodeJsRuntime} is deprecated`);
      }
      return latestNodeJsRuntime;
    }

    const latestPythonRuntime = RuntimeDeterminer.determineLatestPythonRuntime(compatibleRuntimes);
    if (latestPythonRuntime !== undefined) {
      if (latestPythonRuntime.isDeprecated) {
        throw new Error(`Latest python runtime ${latestPythonRuntime} is deprecated`);
      }
      return latestPythonRuntime;
    }

    throw new Error('Compatible runtimes must contain either nodejs or python runtimes');
  }

  public constructor(scope: Construct, id: string, props: CdkSingletonFunctionProps) {
    super(scope, id, {
      ...props,
      code: props.code.codeFromAsset,
      runtime: CdkSingletonFunction.determineRuntime(props.code.compatibleRuntimes),
    });
  }
}
