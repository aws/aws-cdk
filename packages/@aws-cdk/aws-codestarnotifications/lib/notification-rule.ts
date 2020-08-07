import * as chatbot from '@aws-cdk/aws-chatbot';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { CfnNotificationRule } from './codestarnotifications.generated';

/**
 * The list of event types for AWS Codecommit
 */
export enum RepositoryEvent {

  /**
   * Trigger notification when repository comments on commits
   */
  COMMENTS_ON_COMMITS = 'codecommit-repository-comments-on-commits',

  /**
   * Trigger notification when repository comments on pull requests
   */
  COMMENTS_ON_PULL_REQUEST = 'codecommit-repository-comments-on-pull-requests',

  /**
   * Trigger notification when repository approvals status changed
   */
  APPROVAL_STATUS_CHANGED = 'codecommit-repository-approvals-status-changed',

  /**
   * Trigger notification when repository approvals rule override
   */
  APPROVAL_RULE_OVERRIDE = 'codecommit-repository-approvals-rule-override',

  /**
   * Trigger notification when repository pull request created
   */
  PULL_REQUEST_CREATED = 'codecommit-repository-pull-request-created',

  /**
   * Trigger notification when repository pull request source updated
   */
  PULL_REQUEST_SOURCE_UPDATED = 'codecommit-repository-pull-request-source-updated',

  /**
   * Trigger notification when repository pull request status changed
   */
  PULL_REQUEST_STATUS_CHANGED = 'codecommit-repository-pull-request-status-changed',

  /**
   * Trigger notification when repository pull request merged
   */
  PULL_REQUEST_MERGED = 'codecommit-repository-pull-request-merged',

  /**
   * Trigger notification when repository branches and tags created
   */
  BRANCHES_AND_TAGS_CREATED = 'codecommit-repository-branches-and-tags-created',

  /**
   * Trigger notification when repository branches and tags deleted
   */
  BRANCHES_AND_TAGS_DELETED = 'codecommit-repository-branches-and-tags-deleted',

  /**
   * Trigger notification when repository branches and tags updated
   */
  BRANCHES_AND_TAGS_UPDATED = 'codecommit-repository-branches-and-tags-updated',
}

/**
 * The list of event types for AWS Codebuild
 */
export enum ProjectEvent {

  /**
   * Trigger notification when project build state failed
   */
  BUILD_STATE_FAILED = 'codebuild-project-build-state-failed',

  /**
   * Trigger notification when project build state succeeded
   */
  BUILD_STATE_SUCCEEDED = 'codebuild-project-build-state-succeeded',

  /**
   * Trigger notification when project build state in progress
   */
  BUILD_STATE_IN_PROGRESS = 'codebuild-project-build-state-in-progress',

  /**
   * Trigger notification when project build state stopped
   */
  BUILD_STATE_STOPPED = 'codebuild-project-build-state-stopped',

  /**
   * Trigger notification when project build phase failure
   */
  BUILD_PHASE_FAILRE = 'codebuild-project-build-phase-failure',

  /**
   * Trigger notification when project build phase success
   */
  BUILD_PHASE_SUCCESS = 'codebuild-project-build-phase-success',
}

/**
 * The list of event types for AWS Codedeploy
 */
export enum ApplicationEvent {

  /**
   * Trigger notification when application deployment failed
   */
  DEPLOYMENT_FAILED = 'codedeploy-application-deployment-failed',

  /**
   * Trigger notification when application deployment succeeded
   */
  DEPLOYMENT_SUCCEEDED = 'codedeploy-application-deployment-succeeded',

  /**
   * Trigger notification when application deployment started
   */
  DEPLOYMENT_STARTED = 'codedeploy-application-deployment-started',
}

/**
 * The list of event types for AWS Codepipeline
 */
export enum PipelineEvent {

  /**
   * Trigger notification when pipeline action execution succeeded
   */
  ACTION_EXECUTION_SUCCEEDED = 'codepipeline-pipeline-action-execution-succeeded',

  /**
   * Trigger notification when pipeline action execution failed
   */
  ACTION_EXECUTION_FAILED = 'codepipeline-pipeline-action-execution-failed',

  /**
   * Trigger notification when pipeline action execution canceled
   */
  ACTION_EXECUTION_CANCELED = 'codepipeline-pipeline-action-execution-canceled',

  /**
   * Trigger notification when pipeline action execution started
   */
  ACTION_EXECUTION_STARTED = 'codepipeline-pipeline-action-execution-started',

