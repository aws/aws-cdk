import { SharedOptions } from './common';

/**
 * Options to use with cdk destroy
 */
export interface DestroyOptions extends SharedOptions {
  /**
   * Should the script prompt for approval before destroying stacks
   *
   * @default false
   */
  readonly requireApproval?: boolean;

  /**
   * Only destroy the given stack
   *
   * @default false
   */
  readonly exclusively?: boolean;
}
