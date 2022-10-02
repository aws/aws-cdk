import { ArnFormat, CfnResource, CustomResource, Lazy, Reference, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { ApiCallBase } from './api-call-base';
import { EqualsAssertion } from './assertions';
import { ActualResult, ExpectedResult } from './common';
import { AssertionsProvider, SDK_RESOURCE_TYPE_PREFIX } from './providers';

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
export interface AwsApiCallProps extends AwsApiCallOptions { }

/**
 * Construct that creates a custom resource that will perform
 * a query using the AWS SDK
 */
export class AwsApiCall extends ApiCallBase {
  protected readonly apiCallResource: CustomResource;
  private readonly name: string;

  public readonly provider: AssertionsProvider;

  constructor(scope: Construct, id: string, props: AwsApiCallProps) {
    super(scope, id);

    this.provider = new AssertionsProvider(this, 'SdkProvider');
    this.provider.addPolicyStatementFromSdkCall(props.service, props.api);
    this.name = `${props.service}${props.api}`;

    this.apiCallResource = new CustomResource(this, 'Default', {
      serviceToken: this.provider.serviceToken,
      properties: {
        service: props.service,
        api: props.api,
        parameters: this.provider.encode(props.parameters),
        flattenResponse: Lazy.string({ produce: () => this.flattenResponse }),
        salt: Date.now().toString(),
      },
      resourceType: `${SDK_RESOURCE_TYPE_PREFIX}${this.name}`.substring(0, 60),
    });

    // Needed so that all the policies set up by the provider should be available before the custom resource is provisioned.
    this.apiCallResource.node.addDependency(this.provider);
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
    new EqualsAssertion(this, `AssertEquals${this.name}`, {
      expected,
      actual: ActualResult.fromCustomResource(this.apiCallResource, 'apiCallResponse'),
    });
  }

  public assertAtPath(path: string, expected: ExpectedResult): void {
    new EqualsAssertion(this, `AssertEquals${this.name}`, {
      expected,
      actual: ActualResult.fromAwsApiCall(this, path),
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

