import { Stack } from '@aws-cdk/core';
import { Construct, IConstruct, Node } from 'constructs';
import { EqualsAssertion } from './assertions';
import { ExpectedResult, ActualResult } from './common';
import { md5hash } from './private/hash';
import { AwsApiCall, LambdaInvokeFunction, LambdaInvokeFunctionProps } from './sdk';

const DEPLOY_ASSERT_SYMBOL = Symbol.for('@aws-cdk/integ-tests.DeployAssert');


// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct as CoreConstruct } from '@aws-cdk/core';

/**
 * Options for DeployAssert
 */
export interface DeployAssertProps { }

/**
 * Construct that allows for registering a list of assertions
 * that should be performed on a construct
 */
export class DeployAssert extends CoreConstruct {

  /**
   * Returns whether the construct is a DeployAssert construct
   */
  public static isDeployAssert(x: any): x is DeployAssert {
    return x !== null && typeof(x) === 'object' && DEPLOY_ASSERT_SYMBOL in x;
  }

  /**
   * Finds a DeployAssert construct in the given scope
   */
  public static of(construct: IConstruct): DeployAssert {
    const scopes = Node.of(Node.of(construct).root).findAll();
    const deployAssert = scopes.find(s => DeployAssert.isDeployAssert(s));
    if (!deployAssert) {
      throw new Error('No DeployAssert construct found in scopes');
    }
    return deployAssert as DeployAssert;
  }

  constructor(scope: Construct) {
    /**
     * Normally we would not want to do a scope swapparoo like this
     * but in this case this it allows us to provide a better experience
     * for the user. This allows DeployAssert to be created _not_ in the
     * scope of a Stack. DeployAssert is treated like a Stack, but doesn't
     * exose any of the stack functionality (the methods that the user sees
     * are just DeployAssert methods and not any Stack methods). So you can do
     * something like this, which you would not normally be allowed to do
     *
     * const deployAssert = new DeployAssert(app);
     * new AwsApiCall(deployAssert, 'AwsApiCall', {...});
     */
    scope = new Stack(scope, 'DeployAssert');
    super(scope, 'Default');

    Object.defineProperty(this, DEPLOY_ASSERT_SYMBOL, { value: true });
  }

  /**
   * Query AWS using JavaScript SDK V2 API calls. This can be used to either
   * trigger an action or to return a result that can then be asserted against
   * an expected value
   *
   * @example
   * declare const app: App;
   * const assert = new DeployAssert(app);
   * assert.awsApiCall('SQS', 'sendMessage', {
   *   QueueUrl: 'url',
   *   MessageBody: 'hello',
   * });
   * const message = assert.awsApiCall('SQS', 'receiveMessage', {
   *   QueueUrl: 'url',
   * });
   * message.assert(ExpectedResult.objectLike({
   *   Messages: [{ Body: 'hello' }],
   * }));
   */
  public awsApiCall(service: string, api: string, parameters?: any): AwsApiCall {
    return new AwsApiCall(this, `AwsApiCall${service}${api}`, {
      api,
      service,
      parameters,
    });
  }

  /**
   * Invoke a lambda function and return the response which can be asserted
   *
   * @example
   * declare const app: App;
   * const assert = new DeployAssert(app);
   * const invoke = assert.invokeFunction({
   *   functionName: 'my-function',
   * });
   * invoke.assert(ExpectedResult.objectLike({
   *   Payload: '200',
   * }));
   */
  public invokeFunction(props: LambdaInvokeFunctionProps): LambdaInvokeFunction {
    const hash = md5hash(Stack.of(this).resolve(props));
    return new LambdaInvokeFunction(this, `LambdaInvoke${hash}`, props);
  }

  /**
   * Assert that the ExpectedResult is equal
   * to the ActualResult
   *
   * @example
   * declare const deployAssert: DeployAssert;
   * declare const apiCall: AwsApiCall;
   * deployAssert.assert(
   *   'invoke',
   *   ExpectedResult.objectLike({ Payload: 'OK' }),
   *   ActualResult.fromAwsApiCall(apiCall, 'Body'),
   * );
   */
  public assert(id: string, expected: ExpectedResult, actual: ActualResult): void {
    new EqualsAssertion(this, `EqualsAssertion${id}`, {
      expected,
      actual,
    });
  }
}
