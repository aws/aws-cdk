import cloudwatch = require('@aws-cdk/aws-cloudwatch');
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
  public readonly resourceArn: string;
  public readonly policyStatements?: iam.PolicyStatement[] | undefined;
  public readonly metricDimensions?: cloudwatch.DimensionHash | undefined;
  public readonly metricPrefixSingular?: string = 'LambdaFunction';
  public readonly metricPrefixPlural?: string = 'LambdaFunctions';

  public readonly heartbeatSeconds?: number | undefined;
  public readonly parameters?: { [name: string]: any; } | undefined;

  constructor(lambdaFunction: lambda.IFunction) {
    this.resourceArn = lambdaFunction.functionArn;
    this.policyStatements = [new iam.PolicyStatement()
      .addResource(lambdaFunction.functionArn)
      .addActions("lambda:InvokeFunction")
    ];
    this.metricDimensions = { LambdaFunctionArn: lambdaFunction.functionArn };
  }
}