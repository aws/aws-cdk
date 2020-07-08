import { exactValue, InspectionFailure, PropertyMatcher } from '@aws-cdk/assert';

/**
 * Do a glob-like pattern match (which only supports *s)
 */
export function stringLike(pattern: string): PropertyMatcher {
  // Replace * with .* in the string, escape the rest and brace with ^...$
  const regex = new RegExp(`^${pattern.split('*').map(escapeRegex).join('.*')}$`);

  return annotate({ $stringContaining: pattern }, (value: any, failure: InspectionFailure) => {
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
  return annotate({ $anything: true }, () => true);
}

/**
 * Negate an inner matcher
 */
export function notMatching(matcher: any): PropertyMatcher {
  return annotate({ $notMatching: matcher }, (value: any, failure: InspectionFailure) => {
    const result = makeMatcher(matcher)(value, failure);
    if (result) {
      failure.failureReason = 'Should not have matched, but did';
      return false;
    }
    return true;
  });
}

/**
 * Sort an array (of Actions) by their RunOrder field before applying a matcher.
 *
 * Makes the matcher independent of the order in which the Actions get synthed
 * to the template. Elements with the same RunOrder will be sorted by name.
 */
export function sortedByRunOrder(matcher: any): PropertyMatcher {
  return annotate({ $sortedByRunOrder: matcher }, (value: any, failure: InspectionFailure) => {
    if (!Array.isArray(value)) {
      failure.failureReason = `Expected an Array, but got '${typeof value}'`;
      return false;
    }

    value = value.slice();

    value.sort((a: any, b: any) => {
      if (a.RunOrder !== b.RunOrder) { return a.RunOrder - b.RunOrder; }
      return (a.Name as string).localeCompare(b.Name);
    });

    return makeMatcher(matcher)(value, failure);
  });
}

/**
 * Match on the innards of a JSON string, instead of the complete string
 */
export function encodedJson(matcher: any): PropertyMatcher {
  return annotate({ $encodedJson: matcher }, (value: any, failure: InspectionFailure) => {
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

    return makeMatcher(matcher)(decoded, failure);
  });
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

/**
 * Whether a value is a callable
 */
function isCallable(x: any): x is ((...args: any[]) => any) {
  return x && {}.toString.call(x) === '[object Function]';
}

/**
 * Turn a matcher or literal into a matcher
 *
 * Unfortunately I forgot to make the match() function public, so I can only accept matcher functions, not literals.
 * However I can transform a literal into a matcher by using `exactValue`.
 */
function makeMatcher(matcher: any): PropertyMatcher {
  return isCallable(matcher) ? matcher : exactValue(matcher);
}

/**
 * This should also have been in the upstream library
 *
 * Annotate a matcher with toJSON
 */
function annotate<A extends object>(how: A, matcher: PropertyMatcher): PropertyMatcher {
  (matcher as any).toJSON = () => how;
  return matcher;
}