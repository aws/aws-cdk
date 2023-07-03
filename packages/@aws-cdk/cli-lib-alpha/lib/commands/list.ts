import { SharedOptions } from './common';

/**
 * Options for cdk list
 */
export interface ListOptions extends SharedOptions {
  /**
   * Display environment information for each stack
   *
   * @default false
   */
  readonly long?: boolean;
}
