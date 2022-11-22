import { ABSENT, InspectionFailure, PropertyMatcher } from './have-resource';

/**
 * A matcher for an object that contains at least the given fields with the given matchers (or literals)
 *
 * Only does lenient matching one level deep, at the next level all objects must declare the
 * exact expected keys again.
 */
export function objectLike<A extends object>(pattern: A): PropertyMatcher {
  return _objectContaining(pattern, false);
}

/**
 * A matcher for an object that contains at least the given fields with the given matchers (or literals)
 *
 * Switches to "deep" lenient matching. Nested objects also only need to contain declared keys.
 */
export function deepObjectLike<A extends object>(pattern: A): PropertyMatcher {
  return _objectContaining(pattern, true);
}

function _objectContaining<A extends object>(pattern: A, deep: boolean): PropertyMatcher {
  const anno = { [deep ? '$deepObjectLike' : '$objectLike']: pattern };

  return annotateMatcher(anno, (value: any, inspection: InspectionFailure): boolean => {
    if (typeof value !== 'object' || !value) {
      return failMatcher(inspection, `Expect an object but got '${typeof value}'`);
    }

    const errors = new Array<string>();

    for (const [patternKey, patternValue] of Object.entries(pattern)) {
      if (patternValue === ABSENT) {
        if (value[patternKey] !== undefined) { errors.push(`Field ${patternKey} present, but shouldn't be`); }
        continue;
      }

      if (!(patternKey in value)) {
        errors.push(`Field ${patternKey} missing`);
        continue;
      }

      // If we are doing DEEP objectLike, translate object literals in the pattern into
      // more `deepObjectLike` matchers, even if they occur in lists.
      const matchValue = deep ? deepMatcherFromObjectLiteral(patternValue) : patternValue;

      const innerInspection = { ...inspection, failureReason: '' };
      const valueMatches = match(value[patternKey], matchValue, innerInspection);
      if (!valueMatches) {
        errors.push(`Field ${patternKey} mismatch: ${innerInspection.failureReason}`);
      }
    }

    /**
     * Transform nested object literals into more deep object matchers, if applicable
     *
     * Object literals in lists are also transformed.
     */
    function deepMatcherFromObjectLiteral(nestedPattern: any): any {
      if (isObject(nestedPattern)) {
        return deepObjectLike(nestedPattern);
      }
      if (Array.isArray(nestedPattern)) {
        return nestedPattern.map(deepMatcherFromObjectLiteral);
      }
      return nestedPattern;
    }

    if (errors.length > 0) {
      return failMatcher(inspection, errors.join(', '));
    }
    return true;
  });
}

/**
 * Match exactly the given value
 *
 * This is the default, you only need this to escape from the deep lenient matching
 * of `deepObjectLike`.
 */
export function exactValue(expected: any): PropertyMatcher {
  const anno = { $exactValue: expected };
  return annotateMatcher(anno, (value: any, inspection: InspectionFailure): boolean => {
    return matchLiteral(value, expected, inspection);
  });
}

/**
 * A matcher for a list that contains all of the given elements in any order
 */
export function arrayWith(...elements: any[]): PropertyMatcher {
  if (elements.length === 0) { return anything(); }

  const anno = { $arrayContaining: elements.length === 1 ? elements[0] : elements };
  return annotateMatcher(anno, (value: any, inspection: InspectionFailure): boolean => {
    if (!Array.isArray(value)) {
      return failMatcher(inspection, `Expect an array but got '${typeof value}'`);
    }

    for (const element of elements) {
      const failure = longestFailure(value, element);
      if (failure) {
        return failMatcher(inspection, `Array did not contain expected element, closest match at index ${failure[0]}: ${failure[1]}`);
      }
    }

    return true;

    /**
     * Return 'null' if the matcher matches anywhere in the array, otherwise the longest error and its index
     */
    function longestFailure(array: any[], matcher: any): [number, string] | null {
      let fail: [number, string] | null = null;
      for (let i = 0; i < array.length; i++) {
        const innerInspection = { ...inspection, failureReason: '' };
        if (match(array[i], matcher, innerInspection)) {
          return null;
        }

        if (fail === null || innerInspection.failureReason.length > fail[1].length) {
          fail = [i, innerInspection.failureReason];
        }
      }
      return fail;
    }
  });
}

