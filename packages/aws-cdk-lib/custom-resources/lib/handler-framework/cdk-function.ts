import { Construct } from 'constructs';
import { CdkCode } from './cdk-code';
import { Function, FunctionOptions, Runtime } from '../../../aws-lambda';
import { RuntimeDeterminer } from '../helpers-internal/runtime-determiner';

/**
 * Properties used to define a Lambda function used as a custom resource provider.
 */
export interface CdkFunctionProps extends FunctionOptions {
  /**
   * The source code of your Lambda function.
   */
  readonly code: CdkCode;

  /**
   * The name of the method within your code that Lambda calls to execute your function.
   */
  readonly handler: string;
}

/**
 * Represents a Lambda function used as a custom resource provider.
 */
export class CdkFunction extends Function {
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

  public constructor(scope: Construct, id: string, props: CdkFunctionProps) {
    super(scope, id, {
      ...props,
      code: props.code.codeFromAsset,
      runtime: CdkFunction.determineRuntime(props.code.compatibleRuntimes),
    });
  }
}
