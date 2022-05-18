import { ExpectedResult, ActualResult } from './common';
import { IAwsApiCall, LambdaInvokeFunctionProps } from './sdk';

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
   * integ.assert.awsApiCall('SQS', 'sendMessage', {
   *   QueueUrl: 'url',
   *   MessageBody: 'hello',
   * });
   * const message = integ.assert.awsApiCall('SQS', 'receiveMessage', {
   *   QueueUrl: 'url',
   * });
   * message.assert(ExpectedResult.objectLike({
   *   Messages: [{ Body: 'hello' }],
   * }));
   */
  awsApiCall(service: string, api: string, parameters?: any): IAwsApiCall;

  /**
   * Invoke a lambda function and return the response which can be asserted
   *
   * @example
   * declare const app: App;
   * declare const integ: IntegTest;
   * const invoke = integ.assert.invokeFunction({
   *   functionName: 'my-function',
   * });
   * invoke.assert(ExpectedResult.objectLike({
   *   Payload: '200',
   * }));
   */
  invokeFunction(props: LambdaInvokeFunctionProps): IAwsApiCall;

  /**
   * Assert that the ExpectedResult is equal
   * to the ActualResult
   *
   * @example
   * declare const integ: IntegTest;
   * declare const apiCall: AwsApiCall;
   * integ.assert.assert(
   *   'invoke',
   *   ExpectedResult.objectLike({ Payload: 'OK' }),
   *   ActualResult.fromAwsApiCall(apiCall, 'Body'),
   * );
   */
  assert(id: string, expected: ExpectedResult, actual: ActualResult): void;
}
