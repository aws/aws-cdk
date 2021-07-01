import { annotateMatcher, InspectionFailure, match, matcherFrom, PropertyMatcher } from '@aws-cdk/assert-internal';

/**
 * Sort an array (of Actions) by their RunOrder field before applying a matcher.
 *
 * Makes the matcher independent of the order in which the Actions get synthed
 * to the template. Elements with the same RunOrder will be sorted by name.
 */
export function sortedByRunOrder(matcher: any): PropertyMatcher {
  return annotateMatcher({ $sortedByRunOrder: matcher }, (value: any, failure: InspectionFailure) => {
    if (!Array.isArray(value)) {
      failure.failureReason = `Expected an Array, but got '${typeof value}'`;
      return false;
    }

    value = value.slice();

    value.sort((a: any, b: any) => {
      if (a.RunOrder !== b.RunOrder) { return a.RunOrder - b.RunOrder; }
      return (a.Name as string).localeCompare(b.Name);
    });

    return matcherFrom(matcher)(value, failure);
  });
}

/**
 * Matches any of the matchers given
 */
export function anyOf(...patterns: any[]): PropertyMatcher {
  return annotateMatcher({ $anyOf: patterns }, (value: any, failure: InspectionFailure) => {
    let bestError: InspectionFailure | undefined;

    for (const pattern of patterns) {
      const innerInspection = { ...failure, failureReason: '' };
      if (match(value, pattern, innerInspection)) {
        return true;
      }
      if (!bestError || bestError.failureReason.length > innerInspection.failureReason.length) {
        bestError = innerInspection;
      }
    }

    failure.failureReason = `Expected one of ${patterns.length} values, got: ${bestError?.failureReason}`;
    return false;
  });
}