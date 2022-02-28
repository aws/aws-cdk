import * as iam from '@aws-cdk/aws-iam';
import * as iotevents from '@aws-cdk/aws-iotevents';
import * as lambda from '@aws-cdk/aws-lambda';

/**
 * The action to write the data to an AWS Lambda function.
 */
export class LambdaInvokeAction implements iotevents.IAction {
  /**
   * The policies to perform the AWS IoT Events action.
   */
  readonly actionPolicies?: iam.PolicyStatement[];

  /**
   * @param func the AWS Lambda function to be invoked by this action
   */
  constructor(private readonly func: lambda.IFunction) {
    this.actionPolicies = [
      new iam.PolicyStatement({
        actions: ['lambda:InvokeFunction'],
        resources: [func.functionArn],
      }),
    ];
  }

  renderActionConfig(): iotevents.ActionConfig {
    return {
      configuration: {
        lambda: {
          functionArn: this.func.functionArn,
        },
      },
    };
  }
}
