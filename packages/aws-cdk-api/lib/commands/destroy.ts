import { SharedOptions } from './common';

/**
 * Options to use with cdk destroy
 */
export interface DestroyOptions extends SharedOptions {
  /**
   * Do not ask for permission before destroying stacks
   *
   * @default false
   */
  readonly force?: boolean;

  /**
   * Only destroy the given stack
   *
   * @default false
   */
  readonly exclusively?: boolean;
}
