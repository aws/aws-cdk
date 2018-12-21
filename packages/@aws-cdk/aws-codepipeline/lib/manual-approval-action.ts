import actions = require('@aws-cdk/aws-codepipeline-api');
import sns = require('@aws-cdk/aws-sns');
import cdk = require('@aws-cdk/cdk');

/**
 * Construction properties of the {@link ManualApprovalAction}.
 */
export interface ManualApprovalActionProps extends actions.CommonActionProps,
    actions.CommonActionConstructProps {
  /**
   * Optional SNS topic to send notifications to when an approval is pending.
   */
  notificationTopic?: sns.TopicRef;

  /**
   * A list of email addresses to subscribe to notifications when this Action is pending approval.
   * If this has been provided, but not `notificationTopic`,
   * a new Topic will be created.
   */
  notifyEmails?: string[];

  /**
   * Any additional information that you want to include in the notification email message.
   */
  additionalInformation?: string;
}

/**
 * Manual approval action.
 */
export class ManualApprovalAction extends actions.Action {
  /**
   * The SNS Topic passed when constructing the Action.
   * If no Topic was passed, but `notifyEmails` were provided,
   * a new Topic will be created.
   */
  public readonly notificationTopic?: sns.TopicRef;

  constructor(parent: cdk.Construct, name: string, props: ManualApprovalActionProps) {
    super(parent, name, {
      category: actions.ActionCategory.Approval,
      provider: 'Manual',
      artifactBounds: { minInputs: 0, maxInputs: 0, minOutputs: 0, maxOutputs: 0 },
      configuration: new cdk.Token(() => this.actionConfiguration(props)),
      ...props,
    });

    if (props.notificationTopic) {
      this.notificationTopic = props.notificationTopic;
    } else if ((props.notifyEmails || []).length > 0) {
      this.notificationTopic = new sns.Topic(this, 'TopicResource');
    }

    if (this.notificationTopic) {
      this.notificationTopic.grantPublish(props.stage.pipeline.role);
      for (const notifyEmail of props.notifyEmails || []) {
        this.notificationTopic.subscribeEmail(`Subscription-${notifyEmail}`, notifyEmail);
      }
    }
  }

  private actionConfiguration(props: ManualApprovalActionProps): any {
    return this.notificationTopic
      ? {
        NotificationArn: this.notificationTopic.topicArn,
        CustomData: props.additionalInformation,
      }
      : undefined;
  }
}
