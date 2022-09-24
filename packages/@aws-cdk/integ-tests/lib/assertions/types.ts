import { IApiCall } from './api-call-base';
import { ExpectedResult, ActualResult } from './common';
import { LambdaInvokeFunctionProps } from './sdk';

/**
 * Interface that allows for registering a list of assertions
 * that should be performed on a construct. This is only necessary
 * when writing integration tests.
 */
export interface IDeployAssert {
  /**
   * Query AWS using JavaScript SDK V2 API calls. This can be used to either
   * trigger an action or to return a result that can then be asserted against
   * an expected value
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
  awsApiCall(service: string, api: string, parameters?: any): IApiCall;

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
