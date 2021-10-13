import { ArnFormat, Lazy, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IAction } from './action';
import { CfnTopicRule } from './iot.generated';
import { ITopicRule } from './topic-rule-ref';

/**
 * The version of the SQL rules engine to use when evaluating the rule.
 *
 * @see https://docs.aws.amazon.com/iot/latest/developerguide/iot-rule-sql-version.html
 */
export enum AwsIotSqlVersion {
  /**
   * 2015-10-08 – The original SQL version built on 2015-10-08.
   */
  VER_2015_10_08 = '2015-10-08',
  /**
   * 2016-03-23 – The SQL version built on 2016-03-23.
   */
  SQL_2016_03_23 = '2016-03-23',
  /**
   * beta – The most recent beta SQL version. If you use this version, it might introduce breaking changes to your rules.
   */
  SQL_BETA = 'beta',
}

/**
 * Properties for defining an AWS IoT Rule
 */
export interface TopicRuleProps {
  /**
   * The name of the rule.
   * @default None
   */
  readonly topicRuleName?: string;
  /**
   * The rule payload.
   */
  readonly topicRulePayload: TopicRulePayloadProperty;
}

/**
 * Properties for defining details of an AWS IoT Rule
 */
export interface TopicRulePayloadProperty {
  /**
   * The actions associated with the rule.
   *
   * @default No actions will be perform
   */
  readonly actions?: Array<IAction>;
  /**
   * The version of the SQL rules engine to use when evaluating the rule.
   *
   * @default AwsIotSqlVersion.SQL_2015_10_08
   * @see https://docs.aws.amazon.com/iot/latest/developerguide/iot-create-rule.html
   */
  readonly awsIotSqlVersion?: AwsIotSqlVersion;
  /**
   * A textual description of the rule.
   *
   * @default None
   */
  readonly description?: string;
  /**
   * The action AWS IoT performs when it is unable to perform a rule's action.
   *
   * @default No action will be perform
   */
  readonly errorAction?: IAction;
  /**
   * Specifies whether the rule is disabled.
   *
   * @default false
   */
  readonly ruleDisabled?: boolean;
  /**
   * A simplified SQL syntax to filter messages received on an MQTT topic and push the data elsewhere.
   *
   * @see https://docs.aws.amazon.com/iot/latest/developerguide/iot-sql-reference.html
   */
  readonly sql: string;
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
      throw new Error('Invalid topic rule arn: topicRuleArn has no resource name.');
    }
    const resourceName = parts.resourceName;

    class Import extends Resource implements ITopicRule {
      public readonly topicRuleArn = topicRuleArn;
      public readonly topicRuleName = resourceName;
    }
    return new Import(scope, id);
  }

  /**
   * Arn of this rule
   * @attribute
   */
  public readonly topicRuleArn: string;
  /**
   * Name of this rule
   * @attribute
   */
  public readonly topicRuleName: string;

  private readonly actions = new Array<CfnTopicRule.ActionProperty>();

  constructor(scope: Construct, id: string, props: TopicRuleProps) {
    super(scope, id, {
      physicalName: props.topicRuleName,
    });

    if (props.topicRulePayload.sql === '') {
      throw new Error('\'topicRulePayload.sql\' cannot be empty.');
    }

    const resource = new CfnTopicRule(this, 'Resource', {
      ruleName: this.physicalName,
      topicRulePayload: {
        actions: Lazy.any({ produce: () => this.actions }),
        awsIotSqlVersion: props.topicRulePayload.awsIotSqlVersion ?? AwsIotSqlVersion.SQL_2015_10_08,
        description: props.topicRulePayload.description,
        errorAction: props.topicRulePayload.errorAction?.bind(this),
        ruleDisabled: props.topicRulePayload.ruleDisabled ?? false,
        sql: props.topicRulePayload.sql,
      },
    });

    this.topicRuleArn = this.getResourceArnAttribute(resource.attrArn, {
      service: 'iot',
      resource: 'rule',
      resourceName: this.physicalName,
    });
    this.topicRuleName = this.getResourceNameAttribute(resource.ref);

    props.topicRulePayload.actions?.forEach(action => {
      this.addAction(action);
    });
  }

  /**
   * Add a action to the rule.
   *
   * @param action the action to associate with the rule.
   */
  public addAction(action: IAction): void {
    const actionConfig = action.bind(this);

    const keys = Object.keys(actionConfig);
    if (keys.length === 0) {
      throw new Error('Empty actions are not allowed. Please define one type of action');
    }
    if (keys.length >= 2) {
      throw new Error(`Each object in the actions list can only have one action defined. keys: ${keys}`);
    }

    this.actions.push(actionConfig);
  }
}
