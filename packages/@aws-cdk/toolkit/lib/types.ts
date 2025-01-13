/**
 * The current action being performed by the CLI. 'none' represents the absence of an action.
 */
export type ToolkitAction =
| 'bootstrap'
| 'synth'
| 'list'
| 'diff'
| 'deploy'
| 'rollback'
| 'watch'
| 'destroy';

export enum StackSelectionStrategy {
  /**
   * Returns an empty selection in case there are no stacks.
   */
  NONE = 'none',

  /**
   * Return matched stacks. If no patterns are provided, return the single stack in the app.
   * If the app has more than one stack, an error is thrown.
   *
   * This is the default strategy used by "deploy" and "destroy".
   */
  MATCH_OR_SINGLE = 'match-or-single',

  /**
   * Throws an exception if the selector doesn't match at least one stack in the app.
   */
  MUST_MATCH_PATTERN = 'must-match-pattern',

  /**
   * Returns all stacks in the main (top level) assembly only.
   */
  MAIN_ASSEMBLY = 'main',

  /**
   * If no selectors are provided, returns all stacks in the app,
   * including stacks inside nested assemblies.
   */
  ALL_STACKS = 'all',
}

/**
 * When selecting stacks, what other stacks to include because of dependencies
 */
export enum ExtendedStackSelection {
  /**
   * Don't select any extra stacks
   */
  NONE = 'none',

  /**
   * Include stacks that this stack depends on
   */
  UPSTREAM = 'upstream',

  /**
   * Include stacks that depend on this stack
   */
  DOWNSTREAM = 'downstream',
}

/**
 * A specification of which stacks should be selected
 */
export interface StackSelector {
  /**
   * A list of patterns to match the stack hierarchical ids
   */
  patterns?: string[];

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
