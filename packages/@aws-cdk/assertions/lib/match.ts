import { MatchResult } from './match-result';
import { ABSENT } from './vendored/assert';

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
  public abstract test(actual: any): MatchResult;
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
      throw new Error('LiteralMatch cannot directly contain another matcher. ' +
        'Remove the top-level matcher or nest it more deeply.');
    }
  }

  public test(actual: any): MatchResult {
    if (Array.isArray(this.pattern)) {
      return new ArrayMatch(this.pattern, { partial: false }).test(actual);
    }

    if (typeof this.pattern === 'object') {
      return new ObjectMatch(this.pattern, { partial: this.partialObjects }).test(actual);
    }

    const result = new MatchResult();
    if (typeof this.pattern !== typeof actual) {
      result.push([], `Expected type ${typeof this.pattern} but received ${getType(actual)}`);
      return result;
    }

    if (this.pattern === ABSENT) {
      throw new Error('absentProperty() can only be used in an object matcher');
    }

    if (actual !== this.pattern) {
      result.push([], `Expected ${this.pattern} but received ${actual}`);
    }

    return result;
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

  public test(actual: any): MatchResult {
    if (!Array.isArray(actual)) {
      return new MatchResult().push([], `Expected type array but received ${getType(actual)}`);
    }
    if (!this.partial && this.pattern.length !== actual.length) {
      return new MatchResult().push([], `Expected array of length ${this.pattern.length} but received ${actual.length}`);
    }

    let patternIdx = 0;
    let actualIdx = 0;

    const result = new MatchResult();
    while (patternIdx < this.pattern.length && actualIdx < actual.length) {
      const patternElement = this.pattern[patternIdx];
      const matcher = Match.isMatcher(patternElement) ? patternElement : new LiteralMatch(patternElement);
      const innerResult = matcher.test(actual[actualIdx]);

      if (!this.partial || !innerResult.hasFailed()) {
        result.compose(`[${actualIdx}]`, innerResult);
        patternIdx++;
        actualIdx++;
      } else {
        actualIdx++;
      }
    }

    for (; patternIdx < this.pattern.length; patternIdx++) {
      const pattern = this.pattern[patternIdx];
      const element = (Match.isMatcher(pattern) || typeof pattern === 'object') ? ' ' : ` [${pattern}] `;
      result.push([], `Missing element${element}at pattern index ${patternIdx}`);
    }

    return result;
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

  public test(actual: any): MatchResult {
    if (typeof actual !== 'object' || Array.isArray(actual)) {
      return new MatchResult().push([], `Expected type object but received ${getType(actual)}`);
    }

    const result = new MatchResult();
    if (!this.partial) {
      for (const a of Object.keys(actual)) {
        if (!(a in this.pattern)) {
          result.push([`/${a}`], 'Unexpected key');
        }
      }
    }

    for (const [patternKey, patternVal] of Object.entries(this.pattern)) {
      if (patternVal === ABSENT) {
        if (patternKey in actual) {
          result.push([`/${patternKey}`], 'Key should be absent');
        }
        continue;
      }
      if (!(patternKey in actual)) {
        result.push([`/${patternKey}`], 'Missing key');
        continue;
      }
      const matcher = Match.isMatcher(patternVal) ? patternVal : new LiteralMatch(patternVal, { partialObjects: this.partial });
      const inner = matcher.test(actual[patternKey]);
      result.compose(`/${patternKey}`, inner);
    }

    return result;
  }
}

function getType(obj: any): string {
  return Array.isArray(obj) ? 'array' : typeof obj;
}