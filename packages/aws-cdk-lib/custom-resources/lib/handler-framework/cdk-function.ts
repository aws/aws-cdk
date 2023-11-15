import { Construct } from 'constructs';
import { Function, FunctionOptions, Runtime } from '../../../aws-lambda';
import { CdkHandler } from './cdk-handler';
import { Lazy } from '../../../core';
import { LatestRuntime } from './latest-runtime';

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
  private static readonly DEFAULT_RUNTIME = Runtime.NODEJS_LATEST;

  public constructor(scope: Construct, id: string, props: CdkFunctionProps) {
    super(scope, id, {
      runtime: Lazy.any(
        { produce: () => this.determineRuntime(props.cdkHandler.compatibleRuntimes) },
      ) as unknown as Runtime,
      code: props.cdkHandler.code,
      handler: props.cdkHandler.handler,
      ...props,
    });
  }

  private determineRuntime(compatibleRuntimes: Runtime[]) {
    if (compatibleRuntimes.length < 1) {
      throw new Error('`cdkHandler` must specify at least 1 compatible runtime');
    }

    if (compatibleRuntimes.some(runtime => runtime.runtimeEquals(CdkFunction.DEFAULT_RUNTIME))) {
      return CdkFunction.DEFAULT_RUNTIME;
    }

    LatestRuntime.fromNodejsRuntimes(compatibleRuntimes);
  }
}
