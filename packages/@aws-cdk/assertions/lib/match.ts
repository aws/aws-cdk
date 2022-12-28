import { Matcher, MatchResult } from './matcher';
import { AbsentMatch } from './private/matchers/absent';
import { sortKeyComparator } from './private/sorting';
import { SparseMatrix } from './private/sparse-matrix';
import { getType } from './private/type';

/**
 * Partial and special matching during template assertions.
 */
export abstract class Match {
  /**
   * Use this matcher in the place of a field's value, if the field must not be present.
   */
  public static absent(): Matcher {
    return new AbsentMatch('absent');
  }

  /**
   * Matches the specified pattern with the array found in the same relative path of the target.
   * The set of elements (or matchers) must be in the same order as would be found.
   * @param pattern the pattern to match
   */
  public static arrayWith(pattern: any[]): Matcher {
    return new ArrayMatch('arrayWith', pattern);
  }

  /**
   * Matches the specified pattern with the array found in the same relative path of the target.
   * The set of elements (or matchers) must match exactly and in order.
   * @param pattern the pattern to match
   */
  public static arrayEquals(pattern: any[]): Matcher {
    return new ArrayMatch('arrayEquals', pattern, { subsequence: false });
  }

  /**
   * Deep exact matching of the specified pattern to the target.
   * @param pattern the pattern to match
   */
  public static exact(pattern: any): Matcher {
    return new LiteralMatch('exact', pattern, { partialObjects: false });
  }

  /**
   * Matches the specified pattern to an object found in the same relative path of the target.
   * The keys and their values (or matchers) must be present in the target but the target can be a superset.
   * @param pattern the pattern to match
   */
  public static objectLike(pattern: {[key: string]: any}): Matcher {
    return new ObjectMatch('objectLike', pattern);
  }

  /**
   * Matches the specified pattern to an object found in the same relative path of the target.
   * The keys and their values (or matchers) must match exactly with the target.
   * @param pattern the pattern to match
   */
  public static objectEquals(pattern: {[key: string]: any}): Matcher {
    return new ObjectMatch('objectEquals', pattern, { partial: false });
  }

  /**
   * Matches any target which does NOT follow the specified pattern.
   * @param pattern the pattern to NOT match
   */
  public static not(pattern: any): Matcher {
    return new NotMatch('not', pattern);
  }

  /**
   * Matches any string-encoded JSON and applies the specified pattern after parsing it.
   * @param pattern the pattern to match after parsing the encoded JSON.
   */
  public static serializedJson(pattern: any): Matcher {
    return new SerializedJson('serializedJson', pattern);
  }

  /**
   * Matches any non-null value at the target.
   */
  public static anyValue(): Matcher {
    return new AnyMatch('anyValue');
  }

  /**
   * Matches targets according to a regular expression
   */
  public static stringLikeRegexp(pattern: string): Matcher {
    return new StringLikeRegexpMatch('stringLikeRegexp', pattern);
  }
}

/**
 * Options when initializing the `LiteralMatch` class.
 */
interface LiteralMatchOptions {
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
class LiteralMatch extends Matcher {
  private readonly partialObjects: boolean;

  constructor(
    public readonly name: string,
    private readonly pattern: any,
    options: LiteralMatchOptions = {}) {

    super();
    this.partialObjects = options.partialObjects ?? false;

    if (Matcher.isMatcher(this.pattern)) {
      throw new Error('LiteralMatch cannot directly contain another matcher. ' +
        'Remove the top-level matcher or nest it more deeply.');
    }
  }

  public test(actual: any): MatchResult {
    if (Array.isArray(this.pattern)) {
      return new ArrayMatch(this.name, this.pattern, { subsequence: false, partialObjects: this.partialObjects }).test(actual);
    }

    if (typeof this.pattern === 'object') {
      return new ObjectMatch(this.name, this.pattern, { partial: this.partialObjects }).test(actual);
    }

    const result = new MatchResult(actual);
    if (typeof this.pattern !== typeof actual) {
      result.recordFailure({
        matcher: this,
        path: [],
        message: `Expected type ${typeof this.pattern} but received ${getType(actual)}`,
      });
      return result;
    }

    if (actual !== this.pattern) {
      result.recordFailure({
        matcher: this,
        path: [],
        message: `Expected ${this.pattern} but received ${actual}`,
      });
    }

    return result;
  }
}

/**
 * Options when initializing the `ArrayMatch` class.
 */
interface ArrayMatchOptions {
  /**
   * Whether the pattern is a subsequence of the target.
   * A subsequence is a sequence that can be derived from another sequence by deleting
   * some or no elements without changing the order of the remaining elements.
   * @default true
   */
  readonly subsequence?: boolean;

