import { Matcher, MatchResult } from './matcher';
import { AbsentMatch } from './private/matchers/absent';
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
    if (!this.subsequence && this.pattern.length !== actual.length) {
      return new MatchResult(actual).recordFailure({
        matcher: this,
        path: [],
        message: `Expected array of length ${this.pattern.length} but received ${actual.length}`,
      });
    }

    let patternIdx = 0;
    let actualIdx = 0;

    const result = new MatchResult(actual);
    while (patternIdx < this.pattern.length && actualIdx < actual.length) {
      const patternElement = this.pattern[patternIdx];

      const matcher = Matcher.isMatcher(patternElement)
        ? patternElement
        : new LiteralMatch(this.name, patternElement, { partialObjects: this.partialObjects });

      const matcherName = matcher.name;
      if (this.subsequence && (matcherName == 'absent' || matcherName == 'anyValue')) {
        // array subsequence matcher is not compatible with anyValue() or absent() matcher. They don't make sense to be used together.
        throw new Error(`The Matcher ${matcherName}() cannot be nested within arrayWith()`);
      }

      const innerResult = matcher.test(actual[actualIdx]);

      if (!this.subsequence || !innerResult.hasFailed()) {
        result.compose(`[${actualIdx}]`, innerResult);
        patternIdx++;
        actualIdx++;
      } else {
        actualIdx++;
      }
    }

    for (; patternIdx < this.pattern.length; patternIdx++) {
      const pattern = this.pattern[patternIdx];
      const element = (Matcher.isMatcher(pattern) || typeof pattern === 'object') ? ' ' : ` [${pattern}] `;
      result.recordFailure({
        matcher: this,
        path: [],
        message: `Missing element${element}at pattern index ${patternIdx}`,
      });
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
            path: [`/${a}`],
            message: 'Unexpected key',
          });
        }
      }
    }

    for (const [patternKey, patternVal] of Object.entries(this.pattern)) {
      if (!(patternKey in actual) && !(patternVal instanceof AbsentMatch)) {
        result.recordFailure({
          matcher: this,
          path: [`/${patternKey}`],
          message: `Missing key '${patternKey}' among {${Object.keys(actual).join(',')}}`,
        });
        continue;
      }
      const matcher = Matcher.isMatcher(patternVal) ?
        patternVal :
        new LiteralMatch(this.name, patternVal, { partialObjects: this.partial });
      const inner = matcher.test(actual[patternKey]);
      result.compose(`/${patternKey}`, inner);
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
    const result = new MatchResult(actual);
    if (getType(actual) !== 'string') {
      result.recordFailure({
        matcher: this,
        path: [],
        message: `Expected JSON as a string but found ${getType(actual)}`,
      });
      return result;
    }
    let parsed;
    try {
      parsed = JSON.parse(actual);
    } catch (err) {
      if (err instanceof SyntaxError) {
        result.recordFailure({
          matcher: this,
          path: [],
          message: `Invalid JSON string: ${actual}`,
        });
        return result;
      } else {
        throw err;
      }
    }

    const matcher = Matcher.isMatcher(this.pattern) ? this.pattern : new LiteralMatch(this.name, this.pattern);
    const innerResult = matcher.test(parsed);
    result.compose(`(${this.name})`, innerResult);
    return result;
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
