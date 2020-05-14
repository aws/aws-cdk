import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { getResourceArn, TaskStateConfig, taskStateJson, validatePatternSupported } from '../private/task-utils';

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
   * Client context to pass to the function
   *
   * @default - No context
   */
  readonly clientContext?: string;

  /**
   * Version or alias of the function to be invoked
   *
   * @default - No qualifier
   */
  readonly qualifier?: string;
}

/**
 * Invoke a Lambda function as a Task
 *
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-lambda.html
 */
export class LambdaInvoke extends sfn.TaskStateBase {

  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  ];

  private readonly integrationPattern: sfn.IntegrationPattern;
  private readonly metricsConfig: sfn.TaskMetricsConfig;
  private readonly policies: iam.PolicyStatement[];

  constructor(scope: cdk.Construct, id: string, private readonly props: LambdaInvokeProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, LambdaInvoke.SUPPORTED_INTEGRATION_PATTERNS);

    if (this.integrationPattern === sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN
      && !sfn.FieldUtils.containsTaskToken(props.payload)) {
      throw new Error('Task Token is required in `payload` for callback. Use Context.taskToken to set the token.');
    }

    this.metricsConfig = {
      metricPrefixSingular: 'LambdaFunction',
      metricPrefixPlural: 'LambdaFunctions',
      metricDimensions: { LambdaFunctionArn: this.props.lambdaFunction.functionArn },
    };

    this.policies = [
      new iam.PolicyStatement({
        resources: [this.props.lambdaFunction.functionArn],
        actions: ['lambda:InvokeFunction'],
      }),
    ];
  }

  /**
   * Provides the service integration task configuration
   */
  protected renderTask(): any {
    const taskStateConfig: TaskStateConfig = {
      resourceArn: getResourceArn('lambda', 'invoke', this.integrationPattern),
      parameters: {
        FunctionName: this.props.lambdaFunction.functionName,
        Payload: this.props.payload ? this.props.payload.value : sfn.TaskInput.fromDataAt('$').value,
        InvocationType: this.props.invocationType,
        ClientContext: this.props.clientContext,
        Qualifier: this.props.qualifier,
      },
    };

    return taskStateJson(taskStateConfig);
  }

  /**
   * Additional policy statements that will be added to the state machine's
   * execution role
   */
  protected taskPolicies(): iam.PolicyStatement[] {
    return this.policies;
  }

  /**
   * metrics configuration properties for the task
   */
  protected taskMetrics(): sfn.TaskMetricsConfig {
    return this.metricsConfig;
  }
}

/**
 * Invocation type of a Lambda
 */
export enum LambdaInvocationType {
  /**
   * Invoke synchronously
   *
   * The API response includes the function response and additional data.
   */
  REQUEST_RESPONSE = 'RequestResponse',

  /**
   * Invoke asynchronously
   *
   * Send events that fail multiple times to the function's dead-letter queue (if it's configured).
   * The API response only includes a status code.
   */
  EVENT = 'Event',

  /**
   * TValidate parameter values and verify that the user or role has permission to invoke the function.
   */
  DRY_RUN = 'DryRun'
}
