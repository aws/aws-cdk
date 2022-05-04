import { CustomResource, Reference, Lazy, CfnResource, Stack, ArnFormat } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { EqualsAssertion } from './assertions';
import { ExpectedResult, ActualResult } from './common';
import { AssertionsProvider, SDK_RESOURCE_TYPE_PREFIX, AssertionType } from './providers';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct as CoreConstruct } from '@aws-cdk/core';

/**
 * Options to perform an AWS JavaScript V2 API call
 */
export interface AwsApiCallOptions {
  /**
   * The AWS service, i.e. S3
   */
  readonly service: string;

  /**
   * The api call to make, i.e. getBucketLifecycle
   */
  readonly api: string;

  /**
   * Any parameters to pass to the api call
   *
   * @default - no parameters
   */
  readonly parameters?: any;
}

/**
 * Options for creating an SDKQuery provider
 */
export interface AwsApiCallProps extends AwsApiCallOptions {}

/**
 * Construct that creates a custom resource that will perform
 * a query using the AWS SDK
 */
export class AwsApiCall extends CoreConstruct {
  private readonly sdkCallResource: CustomResource;
  private flattenResponse: string = 'false';
  private readonly name: string;

  protected provider: AssertionsProvider;

  constructor(scope: Construct, id: string, props: AwsApiCallProps) {
    super(scope, id);

    this.provider = new AssertionsProvider(this, 'SdkProvider');
    this.provider.addPolicyStatementFromSdkCall(props.service, props.api);
    this.name = `${props.service}${props.api}`;

    this.sdkCallResource = new CustomResource(this, 'Default', {
      serviceToken: this.provider.serviceToken,
      properties: {
        service: props.service,
        api: props.api,
        parameters: this.provider.encode(props.parameters),
        flattenResponse: Lazy.string({ produce: () => this.flattenResponse }),
        salt: Date.now().toString(),
      },
      resourceType: `${SDK_RESOURCE_TYPE_PREFIX}${this.name}`,
    });

    // Needed so that all the policies set up by the provider should be available before the custom resource is provisioned.
    this.sdkCallResource.node.addDependency(this.provider);
  }

  /**
   * Returns the value of an attribute of the custom resource of an arbitrary
   * type. Attributes are returned from the custom resource provider through the
   * `Data` map where the key is the attribute name.
   *
   * @param attributeName the name of the attribute
   * @returns a token for `Fn::GetAtt`. Use `Token.asXxx` to encode the returned `Reference` as a specific type or
   * use the convenience `getAttString` for string attributes.
   */
  public getAtt(attributeName: string): Reference {
    this.flattenResponse = 'true';
    return this.sdkCallResource.getAtt(`apiCallResponse.${attributeName}`);
  }

  /**
   * Returns the value of an attribute of the custom resource of type string.
   * Attributes are returned from the custom resource provider through the
   * `Data` map where the key is the attribute name.
   *
   * @param attributeName the name of the attribute
   * @returns a token for `Fn::GetAtt` encoded as a string.
   */
  public getAttString(attributeName: string): string {
    this.flattenResponse = 'true';
    return this.sdkCallResource.getAttString(`apiCallResponse.${attributeName}`);
  }

  /**
   * Asserts that the expected value is strictly equal to
   * the result of the AwsApiCall. Missing fields will result in
   * a failure.
   */
  public assertObjectEqual(expected: { [key: string]: any }): void {
    new EqualsAssertion(this, `AssertEquals${this.name}`, {
      expected: ExpectedResult.fromObject(expected),
      actual: ActualResult.fromCustomResource(this.sdkCallResource, 'apiCallResponse'),
    });
  }

  /**
   * Asserts that the expected value is a subset of
   * the result of the AwsApiCall
   */
  public assertObjectLike(expected: { [key: string]: any }): void {
    new EqualsAssertion(this, `EqualsAssertion${this.name}`, {
      actual: ActualResult.fromCustomResource(this.sdkCallResource, 'apiCallResponse'),
      expected: ExpectedResult.fromObject(expected),
      assertionType: AssertionType.OBJECT_LIKE,
    });
  }

  /**
   * Asserts that the expected value is equal to the
   * results of the AwsApiCall. The result of the SdkQuery
   * must be a string value.
   */
  public assertStringEqual(expected: string): void {
    new EqualsAssertion(this, `EqualsAssertion${this.name}`, {
      actual: ActualResult.fromCustomResource(this.sdkCallResource, 'apiCallResponse'),
      expected: ExpectedResult.fromString(expected),
      assertionType: AssertionType.EQUALS,
    });
  }
}

/**
 * Set to Tail to include the execution log in the response.
 * Applies to synchronously invoked functions only.
 */
export enum LogType {
  /**
   * The log messages are not returned in the response
   */
  NONE = 'None',

  /**
   * The log messages are returned in the response
   */
  TAIL = 'Tail',
}

/**
 * The type of invocation. Default is REQUEST_RESPONE
 */
export enum InvocationType {
  /**
   * Invoke the function asynchronously.
   * Send events that fail multiple times to the function's
   * dead-letter queue (if it's configured).
   * The API response only includes a status code.
   */
  EVENT = 'Event',

  /**
   * Invoke the function synchronously.
   * Keep the connection open until the function returns a response or times out.
   * The API response includes the function response and additional data.
   */
  REQUEST_RESPONE = 'RequestResponse',

  /**
   * Validate parameter values and verify that the user
   * or role has permission to invoke the function.
   */
  DRY_RUN = 'DryRun',
}

/**
 * Options to pass to the Lambda invokeFunction API call
 */
export interface LambdaInvokeFunctionProps {
  /**
   * The name of the function to invoke
   */
  readonly functionName: string;

  /**
   * The type of invocation to use
   *
   * @default InvocationType.REQUEST_RESPONE
   */
  readonly invocationType?: InvocationType;

  /**
   * Whether to return the logs as part of the response
   *
   * @default LogType.NONE
   */
  readonly logType?: LogType;

  /**
   * Payload to send as part of the invoke
   *
   * @default - no payload
   */
  readonly payload?: string;
}

/**
 * An AWS Lambda Invoke function API call.
 * Use this istead of the generic AwsApiCall in order to
 * invoke a lambda function. This will automatically create
 * the correct permissions to invoke the function
 */
export class LambdaInvokeFunction extends AwsApiCall {
  constructor(scope: Construct, id: string, props: LambdaInvokeFunctionProps) {
    super(scope, id, {
      api: 'invoke',
      service: 'Lambda',
      parameters: {
        FunctionName: props.functionName,
        InvocationType: props.invocationType,
        LogType: props.logType,
        Payload: props.payload,
      },
    });

    const stack = Stack.of(this);
    // need to give the assertion lambda permission to invoke
    new CfnResource(this, 'Invoke', {
      type: 'AWS::Lambda::Permission',
      properties: {
        Action: 'lambda:InvokeFunction',
        FunctionName: props.functionName,
        Principal: this.provider.handlerRoleArn,
      },
    });

    // the api call is 'invoke', but the permission is 'invokeFunction'
    // so need to handle it specially
    this.provider.addPolicyStatementFromSdkCall('Lambda', 'invokeFunction', [stack.formatArn({
      service: 'lambda',
      resource: 'function',
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
      resourceName: props.functionName,
    })]);
  }
}

