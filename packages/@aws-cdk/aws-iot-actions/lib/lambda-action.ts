import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import * as lambda from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';


/**
 * The action to invoke an AWS Lambda function, passing in an MQTT message.
 */
export class LambdaAction implements iot.IAction {
  /**
   * @param lambdaFn The lambda function to be invoked by this action
   */
  constructor(private readonly lambdaFn: lambda.IFunction) {}

  bind(rule: iot.ITopicRule): iot.ActionConfig {
    this.lambdaFn.addPermission('invokedByAwsIotRule', {
      action: 'lambda:InvokeFunction',
      principal: new iam.ServicePrincipal('iot.amazonaws.com'),
      sourceAccount: Stack.of(rule).account,
      sourceArn: rule.topicRuleArn,
    });

    return {
      configuration: {
        lambda: {
          functionArn: this.lambdaFn.functionArn,
        },
      },
    };
  }
}
