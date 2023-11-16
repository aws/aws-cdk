import { Construct } from 'constructs';
import { FunctionOptions, SingletonFunction } from '../../../aws-lambda';
import { CdkCode } from './cdk-code';
import { CdkFunctionBase } from './cdk-function-base';

export interface CdkSingletonFunctionProps extends FunctionOptions {
  readonly uuid: string;
  readonly code: CdkCode;
  readonly handler: string;
  readonly lambdaPurpose?: string;
}

export class CdkSingletonFunction extends CdkFunctionBase {
  public constructor(scope: Construct, id: string, props: CdkSingletonFunctionProps) {
    super();

    new SingletonFunction(scope, id, {
      ...props,
      code: props.code.codeFromAsset,
      runtime: this.determineRuntime(props.code.compatibleRuntimes),
    });
  }
}
