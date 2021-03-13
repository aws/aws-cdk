import { Resource, IResource, Lazy } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnTopicRule } from './iot.generated';
import { ITopicRuleAction } from './topic-rule-action';
import { parseTopicRuleArn } from './util';

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
   */
  readonly description?: string;
  /**
   * The rule actions to preform on error.
   */
  readonly errorAction?: ITopicRuleAction;
}

/**
 * A new topic rule
 */
export class TopicRule extends Resource implements ITopicRule {
  public static fromReceiptRuleName(scope: Construct, id: string, topicRuleName: string): ITopicRule {
    class Import extends Resource implements ITopicRule {
      public readonly ruleName = topicRuleName;
      public readonly topicRuleArn = parseTopicRuleArn(scope, topicRuleName);
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
      topicRulePayload: {
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
