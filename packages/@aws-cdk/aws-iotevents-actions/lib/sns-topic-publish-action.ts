import * as iam from '@aws-cdk/aws-iam';
import * as iotevents from '@aws-cdk/aws-iotevents';
import * as sns from '@aws-cdk/aws-sns';

/**
 * The action to write the data to an Amazon SNS topic.
 */
export class SNSTopicPublishAction implements iotevents.IAction {
  readonly actionPolicies?: iam.PolicyStatement[];

  /**
   * @param topic The Amazon SNS topic to publish data on. Must not be a FIFO topic.
   */
  constructor(private readonly topic: sns.ITopic) {
    this.actionPolicies = [
      new iam.PolicyStatement({
        actions: ['sns:Publish'],
        resources: [topic.topicArn],
      }),
    ];
  }

  renderActionConfig(): iotevents.ActionConfig {
    return {
      configuration: {
        sns: {
          targetArn: this.topic.topicArn,
        },
      },
    };
  }
}