  /**
   * Whether to continue matching objects inside the array partially
   *
   * @default false
   */
  readonly partialObjects?: boolean;
}

/**
 * Match class that matches arrays.
 */
class ArrayMatch extends Matcher {
  private readonly subsequence: boolean;
  private readonly partialObjects: boolean;

  constructor(
    public readonly name: string,
    private readonly pattern: any[],
    options: ArrayMatchOptions = {}) {

    super();
    this.subsequence = options.subsequence ?? true;
    this.partialObjects = options.partialObjects ?? false;
  }

  public test(actual: any): MatchResult {
    if (!Array.isArray(actual)) {
      return new MatchResult(actual).recordFailure({
        matcher: this,
        path: [],
        message: `Expected type array but received ${getType(actual)}`,
      });
    }

    return this.subsequence ? this.testSubsequence(actual) : this.testFullArray(actual);
  }

  private testFullArray(actual: Array<any>): MatchResult {
    const result = new MatchResult(actual);

    let i = 0;
    for (; i < this.pattern.length && i < actual.length; i++) {
      const patternElement = this.pattern[i];
      const matcher = Matcher.isMatcher(patternElement)
        ? patternElement
        : new LiteralMatch(this.name, patternElement, { partialObjects: this.partialObjects });

      const innerResult = matcher.test(actual[i]);
      result.compose(`${i}`, innerResult);
    }

    if (i < this.pattern.length) {
      result.recordFailure({
        matcher: this,
        message: `Not enough elements in array (expecting ${this.pattern.length}, got ${actual.length})`,
        path: [`${i}`],
      });
    }
    if (i < actual.length) {
      result.recordFailure({
        matcher: this,
        message: `Too many elements in array (expecting ${this.pattern.length}, got ${actual.length})`,
        path: [`${i}`],
      });
    }

    return result;
  }

  private testSubsequence(actual: Array<any>): MatchResult {
    const result = new MatchResult(actual);

    // For subsequences, there is a lot of testing and backtracking that happens
    // here, keep track of it all so we can report in a sensible amount of
    // detail on what we did if the match happens to fail.

    let patternIdx = 0;
    let actualIdx = 0;
    const matches = new SparseMatrix<MatchResult>();

    while (patternIdx < this.pattern.length && actualIdx < actual.length) {
      const patternElement = this.pattern[patternIdx];

      const matcher = Matcher.isMatcher(patternElement)
        ? patternElement
        : new LiteralMatch(this.name, patternElement, { partialObjects: this.partialObjects });

      const matcherName = matcher.name;
      if (matcherName == 'absent' || matcherName == 'anyValue') {
        // array subsequence matcher is not compatible with anyValue() or absent() matcher. They don't make sense to be used together.
        throw new Error(`The Matcher ${matcherName}() cannot be nested within arrayWith()`);
      }

      const innerResult = matcher.test(actual[actualIdx]);
      matches.set(patternIdx, actualIdx, innerResult);

      actualIdx++;
      if (innerResult.isSuccess) {
        result.compose(`${actualIdx}`, innerResult); // Record any captures
        patternIdx++;
      }
    }

    // If we haven't matched all patterns:
    // - Report on each one that did match on where it matched (perhaps it was wrong)
    // - Report the closest match for the failing one
    if (patternIdx < this.pattern.length) {
      // Succeeded Pattern Index
      for (let spi = 0; spi < patternIdx; spi++) {
        const foundMatch = matches.row(spi).find(([, r]) => r.isSuccess);
        if (!foundMatch) { continue; } // Should never fail but let's be defensive

        const [index] = foundMatch;

        result.compose(`${index}`, new MatchResult(actual[index]).recordFailure({
          matcher: this,
          message: `arrayWith pattern ${spi} matched here`,
          path: [],
          cost: 0, // This is an informational message so it would be unfair to assign it cost
        }));
      }

      const failedMatches = matches.row(patternIdx);
      failedMatches.sort(sortKeyComparator(([i, r]) => [r.failCost, i]));
      if (failedMatches.length > 0) {
        const [index, innerResult] = failedMatches[0];
        result.recordFailure({
          matcher: this,
          message: `Could not match arrayWith pattern ${patternIdx}. This is the closest match`,
          path: [`${index}`],
          cost: 0, //  Informational message
        });
        result.compose(`${index}`, innerResult);
      } else {
        // The previous matcher matched at the end of the pattern and we didn't even get to try anything
        result.recordFailure({
          matcher: this,
          message: `Could not match arrayWith pattern ${patternIdx}. No more elements to try`,
          path: [`${actual.length}`],
        });
      }
    }

    return result;
  }
}

/**
 * Options when initializing `ObjectMatch` class.
 */
interface ObjectMatchOptions {
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
class ObjectMatch extends Matcher {
  private readonly partial: boolean;

