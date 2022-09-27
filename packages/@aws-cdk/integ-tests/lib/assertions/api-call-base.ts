import { CustomResource, Reference } from '@aws-cdk/core';
import { Construct, IConstruct } from 'constructs';
import { ExpectedResult } from './common';
import { AssertionsProvider } from './providers';

/**
 * Represents an ApiCall
 */
export interface IApiCall extends IConstruct {
  /**
   * access the AssertionsProvider. This can be used to add additional IAM policies
   * the the provider role policy
   *
   * @example
   * declare const apiCall: AwsApiCall;
   * apiCall.provider.addToRolePolicy({
   *   Effect: 'Allow',
   *   Action: ['s3:GetObject'],
   *   Resource: ['*'],
   * });
   */
  readonly provider: AssertionsProvider;

  /**
   * Returns the value of an attribute of the custom resource of an arbitrary
   * type. Attributes are returned from the custom resource provider through the
   * `Data` map where the key is the attribute name.
   *
   * @param attributeName the name of the attribute
   * @returns a token for `Fn::GetAtt`. Use `Token.asXxx` to encode the returned `Reference` as a specific type or
   * use the convenience `getAttString` for string attributes.
   */
  getAtt(attributeName: string): Reference;

  /**
   * Returns the value of an attribute of the custom resource of type string.
   * Attributes are returned from the custom resource provider through the
   * `Data` map where the key is the attribute name.
   *
   * @param attributeName the name of the attribute
   * @returns a token for `Fn::GetAtt` encoded as a string.
   */
  getAttString(attributeName: string): string;

  /**
   * Assert that the ExpectedResult is equal
   * to the result of the AwsApiCall
   *
   * @example
   * declare const integ: IntegTest;
   * const invoke = integ.assertions.invokeFunction({
   *   functionName: 'my-func',
   * });
   * invoke.expect(ExpectedResult.objectLike({ Payload: 'OK' }));
   */
  expect(expected: ExpectedResult): void;

  /**
   * Assert that the ExpectedResult is equal
   * to the result of the AwsApiCall at the given path.
   *
   * For example the SQS.receiveMessage api response would look
   * like:
   *
   * If you wanted to assert the value of `Body` you could do
   *
   * @example
   * const actual = {
   *   Messages: [{
   *     MessageId: '',
   *     ReceiptHandle: '',
   *     MD5OfBody: '',
   *     Body: 'hello',
   *     Attributes: {},
   *     MD5OfMessageAttributes: {},
   *     MessageAttributes: {}
   *   }]
   * };
   *
   *
   * declare const integ: IntegTest;
   * const message = integ.assertions.awsApiCall('SQS', 'receiveMessage');
   *
   * message.assertAtPath('Messages.0.Body', ExpectedResult.stringLikeRegexp('hello'));
   */
  assertAtPath(path: string, expected: ExpectedResult): void;

  /**
   * Allows you to chain IApiCalls. This adds an explicit dependency
   * betweent the two resources.
   *
   * Returns the IApiCall provided as `next`
   *
   * @example
   * declare const first: IApiCall;
   * declare const second: IApiCall;
   *
   * first.next(second);
   */
  next(next: IApiCall): IApiCall;
}

/**
 * Base class for an ApiCall
 */
export abstract class ApiCallBase extends Construct implements IApiCall {
  protected abstract readonly apiCallResource: CustomResource;
  protected expectedResult?: string;
  protected flattenResponse: string = 'false';
  protected stateMachineArn?: string;

  public abstract readonly provider: AssertionsProvider;

  constructor(scope: Construct, id: string) {
    super(scope, id);

  }

  public getAtt(attributeName: string): Reference {
    this.flattenResponse = 'true';
    return this.apiCallResource.getAtt(`apiCallResponse.${attributeName}`);
  }

  public getAttString(attributeName: string): string {
    this.flattenResponse = 'true';
    return this.apiCallResource.getAttString(`apiCallResponse.${attributeName}`);
  }

  public expect(expected: ExpectedResult): void {
    this.expectedResult = expected.result;
  }

  public abstract assertAtPath(path: string, expected: ExpectedResult): void;

  public next(next: IApiCall): IApiCall {
    next.node.addDependency(this);
    return next;
  }
}
