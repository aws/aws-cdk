import { ArnFormat, Lazy, Names, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnInsightRule } from './cloudwatch.generated';

/**
 * Valid states for the rule.
 */
export enum RuleState {
  /**
   * Insight rule is on
   */
  ENABLED = 'ENABLED',

  /**
   * Insight rule is off
   */
  DISABLED = 'DISABLED',
}

/**
 * Propperties of defining a CloudWatch Contributor Insights rule.
 */
export interface InsightRuleProps {
  /**
   * The definition of the rule, as a JSON object.
   */
  readonly ruleBody: string;

  /**
   * The name of the rule
   *
   * Up to 128 letters (uppercase and lowercase), numbers, hyphens, and underscores are allows.
   *
   * @default - automatically generated name
   */
  readonly insightRuleName?: string;

  /**
   * The current state of the rule
   *
   * @default - ENABLED
   */
  readonly ruleState?: RuleState;
}

/**
 * A rule that evaluates log events in CloudWatch Logs to find contributor data
 */
export class InsightRule extends Resource {
  /**
   * Insight ARN
   *
   * @attribute
   */
  public readonly arn: string;

  /**
   * Name of the insight rule
   *
   * @attribute
   */
  public readonly ruleName: string;

  constructor(scope: Construct, id: string, props: InsightRuleProps) {
    super(scope, id, {
      physicalName: props.insightRuleName ?? Lazy.string({ produce: () => this.generateUniqueId() }),
    });

    if (props.insightRuleName && props.insightRuleName.length > 128) {
      throw new Error('Insight Rule Name cannot be greater than 128 characters');
    }

    const ruleState = props.ruleState || RuleState.ENABLED;

    const insightRule = new CfnInsightRule(this, 'Resource', {
      ruleBody: props.ruleBody,
      ruleName: this.physicalName,
      ruleState,
    });

    this.arn = this.getResourceArnAttribute(insightRule.attrArn, {
      service: 'cloudwatch',
      resource: 'insight',
      resourceName: this.physicalName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });

    this.ruleName = this.getResourceNameAttribute(insightRule.attrRuleName);
  }

  private generateUniqueId(): string {
    const name = Names.uniqueId(this);
    if (name.length > 128) {
      return name.substring(0, 64) + name.substring(name.length - 64);
    }
    return name;
  }
}
