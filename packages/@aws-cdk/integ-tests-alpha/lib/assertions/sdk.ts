import { ArnFormat, CfnResource, CustomResource, Lazy, Stack, Aspects, CfnOutput, AspectPriority } from 'aws-cdk-lib/core';
import { Construct, IConstruct } from 'constructs';
import { ApiCallBase, IApiCall } from './api-call-base';
import { ExpectedResult } from './common';
import { AssertionsProvider, SDK_RESOURCE_TYPE_PREFIX } from './providers';
import { WaiterStateMachine, WaiterStateMachineOptions } from './waiter-state-machine';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';

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

  /**
   * Restrict the data returned by the API call to specific paths in
   * the API response. Use this to limit the data returned by the custom
   * resource if working with API calls that could potentially result in custom
   * response objects exceeding the hard limit of 4096 bytes.
   *
   * @default - return all data
   */
  readonly outputPaths?: string[];
}

/**
 * Construct that creates a custom resource that will perform
 * a query using the AWS SDK
 */
export interface AwsApiCallProps extends AwsApiCallOptions { }

/**
 * Construct that creates a custom resource that will perform
 * a query using the AWS SDK
 */
export class AwsApiCall extends ApiCallBase {
  public readonly provider: AssertionsProvider;

  /**
   * access the AssertionsProvider for the waiter state machine.
   * This can be used to add additional IAM policies
   * the the provider role policy
   *
   * @example
   * declare const apiCall: AwsApiCall;
   * apiCall.waiterProvider?.addToRolePolicy({
   *   Effect: 'Allow',
   *   Action: ['s3:GetObject'],
   *   Resource: ['*'],
   * });
   */
  public waiterProvider?: AssertionsProvider;

  protected readonly apiCallResource: CustomResource;
  private readonly name: string;

  private _assertAtPath?: string;
  private readonly api: string;
  private readonly service: string;

  constructor(scope: Construct, id: string, props: AwsApiCallProps) {
    super(scope, id);

    this.provider = new AssertionsProvider(this, 'SdkProvider', {
      logRetention: props.parameters?.RetentionDays,
    });
    this.provider.addPolicyStatementFromSdkCall(props.service, props.api);
    this.name = `${props.service}${props.api}`;
    this.api = props.api;
    this.service = props.service;
    if (props.outputPaths) {
      this.outputPaths = [...props.outputPaths];
    }

    this.apiCallResource = new CustomResource(this, 'Default', {
      serviceToken: this.provider.serviceToken,
      properties: {
        service: props.service,
        api: props.api,
        expected: Lazy.any({ produce: () => this.expectedResult }),
        actualPath: Lazy.string({ produce: () => this._assertAtPath }),
        stateMachineArn: Lazy.string({ produce: () => this.stateMachineArn }),
        parameters: this.provider.encode(props.parameters),
        flattenResponse: Lazy.string({ produce: () => this.flattenResponse }),
        outputPaths: Lazy.list({ produce: () => this.outputPaths }),
        salt: Date.now().toString(),
      },
      // Remove the slash from the resource type because when using the v3 package name as the service name,
      // the `service` props includes the slash, but the resource type name cannot contain the slash
      // See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-cloudformation-customresource.html#aws-resource-cloudformation-customresource--remarks
      resourceType: `${SDK_RESOURCE_TYPE_PREFIX}${this.name}`.substring(0, 60).replace(/[\/]/g, ''),
    });
    // Needed so that all the policies set up by the provider should be available before the custom resource is provisioned.
    this.apiCallResource.node.addDependency(this.provider);

    // if expectedResult has been configured then that means
    // we are making assertions and we should output the results
    Aspects.of(this).add({
      visit(node: IConstruct) {
        if (node instanceof AwsApiCall) {
          if (node.expectedResult) {
            const result = node.apiCallResource.getAttString('assertion');

            new CfnOutput(node, 'AssertionResults', {
              value: result,
              // Remove the at sign, slash, and hyphen because when using the v3 package name or client name as the service name,
              // the `id` includes them, but they are not allowed in the `CfnOutput` logical id
              // See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/outputs-section-structure.html#outputs-section-syntax
            }).overrideLogicalId(`AssertionResults${id}`.replace(/[\@\/\-]/g, ''));
          }
        }
      },
    }, { priority: AspectPriority.MUTATING });
  }

  public assertAtPath(path: string, expected: ExpectedResult): IApiCall {
    this._assertAtPath = path;
    (this.outputPaths ??= []).push(path);
    this.expectedResult = expected.result;
    this.flattenResponse = 'true';
    return this;
  }

  public waitForAssertions(options?: WaiterStateMachineOptions): IApiCall {
    const waiter = new WaiterStateMachine(this, 'WaitFor', {
      ...options,
    });
    this.stateMachineArn = waiter.stateMachineArn;
    this.provider.addPolicyStatementFromSdkCall('states', 'StartExecution');
    waiter.isCompleteProvider.addPolicyStatementFromSdkCall(this.service, this.api);
    this.waiterProvider = waiter.isCompleteProvider;
    return this;
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
 * The type of invocation. Default is REQUEST_RESPONSE
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
  REQUEST_RESPONSE = 'RequestResponse',

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
   * @default InvocationType.REQUEST_RESPONSE
   */
  readonly invocationType?: InvocationType;

  /**
   * Whether to return the logs as part of the response
   *
   * @default LogType.NONE
   */
  readonly logType?: LogType;

  /**
   * How long, in days, the log contents will be retained.
   *
   * @default - no retention days specified
   */
  readonly logRetention?: RetentionDays;

  /**
   * Payload to send as part of the invoke
   *
   * @default - no payload
   */
  readonly payload?: string;
}

/**
 * An AWS Lambda Invoke function API call.
 * Use this instead of the generic AwsApiCall in order to
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
        RetentionDays: props.logRetention,
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

    // If using `waitForAssertions`, do the same for `waiterProvider` as above.
    // Aspects are used here because we do not know if the user is using `waitForAssertions` at this point.
    Aspects.of(this).add({
      visit(node: IConstruct) {
        if (node instanceof AwsApiCall && node.waiterProvider) {
          node.waiterProvider.addPolicyStatementFromSdkCall('Lambda', 'invokeFunction', [stack.formatArn({
            service: 'lambda',
            resource: 'function',
            arnFormat: ArnFormat.COLON_RESOURCE_NAME,
            resourceName: props.functionName,
          })]);
        }
      },
    }, { priority: AspectPriority.MUTATING });
  }
}
