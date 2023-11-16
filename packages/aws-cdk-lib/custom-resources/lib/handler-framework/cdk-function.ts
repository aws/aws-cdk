import { Construct } from 'constructs';
import { CdkCode } from './cdk-code';
import { Function, FunctionOptions } from '../../../aws-lambda';
import { RuntimeDeterminer } from '../helpers-internal/runtime-determiner';

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
export class CdkFunction extends Function {
  public constructor(scope: Construct, id: string, props: CdkFunctionProps) {
    super(scope, id, {
      ...props,
      code: props.code.codeFromAsset,
      runtime: RuntimeDeterminer.determineRuntime(props.code.compatibleRuntimes),
    });
  }
}
