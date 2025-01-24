import { StackSelector } from '../api/cloud-assembly/stack-selector';

export interface ListOptions {
  /**
   * Select the stacks
   */
  readonly stacks: StackSelector;
}
