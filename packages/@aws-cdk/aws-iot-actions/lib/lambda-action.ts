import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import * as lambda from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';

/**
 * The action to invoke an AWS Lambda function, passing in an MQTT message.
 */
export class LambdaAction implements iot.IAction {
  /**
   * @param func The lambda function to be invoked by this action
   */
  constructor(private readonly func: lambda.IFunction) {}

  bind(rule: iot.ITopicRule): iot.ActionConfig {
    this.func.addPermission('invokedByAwsIotRule', {
      action: 'lambda:InvokeFunction',
      principal: new iam.ServicePrincipal('iot.amazonaws.com'),
      sourceAccount: rule.env.account,
      sourceArn: rule.topicRuleArn,
    });

    return {
      configuration: {
        lambda: {
          functionArn: this.func.functionArn,
        },
      },
    };
  }
}
