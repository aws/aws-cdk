import { Construct } from 'constructs';
import { Action } from './action';
import * as codepipeline from '../../aws-codepipeline';
import * as iam from '../../aws-iam';
import * as sns from '../../aws-sns';
import * as subs from '../../aws-sns-subscriptions';
import { Duration, UnscopedValidationError } from '../../core';

/**
 * Construction properties of the `ManualApprovalAction`.
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

  /**
   * A timeout duration.
   *
   * It is configurable up to 86400 minutes (60 days) with a minimum value of 5 minutes.
   *
   * @default - 10080 minutes (7 days)
   * @see https://docs.aws.amazon.com/codepipeline/latest/userguide/limits.html
   */
  readonly timeout?: Duration;
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
  private stage?: codepipeline.IStage;

  constructor(props: ManualApprovalActionProps) {
    super({
      ...props,
      category: codepipeline.ActionCategory.APPROVAL,
      provider: 'Manual',
      artifactBounds: { minInputs: 0, maxInputs: 0, minOutputs: 0, maxOutputs: 0 },
    });

    if (props.timeout && (props.timeout.toMinutes() < 5 || props.timeout.toMinutes() > 86400)) {
      throw new UnscopedValidationError(`timeout must be between 5 minutes and 86400 minutes (60 days), got ${props.timeout.toMinutes()} minutes`);
    }

    this.props = props;
  }

  public get notificationTopic(): sns.ITopic | undefined {
    return this._notificationTopic;
  }

  /**
   * grant the provided principal the permissions to approve or reject this manual approval action
   *
   * For more info see:
   * https://docs.aws.amazon.com/codepipeline/latest/userguide/approvals-iam-permissions.html
   *
   * @param grantable the grantable to attach the permissions to
   */
  public grantManualApproval(grantable: iam.IGrantable): void {
    if (!this.stage) {
      throw new UnscopedValidationError('Cannot grant permissions before binding action to a stage');
    }
    grantable.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['codepipeline:ListPipelines'],
      resources: ['*'],
    }));
    grantable.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['codepipeline:GetPipeline', 'codepipeline:GetPipelineState', 'codepipeline:GetPipelineExecution'],
      resources: [this.stage.pipeline.pipelineArn],
    }));
    grantable.grantPrincipal.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['codepipeline:PutApprovalResult'],
      resources: [`${this.stage.pipeline.pipelineArn}/${this.stage.stageName}/${this.props.actionName}`],
    }));
  }

  protected bound(scope: Construct, stage: codepipeline.IStage, options: codepipeline.ActionBindOptions): codepipeline.ActionConfig {
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

    this.stage = stage;

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
