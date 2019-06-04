import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import sfn = require('@aws-cdk/aws-stepfunctions');
import { FieldUtils } from '../../aws-stepfunctions/lib/fields';

/**
 * Properties for InvokeFunction
 */
export interface InvokeFunctionProps {
  /**
   * The JSON that you want to provide to your Lambda function as input.
   */
  readonly payload?: { [key: string]: any };

  /**
   * Whether to pause the workflow until a task token is returned
   *
   * @default false
   */
  readonly waitForTaskToken?: boolean;

  /**
   * Whether to invoke lambda via integrated service ARN "arn:aws:states:::lambda:invoke"
   * or via Function ARN.
   *
   * @default false
   */
  readonly invokeAsIntegratedService?: boolean;
}

/**
 * A StepFunctions Task to invoke a Lambda function.
 *
 * A Function can be used directly as a Resource, but this class mirrors
 * integration with other AWS services via a specific class instance.
 */
export class InvokeFunction implements sfn.IStepFunctionsTask {

  private readonly waitForTaskToken: boolean;
  private readonly invokeAsIntegratedService: boolean;

  constructor(private readonly lambdaFunction: lambda.IFunction, private readonly props: InvokeFunctionProps = {}) {
    this.waitForTaskToken = props.waitForTaskToken === true;

    // Invoke function as integrated service if flag is in props, or if waitForTaskToken property is true
    this.invokeAsIntegratedService = props.invokeAsIntegratedService === true || this.waitForTaskToken;

    if (this.waitForTaskToken && !FieldUtils.containsTaskToken(props.payload)) {
      throw new Error('Task Token is missing in payload');
    }
  }

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskProperties {
    const resourceArn = this.invokeAsIntegratedService
      ? 'arn:aws:states:::lambda:invoke' + this.waitForTaskToken ? '.waitForTaskToken' : ''
      : this.lambdaFunction.functionArn;

    const includeParameters = this.invokeAsIntegratedService || this.props.payload;

    return {
      resourceArn,
      policyStatements: [new iam.PolicyStatement()
        .addResource(this.lambdaFunction.functionArn)
        .addActions("lambda:InvokeFunction")
      ],
      metricPrefixSingular: 'LambdaFunction',
      metricPrefixPlural: 'LambdaFunctions',
      metricDimensions: { LambdaFunctionArn: this.lambdaFunction.functionArn },
      ...includeParameters && {
        parameters: {
          ...this.invokeAsIntegratedService && { FunctionName: this.lambdaFunction.functionName },
          ...this.props.payload && { Payload: this.props.payload },
        }
      }
    };
  }
}