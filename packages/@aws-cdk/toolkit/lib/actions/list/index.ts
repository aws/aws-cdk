import type { StackSelector } from '../../api/cloud-assembly';

export interface ListOptions {
  /**
   * Select the stacks
   */
  readonly stacks?: StackSelector;
}
