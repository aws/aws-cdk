import { StackSelector } from '../types';

export interface SynthOptions {
  /**
   * Select the stacks
   */
  readonly stacks: StackSelector;

  /**
   * After synthesis, validate stacks with the "validateOnSynth" attribute set (can also be controlled with CDK_VALIDATION)
   * @default true
   */
  readonly validateStacks?: boolean;
}
