import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Properties for invoking a Lambda function with LambdaInvoke
 */
export interface LambdaInvokeProps extends sfn.TaskStateBaseProps {

  /**
   * Lambda function to invoke
   */
  readonly lambdaFunction: lambda.IFunction;

  /**
   * The JSON that will be supplied as input to the Lambda function
   *
   * @default - The state input (JSON path '$')
   */
  readonly payload?: sfn.TaskInput;

  /**
   * Invocation type of the Lambda function
   *
   * @default InvocationType.REQUEST_RESPONSE
   */
  readonly invocationType?: LambdaInvocationType;

  /**
   * Up to 3583 bytes of base64-encoded data about the invoking client
   * to pass to the function.
   *
   * @default - No context
   */
  readonly clientContext?: string;

  /**
   * Version or alias to invoke a published version of the function
   *
   * You only need to supply this if you want the version of the Lambda Function to depend
   * on data in the state machine state. If not, you can pass the appropriate Alias or Version object
   * directly as the `lambdaFunction` argument.
   *
   * @default - Version or alias inherent to the `lambdaFunction` object.
   */
  readonly qualifier?: string;
}

/**
 * Invoke a Lambda function as a Task
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-lambda.html
 */
export class LambdaInvoke extends sfn.TaskStateBase {

  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: cdk.Construct, id: string, private readonly props: LambdaInvokeProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, LambdaInvoke.SUPPORTED_INTEGRATION_PATTERNS);

    if (this.integrationPattern === sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN
      && !sfn.FieldUtils.containsTaskToken(props.payload)) {
      throw new Error('Task Token is required in `payload` for callback. Use JsonPath.taskToken to set the token.');
    }

    this.taskMetrics = {
      metricPrefixSingular: 'LambdaFunction',
      metricPrefixPlural: 'LambdaFunctions',
      metricDimensions: {
        LambdaFunctionArn: this.props.lambdaFunction.functionArn,
        ...(this.props.qualifier && { Qualifier: this.props.qualifier }),
      },
    };

    this.taskPolicies = [
      new iam.PolicyStatement({
        resources: [this.props.lambdaFunction.functionArn],
        actions: ['lambda:InvokeFunction'],
      }),
    ];
  }

  /**
   * Provides the Lambda Invoke service integration task configuration
   */
  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('lambda', 'invoke', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
        FunctionName: this.props.lambdaFunction.functionArn,
        Payload: this.props.payload ? this.props.payload.value : sfn.TaskInput.fromDataAt('$').value,
        InvocationType: this.props.invocationType,
        ClientContext: this.props.clientContext,
        Qualifier: this.props.qualifier,
      }),
    };
  }
}

/**
 * Invocation type of a Lambda
 */
export enum LambdaInvocationType {
  /**
   * Invoke the function synchronously.
   *
   * Keep the connection open until the function returns a response or times out.
   * The API response includes the function response and additional data.
   */
  REQUEST_RESPONSE = 'RequestResponse',

  /**
   * Invoke the function asynchronously.
   *
   * Send events that fail multiple times to the function's dead-letter queue (if it's configured).
   * The API response only includes a status code.
   */
  EVENT = 'Event',

  /**
   * Validate parameter values and verify that the user or role has permission to invoke the function.
   */
  DRY_RUN = 'DryRun'
}
