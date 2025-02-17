import { DefaultCdkOptions } from './common';

/**
 * Options for cdk list
 */
export interface ListOptions extends DefaultCdkOptions {
  /**
   *Display environment information for each stack
   *
   * @default false
   */
  readonly long?: boolean;
}
