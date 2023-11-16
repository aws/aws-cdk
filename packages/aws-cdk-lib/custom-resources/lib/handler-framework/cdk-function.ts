import { Construct } from 'constructs';
import { CdkCode } from './cdk-code';
import { CdkFunctionBase } from './cdk-function-base';
import { Function, FunctionOptions } from '../../../aws-lambda';

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
export class CdkFunction extends CdkFunctionBase {
  public constructor(scope: Construct, id: string, props: CdkFunctionProps) {
    super();

    new Function(scope, id, {
      ...props,
      code: props.code.codeFromAsset,
      runtime: this.determineRuntime(props.code.compatibleRuntimes),
    });
  }
}
