import { Construct } from 'constructs';
import { CdkHandler } from './cdk-handler';
import { Function, FunctionOptions } from '../../aws-lambda';

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
  public constructor(scope: Construct, id: string, props: CdkFunctionProps) {
    super(scope, id, {
      ...props,
      code: props.handler.code,
      handler: props.handler.entrypoint,
      runtime: props.handler.runtime,
    });
  }
}
