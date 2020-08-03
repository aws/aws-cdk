import * as chatbot from '@aws-cdk/aws-chatbot';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import { CfnNotificationRule } from './codestarnotifications.generated';

export enum RepositoryEvent {
  COMMENTS_ON_COMMITS = 'codecommit-repository-comments-on-commits',
  COMMENTS_ON_PULL_REQUEST = 'codecommit-repository-comments-on-pull-requests',
  APPROVAL_STATUS_CHANGED = 'codecommit-repository-approvals-status-changed',
  APPROVAL_RULE_OVERRIDE = 'codecommit-repository-approvals-rule-override',
  PULL_REQUEST_CREATED = 'codecommit-repository-pull-request-created',
  PULL_REQUEST_SOURCE_UPDATED = 'codecommit-repository-pull-request-source-updated',
  PULL_REQUEST_STATUS_CHANGED = 'codecommit-repository-pull-request-status-changed',
  PULL_REQUEST_MERGED = 'codecommit-repository-pull-request-merged',
  BRANCHES_AND_TAGS_CREATED = 'codecommit-repository-branches-and-tags-created',
  BRANCHES_AND_TAGS_DELETED = 'codecommit-repository-branches-and-tags-deleted',
  BRANCHES_AND_TAGS_UPDATED = 'codecommit-repository-branches-and-tags-updated',
}

export enum ProjectEvent {
  BUILD_STATE_FAILED = 'codebuild-project-build-state-failed',
  BUILD_STATE_SUCCEEDED = 'codebuild-project-build-state-succeeded',
  BUILD_STATE_IN_PROGRESS = 'codebuild-project-build-state-in-progress',
  BUILD_STATE_STOPPED = 'codebuild-project-build-state-stopped',
  BUILD_PHASE_FAILRE = 'codebuild-project-build-phase-failure',
  BUILD_PHASE_SUCCESS = 'codebuild-project-build-phase-success',
}

export enum ApplicationEvent {
  DEPLOYMENT_FAILED = 'codedeploy-application-deployment-failed',
  DEPLOYMENT_SUCCEEDED = 'codedeploy-application-deployment-succeeded',
  DEPLOYMENT_STARTED = 'codedeploy-application-deployment-started',
}

export enum PipelineEvent {
  ACTION_EXECUTION_SUCCEEDED = 'codepipeline-pipeline-action-execution-succeeded',
  ACTION_EXECUTION_FAILED = 'codepipeline-pipeline-action-execution-failed',
  ACTION_EXECUTION_CANCELED = 'codepipeline-pipeline-action-execution-canceled',
  ACTION_EXECUTION_STARTED = 'codepipeline-pipeline-action-execution-started',
  STAGE_EXECUTION_STARTED = 'codepipeline-pipeline-stage-execution-started',
  STAGE_EXECUTION_SUCCEEDED = 'codepipeline-pipeline-stage-execution-succeeded',
  STAGE_EXECUTION_RESUMED = 'codepipeline-pipeline-stage-execution-resumed',
  STAGE_EXECUTION_CANCELED = 'codepipeline-pipeline-stage-execution-canceled',
  STAGE_EXECUTION_FAILED = 'codepipeline-pipeline-stage-execution-failed',
  PIPELINE_EXECUTION_FAILED = 'codepipeline-pipeline-pipeline-execution-failed',
  PIPELINE_EXECUTION_CANCELED = 'codepipeline-pipeline-pipeline-execution-canceled',
  PIPELINE_EXECUTION_STARTED = 'codepipeline-pipeline-pipeline-execution-started',
  PIPELINE_EXECUTION_RESUMED = 'codepipeline-pipeline-pipeline-execution-resumed',
  PIPELINE_EXECUTION_SUCCEEDED = 'codepipeline-pipeline-pipeline-execution-succeeded',
  PIPELINE_EXECUTION_SUPERSEDED = 'codepipeline-pipeline-pipeline-execution-superseded',
  MANUAL_APPROVAL_FAILED = 'codepipeline-pipeline-manual-approval-failed',
  MANUAL_APPROVAL_NEEDED = 'codepipeline-pipeline-manual-approval-needed',
  MANUAL_APPROVAL_SUCCEEDED = 'codepipeline-pipeline-manual-approval-succeeded',
}

export type Events = RepositoryEvent | ProjectEvent | ApplicationEvent | PipelineEvent;

export enum DetailType {
  FULL = 'FULL',
  BASIC = 'BASIC',
}

export enum Status {
  DISABLED = 'DISABLED',
  ENABLED = 'ENABLED',
}

export enum TargetType {
  SNS = 'SNS',
  AWS_CHATBOT_SLACK = 'AWSChatbotSlack',
}

export interface NotificationTargetProps {
  readonly targetType: TargetType;
  readonly targetAddress: string;
}

export interface INotificationRule extends cdk.IResource {
  readonly notificationRuleArn: string;
}

export abstract class NotificationRuleBase extends cdk.Resource implements INotificationRule {
  abstract readonly notificationRuleArn: string;
}

export interface NotificationRuleProps {
  readonly name: string;
  readonly status?: Status;
  readonly detailType?: DetailType;
  readonly targets: INotificationTarget[];
  readonly eventTypeIds: Events[];
  readonly resourceArn: string;
}

export interface INotificationTarget {
  bind(scope: cdk.Construct, notificationRule: INotificationRule): NotificationTargetProps;
}

export class SlackNotificationTarget implements INotificationTarget {
  constructor(readonly slackChannel: chatbot.ISlackChannelConfiguration) {}

  public bind(
    _scope: cdk.Construct,
    _notificationRule: INotificationRule,
  ): NotificationTargetProps {
    return {
      targetType: TargetType.AWS_CHATBOT_SLACK,
      targetAddress: this.slackChannel.configurationArn,
    };
  }
}

export class SNSTopicNotificationTarget implements INotificationTarget {
  constructor(readonly topic: sns.ITopic) {}

  public bind(
    _scope: cdk.Construct,
    _notificationRule: INotificationRule,
  ): NotificationTargetProps {
    this.topic.grantPublish(new iam.ServicePrincipal('codestar-notifications.amazonaws.com'));

    return {
      targetType: TargetType.SNS,
      targetAddress: this.topic.topicArn,
    };
  }
}

export class NotificationRule extends NotificationRuleBase {
  public static fromNotificationRuleArn(scope: cdk.Construct, id: string, notificationRuleArn: string): INotificationRule {
    class Import extends NotificationRuleBase {
      readonly notificationRuleArn = notificationRuleArn;
    }

    return new Import(scope, id);
  }

  readonly notificationRuleArn: string;
  readonly targets: NotificationTargetProps[] = [];

  constructor(scope: cdk.Construct, id: string, props: NotificationRuleProps) {
    super(scope, id);

    props.targets.forEach((target) => {
      this.addTarget(target);
    });

    this.notificationRuleArn = new CfnNotificationRule(this, 'Resource', {
      name: props.name,
      status: props.status || Status.ENABLED,
      detailType: props.detailType || DetailType.FULL,
      targets: this.targets,
      eventTypeIds: props.eventTypeIds,
      resource: props.resourceArn,
    }).ref;
  }

  public addTarget(target: INotificationTarget) {
    this.targets.push(target.bind(this, this));
  }
}