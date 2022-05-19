// This file contains the input and output types for the providers.
// Kept in a separate file for sharing between the handler and the provider constructs.

export const ASSERT_RESOURCE_TYPE = 'Custom::DeployAssert@AssertEquals';
export const RESULTS_RESOURCE_TYPE = 'Custom::DeployAssert@ResultsCollection';
export const SDK_RESOURCE_TYPE_PREFIX = 'Custom::DeployAssert@SdkCall';

/**
 * A AWS JavaScript SDK V2 request
 */
export interface AwsApiCallRequest {
  /**
   * The AWS service i.e. S3
   */
  readonly service: string;

  /**
   * The AWS api call to make i.e. getBucketLifecycle
   */
  readonly api: string;

  /**
   * Any parameters to pass to the api call
   *
   * @default - no parameters
   */
  readonly parameters?: any;

  /**
   * Whether or not to flatten the response from the api call
   *
   * Valid values are 'true' or 'false' as strings
   *
   * Typically when using an SdkRequest you will be passing it as the
   * `actual` value to an assertion provider so this would be set
   * to 'false' (you want the actual response).
   *
   * If you are using the SdkRequest to perform more of a query to return
   * a single value to use, then this should be set to 'true'. For example,
   * you could make a StepFunctions.startExecution api call and retreive the
   * `executionArn` from the response.
   *
   * @default 'false'
   */
  readonly flattenResponse?: string;
}

/**
 * The result from a SdkQuery
 */
export interface AwsApiCallResult {
  /**
   * The full api response
   */
  readonly apiCallResponse: any;
}

/**
 * The type of assertion to perform
 */
export enum AssertionType {
  /**
   * Assert that two values are equal
   */
  EQUALS = 'equals',

  /**
   * The keys and their values must be present in the target but the target
   * can be a superset.
   */
  OBJECT_LIKE = 'objectLike',

  /**
   * Matches the specified pattern with the array
   * The set of elements must be in the same order as would be found
   */
  ARRAY_WITH = 'arrayWith',
}

/**
 * A request to make an assertion that the
 * actual value matches the expected
 */
export interface AssertionRequest {
  /**
   * The expected value to assert
   */
  readonly expected: any;

  /**
   * The actual value received
   */
  readonly actual: any;

  /**
   * Set this to true if a failed assertion should
   * result in a CloudFormation deployment failure
   *
   * This is only necessary if assertions are being
   * executed outside of `integ-runner`.
   *
   * @default false
   */
  readonly failDeployment?: boolean;
}
/**
 * The result of an Assertion
 * wrapping the actual result data in another struct.
 * Needed to access the whole message via getAtt() on the custom resource.
 */
export interface AssertionResult {
/**
 * The result of an assertion
 */
  readonly data: string;

  /**
   * Whether or not the assertion failed
   *
   * @default false
   */
  readonly failed?: boolean;
}

/**
 * The status of the assertion
 */
export enum Status {
  /**
   * The assertion passed
   */
  PASS = 'pass',

  /**
   * The assertion failed
   */
  FAIL = 'fail',
}

/**
 * The result of an assertion
 */
export interface AssertionResultData {
  /**
   * The status of the assertion, i.e.
   * pass or fail
   */
  readonly status: Status;

  /**
   * Any message returned with the assertion result
   * typically this will be the diff if there is any
   *
   * @default - none
   */
  readonly message?: string;
}

/**
 * Represents a collection of assertion request results
 */
export interface ResultsCollectionRequest {
  /**
   * The results of all the assertions that have been
   * registered
   */
  readonly assertionResults: AssertionResultData[];
}

/**
 * The result of a results request
 */
export interface ResultsCollectionResult {
  /**
   * A message containing the results of the assertion
   */
  readonly message: string;
}
