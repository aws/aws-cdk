import { CustomResource } from '@aws-cdk/core';
import { AwsApiCall } from './sdk';
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
  public static fromAwsApiCall(query: AwsApiCall, attribute: string): ActualResult {
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
  public static exact(expected: any): ExpectedResult {
    return {
      result: JSON.stringify({
        $Exact: expected,
      }),
    };
  }

  public static objectLike(expected: { [key: string]: any }): ExpectedResult {
    return {
      result: JSON.stringify({
        $ObjectLike: expected,
      }),
    };
  }

  public static arrayWith(expected: any[]): ExpectedResult {
    return {
      result: JSON.stringify({
        $ArrayWith: expected,
      }),
    };
  }
  /**
   * Expected result is a string
   */
  public static stringLikeRegexp(expected: string): ExpectedResult {
    return {
      result: JSON.stringify({
        $StringLike: expected,
      }),
    };
  }

  /**
   * The expected results as a string
   */
  public abstract result: string;
}
