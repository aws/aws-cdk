import { Assertion, JestFriendlyAssertion } from '../assertion';
import { StackInspector } from '../inspector';

/**
 * Magic value to signify that a certain key should be absent from the property bag.
 *
 * The property is either not present or set to `undefined.
 *
 * NOTE: `ABSENT` only works with the `haveResource()` and `haveResourceLike()`
 * assertions.
 */
export const ABSENT = '{{ABSENT}}';

/**
 * An assertion to check whether a resource of a given type and with the given properties exists, disregarding properties
 *
 * @param resourceType the type of the resource that is expected to be present.
 * @param properties   the properties that the resource is expected to have. A function may be provided, in which case
 *                     it will be called with the properties of candidate resources and an ``InspectionFailure``
 *                     instance on which errors should be appended, and should return a truthy value to denote a match.
 * @param comparison   the entity that is being asserted against.
 * @param allowValueExtension if properties is an object, tells whether values must match exactly, or if they are
 *                     allowed to be supersets of the reference values. Meaningless if properties is a function.
 */
export function haveResource(
  resourceType: string,
  properties?: any,
  comparison?: ResourcePart,
  allowValueExtension: boolean = false): Assertion<StackInspector> {
  return new HaveResourceAssertion(resourceType, properties, comparison, allowValueExtension);
}

/**
 * Sugar for calling ``haveResources`` with ``allowValueExtension`` set to ``true``.
 */
export function haveResourceLike(
  resourceType: string,
  properties?: any,
  comparison?: ResourcePart) {
  return haveResource(resourceType, properties, comparison, true);
}

export type PropertyMatcher = (props: any, inspection: InspectionFailure) => boolean;

export class HaveResourceAssertion extends JestFriendlyAssertion<StackInspector> {
  private readonly inspected: InspectionFailure[] = [];
  private readonly part: ResourcePart;
  private readonly matcher: any;

  constructor(
    private readonly resourceType: string,
    properties?: any,
    part?: ResourcePart,
    allowValueExtension: boolean = false) {
    super();

    this.matcher = isCallable(properties) ? properties :
      properties === undefined ? anything() :
        allowValueExtension ? deepObjectLike(properties) :
          objectLike(properties);
    this.part = part !== undefined ? part : ResourcePart.Properties;
  }

  public assertUsing(inspector: StackInspector): boolean {
    for (const logicalId of Object.keys(inspector.value.Resources || {})) {
      const resource = inspector.value.Resources[logicalId];
      if (resource.Type === this.resourceType) {
        const propsToCheck = this.part === ResourcePart.Properties ? resource.Properties : resource;

        // Pass inspection object as 2nd argument, initialize failure with default string,
        // to maintain backwards compatibility with old predicate API.
        const inspection = { resource, failureReason: 'Object did not match predicate' };

        if (match(propsToCheck, this.matcher, inspection)) {
          return true;
        }

        this.inspected.push(inspection);
      }
    }

    return false;
  }

  public generateErrorMessage() {
    const lines: string[] = [];
    lines.push(`None of ${this.inspected.length} resources matches ${this.description}.`);

    for (const inspected of this.inspected) {
      lines.push(`- ${inspected.failureReason} in:`);
      lines.push(indent(4, JSON.stringify(inspected.resource, null, 2)));
    }

    return lines.join('\n');
  }

  public assertOrThrow(inspector: StackInspector) {
    if (!this.assertUsing(inspector)) {
      throw new Error(this.generateErrorMessage());
    }
  }

  public get description(): string {
    // tslint:disable-next-line:max-line-length
    return `resource '${this.resourceType}' with ${JSON.stringify(this.matcher, undefined, 2)}`;
  }
}

function indent(n: number, s: string) {
  const prefix = ' '.repeat(n);
  return prefix + s.replace(/\n/g, '\n' + prefix);
}

export interface InspectionFailure {
  resource: any;
  failureReason: string;
}

/**
 * Match a given literal value against a matcher
 *
 * If the matcher is a callable, use that to evaluate the value. Otherwise, the values
 * must be literally the same.
 */
function match(value: any, matcher: any, inspection: InspectionFailure) {
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
 * Helper function to make matcher failure reporting a little easier
 *
 * Our protocol is weird (change a string on a passed-in object and return 'false'),
 * but I don't want to change that right now.
 */
function failMatcher(inspection: InspectionFailure, error: string): boolean {
  inspection.failureReason = error;
  return false;
}

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

export function _objectContaining<A extends object>(pattern: A, deep: boolean): PropertyMatcher {
  const ret = (value: any, inspection: InspectionFailure): boolean => {
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
  };

  // Override toJSON so that our error messages print an readable version of this matcher
  // (which we produce by doing JSON.stringify() at some point in the future).
  ret.toJSON = () => ({ [deep ? '$deepObjectLike' : '$objectLike']: pattern });
  return ret;
}

/**
 * Match exactly the given value
 *
 * This is the default, you only need this to escape from the deep lenient matching
 * of `deepObjectLike`.
 */
export function exactValue(expected: any): PropertyMatcher {
  const ret = (value: any, inspection: InspectionFailure): boolean => {
    return matchLiteral(value, expected, inspection);
  };

  // Override toJSON so that our error messages print an readable version of this matcher
  // (which we produce by doing JSON.stringify() at some point in the future).
  ret.toJSON = () => ({ $exactValue: expected });
  return ret;
}

/**
 * A matcher for a list that contains all of the given elements in any order
 */
export function arrayWith(...elements: any[]): PropertyMatcher {
  if (elements.length === 0) { return anything(); }

  const ret = (value: any, inspection: InspectionFailure): boolean => {
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
  };

  // Override toJSON so that our error messages print an readable version of this matcher
  // (which we produce by doing JSON.stringify() at some point in the future).
  ret.toJSON = () => ({ $arrayContaining: elements.length === 1 ? elements[0] : elements });
  return ret;
}

/**
 * Matches anything
 */
function anything() {
  const ret = () => {
    return true;
  };
  ret.toJSON = () => ({ $anything: true });
  return ret;
}

/**
 * Return whether `superObj` is a super-object of `obj`.
 *
 * A super-object has the same or more property values, recursing into sub properties if ``allowValueExtension`` is true.
 *
 * At any point in the object, a value may be replaced with a function which will be used to check that particular field.
 * The type of a matcher function is expected to be of type PropertyMatcher.
 *
 * @deprecated - Use `objectLike` or a literal object instead.
 */
export function isSuperObject(superObj: any, pattern: any, errors: string[] = [], allowValueExtension: boolean = false): boolean {
  const matcher = allowValueExtension ? deepObjectLike(pattern) : objectLike(pattern);

  const inspection: InspectionFailure = { resource: superObj, failureReason: '' };
  const ret = match(superObj, matcher, inspection);
  if (!ret) {
    errors.push(inspection.failureReason);
  }
  return ret;
}

/**
 * What part of the resource to compare
 */
export enum ResourcePart {
  /**
   * Only compare the resource's properties
   */
  Properties,

  /**
   * Check the entire CloudFormation config
   *
   * (including UpdateConfig, DependsOn, etc.)
   */
  CompleteDefinition
}

/**
 * Whether a value is a callable
 */
function isCallable(x: any): x is ((...args: any[]) => any) {
  return x && {}.toString.call(x) === '[object Function]';
}

/**
 * Whether a value is an object
 */
function isObject(x: any): x is object {
  // Because `typeof null === 'object'`.
  return x && typeof x === 'object';
}
