import { Resource, IResource, Lazy } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnTopicRule } from './iot.generated';
import { ITopicRuleAction } from './topic-rule-action';
import { parseRuleName } from './util';

/**
 * An IoT Topic Rule
 */
export interface ITopicRule extends IResource {
  /**
   * Then name of the topic rule
   */
  readonly ruleName: string;
  /**
   * Then name of the topic rule
   *
   * @attribute
   *
   */
  readonly topicRuleArn: string;
}
/**
 * A reference to an IoT Topic Rule.
 */
export interface TopicRuleAttributes {
  /**
   * The ARN of the IoT Topic Rule. At least one of bucketArn or bucketName must be
   * defined in order to initialize a bucket ref.
   */
  readonly topicRuleArn: string;
}
/**
 * Properties for defining an IoT Topic Rule.
 */
export interface TopicRuleProps {
  /**
   * The name of the rule.
   *
   * @default - generated
   */
  readonly ruleName?: string
  /**
   * The rule actions.
   *
   * @default - empty
   */
  readonly actions?: ITopicRuleAction[];
  /**
   * The rule enabled status.
   *
   * @default - false
   */
  readonly ruleDisabled?: boolean;
  /**
   * The rule sql.
   */
  readonly sql: string;
  /**
   * The rule AWS IoT SQL version.
   *
   * @default - 2012-17-10
   */
  readonly awsIotSqlVersion?: string;
  /**
   * The topic rule description.
   *
   * @default - none
   */
  readonly description?: string;
  /**
   * The rule actions to preform on error.
   *
   * @default - none
   */
  readonly errorAction?: ITopicRuleAction;
}

/**
 * A new topic rule
 */
export class TopicRule extends Resource implements ITopicRule {
  /**
   * Import topic rule attributes
   */
  public static fromTopicRuleArn(scope: Construct, id: string, topicRuleArn: string): ITopicRule {
    return TopicRule.fromTopicRuleAttributes(scope, id, { topicRuleArn });
  }
  /**
   * Import topic rule attributes
   */
  public static fromTopicRuleAttributes(scope: Construct, id: string, attrs: TopicRuleAttributes): ITopicRule {
    const topicRuleArn = attrs.topicRuleArn;
    const ruleName = parseRuleName(attrs.topicRuleArn);
    class Import extends Resource implements ITopicRule {
      public readonly ruleName = ruleName;
      public readonly topicRuleArn = topicRuleArn;
    }

    return new Import(scope, id);
  }

  public readonly ruleName: string;
  public readonly topicRuleArn: string;
  private readonly actions = new Array<CfnTopicRule.ActionProperty>();

  constructor(scope: Construct, id: string, props: TopicRuleProps) {
    super(scope, id, {
      physicalName: props.ruleName || 'TODO',
    });

    const resource = new CfnTopicRule(this, 'Resource', {
      ruleName: this.physicalName,
      topicRulePayload: {
        ...props.errorAction,
        description: props.description || '',
        awsIotSqlVersion: props.awsIotSqlVersion || '2015-10-08',
        sql: props.sql,
        ruleDisabled: props.ruleDisabled || false,
        actions: Lazy.any({ produce: () => this.renderActions() }),
      },
    });

    this.ruleName = resource.ref;
    this.topicRuleArn = resource.attrArn;
    for (const action of props.actions || []) {
      this.addAction(action);
    }
  }

  /**
   * Adds an action to this topic rule.
   */
  public addAction(action: ITopicRuleAction) {
    this.actions.push(action.bind(this));
  }

  public renderActions() {
    if (this.actions.length === 0) {
      return undefined;
    }
    return this.actions;
  }
}
