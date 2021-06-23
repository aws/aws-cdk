/**
 * The result of `Match.test()`.
 */
export class MatchResult {
  private readonly failures: MatchFailure[] = [];

  /**
   * Push a new failure into this result at a specific path.
   * If the failure occurred at root of the match tree, set the path to an empty list.
   * If it occurs in the 5th index of an array nested within the 'foo' key of an object,
   * set the path as `['/foo', '[5]']`.
   * @param path the path at which the failure occurred.
   * @param message the failure
   */
  public push(path: string[], message: string): this {
    this.failures.push({ path, message });
    return this;
  }

  /** Does the result contain any failures. If not, the result is a success */
  public hasFailed(): boolean {
    return this.failures.length !== 0;
  }

  /** The number of failures */
  public get failCount(): number {
    return this.failures.length;
  }

  /**
   * Compose the results of a previous match as a subtree.
   * @param id the id of the parent tree.
   */
  public compose(id: string, inner: MatchResult): this {
    const innerF = (inner as any).failures as MatchFailure[];
    this.failures.push(...innerF.map(f => {
      return { path: [id, ...f.path], message: f.message };
    }));
    return this;
  }

  /**
   * Get the list of failures as human readable strings
   */
  public toHumanStrings(): string[] {
    return this.failures.map(r => {
      const loc = r.path.length === 0 ? '' : ` at ${r.path.join('')}`;
      return '' + r.message + loc;
    });
  }
}

type MatchFailure = {
  path: string[];
  message: string;
}