/**
 * Whether a value is an object
 */
function isObject(x: any): x is object {
  // Because `typeof null === 'object'`.
  return x && typeof x === 'object';
}

/**
 * Helper function to make matcher failure reporting a little easier
 *
 * Our protocol is weird (change a string on a passed-in object and return 'false'),
 * but I don't want to change that right now.
 */
export function failMatcher(inspection: InspectionFailure, error: string): boolean {
  inspection.failureReason = error;
  return false;
}

/**
 * Match a given literal value against a matcher
 *
 * If the matcher is a callable, use that to evaluate the value. Otherwise, the values
 * must be literally the same.
 */
export function match(value: any, matcher: any, inspection: InspectionFailure) {
  if (isCallable(matcher)) {
    // Custom matcher (this mostly looks very weird because our `InspectionFailure` signature is weird)
    const innerInspection: InspectionFailure = { ...inspection, failureReason: '' };
    const result = matcher(value, innerInspection);
    if (typeof result !== 'boolean') {
      return failMatcher(inspection, `Predicate returned non-boolean return value: ${result}`);
    }
    if (!result && !innerInspection.failureReason) {
      // Custom matcher neglected to return an error
      return failMatcher(inspection, 'Predicate returned false');
    }
    // Propagate inner error in case of failure
    if (!result) { inspection.failureReason = innerInspection.failureReason; }
    return result;
  }

  return matchLiteral(value, matcher, inspection);
}

/**
 * Match a literal value at the top level.
 *
 * When recursing into arrays or objects, the nested values can be either matchers
 * or literals.
 */
function matchLiteral(value: any, pattern: any, inspection: InspectionFailure) {
  if (pattern == null) { return true; }

  const errors = new Array<string>();

  if (Array.isArray(value) !== Array.isArray(pattern)) {
    return failMatcher(inspection, 'Array type mismatch');
  }
  if (Array.isArray(value)) {
    if (pattern.length !== value.length) {
      return failMatcher(inspection, 'Array length mismatch');
    }

    // Recurse comparison for individual objects
    for (let i = 0; i < pattern.length; i++) {
      if (!match(value[i], pattern[i], { ...inspection })) {
        errors.push(`Array element ${i} mismatch`);
      }
    }

    if (errors.length > 0) {
      return failMatcher(inspection, errors.join(', '));
    }
    return true;
  }
  if ((typeof value === 'object') !== (typeof pattern === 'object')) {
    return failMatcher(inspection, 'Object type mismatch');
  }
  if (typeof pattern === 'object') {
    // Check that all fields in the pattern have the right value
    const innerInspection = { ...inspection, failureReason: '' };
    const matcher = objectLike(pattern)(value, innerInspection);
    if (!matcher) {
      inspection.failureReason = innerInspection.failureReason;
      return false;
    }

    // Check no fields uncovered
    const realFields = new Set(Object.keys(value));
    for (const key of Object.keys(pattern)) { realFields.delete(key); }
    if (realFields.size > 0) {
      return failMatcher(inspection, `Unexpected keys present in object: ${Array.from(realFields).join(', ')}`);
    }
    return true;
  }

  if (value !== pattern) {
    return failMatcher(inspection, 'Different values');
  }

  return true;
}

/**
 * Whether a value is a callable
 */
function isCallable(x: any): x is ((...args: any[]) => any) {
  return x && {}.toString.call(x) === '[object Function]';
}

/**
 * Do a glob-like pattern match (which only supports *s). Supports multiline strings.
 */
export function stringLike(pattern: string): PropertyMatcher {
  // Replace * with .* in the string, escape the rest and brace with ^...$
  const regex = new RegExp(`^${pattern.split('*').map(escapeRegex).join('.*')}$`, 'm');

  return annotateMatcher({ $stringContaining: pattern }, (value: any, failure: InspectionFailure) => {
    if (typeof value !== 'string') {
      failure.failureReason = `Expected a string, but got '${typeof value}'`;
      return false;
    }

    if (!regex.test(value)) {
      failure.failureReason = 'String did not match pattern';
      return false;
    }

    return true;
  });
}

/**
 * Matches any value
 */
export function anything(): PropertyMatcher {
  return annotateMatcher({ $anything: true }, () => true);
}

/**
 * Negate an inner matcher
 */
