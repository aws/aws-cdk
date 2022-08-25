import { ArnFormat, Resource, Stack, IResource, Lazy } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IAction } from './action';
import { IotSql } from './iot-sql';
import { CfnTopicRule } from './iot.generated';

/**
 * Represents an AWS IoT Rule
 */
export interface ITopicRule extends IResource {
  /**
   * The value of the topic rule Amazon Resource Name (ARN), such as
   * arn:aws:iot:us-east-2:123456789012:rule/rule_name
   *
   * @attribute
   */
  readonly topicRuleArn: string;

  /**
   * The name topic rule
   *
   * @attribute
   */
  readonly topicRuleName: string;
}

/**
 * Properties for defining an AWS IoT Rule
 */
export interface TopicRuleProps {
  /**
   * The name of the topic rule.
   * @default None
   */
  readonly topicRuleName?: string;

  /**
   * The actions associated with the topic rule.
   *
   * @default No actions will be perform
   */
  readonly actions?: IAction[];

  /**
   * A textual description of the topic rule.
   *
   * @default None
   */
  readonly description?: string;

  /**
   * The action AWS IoT performs when it is unable to perform a rule's action.
   *
   * @default - no action will be performed
   */
  readonly errorAction?: IAction;

  /**
   * Specifies whether the rule is enabled.
   *
   * @default true
   */
  readonly enabled?: boolean

  /**
   * A simplified SQL syntax to filter messages received on an MQTT topic and push the data elsewhere.
   *
   * @see https://docs.aws.amazon.com/iot/latest/developerguide/iot-sql-reference.html
   */
  readonly sql: IotSql;
}

/**
 * Defines an AWS IoT Rule in this stack.
 */
export class TopicRule extends Resource implements ITopicRule {
  /**
   * Import an existing AWS IoT Rule provided an ARN
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param topicRuleArn AWS IoT Rule ARN (i.e. arn:aws:iot:<region>:<account-id>:rule/MyRule).
   */
  public static fromTopicRuleArn(scope: Construct, id: string, topicRuleArn: string): ITopicRule {
    const parts = Stack.of(scope).splitArn(topicRuleArn, ArnFormat.SLASH_RESOURCE_NAME);
    if (!parts.resourceName) {
      throw new Error(`Missing topic rule name in ARN: '${topicRuleArn}'`);
    }
    const resourceName = parts.resourceName;

    class Import extends Resource implements ITopicRule {
      public readonly topicRuleArn = topicRuleArn;
      public readonly topicRuleName = resourceName;
    }
    return new Import(scope, id, {
      environmentFromArn: topicRuleArn,
    });
  }

  /**
   * Arn of this topic rule
   * @attribute
   */
  public readonly topicRuleArn: string;

  /**
   * Name of this topic rule
   * @attribute
   */
  public readonly topicRuleName: string;

  private readonly actions: CfnTopicRule.ActionProperty[] = [];

  constructor(scope: Construct, id: string, props: TopicRuleProps) {
    super(scope, id, {
      physicalName: props.topicRuleName,
    });

    const sqlConfig = props.sql.bind(this);

    const resource = new CfnTopicRule(this, 'Resource', {
      ruleName: this.physicalName,
      topicRulePayload: {
        actions: Lazy.any({ produce: () => this.actions }),
        awsIotSqlVersion: sqlConfig.awsIotSqlVersion,
        description: props.description,
        errorAction: props.errorAction?._bind(this).configuration,
        ruleDisabled: props.enabled === undefined ? undefined : !props.enabled,
        sql: sqlConfig.sql,
      },
    });

    this.topicRuleArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'iot',
      resource: 'rule',
      resourceName: this.physicalName,
    });
    this.topicRuleName = this.getResourceNameAttribute(resource.ref);

    props.actions?.forEach(action => {
      this.addAction(action);
    });
  }

  /**
   * Add a action to the topic rule.
   *
   * @param action the action to associate with the topic rule.
   */
  public addAction(action: IAction): void {
    const { configuration } = action._bind(this);

    const keys = Object.keys(configuration);
    if (keys.length === 0) {
      throw new Error('An action property cannot be an empty object.');
    }
    if (keys.length > 1) {
      throw new Error(`An action property cannot have multiple keys, received: ${keys}`);
    }

    this.actions.push(configuration);
  }
}
