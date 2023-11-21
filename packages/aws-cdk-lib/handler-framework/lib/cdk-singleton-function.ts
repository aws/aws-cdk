import { Construct } from 'constructs';
import { CdkHandler } from './cdk-handler';
import { RuntimeDeterminer } from './utils/runtime-determiner';
import { FunctionOptions, Runtime, RuntimeFamily, SingletonFunction } from '../../aws-lambda';

/**
 * Properties used to define a singleton Lambda function to be used as a custom resource
 * provider.
 */
export interface CdkSingletonFunctionProps extends FunctionOptions {
  /**
   * A unique identifier to identify this lambda
   *
   * The identifier should be unique across all custom resource providers.
   * We recommend generating a UUID per provider.
   */
  readonly uuid: string;

  /**
   * The source code, compatible runtimes, and the method within your code that Lambda calls to execute your function.
   */
  readonly handler: CdkHandler;

  /**
   * A descriptive name for the purpose of this Lambda.
   *
   * If the Lambda does not have a physical name, this string will be
   * reflected its generated name. The combination of lambdaPurpose
   * and uuid must be unique.
   *
   * @default SingletonLambda
   */
  readonly lambdaPurpose?: string;
}

/**
 * Represents a singleton Lambda function to be used as a custom resource provider.
 */
export class CdkSingletonFunction extends SingletonFunction {
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

  public constructor(scope: Construct, id: string, props: CdkSingletonFunctionProps) {
    super(scope, id, {
      ...props,
      code: props.handler.code,
      handler: props.handler.handler,
      runtime: CdkSingletonFunction.determineRuntime(props.handler.compatibleRuntimes),
    });
  }
}
