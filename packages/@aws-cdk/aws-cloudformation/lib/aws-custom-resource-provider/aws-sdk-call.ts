/**
 * An AWS SDK call.
 */
export interface AwsSdkCall {
  /**
   * The service to call
   *
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html
   */
  readonly service: string;

  /**
   * The service action to call
   *
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html
   */
  readonly action: string;

  /**
   * The parameters for the service action
   *
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/index.html
   */
  readonly parameters?: any;

  /**
   * The path to the data in the API call response to use as the physical
   * resource id. Either `physicalResourceId` or `physicalResourceIdPath`
   * must be specified for onCreate or onUpdate calls.
   *
   * @default no path
   */
  readonly physicalResourceIdPath?: string;

  /**
   * The physical resource id of the custom resource for this call. Either
   * `physicalResourceId` or `physicalResourceIdPath` must be specified for
   * onCreate or onUpdate calls.
   *
   * @default no physical resource id
   */
  readonly physicalResourceId?: string;

  /**
   * The regex pattern to use to catch API errors. The `code` property of the
   * `Error` object will be tested against this pattern. If there is a match an
   * error will not be thrown.
   *
   * @default do not catch errors
   */
  readonly catchErrorPattern?: string;

  /**
   * API version to use for the service
   *
   * @see https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/locking-api-versions.html
   * @default use latest available API version
   */
  readonly apiVersion?: string;
}