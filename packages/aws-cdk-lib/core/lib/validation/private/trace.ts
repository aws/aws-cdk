import type { ConstructTree, ConstructTrace } from './construct-tree';

/**
 * Utility class to generate the construct stack trace
 * for a report
 */
export class ReportTrace {
  constructor(private readonly tree: ConstructTree) {}

  /**
   * Return a JSON representation of the construct trace
   */
  public formatJson(constructPath: string): ConstructTrace | undefined {
    return this.tree.traceFromPath(constructPath);
  }
}
