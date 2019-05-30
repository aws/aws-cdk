import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import sfn = require('@aws-cdk/aws-stepfunctions');

/**
 * Properties for InvokeFunction
 */
export interface InvokeFunctionProps {
  /**
   * The JSON that you want to provide to your Lambda function as input.
   */
  readonly payload?: { [key: string]: string };

  /**
   * Whether to pause the workflow until a task token is returned
   *
   * @default false
   */
  readonly waitForTaskToken?: boolean;
}

/**
 * A StepFunctions Task to invoke a Lambda function.
 *
 * A Function can be used directly as a Resource, but this class mirrors
 * integration with other AWS services via a specific class instance.
 */
export class InvokeFunction implements sfn.IStepFunctionsTask {

  private readonly waitForTaskToken: boolean;

  constructor(private readonly lambdaFunction: lambda.IFunction, private readonly props: InvokeFunctionProps) {
    this.waitForTaskToken = props.waitForTaskToken === true;
  }

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskProperties {
    return {
      resourceArn: this.waitForTaskToken
        ? 'arn:aws:states:::lambda:invoke.waitForTaskToken'
        : this.lambdaFunction.functionArn,
      policyStatements: [new iam.PolicyStatement()
        .addResource(this.lambdaFunction.functionArn)
        .addActions("lambda:InvokeFunction")
      ],
      metricPrefixSingular: 'LambdaFunction',
      metricPrefixPlural: 'LambdaFunctions',
      metricDimensions: { LambdaFunctionArn: this.lambdaFunction.functionArn },
      parameters: {
        FunctionName: this.lambdaFunction.functionName,
        ...this.props.payload && { Payload: this.props.payload },
      }
    };
  }
}