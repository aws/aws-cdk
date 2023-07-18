import { SharedOptions } from './common';

/**
 * Options to use with cdk synth
 */
export interface SynthOptions extends SharedOptions {

  /**
   * After synthesis, validate stacks with the "validateOnSynth"
   * attribute set (can also be controlled with CDK_VALIDATION)
   *
   * @default true;
   */
  readonly validation?: boolean;

  /**
   * Do not output CloudFormation Template to stdout
   * @default false;
   */
  readonly quiet?: boolean;

  /**
   * Only synthesize the given stack
   *
   * @default false
   */
  readonly exclusively?: boolean;
}
