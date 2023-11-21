import { Construct } from 'constructs';
import { CdkHandler } from './cdk-handler';
import { RuntimeDeterminer } from './utils/runtime-determiner';
import { Function, FunctionOptions, Runtime, RuntimeFamily } from '../../aws-lambda';

/**
 * Properties used to define a Lambda function used as a custom resource provider.
 */
export interface CdkFunctionProps extends FunctionOptions {
  /**
   * The source code, compatible runtimes, and the method within your code that Lambda calls to execute your function.
   */
  readonly handler: CdkHandler;
}

/**
 * Represents a Lambda function used as a custom resource provider.
 */
export class CdkFunction extends Function {
  private static determineRuntime(compatibleRuntimes: Runtime[]) {
    const nodeJsRuntimes = compatibleRuntimes.filter(runtime => runtime.family === RuntimeFamily.NODEJS);
    const latestNodeJsRuntime = RuntimeDeterminer.latestNodeJsRuntime(nodeJsRuntimes);
    if (latestNodeJsRuntime !== undefined) {
      if (latestNodeJsRuntime.isDeprecated) {
        throw new Error(`Latest nodejs runtime ${latestNodeJsRuntime} is deprecated`);
      }
      return latestNodeJsRuntime;
    }

    const pythonRuntimes = compatibleRuntimes.filter(runtime => runtime.family === RuntimeFamily.PYTHON);
    const latestPythonRuntime = RuntimeDeterminer.latestPythonRuntime(pythonRuntimes);
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
      code: props.handler.code,
      handler: props.handler.handler,
      runtime: CdkFunction.determineRuntime(props.handler.compatibleRuntimes),
    });
  }
}
