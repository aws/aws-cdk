import * as iotevents from '@aws-cdk/aws-iotevents';
import * as lambda from '@aws-cdk/aws-lambda';
import { Construct } from 'constructs';

/**
 * The action to write the data to an AWS Lambda function.
 */
export class LambdaInvokeAction implements iotevents.IAction {
  /**
   * @param func the AWS Lambda function to be invoked by this action
   */
  constructor(private readonly func: lambda.IFunction) {
  }

  /**
   * @internal
   */
  public _bind(_scope: Construct, options: iotevents.ActionBindOptions): iotevents.ActionConfig {
    this.func.grantInvoke(options.role);
    return {
      configuration: {
        lambda: {
          functionArn: this.func.functionArn,
        },
      },
    };
  }
}
