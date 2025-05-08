import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import * as lambda from '../../../aws-lambda';
import * as sfn from '../../../aws-stepfunctions';
import * as cdk from '../../../core';
import * as cxapi from '../../../cx-api';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

interface LambdaInvokeBaseProps {
  /**
   * Lambda function to invoke
   */
  readonly lambdaFunction: lambda.IFunction;

  /**
   * The JSON that will be supplied as input to the Lambda function
   *
   * @default - The state input (JSONata: '{% $states.input %}', JSONPath: '$')
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
   * @deprecated pass a Version or Alias object as lambdaFunction instead
   */
  readonly qualifier?: string;

  /**
   * Invoke the Lambda in a way that only returns the payload response without additional metadata.
   *
   * The `payloadResponseOnly` property cannot be used if `integrationPattern`, `invocationType`,
   * `clientContext`, or `qualifier` are specified.
   * It always uses the REQUEST_RESPONSE behavior.
   *
   * @default false
   */
  readonly payloadResponseOnly?: boolean;

  /**
   * Whether to retry on Lambda service exceptions.
   *
   * This handles `Lambda.ServiceException`, `Lambda.AWSLambdaException`,
   * `Lambda.SdkClientException`, and `Lambda.ClientExecutionTimeoutException`
   * with an interval of 2 seconds, a back-off rate
   * of 2 and 6 maximum attempts.
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/bp-lambda-serviceexception.html
   *
   * @default true
   */
  readonly retryOnServiceExceptions?: boolean;
}

/**
 * Properties for invoking a Lambda function with LambdaInvoke using JsonPath
 */
export interface LambdaInvokeJsonPathProps extends LambdaInvokeBaseProps, sfn.TaskStateJsonPathBaseProps { }

/**
 * Properties for invoking a Lambda function with LambdaInvoke using Jsonata
 */
export interface LambdaInvokeJsonataProps extends LambdaInvokeBaseProps, sfn.TaskStateJsonataBaseProps { }

/**
 * Properties for invoking a Lambda function with LambdaInvoke
 */
export interface LambdaInvokeProps extends LambdaInvokeBaseProps, sfn.TaskStateBaseProps { }

/**
 * Invoke a Lambda function as a Task
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-lambda.html
 */
export class LambdaInvoke extends sfn.TaskStateBase {
  /**
   * Invoke a Lambda function as a Task using JSONPath
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-lambda.html
   */
  public static jsonPath(scope: Construct, id: string, props: LambdaInvokeJsonPathProps) {
    return new LambdaInvoke(scope, id, props);
  }
  /**
   * Invoke a Lambda function as a Task using JSONata
   *
   * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-lambda.html
   */
  public static jsonata(scope: Construct, id: string, props: LambdaInvokeJsonataProps) {
    return new LambdaInvoke(scope, id, {
      ...props,
      queryLanguage: sfn.QueryLanguage.JSONATA,
    });
  }

  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: LambdaInvokeProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, LambdaInvoke.SUPPORTED_INTEGRATION_PATTERNS);

    if (this.integrationPattern === sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN
      && !sfn.FieldUtils.containsTaskToken(props.payload)) {
      throw new Error('Task Token is required in `payload` for callback. Use JsonPath.taskToken to set the token.');
    }

    if (props.payloadResponseOnly &&
      (props.integrationPattern || props.invocationType || props.clientContext || props.qualifier)) {
      throw new Error(
        "The 'payloadResponseOnly' property cannot be used if 'integrationPattern', 'invocationType', 'clientContext', or 'qualifier' are specified.",
      );
    }

    this.taskMetrics = {
      metricPrefixSingular: 'LambdaFunction',
      metricPrefixPlural: 'LambdaFunctions',
      metricDimensions: {
        LambdaFunctionArn: this.props.lambdaFunction.functionArn,
        ...(this.props.qualifier && { Qualifier: this.props.qualifier }),
      },
    };

    const grantAllVersions = cdk.FeatureFlags.of(this).isEnabled(cxapi.STEPFUNCTIONS_TASKS_LAMBDA_INVOKE_GRANT_ALL_VERSIONS);
    const functionArn = this.props.lambdaFunction.functionArn;
    let resources: string[];
    if (grantAllVersions) {
      const baseArn = functionArn.replace(/:[^:]*$/, '');
      resources = [
        functionArn,
        `${baseArn}:*`,
      ];
    } else {
      resources = this.props.lambdaFunction.resourceArnsForGrantInvoke;
    }

    this.taskPolicies = [
      new iam.PolicyStatement({
        resources,
        actions: ['lambda:InvokeFunction'],
      }),
    ];

    if (props.retryOnServiceExceptions ?? true) {
      // Best practice from https://docs.aws.amazon.com/step-functions/latest/dg/bp-lambda-serviceexception.html
      this.addRetry({
        errors: ['Lambda.ClientExecutionTimeoutException', 'Lambda.ServiceException', 'Lambda.AWSLambdaException', 'Lambda.SdkClientException'],
        interval: cdk.Duration.seconds(2),
        maxAttempts: 6,
        backoffRate: 2,
      });
    }
  }

  /**
   * Provides the Lambda Invoke service integration task configuration
   */
  /**
   * @internal
   */
  protected _renderTask(topLevelQueryLanguage?: sfn.QueryLanguage): any {
    const queryLanguage = sfn._getActualQueryLanguage(topLevelQueryLanguage, this.props.queryLanguage);
    const [resource, paramOrArg] = this.props.payloadResponseOnly ?
      [this.props.lambdaFunction.functionArn, this.props.payload?.value] :
      [integrationResourceArn('lambda', 'invoke', this.integrationPattern), {
        FunctionName: this.props.lambdaFunction.functionArn,
        Payload: this.props.payload?.value ??
          (queryLanguage === sfn.QueryLanguage.JSONATA ? '{% $states.input %}'
            : sfn.TaskInput.fromJsonPathAt('$').value),
        InvocationType: this.props.invocationType,
        ClientContext: this.props.clientContext,
        Qualifier: this.props.qualifier,
      }];
    return {
      Resource: resource,
      ...this._renderParametersOrArguments(paramOrArg, queryLanguage),
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
  DRY_RUN = 'DryRun',
}
