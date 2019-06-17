import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import sfn = require('@aws-cdk/aws-stepfunctions');

/**
 * A StepFunctions Task to invoke a Lambda function.
 *
 * A Function can be used directly as a Resource, but this class mirrors
 * integration with other AWS services via a specific class instance.
 */
export class InvokeFunction implements sfn.IStepFunctionsTask {
  constructor(private readonly lambdaFunction: lambda.IFunction) {
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
    };
  }
}
