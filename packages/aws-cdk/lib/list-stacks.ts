
import '@jsii/check-node/run';
import { DefaultSelection, ExtendedStackSelection, type StackDetails } from './api/cxapp/cloud-assembly';
import { CdkToolkit } from './cli/cdk-toolkit';

/**
 * Options for List Stacks
 */
export interface ListStacksOptions {
  /**
   * Stacks to list
   *
   * @default - All stacks are listed
   */
  readonly selectors: string[];
}

/**
 * List Stacks
 *
 * @param toolkit cdk toolkit
 * @param options list stacks options
 * @returns StackDetails[]
 */
export async function listStacks(toolkit: CdkToolkit, options: ListStacksOptions): Promise<StackDetails[]> {
  const assembly = await toolkit.assembly();

  const stacks = await assembly.selectStacks({
    patterns: options.selectors,
  }, {
    extend: ExtendedStackSelection.Upstream,
    defaultBehavior: DefaultSelection.AllStacks,
  });

  return stacks.withDependencies();
}
