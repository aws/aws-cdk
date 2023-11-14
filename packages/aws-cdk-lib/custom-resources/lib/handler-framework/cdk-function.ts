import { Construct } from 'constructs';
import { Function, FunctionOptions, Runtime } from '../../../aws-lambda';
import { CdkHandler } from './cdk-handler';

/**
 *
 */
export interface CdkFunctionProps extends FunctionOptions {
  /**
   *
   */
  readonly cdkHandler: CdkHandler,
}

export class CdkFunction extends Function {
  private static readonly PREVIOUS_RUNTIME = Runtime.NODEJS_16_X;
  private static readonly DEFAULT_RUNTIME = Runtime.NODEJS_18_X;

  public constructor(scope: Construct, id: string, props: CdkFunctionProps) {
    super(scope, id, {
      runtime: CdkFunction.DEFAULT_RUNTIME,
      code: props.cdkHandler.code,
      handler: props.cdkHandler.handler,
      ...props,
    });
    this.validateCompatibleRuntimes(props.cdkHandler.compatibleRuntimes);
  }

  private validateCompatibleRuntimes (compatibleRuntime: Runtime[]) {
    if (!compatibleRuntime.includes(CdkFunction.DEFAULT_RUNTIME) || !compatibleRuntime.includes(CdkFunction.PREVIOUS_RUNTIME)) {
      throw new Error();
    }
  }
}
