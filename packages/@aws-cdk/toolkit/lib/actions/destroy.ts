import { StackSelector } from '../types';

export interface DestroyOptions {
  /**
   * Criteria for selecting stacks to deploy
   */
  readonly stacks: StackSelector;

  /**
   * The arn of the IAM role to use
   */
  readonly roleArn?: string;
}
