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
   * If this is set to true, the Context.taskToken value must be included
   * somewhere in the payload and the Lambda must call SendTaskSuccess
   * using that token.
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

  constructor(private readonly lambdaFunction: lambda.IFunction, private readonly props: InvokeFunctionProps = {}) {
    this.waitForTaskToken = !!props.waitForTaskToken;

    if (this.waitForTaskToken && !FieldUtils.containsTaskToken(props.payload)) {
      throw new Error('Task Token is missing in payload (pass Context.taskToken somewhere in payload)');
    }
  }

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    const resourceArn = this.waitForTaskToken
      ? 'arn:aws:states:::lambda:invoke.waitForTaskToken'
      : this.lambdaFunction.functionArn;

    let parameters: any;
    if (this.waitForTaskToken) {
      parameters = {
        FunctionName: this.lambdaFunction.functionName,
        Payload: nonEmptyObject(this.props.payload),
      };
    } else {
      parameters = this.props.payload;
    }

    return {
      resourceArn,
      policyStatements: [new iam.PolicyStatement()
        .addResource(this.lambdaFunction.functionArn)
        .addActions("lambda:InvokeFunction")
      ],
      metricPrefixSingular: 'LambdaFunction',
      metricPrefixPlural: 'LambdaFunctions',
      metricDimensions: { LambdaFunctionArn: this.lambdaFunction.functionArn },
      parameters: nonEmptyObject(parameters)
    };
  }
}

function nonEmptyObject(x: any): any {
  if (typeof x === 'object' && x !== null && Object.entries(x).length === 0) {
    return undefined;
  }
  return x;
}