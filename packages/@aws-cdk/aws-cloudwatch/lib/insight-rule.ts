import * as iam from '@aws-cdk/aws-iam';
import * as core from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnInsightRule } from './cloudwatch.generated';
import { MetricOptions, Metric } from './metric';


/**
 * Properties for defining a Contributor Insights Rule
 */
export interface IInsightRule extends core.IResource {
  /**
     * Contributor Insights Rule Arn (i.e. arn:aws:cloudwatch:<region>:<account-id>:insight-rule:Foo)
     *
     * @attribute
     */
  readonly insightRuleArn: string;

  /**
     * Name of Contributor Insights Rule
     *
     * @attribute
     */
  readonly insightRuleRuleName: string;

  /**
     * Adds an IAM policy statement associated with this rule to an IAM principle's policy
     *
     * @param grantee the principle to grant access to (no-op if undefined)
     * @param actions set of actions to allow
     */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant

  /**
     * Returns the given named metric for this rule
     *
     * @param metricName the value one wishes to take the metrics of
     * @param options properties of the metric (i.e. period, etc)
     */
  metric(metricName: string, options?: MetricOptions): Metric
}

/**
 * Abstract class whose function is to implement the grant and metric functions, not public/exposed in API
 * Required by contributing guidelines
 */
abstract class InsightRuleBase extends core.Resource implements IInsightRule {

  /**
     * @attribute
     */
  public abstract readonly insightRuleArn: string;

  /**
     * @attribute
     */
  public abstract readonly insightRuleRuleName: string;

  /**
     * Adds an IAM policy statement associated with this rule to an IAM principle's policy
     *
     * @param grantee the principle to grant access to (no-op if undefined)
     * @param actions set of actions to allow
     */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee: grantee,
      actions: actions,
      resourceArns: [this.insightRuleArn],
      scope: this,
    });
  }

  /**
   * Returns the given named metric for this rule
   *
   * @param metricName the value one wishes to take the metrics of
   * @param props properties that describe the characteristics of the MetricOptions
   */
  public metric(metricName: string, props?: MetricOptions): Metric {
    return new Metric({
      namespace: 'AWS/InsightRule',
      metricName,
      dimensions: {
        TableName: this.insightRuleRuleName,
      },
      ...props,
    }).attachTo(this);
  }
}

/**
 * Possible states for Contributor Insights Rule
 */
export enum InsightRuleStates {

  /**
     * Rule is active and will collect and write data
     */
  ENABLED = 'ENABLED',

  /**
     * Rule is inactive and will not collect and write data
     */
  DISABLED = 'DISABLED'
}


/**
 * The properties of a Contributor Insights Rule
 */
export interface InsightRuleProps {

  /**
     * Physical name of the Contributor Insights Rule
     */
  readonly insightRuleName: string;

  /**
     * Rule body of the Contributor Insights Rule
     */
  readonly insightRuleBody: string;

  /**
     * Rule state of the Contributor Insights Rule, can either be ENABLED or DISABLED
     *
     * @default InsightRuleStates.ENABLED, rule will actively collect data and report metrics when left out
     */
  readonly insightRuleState?: InsightRuleStates;
}

/**
 * A Contributor Insights Rule managed by the CDK
 */
export class InsightRule extends InsightRuleBase {

  /**
     * Reference an existing Contributor Insights Rule defined outside of the CDK code, by name
     *
     * @param scope The parent creating construct (usually 'this')
     * @param id The construct's name
     * @param insightRuleName The Contributor Insights Rule's name
     */
  public static fromInsightRuleName(scope: Construct, id: string,
    insightRuleName: string): IInsightRule {
    class Import extends InsightRuleBase {
      public readonly insightRuleArn = core.Stack.of(scope).formatArn({
        service: 'cloudformation',
        resource: 'insight-rule',
        resourceName: insightRuleName,
      });
      public readonly insightRuleRuleName = insightRuleName;
    }

    return new Import(scope, id);
  }

  /**
     * Reference an existing Contributor Insights Rule defined outside of the CDK code, by arn
     *
     * @param scope The parent creating construct (usually 'this')
     * @param id The construct's name
     * @param InsightRuleArn The Contributor Insights Rule's arn
     */
  public static frominsightRuleArn(scope: Construct, id: string,
    InsightRuleArn:string): IInsightRule {
    class Import extends InsightRuleBase {
      public readonly insightRuleArn = InsightRuleArn;
      public readonly insightRuleRuleName =
      core.Stack.of(scope).parseArn(InsightRuleArn, ':').resourceName!;
    }

    return new Import(scope, id);
  }

  /**
     * Arn of this Contributor Insights Rule
     *
     * @attribute
     */
  public readonly insightRuleArn: string;

  /**
     * Name of this Contributor Insights Rule
     *
     * @attribute
     */
  public readonly insightRuleRuleName: string;

  private readonly ruleBody: string;
  private readonly ruleState?: InsightRuleStates;


  constructor(scope: Construct, id: string, props: InsightRuleProps) {
    super(scope, id, {
      physicalName: props.insightRuleName,
    });

    /**
         * Validate the inputs,
         * We shouldnt need to validate rule state,
         * I know ruleName has some restrictions
         * Rulebody I suppose can go through a json/yaml validator
         */
    this.ruleState = props.insightRuleState;
    this.ruleBody = props.insightRuleBody;

    const insightRule = new CfnInsightRule(this, 'Resource', {
      ruleName: props.insightRuleName,
      ruleBody: this.ruleBody,
      ruleState: this.ruleState || InsightRuleStates.ENABLED,
    });

    /**
         * The arn and name are both attributes of the CFN resource
         * @see https://docs.aws.amazon.com/cdk/api/latest/python/aws_cdk.aws_cloudwatch/CfnInsightRule.html
         */
    this.insightRuleArn = insightRule.attrArn;
    this.insightRuleRuleName = insightRule.ref;
  }

}