  /**
   * Trigger notification when pipeline stage execution started
   */
  STAGE_EXECUTION_STARTED = 'codepipeline-pipeline-stage-execution-started',

  /**
   * Trigger notification when pipeline stage execution succeeded
   */
  STAGE_EXECUTION_SUCCEEDED = 'codepipeline-pipeline-stage-execution-succeeded',

  /**
   * Trigger notification when pipeline stage execution resumed
   */
  STAGE_EXECUTION_RESUMED = 'codepipeline-pipeline-stage-execution-resumed',

  /**
   * Trigger notification when pipeline stage execution canceled
   */
  STAGE_EXECUTION_CANCELED = 'codepipeline-pipeline-stage-execution-canceled',

  /**
   * Trigger notification when pipeline stage execution failed
   */
  STAGE_EXECUTION_FAILED = 'codepipeline-pipeline-stage-execution-failed',

  /**
   * Trigger notification when pipeline execution failed
   */
  PIPELINE_EXECUTION_FAILED = 'codepipeline-pipeline-pipeline-execution-failed',

  /**
   * Trigger notification when pipeline execution canceled
   */
  PIPELINE_EXECUTION_CANCELED = 'codepipeline-pipeline-pipeline-execution-canceled',

  /**
   * Trigger notification when pipeline execution started
   */
  PIPELINE_EXECUTION_STARTED = 'codepipeline-pipeline-pipeline-execution-started',

  /**
   * Trigger notification when pipeline execution resumed
   */
  PIPELINE_EXECUTION_RESUMED = 'codepipeline-pipeline-pipeline-execution-resumed',

  /**
   * Trigger notification when pipeline execution succeeded
   */
  PIPELINE_EXECUTION_SUCCEEDED = 'codepipeline-pipeline-pipeline-execution-succeeded',

  /**
   * Trigger notification when pipeline execution superseded
   */
  PIPELINE_EXECUTION_SUPERSEDED = 'codepipeline-pipeline-pipeline-execution-superseded',

  /**
   * Trigger notification when pipeline manual approval failed
   */
  MANUAL_APPROVAL_FAILED = 'codepipeline-pipeline-manual-approval-failed',

  /**
   * Trigger notification when pipeline manual approval needed
   */
  MANUAL_APPROVAL_NEEDED = 'codepipeline-pipeline-manual-approval-needed',

  /**
   * Trigger notification when pipeline manual approval succeeded
   */
  MANUAL_APPROVAL_SUCCEEDED = 'codepipeline-pipeline-manual-approval-succeeded',
}

export type Events = RepositoryEvent | ProjectEvent | ApplicationEvent | PipelineEvent;

/**
 * The level of detail to include in the notifications for this resource.
 */
export enum DetailType {
  /**
   * BASIC will include only the contents of the event as it would appear in AWS CloudWatch
   */
  BASIC = 'BASIC',

  /**
   * FULL will include any supplemental information provided by AWS CodeStar Notifications and/or the service for the resource for which the notification is created.
   */
  FULL = 'FULL',
}

/**
 * The status of the notification rule.
 */
export enum Status {

  /**
   * If the status is set to DISABLED, notifications aren't sent.
   */
  DISABLED = 'DISABLED',

  /**
   * If the status is set to ENABLED, notifications are sent.
   */
  ENABLED = 'ENABLED',
}

/**
 * The target type of the notification rule.
 */
export enum TargetType {

  /**
   * Amazon SNS topics are specified as SNS.
   */
  SNS = 'SNS',

  /**
   * AWS Chatbot clients are specified as AWSChatbotSlack.
   */
  AWS_CHATBOT_SLACK = 'AWSChatbotSlack',
}

/**
 * Information about the SNS topics or AWS Chatbot clients associated with a notification rule.
 */
export interface NotificationTargetConfig {

  /**
   * The target type. Can be an Amazon SNS topic or AWS Chatbot client.
   */
  readonly targetType: TargetType;

  /**
   * The Amazon Resource Name (ARN) of the Amazon SNS topic or AWS Chatbot client.
   */
  readonly targetAddress: string;
}

/**
 * Represents a notification target
 */
export interface INotificationTarget {

  /**
   * Binds target to notification rule
   * @param _notificationRule The notification rule
   */
  bind(_notificationRule: INotificationRule): NotificationTargetConfig;
}

/**
 * A Slack notification target
 */
export class SlackNotificationTarget implements INotificationTarget {

  /**
   * @param slackChannel The Slack channel configuration
   */
  constructor(readonly slackChannel: chatbot.ISlackChannelConfiguration) {}

