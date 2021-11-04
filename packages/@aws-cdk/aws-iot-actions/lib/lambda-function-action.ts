import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import * as lambda from '@aws-cdk/aws-lambda';

/**
 * The action to invoke an AWS Lambda function, passing in an MQTT message.
 */
export class LambdaFunctionAction implements iot.IAction {
  /**
   * @param func The lambda function to be invoked by this action
   */
  constructor(private readonly func: lambda.IFunction) {}

  bind(topicRule: iot.ITopicRule): iot.ActionConfig {
    this.func.addPermission('invokedByAwsIotRule', {
      action: 'lambda:InvokeFunction',
      principal: new iam.ServicePrincipal('iot.amazonaws.com'),
      sourceAccount: topicRule.env.account,
      sourceArn: topicRule.topicRuleArn,
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
