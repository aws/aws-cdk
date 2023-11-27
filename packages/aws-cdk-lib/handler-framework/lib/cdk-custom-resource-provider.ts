import { Construct } from 'constructs';
import { CdkFunction } from './cdk-function';
import { CdkHandler } from './cdk-handler';
import { Duration, Size, Stack } from '../../core';

export interface CdkCustomResourceProviderProps {
  /**
   * The source code, compatible runtimes, and the method within your code that Lambda calls to execute your function.
   */
  readonly handler: CdkHandler;

  /**
   * AWS Lambda timeout for the provider.
   *
   * @default Duration.minutes(15)
   */
  readonly timeout?: Duration;

  /**
   * The amount of memory that your function has access to. Increasing the function's memory also increases its CPU
   * allocation.
   *
   * @default Size.mebibytes(128)
   */
  readonly memorySize?: Size;

  /**
   * Key-value pairs that are passed to Lambda as Environment
   *
   * @default - No environment variables.
   */
  readonly environment?: { [key: string]: string };

  /**
   * A description of the function.
   *
   * @default - No description.
   */
  readonly description?: string;
}

export class CdkCustomResourceProvider extends Construct {
  public static getOrCreate(scope: Construct, uniqueid: string, props: CdkCustomResourceProviderProps) {
    return this.getOrCreateProvider(scope, uniqueid, props).serviceToken;
  }

  public static getOrCreateProvider(scope: Construct, uniqueid: string, props: CdkCustomResourceProviderProps) {
    const id = `${uniqueid}CustomResourceProvider`;
    const stack = Stack.of(scope);
    const provider = stack.node.tryFindChild(id) as CdkCustomResourceProvider
      ?? new CdkCustomResourceProvider(stack, id, props);
    return provider;
  }

  /**
   * The ARN of the provider's AWS Lambda function which should be used as the `serviceToken` when defining a custom
   * resource.
   */
  public readonly serviceToken: string;

  protected constructor(scope: Construct, id: string, props: CdkCustomResourceProviderProps) {
    super(scope, id);

    const fn = new CdkFunction(this, 'Handler', {
      handler: props.handler,
      timeout: props.timeout ?? Duration.minutes(15),
      memorySize: props.memorySize?.toMebibytes(),
      description: props.description,
      environment: props.environment,
    });

    this.serviceToken = fn.functionArn;
  }
}