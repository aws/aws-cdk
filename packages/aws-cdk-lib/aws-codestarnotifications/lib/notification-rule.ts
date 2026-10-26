import type * as constructs from 'constructs';
import { CfnNotificationRule } from './codestarnotifications.generated';
import type { INotificationRuleSource } from './notification-rule-source';
import type { INotificationRuleTarget, NotificationRuleTargetConfig } from './notification-rule-target';
import type { IResource } from '../../core';
import { Resource, Names, Token, ValidationError } from '../../core';
import { addConstructMetadata, MethodMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { INotificationRuleRef, NotificationRuleReference } from '../../interfaces/generated/aws-codestarnotifications-interfaces.generated';

const NOTIFICATION_RULE_SYMBOL = Symbol.for('@aws-cdk/aws-codestarnotifications.NotificationRule');

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

  /**
   * The name or email alias of the person who created the notification rule.
   * If not specified, it means that the creator's alias is not provided.
   *
   * @default - No alias provided
   */
  readonly createdBy?: string;
}

/**
 * Properties for a new notification rule
 */
export interface NotificationRuleProps extends NotificationRuleOptions {
  /**
   * A list of event types associated with this notification rule.
   * For a complete list of event types and IDs, see Notification concepts in the Developer Tools Console User Guide.
   * @see https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#concepts-api
   */
  readonly events: string[];

  /**
   * The Amazon Resource Name (ARN) of the resource to associate with the notification rule.
   * Currently, Supported sources include pipelines in AWS CodePipeline, build projects in AWS CodeBuild, and repositories in AWS CodeCommit in this L2 constructor.
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-codestarnotifications-notificationrule.html#cfn-codestarnotifications-notificationrule-resource
   */
  readonly source: INotificationRuleSource;

  /**
   * The targets to register for the notification destination.
   *
   * @default - No targets are added to the rule. Use `addTarget()` to add a target.
   */
  readonly targets?: INotificationRuleTarget[];
}

/**
 * Represents a notification rule
 */
export interface INotificationRule extends IResource, INotificationRuleRef {

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
@propertyInjectable
export class NotificationRule extends Resource implements INotificationRule {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-codestarnotifications.NotificationRule';

  /**
   * Return whether the given object is a NotificationRule
   */
  public static isNotificationRule(x: any): x is NotificationRule {
    return x !== null && typeof x === 'object' && NOTIFICATION_RULE_SYMBOL in x;
  }

  /**
   * Import an existing notification rule provided an ARN
   * @param scope The parent creating construct
   * @param id The construct's name
   * @param notificationRuleArn Notification rule ARN (i.e. arn:aws:codestar-notifications:::notificationrule/01234abcde)
   */
  public static fromNotificationRuleArn(scope: constructs.Construct, id: string, notificationRuleArn: string): INotificationRule {
    class Import extends Resource implements INotificationRule {
      readonly notificationRuleArn = notificationRuleArn;

      public get notificationRuleRef(): NotificationRuleReference {
        return {
          notificationRuleArn: this.notificationRuleArn,
        };
      }

      public addTarget(_target: INotificationRuleTarget): boolean {
        return false;
      }
    }

    return new Import(scope, id, {
      environmentFromArn: notificationRuleArn,
    });
  }

  /**
   * @attribute
   */
  public readonly notificationRuleArn: string;

  public get notificationRuleRef(): NotificationRuleReference {
    return {
      notificationRuleArn: this.notificationRuleArn,
    };
  }

  private readonly targets: NotificationRuleTargetConfig[] = [];

  private readonly events: string[] = [];

  private readonly boundTargets = new Set<INotificationRuleTarget>();

  private readonly options: NotificationRuleOptions;

  private readonly sourceArn: string;

  constructor(scope: constructs.Construct, id: string, props: NotificationRuleProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    const source = props.source.bindAsNotificationRuleSource(this);
    this.sourceArn = source.sourceArn;
    this.options = effectiveOptions(props);

    this.addEvents(props.events);

    const resource = new CfnNotificationRule(this, 'Resource', {
      // It has a 64 characters limit for the name
      name: props.notificationRuleName || Names.uniqueId(this).slice(-64),
      detailType: props.detailType || DetailType.FULL,
      targets: this.targets,
      eventTypeIds: this.events,
      resource: source.sourceArn,
      status: props.enabled !== undefined
        ? (props.enabled ? 'ENABLED' : 'DISABLED')
        : undefined,
      createdBy: props.createdBy,
    });

    this.notificationRuleArn = resource.ref;

    props.targets?.forEach((target) => {
      this.addTarget(target);
    });
  }

  /**
   * Adds target to notification rule
   * @param target The SNS topic or AWS Chatbot Slack target
   */
  @MethodMetadata()
  public addTarget(target: INotificationRuleTarget): boolean {
    this.targets.push(target.bindAsNotificationRuleTarget(this));
    this.boundTargets.add(target);
    return true;
  }

  /**
   * Adds events to notification rule
   *
   * Events that are already on the rule are ignored.
   *
   * @see https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#events-ref-pipeline
   * @see https://docs.aws.amazon.com/dtconsole/latest/userguide/concepts.html#events-ref-buildproject
   * @param events The list of event types for AWS Codebuild and AWS CodePipeline
   */
  @MethodMetadata()
  public addEvents(events: string[]): void {
    events.forEach((event) => {
      if (this.events.includes(event)) {
        return;
      }

      this.events.push(event);
    });
  }

  /**
   * Add the events and targets of another `notifyOn` call to this rule.
   *
   * Targets that are already on the rule are not added again.
   *
   * @internal
   */
  public _merge(props: NotificationRuleProps): void {
    const sourceArn = props.source.bindAsNotificationRuleSource(this).sourceArn;
    if (sourceArn !== this.sourceArn) {
      throw new ValidationError(lit`NotificationRuleSourceMismatch`, `notification rule ${JSON.stringify(this.node.path)} already exists for a different source, use a different id`, this);
    }

    const options = effectiveOptions(props);
    for (const key of ['notificationRuleName', 'enabled', 'detailType', 'createdBy'] as const) {
      const value = options[key];
      if (value === this.options[key]) {
        continue;
      }
      if (Token.isUnresolved(value) || Token.isUnresolved(this.options[key])) {
        continue;
      }
      throw new ValidationError(lit`NotificationRuleOptionsMismatch`, `notification rule ${JSON.stringify(this.node.path)} already exists with ${key} ${JSON.stringify(this.options[key])}, got ${JSON.stringify(value)}; use the same options or a different id`, this);
    }

    this.addEvents(props.events);
    props.targets?.forEach((target) => {
      if (!this.boundTargets.has(target)) {
        this.addTarget(target);
      }
    });
  }
}

function effectiveOptions(options: NotificationRuleOptions): NotificationRuleOptions {
  return {
    notificationRuleName: options.notificationRuleName,
    enabled: options.enabled ?? true,
    detailType: options.detailType ?? DetailType.FULL,
    createdBy: options.createdBy,
  };
}

Object.defineProperty(NotificationRule.prototype, NOTIFICATION_RULE_SYMBOL, {
  value: true,
  enumerable: false,
  writable: false,
});
