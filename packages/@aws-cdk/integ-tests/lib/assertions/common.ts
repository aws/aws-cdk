import { CustomResource } from '@aws-cdk/core';
import { SdkQuery } from './sdk';
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
   * Get the actual results from a SdkQuery
   */
  public static fromSdkQuery(query: SdkQuery, attribute: string): ActualResult {
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
   * Expected result is a string
   */
  public static fromString(expected: string): ExpectedResult {
    return {
      result: expected,
    };
  }

  /**
   * Expected result is an object. The object will
   * be stringified before being sent to the customResource
   */
  public static fromObject(expected: { [key: string]: any }): ExpectedResult {
    return {
      result: JSON.stringify(expected),
    };
  }

  /**
   * The expected results as a string
   */
  public abstract result: string;
}