  public bind(
    _notificationRule: INotificationRule,
  ): NotificationTargetConfig {
    return {
      targetType: TargetType.AWS_CHATBOT_SLACK,
      targetAddress: this.slackChannel.slackChannelConfigurationArn,
    };
  }
}

/**
 * A SNS topic notification target
 */
export class SNSTopicNotificationTarget implements INotificationTarget {

  /**
   * @param topic The SNS topic
   */
  constructor(readonly topic: sns.ITopic) {}

  public bind(
    _notificationRule: INotificationRule,
  ): NotificationTargetConfig {
    this.topic.grantPublish(new iam.ServicePrincipal('codestar-notifications.amazonaws.com'));

    return {
      targetType: TargetType.SNS,
      targetAddress: this.topic.topicArn,
    };
  }
}

/**
 * The options for AWS Codebuild、AWS Codepipeline and AWS Codecommit notification integration
 */
export type AddNotificationRuleOptions = Omit<NotificationRuleProps, 'resource'>;

/**
 * Properties for a new notification rule
 */
export interface NotificationRuleProps {

  /**
   * The name for the notification rule.
   * Notification rule names must be unique in your AWS account.
   */
  readonly notificationRuleName: string;

  /**
   * The status of the notification rule.
   * If the status is set to DISABLED, notifications aren't sent for the notification rule.
   *
   * @default Status.ENABLED
   */
  readonly status?: Status;

  /**
   * The level of detail to include in the notifications for this resource.
   * BASIC will include only the contents of the event as it would appear in AWS CloudWatch.
   * FULL will include any supplemental information provided by AWS CodeStar Notifications and/or the service for the resource for which the notification is created.
   *
   * @default DetailType.FULL
   */
  readonly detailType?: DetailType;

  /**
   * A list of Amazon Resource Names (ARNs) of Amazon SNS topics and AWS Chatbot clients to associate with the notification rule.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codestarnotifications-notificationrule-target.html
   */
  readonly targets: INotificationTarget[];

  /**
   * A list of event types associated with this notification rule.
   * For a complete list of event types and IDs, see Notification concepts in the Developer Tools Console User Guide.
   *
   * @see https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#concepts-api
   */
  readonly events: Events[];

  /**
   * The Amazon Resource Name (ARN) of the resource to associate with the notification rule.
   * Supported resources include pipelines in AWS CodePipeline, repositories in AWS CodeCommit, and build projects in AWS CodeBuild.
   */
  readonly resource: string;
}

/**
 * Represents a notification rule
 */
export interface INotificationRule extends cdk.IResource {

  /**
   * The ARN of the notification rule (i.e. arn:aws:codestar-notifications:::notificationrule/01234abcde)
   * @attribute
   */
  readonly notificationRuleArn: string;
}

/**
 * Either a new or imported notification rule
 */
abstract class NotificationRuleBase extends cdk.Resource implements INotificationRule {
  abstract readonly notificationRuleArn: string;
}

/**
 * A new notification rule
 */
export class NotificationRule extends NotificationRuleBase {
  /**
   * Import an existing notification rule provided an ARN
   * @param scope The parent creating construct
   * @param id The construct's name
   * @param notificationRuleArn Notification rule ARN (i.e. arn:aws:codestar-notifications:::notificationrule/01234abcde)
   */
  public static fromNotificationRuleArn(scope: cdk.Construct, id: string, notificationRuleArn: string): INotificationRule {
    class Import extends NotificationRuleBase {
      readonly notificationRuleArn = notificationRuleArn;
    }

    return new Import(scope, id);
  }

  /**
   * @attribute
   */
  readonly notificationRuleArn: string;

  /**
   * The target config of notification rule
   */
  readonly targets: NotificationTargetConfig[] = [];

  constructor(scope: cdk.Construct, id: string, props: NotificationRuleProps) {
    super(scope, id, {
      physicalName: props.notificationRuleName,
    });

    props.targets.forEach((target) => {
      this.addTarget(target);
    });

    this.notificationRuleArn = new CfnNotificationRule(this, 'Resource', {
      name: props.notificationRuleName,
      status: props.status || Status.ENABLED,
      detailType: props.detailType || DetailType.FULL,
      targets: this.targets,
      eventTypeIds: props.events,
      resource: props.resource,
    }).ref;
  }

  /**
   * Adds target to notification rule
   * @param target The SNS topic or AWS Chatbot Slack target
   */
  public addTarget(target: INotificationTarget) {
    this.targets.push(target.bind(this));
  }
}