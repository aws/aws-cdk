import { IApiCall } from './api-call-base';
import { ExpectedResult, ActualResult } from './common';
import { FetchOptions } from './providers';
import { LambdaInvokeFunctionProps } from './sdk';

/**
 * Interface that allows for registering a list of assertions
 * that should be performed on a construct. This is only necessary
 * when writing integration tests.
 */
export interface IDeployAssert {
  /**
   * Query AWS using JavaScript SDK API calls. This can be used to either
   * trigger an action or to return a result that can then be asserted against
   * an expected value
   *
   * The `service` is the name of an AWS service, in one of the following forms:
   * - An AWS SDK for JavaScript v3 package name (`@aws-sdk/client-api-gateway`)
   * - An AWS SDK for JavaScript v3 client name (`api-gateway`)
   * - An AWS SDK for JavaScript v2 constructor name (`APIGateway`)
   * - A lowercase AWS SDK for JavaScript v2 constructor name (`apigateway`)
   *
   * The `api` is the name of an AWS API call, in one of the following forms:
   * - An API call name as found in the API Reference documentation (`GetObject`)
   * - The API call name starting with a lowercase letter (`getObject`)
   * - The AWS SDK for JavaScript v3 command class name (`GetObjectCommand`)
   *
   * @example
   * declare const app: App;
   * declare const integ: IntegTest;
   * integ.assertions.awsApiCall('SQS', 'sendMessage', {
   *   QueueUrl: 'url',
   *   MessageBody: 'hello',
   * });
   * const message = integ.assertions.awsApiCall('SQS', 'receiveMessage', {
   *   QueueUrl: 'url',
   * });
   * message.expect(ExpectedResult.objectLike({
   *   Messages: [{ Body: 'hello' }],
   * }));
   */
  awsApiCall(service: string, api: string, parameters?: any, outputPaths?: string[]): IApiCall;

  /**
   * Invoke a lambda function and return the response which can be asserted
   *
   * @example
   * declare const app: App;
   * declare const integ: IntegTest;
   * const invoke = integ.assertions.invokeFunction({
   *   functionName: 'my-function',
   * });
   * invoke.expect(ExpectedResult.objectLike({
   *   Payload: '200',
   * }));
   */
  invokeFunction(props: LambdaInvokeFunctionProps): IApiCall;

  /**
   * Make an HTTP call to the provided endpoint
   *
   * @example
   * declare const app: App;
   * declare const integ: IntegTest;
   * const call = integ.assertions.httpApiCall('https://example.com/test');
   * call.expect(ExpectedResult.objectLike({
   *   Message: 'Hello World!',
   * }));
   */
  httpApiCall(url: string, options?: FetchOptions): IApiCall;

  /**
   * Assert that the ExpectedResult is equal
   * to the ActualResult
   *
   * @example
   * declare const integ: IntegTest;
   * declare const apiCall: AwsApiCall;
   * integ.assertions.expect(
   *   'invoke',
   *   ExpectedResult.objectLike({ Payload: 'OK' }),
   *   ActualResult.fromAwsApiCall(apiCall, 'Body'),
   * );
   */
  expect(id: string, expected: ExpectedResult, actual: ActualResult): void;
}
