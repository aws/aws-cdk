import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnNotificationRule } from './codestarnotifications.generated';
import * as events from './event';
import { SourceConfig, SourceType, IRuleSource } from './source';
import { IRuleTarget, TargetConfig, TargetType } from './target';

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
 * The options for AWS Codebuild and AWS Codepipeline notification integration
 */
export interface RuleProps {

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
   * The Amazon Resource Name (ARN) of the resource to associate with the notification rule.
   * Supported sources include pipeline in AWS CodePipeline and project in AWS CodeBuild.
   */
  readonly source: IRuleSource;

  /**
   * A list of Amazon Resource Names (ARNs) of Amazon SNS topics and AWS Chatbot clients to associate with the notification rule.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-codestarnotifications-notificationrule-target.html
   */
  readonly targets: IRuleTarget[];

  /**
   * A list of event types associated with this notification rule.
   * For a complete list of event types and IDs, see Notification concepts in the Developer Tools Console User Guide.
   *
   * @see https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#concepts-api
   */
  readonly events: events.Event[];
}

/**
 * Represents a notification rule
 */
export interface IRule extends cdk.IResource {

  /**
   * The ARN of the notification rule (i.e. arn:aws:codestar-notifications:::notificationrule/01234abcde)
   * @attribute
   */
  readonly ruleArn: string;
}

/**
 * Either a new or imported notification rule
 */
abstract class RuleBase extends cdk.Resource implements IRule {
  abstract readonly ruleArn: string;
}

/**
 * A new notification rule
 *
 * @resource AWS::CodeStarNotifications::NotificationRule
 */
export class Rule extends RuleBase {
  /**
   * Import an existing notification rule provided an ARN
   * @param scope The parent creating construct
   * @param id The construct's name
   * @param notificationRuleArn Notification rule ARN (i.e. arn:aws:codestar-notifications:::notificationrule/01234abcde)
   */
  public static fromNotificationRuleArn(scope: Construct, id: string, notificationRuleArn: string): IRule {
    class Import extends RuleBase {
      readonly ruleArn = notificationRuleArn;
    }

    return new Import(scope, id);
  }

  /**
   * @attribute
   */
  readonly ruleArn: string;

  /**
   * The source config of notification rule
   */
  readonly source: SourceConfig;

  /**
   * The target config of notification rule
   */
  readonly targets: TargetConfig[] = [];

  constructor(scope: Construct, id: string, props: RuleProps) {
    super(scope, id, {
      physicalName: props.notificationRuleName,
    });

    this.source = this.bindSource(props.source);

    this.validateSourceEvent(props);

    props.targets.forEach((target) => {
      this.addTarget(target);
    });

    this.ruleArn = new CfnNotificationRule(this, 'Resource', {
      name: props.notificationRuleName,
      status: props?.status,
      detailType: props.detailType || DetailType.FULL,
      targets: this.targets,
      eventTypeIds: props.events,
      resource: this.source.sourceAddress,
    }).ref;
  }

  /**
   * Adds target to notification rule
   * @param target The SNS topic or AWS Chatbot Slack target
   */
  public addTarget(target: IRuleTarget) {
    this.targets.push(this.bindTarget(target));
  }

  private validateSourceEvent(props: RuleProps): void {
    if (props.events.length === 0) {
      throw new Error('"events" property must set at least 1 event');
    }

    const validationMapping = {
      [SourceType.CODE_BUILD]: Object.values(events.Event).filter((e) => /^codebuild\-/.test(e)),
      [SourceType.CODE_PIPELINE]: Object.values(events.Event).filter((e) => /^codepipeline\-/.test(e)),
    };

    const validEvents: string[] = validationMapping[this.source.sourceType];

    Object.values(props.events).forEach(event => {
      if (!validEvents.includes(event)) {
        throw new Error(`${event} event id is not valid in ${this.source.sourceType}`);
      }
    });
  }

  private bindTarget(target: IRuleTarget): TargetConfig {
    if (target.topicArn) {
      return {
        targetType: TargetType.SNS,
        targetAddress: target.topicArn,
      }
    }

    if (target.slackChannelConfigurationArn) {
      return {
        targetType: TargetType.AWS_CHATBOT_SLACK,
        targetAddress: target.slackChannelConfigurationArn,
      }
    }

    throw new Error('"target" property must have "topicArn" or "slackChannelConfigurationArn"');
  }

  private bindSource(source: IRuleSource): SourceConfig {
    if (source.projectArn) {
      return {
        sourceType: SourceType.CODE_BUILD,
        sourceAddress: source.projectArn,
      };
    }

    if (source.pipelineArn) {
      return {
        sourceType: SourceType.CODE_PIPELINE,
        sourceAddress: source.pipelineArn,
      };
    }

    throw new Error('"source" property must have "projectArn" or "pipelineArn"');
  }
}