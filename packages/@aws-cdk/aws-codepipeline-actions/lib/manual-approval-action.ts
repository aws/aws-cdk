import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as cdk from '@aws-cdk/core';
import { Action } from './action';

/**
 * Construction properties of the {@link ManualApprovalAction}.
 */
export interface ManualApprovalActionProps extends codepipeline.CommonAwsActionProps {
  /**
   * Optional SNS topic to send notifications to when an approval is pending.
   */
  readonly notificationTopic?: sns.ITopic;

  /**
   * A list of email addresses to subscribe to notifications when this Action is pending approval.
   * If this has been provided, but not `notificationTopic`,
   * a new Topic will be created.
   */
  readonly notifyEmails?: string[];

  /**
   * Any additional information that you want to include in the notification email message.
   */
  readonly additionalInformation?: string;

  /**
   * URL you want to provide to the reviewer as part of the approval request.
   *
   * @default - the approval request will not have an external link
   */
  readonly externalEntityLink?: string;
}

/**
 * Manual approval action.
 */
export class ManualApprovalAction extends Action {
  /**
   * The SNS Topic passed when constructing the Action.
   * If no Topic was passed, but `notifyEmails` were provided,
   * a new Topic will be created.
   */
  private _notificationTopic?: sns.ITopic;
  private readonly props: ManualApprovalActionProps;

  constructor(props: ManualApprovalActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.APPROVAL,
      provider: 'Manual',
      artifactBounds: { minInputs: 0, maxInputs: 0, minOutputs: 0, maxOutputs: 0 },
    });

    this.props = props;
  }

  public get notificationTopic(): sns.ITopic | undefined {
    return this._notificationTopic;
  }

  protected bound(scope: cdk.Construct, _stage: codepipeline.IStage, options: codepipeline.ActionBindOptions):
  codepipeline.ActionConfig {
    if (this.props.notificationTopic) {
      this._notificationTopic = this.props.notificationTopic;
    } else if ((this.props.notifyEmails || []).length > 0) {
      this._notificationTopic = new sns.Topic(scope, 'TopicResource');
    }

    if (this._notificationTopic) {
      this._notificationTopic.grantPublish(options.role);
      for (const notifyEmail of this.props.notifyEmails || []) {
        this._notificationTopic.addSubscription(new subs.EmailSubscription(notifyEmail));
      }
    }

    return {
      configuration: undefinedIfAllValuesAreEmpty({
        NotificationArn: this._notificationTopic?.topicArn,
        CustomData: this.props.additionalInformation,
        ExternalEntityLink: this.props.externalEntityLink,
      }),
    };
  }
}

function undefinedIfAllValuesAreEmpty(object: object): object | undefined {
  return Object.values(object).some(v => v !== undefined) ? object : undefined;
}
