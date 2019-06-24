import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import sfn = require('@aws-cdk/aws-stepfunctions');

/**
 * Properties for InvokeFunction
 */
export interface InvokeFunctionProps {
  /**
   * The JSON that you want to provide to your Lambda function as input.
   *
   * @default - The JSON data indicated by the task's InputPath is used as payload
   */
  readonly payload?: { [key: string]: any };
}

/**
 * A StepFunctions Task to invoke a Lambda function.
 *
 * OUTPUT: the output of this task is the return value of the Lambda Function.
 */
export class InvokeFunction implements sfn.IStepFunctionsTask {
  constructor(private readonly lambdaFunction: lambda.IFunction, private readonly props: InvokeFunctionProps = {}) {
  }

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: this.lambdaFunction.functionArn,
      policyStatements: [new iam.PolicyStatement({
        resources: [this.lambdaFunction.functionArn],
        actions: ["lambda:InvokeFunction"],
      })],
      metricPrefixSingular: 'LambdaFunction',
      metricPrefixPlural: 'LambdaFunctions',
      metricDimensions: { LambdaFunctionArn: this.lambdaFunction.functionArn },
      parameters: this.props.payload
    };
  }
}