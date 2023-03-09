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

  /**
   * The cost of this particular mismatch
   *
   * @default 1
   */
  readonly cost?: number;
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
  private readonly failuresHere = new Map<string, MatchFailure[]>();
  private readonly captures: Map<Capture, any[]> = new Map();
  private finalized: boolean = false;
  private readonly innerMatchFailures = new Map<string, MatchResult>();
  private _hasFailed = false;
  private _failCount = 0;
  private _cost = 0;

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
    const failKey = failure.path.join('.');
    let list = this.failuresHere.get(failKey);
    if (!list) {
      list = [];
      this.failuresHere.set(failKey, list);
    }

    this._failCount += 1;
    this._cost += failure.cost ?? 1;
    list.push(failure);
    this._hasFailed = true;
    return this;
  }

  /** Whether the match is a success */
  public get isSuccess(): boolean {
    return !this._hasFailed;
  }

  /** Does the result contain any failures. If not, the result is a success */
  public hasFailed(): boolean {
    return this._hasFailed;
  }

  /** The number of failures */
  public get failCount(): number {
    return this._failCount;
  }

  /** The cost of the failures so far */
  public get failCost(): number {
    return this._cost;
  }

  /**
   * Compose the results of a previous match as a subtree.
   * @param id the id of the parent tree.
   */
  public compose(id: string, inner: MatchResult): this {
    // Record inner failure
    if (inner.hasFailed()) {
      this._hasFailed = true;
      this._failCount += inner.failCount;
      this._cost += inner._cost;
      this.innerMatchFailures.set(id, inner);
    }

    // Copy captures so we all finalize them together
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
   * Render the failed match in a presentable way
   *
   * Prefer using `renderMismatch` over this method. It is left for backwards
   * compatibility for test suites that expect it, but `renderMismatch()` will
   * produce better output.
   */
  public toHumanStrings(): string[] {
    const failures = new Array<MatchFailure>();
    debugger;
    recurse(this, []);

    return failures.map(r => {
      const loc = r.path.length === 0 ? '' : ` at /${r.path.join('/')}`;
      return '' + r.message + loc + ` (using ${r.matcher.name} matcher)`;
    });

    function recurse(x: MatchResult, prefix: string[]): void {
      for (const fail of Array.from(x.failuresHere.values()).flat()) {
        failures.push({
          matcher: fail.matcher,
          message: fail.message,
          path: [...prefix, ...fail.path],
        });
      }
      for (const [key, inner] of x.innerMatchFailures.entries()) {
        recurse(inner, [...prefix, key]);
      }
    }
  }

  /**
   * Do a deep render of the match result, showing the structure mismatches in context
   */
  public renderMismatch(): string {
    if (!this.hasFailed()) {
      return '<match>';
    }

    const parts = new Array<string>();
    const indents = new Array<string>();
    emitFailures(this, '');
    recurse(this);
    return moveMarkersToFront(parts.join('').trimEnd());

    // Implementation starts here.
    // Yes this is a lot of code in one place. That's a bit unfortunate, but this is
    // the simplest way to access private state of the MatchResult, that we definitely
    // do NOT want to make part of the public API.

    function emit(x: string): void {
      if (x === undefined) {
        debugger;
      }
      parts.push(x.replace(/\n/g, `\n${indents.join('')}`));
    }

    function emitFailures(r: MatchResult, path: string, scrapSet?: Set<string>): void {
      for (const fail of r.failuresHere.get(path) ?? []) {
        emit(`!! ${fail.message}\n`);
      }
      scrapSet?.delete(path);
    }

    function recurse(r: MatchResult): void {
      // Failures that have been reported against this MatchResult that we didn't print yet
      const remainingFailures = new Set(Array.from(r.failuresHere.keys()).filter(x => x !== ''));

      //////////////////////////////////////////////////////////////////////
      if (Array.isArray(r.target)) {
        indents.push('  ');
        emit('[\n');
        for (const [first, i] of enumFirst(range(r.target.length))) {
          if (!first) { emit(',\n'); }

          emitFailures(r, `${i}`, remainingFailures);
          const innerMatcher = r.innerMatchFailures.get(`${i}`);
          if (innerMatcher) {
            // Report the top-level failures on the line before the content
            emitFailures(innerMatcher, '');
            recurseComparingValues(innerMatcher, r.target[i]);
          } else {
            emit(renderAbridged(r.target[i]));
          }
        }

        emitRemaining();
        indents.pop();
        emit('\n]');

        return;
      }

      //////////////////////////////////////////////////////////////////////
      if (r.target && typeof r.target === 'object') {
        indents.push('  ');
        emit('{\n');
        const keys = Array.from(new Set([
          ...Object.keys(r.target),
          ...Array.from(remainingFailures),
        ])).sort();

        for (const [first, key] of enumFirst(keys)) {
          if (!first) { emit(',\n'); }

          emitFailures(r, key, remainingFailures);
          const innerMatcher = r.innerMatchFailures.get(key);
          if (innerMatcher) {
            // Report the top-level failures on the line before the content
            emitFailures(innerMatcher, '');
            emit(`${jsonify(key)}: `);
            recurseComparingValues(innerMatcher, r.target[key]);
          } else {
            emit(`${jsonify(key)}: `);
            emit(renderAbridged(r.target[key]));
          }
        }

        emitRemaining();
        indents.pop();
        emit('\n}');

        return;
      }

      //////////////////////////////////////////////////////////////////////
      emitRemaining();
      emit(jsonify(r.target));

      function emitRemaining(): void {
        if (remainingFailures.size > 0) {
          emit('\n');
        }
        for (const key of remainingFailures) {
          emitFailures(r, key);
        }
      }
    }

    /**
     * Recurse to the inner matcher, but with a twist:
     *
     * If the match result target value is not the same as the given value,
     * then the matcher is matching a transformation of the given value.
     *
     * In that case, render both.
     *
     * FIXME: All of this rendering should have been at the discretion of
     * the matcher, it shouldn't all live here.
     */
    function recurseComparingValues(inner: MatchResult, actualValue: any): void {
      if (inner.target === actualValue) {
        return recurse(inner);
      }
      emit(renderAbridged(actualValue));
      emit(' <*> ');
      recurse(inner);
    }

    /**
     * Render an abridged version of a value
     */
    function renderAbridged(x: any): string {
      if (Array.isArray(x)) {
        switch (x.length) {
          case 0: return '[]';
          case 1: return `[ ${renderAbridged(x[0])} ]`;
          case 2:
            // Render if all values are scalars
            if (x.every(e => ['number', 'boolean', 'string'].includes(typeof e))) {
              return `[ ${x.map(renderAbridged).join(', ')} ]`;
            }
            return '[ ... ]';
          default: return '[ ... ]';
        }
      }
      if (x && typeof x === 'object') {
        const keys = Object.keys(x);
        switch (keys.length) {
          case 0: return '{}';
          case 1: return `{ ${JSON.stringify(keys[0])}: ${renderAbridged(x[keys[0]])} }`;
          default: return '{ ... }';
        }
      }
      return jsonify(x);
    }

    function jsonify(x: any): string {
      return JSON.stringify(x) ?? 'undefined';
    }

    /**
     * Move markers to the front of each line
     */
    function moveMarkersToFront(x: string): string {
      const re = /^(\s+)!!/gm;
      return x.replace(re, (_, spaces: string) => `!!${spaces.substring(0, spaces.length - 2) }`);
    }
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

function* range(n: number): Iterable<number> {
  for (let i = 0; i < n; i++) {
    yield i;
  }
}

function* enumFirst<A>(xs: Iterable<A>): Iterable<[boolean, A]> {
  let first = true;
  for (const x of xs) {
    yield [first, x];
    first = false;
  }
}