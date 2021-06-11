import { IResource, Resource, Names } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnNotificationRule } from './codestarnotifications.generated';
import { NotificationRuleSourceConfig, INotificationRuleSource } from './notification-rule-source';
import { INotificationRuleTarget, NotificationRuleTargetConfig } from './notification-rule-target';

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
 * Standard set of options for `notifyOnXxx` codestar notification handler on construct
 */
export interface NotificationRuleOptions {
  /**
   * The name for the notification rule.
   * Notification rule names must be unique in your AWS account.
   *
   * @default - generated from the `id`
   */
  readonly notificationRuleName?: string;

  /**
   * The target to register for the notification destination.
   *
   * @default - No target is added to the rule. Use `addTarget()` to add a target.
   */
  readonly target?: INotificationRuleTarget;

  /**
   * The status of the notification rule.
   * If the enabled is set to DISABLED, notifications aren't sent for the notification rule.
   *
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * The level of detail to include in the notifications for this resource.
   * BASIC will include only the contents of the event as it would appear in AWS CloudWatch.
   * FULL will include any supplemental information provided by AWS CodeStar Notifications and/or the service for the resource for which the notification is created.
   *
   * @default DetailType.FULL
   */
  readonly detailType?: DetailType;
}

/**
 * Standard set of options for `notifyOn` codestar notification handler on construct
 */
export interface NotifyOnEventOptions extends NotificationRuleOptions {
  /**
   * A list of event types associated with this notification rule.
   * For a complete list of event types and IDs, see Notification concepts in the Developer Tools Console User Guide.
   * @see https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#concepts-api
   *
   * You must specify this property (either via props or via `addEvents`)
   *
   * @default - No events.
   */
  readonly events?: string[];
}

/**
 * Properties for a new notification rule
 */
export interface NotificationRuleProps extends NotifyOnEventOptions {
  /**
   * The Amazon Resource Name (ARN) of the resource to associate with the notification rule.
   * Currently, Supported sources include pipelines in AWS CodePipeline and build projects in AWS CodeBuild in this L2 constructor.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-resource
   */
  readonly source: INotificationRuleSource;
}

/**
 * Represents a notification rule
 */
export interface INotificationRule extends IResource {

  /**
   * The ARN of the notification rule (i.e. arn:aws:codestar-notifications:::notificationrule/01234abcde)
   *
   * @attribute
   */
  readonly notificationRuleArn: string;

  /**
   * Adds target to notification rule
   *
   * @param target The SNS topic or AWS Chatbot Slack target
   * @returns boolean - return true if it had any effect
   */
  addTarget(target: INotificationRuleTarget): boolean;
}

/**
 * A new notification rule
 *
 * @resource AWS::CodeStarNotifications::NotificationRule
 */
export class NotificationRule extends Resource implements INotificationRule {
  /**
   * Import an existing notification rule provided an ARN
   * @param scope The parent creating construct
   * @param id The construct's name
   * @param notificationRuleArn Notification rule ARN (i.e. arn:aws:codestar-notifications:::notificationrule/01234abcde)
   */
  public static fromNotificationRuleArn(scope: Construct, id: string, notificationRuleArn: string): INotificationRule {
    class Import extends Resource implements INotificationRule {
      readonly notificationRuleArn = notificationRuleArn;

      public addTarget(_target?: INotificationRuleTarget): boolean {
        return false;
      }
    }

    return new Import(scope, id);
  }

  /**
   * @attribute
   */
  readonly notificationRuleArn: string;

  /**
   * The source config of notification rule
   */
  readonly source: NotificationRuleSourceConfig;

  /**
   * The target config of notification rule
   */
  private targets: NotificationRuleTargetConfig[] = [];

  /**
   * The events of notification rule
   */
  private events: string[] = [];

  constructor(scope: Construct, id: string, props: NotificationRuleProps) {
    super(scope, id);

    this.source = props.source.bind(this);

    if (props.events) {
      this.addEvents(props.events);
    }

    if (props.target) {
      this.addTarget(props.target);
    }

    const resource = new CfnNotificationRule(this, 'Resource', {
      name: props.notificationRuleName || this.generateName(),
      detailType: props.detailType || DetailType.FULL,
      targets: this.targets,
      eventTypeIds: this.events,
      resource: this.source.sourceArn,
      status: props.enabled !== undefined
        ? !props.enabled ? 'DISABLED' : 'ENABLED'
        : undefined,
    });

    this.notificationRuleArn = resource.ref;
  }

  /**
   * Adds target to notification rule
   * @param target The SNS topic or AWS Chatbot Slack target
   */
  public addTarget(target: INotificationRuleTarget): boolean {
    this.targets.push(target.bind(this));
    return true;
  }

  /**
   * Adds events to notification rule
   *
   * @see https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#events-ref-pipeline
   * @see https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#events-ref-buildproject
   * @param events The list of event types for AWS Codebuild and AWS CodePipeline
   */
  private addEvents(events: string[]): void {
    events.forEach((event) => {
      if (this.events.includes(event)) {
        return;
      }

      this.events.push(event);
    });
  }

  /**
   * The name length generated by id must short than 64 characters
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-name
   * @returns string
   */
  private generateName(): string {
    const name = Names.uniqueId(this);
    return name.slice(-64);
  }
}