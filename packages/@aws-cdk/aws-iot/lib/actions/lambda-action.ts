import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import { IAction, ActionConfig, ITopicRule } from '..';


/**
 * The action to invoke an AWS Lambda function, passing in an MQTT message.
 */
export class LambdaAction implements IAction {
  /**
   * @param lambdaFn The lambda function to be invoked by this action
   */
  constructor(private readonly lambdaFn: lambda.IFunction) {
  }

  bind(rule: ITopicRule): ActionConfig {
    this.lambdaFn.addPermission('invokedByAwsIotRule', {
      action: 'lambda:InvokeFunction',
      principal: new iam.ServicePrincipal('iot.amazonaws.com'),
      sourceAccount: Stack.of(rule).account,
      sourceArn: rule.topicRuleArn,
    });

    return {
      lambda: {
        functionArn: this.lambdaFn.functionArn,
      },
    };
  }
}