  constructor(
    public readonly name: string,
    private readonly pattern: {[key: string]: any},
    options: ObjectMatchOptions = {}) {

    super();
    this.partial = options.partial ?? true;
  }

  public test(actual: any): MatchResult {
    if (typeof actual !== 'object' || Array.isArray(actual)) {
      return new MatchResult(actual).recordFailure({
        matcher: this,
        path: [],
        message: `Expected type object but received ${getType(actual)}`,
      });
    }

    const result = new MatchResult(actual);
    if (!this.partial) {
      for (const a of Object.keys(actual)) {
        if (!(a in this.pattern)) {
          result.recordFailure({
            matcher: this,
            path: [a],
            message: `Unexpected key ${a}`,
          });
        }
      }
    }

    for (const [patternKey, patternVal] of Object.entries(this.pattern)) {
      if (!(patternKey in actual) && !(patternVal instanceof AbsentMatch)) {
        result.recordFailure({
          matcher: this,
          path: [patternKey],
          message: `Missing key '${patternKey}'`,
        });
        continue;
      }
      const matcher = Matcher.isMatcher(patternVal) ?
        patternVal :
        new LiteralMatch(this.name, patternVal, { partialObjects: this.partial });
      const inner = matcher.test(actual[patternKey]);
      result.compose(patternKey, inner);
    }

    return result;
  }
}

class SerializedJson extends Matcher {
  constructor(
    public readonly name: string,
    private readonly pattern: any,
  ) {
    super();
  };

  public test(actual: any): MatchResult {
    if (getType(actual) !== 'string') {
      return new MatchResult(actual).recordFailure({
        matcher: this,
        path: [],
        message: `Expected JSON as a string but found ${getType(actual)}`,
      });
    }
    let parsed;
    try {
      parsed = JSON.parse(actual);
    } catch (err) {
      if (err instanceof SyntaxError) {
        return new MatchResult(actual).recordFailure({
          matcher: this,
          path: [],
          message: `Invalid JSON string: ${actual}`,
        });
      } else {
        throw err;
      }
    }

    const matcher = Matcher.isMatcher(this.pattern) ? this.pattern : new LiteralMatch(this.name, this.pattern);
    const innerResult = matcher.test(parsed);
    if (innerResult.hasFailed()) {
      innerResult.recordFailure({
        matcher: this,
        path: [],
        message: 'Encoded JSON value does not match',
      });
    }
    return innerResult;
  }
}

class NotMatch extends Matcher {
  constructor(
    public readonly name: string,
    private readonly pattern: {[key: string]: any}) {

    super();
  }

  public test(actual: any): MatchResult {
    const matcher = Matcher.isMatcher(this.pattern) ? this.pattern : new LiteralMatch(this.name, this.pattern);

    const innerResult = matcher.test(actual);
    const result = new MatchResult(actual);
    if (innerResult.failCount === 0) {
      result.recordFailure({
        matcher: this,
        path: [],
        message: `Found unexpected match: ${JSON.stringify(actual, undefined, 2)}`,
      });
    }
    return result;
  }
}

class AnyMatch extends Matcher {
  constructor(public readonly name: string) {
    super();
  }

  public test(actual: any): MatchResult {
    const result = new MatchResult(actual);
    if (actual == null) {
      result.recordFailure({
        matcher: this,
        path: [],
        message: 'Expected a value but found none',
      });
    }
    return result;
  }
}

class StringLikeRegexpMatch extends Matcher {
  constructor(
    public readonly name: string,
    private readonly pattern: string) {

    super();
  }

  test(actual: any): MatchResult {
    const result = new MatchResult(actual);

    const regex = new RegExp(this.pattern, 'gm');

    if (typeof actual !== 'string') {
      result.recordFailure({
        matcher: this,
        path: [],
        message: `Expected a string, but got '${typeof actual}'`,
      });
    }

    if (!regex.test(actual)) {
      result.recordFailure({
        matcher: this,
        path: [],
        message: `String '${actual}' did not match pattern '${this.pattern}'`,
      });
    }

    return result;
  }

}
