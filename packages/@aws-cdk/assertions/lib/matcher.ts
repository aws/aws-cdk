import { Capture } from './capture';

/**
 * Represents a matcher that can perform special data matching
 * capabilities between a given pattern and a target.
 */
export abstract class Matcher {
  /**
   * Check whether the provided object is a subtype of the `IMatcher`.
   */
  public static isMatcher(x: any): x is Matcher {
    return x && x instanceof Matcher;
  }

  /**
   * A name for the matcher. This is collected as part of the result and may be presented to the user.
   */
  public abstract readonly name: string;

  /**
   * Test whether a target matches the provided pattern.
   * Every Matcher must implement this method.
   * This method will be invoked by the assertions framework. Do not call this method directly.
   * @param actual the target to match
   * @return the list of match failures. An empty array denotes a successful match.
   */
  public abstract test(actual: any): MatchResult;
}

/**
 * Match failure details
 */
export interface MatchFailure {
  /**
   * The matcher that had the failure
   */
  readonly matcher: Matcher;

  /**
   * The relative path in the target where the failure occurred.
   * If the failure occurred at root of the match tree, set the path to an empty list.
   * If it occurs in the 5th index of an array nested within the 'foo' key of an object,
   * set the path as `['/foo', '[5]']`.
   */
  readonly path: string[];

  /**
   * Failure message
   */
  readonly message: string;
}

/**
 * Information about a value captured during match
 */
export interface MatchCapture {
  /**
   * The instance of Capture class to which this capture is associated with.
   */
  readonly capture: Capture;
  /**
   * The value that was captured
   */
  readonly value: any;
}

/**
 * The result of `Match.test()`.
 */
export class MatchResult {
  /**
   * The target for which this result was generated.
   */
  public readonly target: any;
  private readonly failures: MatchFailure[] = [];
  private readonly captures: Map<Capture, any[]> = new Map();
  private finalized: boolean = false;

  constructor(target: any) {
    this.target = target;
  }

  /**
   * DEPRECATED
   * @deprecated use recordFailure()
   */
  public push(matcher: Matcher, path: string[], message: string): this {
    return this.recordFailure({ matcher, path, message });
  }

  /**
   * Record a new failure into this result at a specific path.
   */
  public recordFailure(failure: MatchFailure): this {
    this.failures.push(failure);
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
    const innerF = inner.failures;
    this.failures.push(...innerF.map(f => {
      return { path: [id, ...f.path], message: f.message, matcher: f.matcher };
    }));
    inner.captures.forEach((vals, capture) => {
      vals.forEach(value => this.recordCapture({ capture, value }));
    });
    return this;
  }

  /**
   * Prepare the result to be analyzed.
   * This API *must* be called prior to analyzing these results.
   */
  public finished(): this {
    if (this.finalized) {
      return this;
    }

    if (this.failCount === 0) {
      this.captures.forEach((vals, cap) => cap._captured.push(...vals));
    }
    this.finalized = true;
    return this;
  }

  /**
   * Get the list of failures as human readable strings
   */
  public toHumanStrings(): string[] {
    return this.failures.map(r => {
      const loc = r.path.length === 0 ? '' : ` at ${r.path.join('')}`;
      return '' + r.message + loc + ` (using ${r.matcher.name} matcher)`;
    });
  }

  /**
   * Record a capture against in this match result.
   */
  public recordCapture(options: MatchCapture): void {
    let values = this.captures.get(options.capture);
    if (values === undefined) {
      values = [];
    }
    values.push(options.value);
    this.captures.set(options.capture, values);
  }
}
