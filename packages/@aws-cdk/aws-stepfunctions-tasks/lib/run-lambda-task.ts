import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import sfn = require('@aws-cdk/aws-stepfunctions');
import { FieldUtils } from '../../aws-stepfunctions/lib/fields';

/**
 * Properties for RunLambdaTask
 */
export interface RunLambdaTaskProps {
  /**
   * The JSON that you want to provide to your Lambda function as input.
   */
  readonly payload?: { [key: string]: any };

  /**
   * Whether to pause the workflow until a task token is returned
   *
   * If this is set to true, the Context.taskToken value must be included
   * somewhere in the payload and the Lambda must call
   * `SendTaskSuccess/SendTaskFailure` using that token.
   *
   * @default false
   */
  readonly waitForTaskToken?: boolean;

  /**
   * Invocation type of the Lambda function
   *
   * @default RequestResponse
   */
  readonly invocationType?: InvocationType;

  /**
   * Client context to pass to the function
   *
   * @default - No context
   */
  readonly clientContext?: string;
}

/**
 * Invoke a Lambda function as a Task
 *
 * OUTPUT: the output of this task is either the return value of Lambda's
 * Invoke call, or whatever the Lambda Function posted back using
 * `SendTaskSuccess/SendTaskFailure` in `waitForTaskToken` mode.
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-lambda.html
 */
export class RunLambdaTask implements sfn.IStepFunctionsTask {
  private readonly waitForTaskToken: boolean;

  constructor(private readonly lambdaFunction: lambda.IFunction, private readonly props: RunLambdaTaskProps = {}) {
    this.waitForTaskToken = !!props.waitForTaskToken;

    if (this.waitForTaskToken && !FieldUtils.containsTaskToken(props.payload)) {
      throw new Error('Task Token is missing in payload (pass Context.taskToken somewhere in payload)');
    }
  }

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    const resourceArn = 'arn:aws:states:::lambda:invoke' + (this.waitForTaskToken ? '.waitForTaskToken' : '');

    return {
      resourceArn,
      policyStatements: [new iam.PolicyStatement()
        .addResource(this.lambdaFunction.functionArn)
        .addActions("lambda:InvokeFunction")
      ],
      metricPrefixSingular: 'LambdaFunction',
      metricPrefixPlural: 'LambdaFunctions',
      metricDimensions: { LambdaFunctionArn: this.lambdaFunction.functionArn },
      parameters: {
        FunctionName: this.lambdaFunction.functionName,
        Payload: this.props.payload,
        InvocationType: this.props.invocationType,
        ClientContext: this.props.clientContext,
      }
    };
  }
}

/**
 * Invocation type of a Lambda
 */
export enum InvocationType {
  /**
   * Invoke synchronously
   *
   * The API response includes the function response and additional data.
   */
  RequestResponse = 'RequestResponse',

  /**
   * Invoke asynchronously
   *
   * Send events that fail multiple times to the function's dead-letter queue (if it's configured).
   * The API response only includes a status code.
   */
  Event = 'Event',
}