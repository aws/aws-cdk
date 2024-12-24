import { BaseDeployOptions } from './deploy';

export interface WatchOptions extends BaseDeployOptions {
  /**
   * Whether to show CloudWatch logs for hotswapped resources
   * locally in the users terminal
   *
   * @default - false
   */
  readonly traceLogs?: boolean;
}
