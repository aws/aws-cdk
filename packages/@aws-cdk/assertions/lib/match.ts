import { ABSENT } from './vendored/assert';

/**
 * Denotes a failure when matching patterns to targets.
 */
export interface MatchFailure {
  /**
   * The relative path at which the failure occurred.
   */
  readonly path: string[];
  /**
   * Description of the match failure.
   */
  readonly message: string;
}

/**
 * Partial and special matching during template assertions.
 */
export abstract class Match {
  /**
   * Use this matcher in the place of a field's value, if the field must not be present.
   */
  public static absentProperty(): string {
    return ABSENT;
  }

  /**
   * Matches the specified pattern with the array found in the same relative path of the target.
   * The set of elements (or matchers) must be in the same order as would be found.
   * @param pattern the pattern to match
   */
  public static arrayWith(pattern: any[]): Match {
    return new ArrayMatch(pattern);
  }

  /**
   * Matches the specified pattern with the array found in the same relative path of the target.
   * The set of elements (or matchers) must match exactly and in order.
   * @param pattern the pattern to match
   */
  public static arrayEquals(pattern: any[]): Match {
    return new ArrayMatch(pattern, { partial: false });
  }

  /**
   * Matches the specified pattern to an object found in the same relative path of the target.
   * The keys and their values (or matchers) must be present in the target but the target can be a superset.
   * @param pattern the pattern to match
   */
  public static objectLike(pattern: {[key: string]: any}): Match {
    return new ObjectMatch(pattern);
  }

  /**
   * Matches the specified pattern to an object found in the same relative path of the target.
   * The keys and their values (or matchers) must match exactly with the target.
   * @param pattern the pattern to match
   */
  public static objectEquals(pattern: {[key: string]: any}): Match {
    return new ObjectMatch(pattern, { partial: false });
  }

  /**
   * Check whether the provided object is a subtype of the `Match` class
   */
  public static isMatcher(x: any): x is Match {
    return x && x instanceof Match;
  }

  /**
   * Test whether a target matches the provided pattern.
   * @param actual the target to match
   * @return the list of match failures. An empty array denotes a successful match.
   */
  public abstract test(actual: any): MatchFailure[];
}

/**
 * Options when initializing the `LiteralMatch` class.
 */
export interface LiteralMatchOptions {
  /**
   * Whether objects nested at any level should be matched partially.
   * @default false
   */
  readonly partialObjects?: boolean;
}

/**
 * A Match class that expects the target to match with the pattern exactly.
 * The pattern may be nested with other matchers that are then deletegated to.
 */
export class LiteralMatch extends Match {
  private readonly partialObjects: boolean;

  constructor(private readonly pattern: any, options: LiteralMatchOptions = {}) {
    super();
    this.partialObjects = options.partialObjects ?? false;

    if (Match.isMatcher(this.pattern)) {
      throw new Error('ExactMatch cannot be nested with another matcher at the top level. Deeper nesting is allowed.');
    }
  }

  public test(actual: any): MatchFailure[] {
    if (Array.isArray(this.pattern)) {
      return new ArrayMatch(this.pattern, { partial: false }).test(actual);
    }

    if (typeof this.pattern === 'object') {
      return new ObjectMatch(this.pattern, { partial: this.partialObjects }).test(actual);
    }

    if (typeof this.pattern !== typeof actual) {
      return [{ path: [], message: `Expected type ${typeof this.pattern} but received ${getType(actual)}` }];
    }

    if (this.pattern === ABSENT) {
      throw new Error('ABSENT can only be used in an object matcher');
    }

    if (actual !== this.pattern) {
      return [{ path: [], message: `Expected ${this.pattern} but received ${actual}` }];
    }

    return [];
  }
}

/**
 * Options when initializing the `ArrayMatch` class.
 */
export interface ArrayMatchOptions {
  /**
   * Whether the pattern should partially match with the target.
   * The target array can contain more elements than expected by the pattern.
   * Matching elements in the target must be present in the same order as in the pattern.
   * @default true
   */
  readonly partial?: boolean;
}

/**
 * Match class that matches arrays.
 */
export class ArrayMatch extends Match {
  private readonly partial: boolean;

  constructor(private readonly pattern: any[], options: ArrayMatchOptions = {}) {
    super();
    this.partial = options.partial ?? true;
  }

  public test(actual: any): MatchFailure[] {
    if (!Array.isArray(actual)) {
      return [{ path: [], message: `Expected type array but received ${getType(actual)}` }];
    }
    if (!this.partial && this.pattern.length !== actual.length) {
      return [{ path: [], message: `Expected array of length ${this.pattern.length} but received ${actual.length}` }];
    }

    let patternIdx = 0;
    let actualIdx = 0;

    const failures: MatchFailure[] = [];
    while (patternIdx < this.pattern.length && actualIdx < actual.length) {
      let patternElement = this.pattern[patternIdx];
      let matcher = Match.isMatcher(patternElement) ? patternElement : new LiteralMatch(patternElement);
      const innerFailures = matcher.test(actual[actualIdx]);

      if (!this.partial || innerFailures.length === 0) {
        failures.push(...composeFailures(`[${actualIdx}]`, innerFailures));
        patternIdx++;
        actualIdx++;
      } else {
        actualIdx++;
      }
    }

    for (; patternIdx < this.pattern.length; patternIdx++) {
      const p = this.pattern[patternIdx];
      const e = (Match.isMatcher(p) || typeof p === 'object') ? ' ' : ` [${p}] `;
      failures.push({ path: [], message: `Missing element${e}at pattern index ${patternIdx}` });
    }

    return failures;
  }
}

/**
 * Options when initializing `ObjectMatch` class.
 */
export interface ObjectMatchOptions {
  /**
   * Whether the pattern should partially match with the target object.
   * The target object can contain more keys than expected by the pattern.
   * @default true
   */
  readonly partial?: boolean;
}

/**
 * Match class that matches objects.
 */
export class ObjectMatch extends Match {
  private readonly partial: boolean;
  constructor(
    private readonly pattern: {[key: string]: any},
    options: ObjectMatchOptions = {}) {

    super();
    this.partial = options.partial ?? true;
  }

  public test(actual: any): MatchFailure[] {
    if (typeof actual !== 'object' || Array.isArray(actual)) {
      return [{ path: [], message: `Expected type object but received ${getType(actual)}` }];
    }

    const failures: MatchFailure[] = [];
    if (!this.partial) {
      for (const a of Object.keys(actual)) {
        if (!(a in this.pattern)) {
          failures.push({ path: [], message: `Unexpected key '${a}'` });
        }
      }
    }

    for (const [patternKey, patternVal] of Object.entries(this.pattern)) {
      if (patternVal === ABSENT) {
        if (patternKey in actual) {
          failures.push({ path: [], message: `Expected key '${patternKey}' to be absent but present` });
        }
        continue;
      }
      if (!(patternKey in actual)) {
        failures.push({ path: [], message: `Missing key '${patternKey}'` });
        continue;
      }
      const matcher = Match.isMatcher(patternVal) ? patternVal : new LiteralMatch(patternVal, { partialObjects: this.partial });
      const innerFailures = matcher.test(actual[patternKey]);
      failures.push(...composeFailures(`/${patternKey}`, innerFailures));
    }

    return failures;
  }
}

function getType(obj: any): string {
  return Array.isArray(obj) ? 'array' : typeof obj;
}

function composeFailures(relativePath: string, inner: MatchFailure[]): MatchFailure[] {
  return inner.map(f => {
    return { path: [relativePath, ...f.path], message: f.message };
  });
}