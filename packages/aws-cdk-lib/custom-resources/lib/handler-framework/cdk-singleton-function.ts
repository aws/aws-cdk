import { Construct } from 'constructs';
import { CdkCode } from './cdk-code';
import { FunctionOptions, SingletonFunction } from '../../../aws-lambda';
import { RuntimeDeterminer } from '../helpers-internal/runtime-determiner';

/**
 * Placeholder
 */
export interface CdkSingletonFunctionProps extends FunctionOptions {
  /**
   * Placeholder
   */
  readonly uuid: string;

  /**
   * Placeholder
   */
  readonly code: CdkCode;

  /**
   * Placeholder
   */
  readonly handler: string;

  /**
   * Placeholder
   */
  readonly lambdaPurpose?: string;
}

/**
 * Placeholder
 */
export class CdkSingletonFunction extends SingletonFunction {
  public constructor(scope: Construct, id: string, props: CdkSingletonFunctionProps) {
    super(scope, id, {
      ...props,
      code: props.code.codeFromAsset,
      runtime: RuntimeDeterminer.determineRuntime(props.code.compatibleRuntimes),
    });
  }
}
