import { CustomResource } from 'aws-cdk-lib/core';
import { IApiCall } from './api-call-base';

/**
 * Represents the "actual" results to compare
 */
export abstract class ActualResult {
  /**
   * Get the actual results from a CustomResource
   */
  public static fromCustomResource(customResource: CustomResource, attribute: string): ActualResult {
    return {
      result: customResource.getAttString(attribute),
    };
  }

  /**
   * Get the actual results from a AwsApiCall
   */
  public static fromAwsApiCall(query: IApiCall, attribute: string): ActualResult {
    return {
      result: query.getAttString(attribute),
    };
  }

  /**
   * The actual results as a string
   */
  public abstract result: string;
}

/**
 * Represents the "expected" results to compare
 */
export abstract class ExpectedResult {
  /**
   * The actual results must match exactly. Missing data
   * will result in a failure
   *
   * @example
   * // actual results
   * const actual = {
   *   stringParam: 'hello',
   *   numberParam: 3,
   *   booleanParam: true,
   * };
   * // pass
   * ExpectedResult.exact({
   *   stringParam: 'hello',
   *   numberParam: 3,
   *   booleanParam: true,
   * })
   *
   * // fail
   * ExpectedResult.exact({
   *   stringParam: 'hello',
   * });
   *
   * @see https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Match.html#static-exactpattern
   */
  public static exact(expected: any): ExpectedResult {
    return {
      result: JSON.stringify({
        $Exact: expected,
      }),
    };
  }

  /**
   * The expected results must be a subset of the
   * actual results.
   *
   * @example
   * // actual results
   * const actual = {
   *   stringParam: 'hello',
   *   numberParam: 3,
   *   booleanParam: true,
   *   objectParam: { prop1: 'value', prop2: 'value' },
   * };
   * // pass
   * ExpectedResult.objectLike({
   *   stringParam: 'hello',
   *   objectParam: { prop1: 'value' },
   * });
   *
   * @see https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Match.html#static-objectwbrlikepattern
   */
  public static objectLike(expected: { [key: string]: any }): ExpectedResult {
    return {
      result: JSON.stringify({
        $ObjectLike: expected,
      }),
    };
  }

  /**
   * The actual results must be a list and must contain
   * an item with the expected results.
   *
   * @example
   * // actual results
   * const actual = [
   *   {
   *     stringParam: 'hello',
   *   },
   *   {
   *     stringParam: 'world',
   *   },
   * ];
   * // pass
   * ExpectedResult.arrayWith([
   *   {
   *     stringParam: 'hello',
   *   },
   * ]);
   *
   * @see https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Match.html#static-arraywbrwithpattern
   */
  public static arrayWith(expected: any[]): ExpectedResult {
    return {
      result: JSON.stringify({
        $ArrayWith: expected,
      }),
    };
  }
  /**
   * Actual results is a string that matches
   * the Expected result regex
   *
   * @example
   * // actual results
   * const actual = 'some string value';
   *
   * // pass
   * ExpectedResult.stringLikeRegexp('value');
   *
   * @see https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions.Match.html#static-stringwbrlikewbrregexppattern
   */
  public static stringLikeRegexp(expected: string): ExpectedResult {
    return {
      result: JSON.stringify({
        $StringLike: expected,
      }),
    };
  }

  /**
   * The expected results encoded as a string
   */
  public abstract result: string;
}
