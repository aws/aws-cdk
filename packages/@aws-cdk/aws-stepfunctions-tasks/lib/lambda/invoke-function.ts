import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as sfn from '@aws-cdk/aws-stepfunctions';

/**
 * Properties for InvokeFunction
 *
 * @deprecated use `LambdaInvoke`
 */
export interface InvokeFunctionProps {
  /**
   * The JSON that you want to provide to your Lambda function as input.
   *
   * This parameter is named as payload to keep consistent with RunLambdaTask class.
   *
   * @default - The JSON data indicated by the task's InputPath is used as payload
   */
  readonly payload?: { [key: string]: any };
}

/**
 * A Step Functions Task to invoke a Lambda function.
 *
 * The Lambda function Arn is defined as Resource in the state machine definition.
 *
 * OUTPUT: the output of this task is the return value of the Lambda Function.
 *
 * @deprecated Use `LambdaInvoke`
 */
export class InvokeFunction implements sfn.IStepFunctionsTask {
  constructor(private readonly lambdaFunction: lambda.IFunction, private readonly props: InvokeFunctionProps = {}) {
  }

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: this.lambdaFunction.functionArn,
      policyStatements: [new iam.PolicyStatement({
        resources: this.lambdaFunction.resourceArnsForGrantInvoke,
        actions: ['lambda:InvokeFunction'],
      })],
      metricPrefixSingular: 'LambdaFunction',
      metricPrefixPlural: 'LambdaFunctions',
      metricDimensions: { LambdaFunctionArn: this.lambdaFunction.functionArn },
      parameters: this.props.payload,
    };
  }
}