export function notMatching(matcher: any): PropertyMatcher {
  return annotateMatcher({ $notMatching: matcher }, (value: any, failure: InspectionFailure) => {
    const result = matcherFrom(matcher)(value, failure);
    if (result) {
      failure.failureReason = 'Should not have matched, but did';
      return false;
    }
    return true;
  });
}

export type TypeValidator<T> = (x: any) => x is T;

/**
 * Captures a value onto an object if it matches a given inner matcher
 *
 * @example
 *
 * const someValue = Capture.aString();
 * expect(stack).toHaveResource({
 *    // ...
 *    Value: someValue.capture(stringMatching('*a*')),
 * });
 * console.log(someValue.capturedValue);
 */
export class Capture<T=any> {
  /**
   * A Capture object that captures any type
   */
  public static anyType(): Capture<any> {
    return new Capture();
  }

  /**
   * A Capture object that captures a string type
   */
  public static aString(): Capture<string> {
    return new Capture((x: any): x is string => {
      if (typeof x !== 'string') {
        throw new Error(`Expected to capture a string, got '${x}'`);
      }
      return true;
    });
  }

  /**
   * A Capture object that captures a custom type
   */
  // eslint-disable-next-line @typescript-eslint/no-shadow
  public static a<T>(validator: TypeValidator<T>): Capture<T> {
    return new Capture(validator);
  }

  private _value?: T;
  private _didCapture = false;
  private _wasInvoked = false;

  protected constructor(private readonly typeValidator?: TypeValidator<T>) {
  }

  /**
   * Capture the value if the inner matcher successfully matches it
   *
   * If no matcher is given, `anything()` is assumed.
   *
   * And exception will be thrown if the inner matcher returns `true` and
   * the value turns out to be of a different type than the `Capture` object
   * is expecting.
   */
  public capture(matcher?: any): PropertyMatcher {
    if (matcher === undefined) {
      matcher = anything();
    }

    return annotateMatcher({ $capture: matcher }, (value: any, failure: InspectionFailure) => {
      this._wasInvoked = true;
      const result = matcherFrom(matcher)(value, failure);
      if (result) {
        if (this.typeValidator && !this.typeValidator(value)) {
          throw new Error(`Value not of the expected type: ${value}`);
        }
        this._didCapture = true;
        this._value = value;
      }
      return result;
    });
  }

  /**
   * Whether a value was successfully captured
   */
  public get didCapture() {
    return this._didCapture;
  }

  /**
   * Return the value that was captured
   *
   * Throws an exception if now value was captured
   */
  public get capturedValue(): T {
    // When this module is ported to jsii, the type parameter will obviously
    // have to be dropped and this will have to turn into an `any`.
    if (!this.didCapture) {
      throw new Error(`Did not capture a value: ${this._wasInvoked ? 'inner matcher failed' : 'never invoked'}`);
    }
    return this._value!;
  }
}

/**
 * Match on the innards of a JSON string, instead of the complete string
 */
export function encodedJson(matcher: any): PropertyMatcher {
  return annotateMatcher({ $encodedJson: matcher }, (value: any, failure: InspectionFailure) => {
    if (typeof value !== 'string') {
      failure.failureReason = `Expected a string, but got '${typeof value}'`;
      return false;
    }

    let decoded;
    try {
      decoded = JSON.parse(value);
    } catch (e) {
      failure.failureReason = `String is not JSON: ${e}`;
      return false;
    }

    return matcherFrom(matcher)(decoded, failure);
  });
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * Make a matcher out of the given argument if it's not a matcher already
 *
 * If it's not a matcher, it will be treated as a literal.
 */
export function matcherFrom(matcher: any): PropertyMatcher {
  return isCallable(matcher) ? matcher : exactValue(matcher);
}

/**
 * Annotate a matcher with toJSON
 *
 * We will JSON.stringify() values if we have a match failure, but for matchers this
 * would show (in traditional JS fashion) something like '[function Function]', or more
 * accurately nothing at all since functions cannot be JSONified.
 *
 * We override to JSON() in order to produce a readable version of the matcher.
 */
export function annotateMatcher<A extends object>(how: A, matcher: PropertyMatcher): PropertyMatcher {
  (matcher as any).toJSON = () => how;
  return matcher;
}
