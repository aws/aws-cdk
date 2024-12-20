export type ToolkitAction =
  | 'bootstrap'
  | 'synth'
  | 'list'
  | 'deploy'
  | 'destroy';

export type MessageLevel = 'error' | 'warn' | 'info' | 'debug';

export enum StackSelectionStrategy {
  /**
   * Returns an empty selection in case there are no stacks.
   */
  None = 'none',

  /**
   * If the app includes a single stack, returns it. Otherwise throws an exception.
   * This behavior is used by "deploy".
   */
  OnlySingle = 'single',

  /**
   * Throws an exception if the app doesn't contain at least one stack.
   */
  AtLeastOne = 'at-lest-one',

  /**
   * Returns all stacks in the main (top level) assembly only.
   */
  MainAssembly = 'main',

  /**
   * If no selectors are provided, returns all stacks in the app,
   * including stacks inside nested assemblies.
   */
  AllStacks = 'all',
}

/**
 * When selecting stacks, what other stacks to include because of dependencies
 */
export enum ExtendedStackSelection {
  /**
   * Don't select any extra stacks
   */
  None,

  /**
   * Include stacks that this stack depends on
   */
  Upstream,

  /**
   * Include stacks that depend on this stack
   */
  Downstream,
}

/**
 * A specification of which stacks should be selected
 */
export interface StackSelector {
  /**
   * A list of patterns to match the stack hierarchical ids
   */
  patterns: string[];

  /**
   * Extend the selection to upstream/downstream stacks
   * @default ExtendedStackSelection.None only select the specified stacks.
   */
  extend?: ExtendedStackSelection;

  /**
   * The behavior if if no selectors are provided.
   */
  strategy: StackSelectionStrategy;
}
