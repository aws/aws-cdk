import type { StackSelector } from '../../api/cloud-assembly';

export interface DestroyOptions {
  /**
   * Criteria for selecting stacks to deploy
   */
  readonly stacks: StackSelector;

  /**
   * The arn of the IAM role to use
   */
  readonly roleArn?: string;

  /**
   * Change stack watcher output to CI mode.
   *
   * @deprecated Implement in IoHost instead
   */
  readonly ci?: boolean;
}
