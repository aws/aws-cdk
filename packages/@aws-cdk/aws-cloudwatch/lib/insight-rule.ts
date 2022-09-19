import { Resource, ArnFormat } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IResource } from '../../core/lib/resource';
import { CfnInsightRule } from './cloudwatch.generated';
import { MathExpression, MathExpressionOptions } from './metric';
import { IMetric } from './metric-types';

/**
 * The applicable Filters for an Insight Rule
 */
export enum FilterOperator {
  /**
   * Checks if the `match` is included in the target array of strings
   */
  IN = 'In',

  /**
   * Checks if the `match` is not included in the target array of strings
   */
  NOT_IN = 'NotIn',

  /**
   * Checks if the `match` starts with one of the target array of strings
   */
  STARTS_WITH = 'StartsWith',

  /**
   * Checks if the `match` is greater than the target number
   */
  GREATER_THAN = 'GreaterThan',

  /**
   * Checks if the `match` is less than the target number
   */
  LESS_THAN = 'LessThan',

  /**
   * Checks if the `match` is equal to the target number
   */
  EQUAL_TO = 'EqualTo',

  /**
   * Checks if the `match` is not equal to the target number
   */
  NOT_EQUAL_TO = 'NotEqualTo',

  /**
   * Checks if the `match` field is present in the log event
   */
  IS_PRESENT = 'IsPresent',
}

/**
 * A Filter to scope down the log events included in an Insight Rule
 */
export class Filter {

  /**
   * Convenience function to generate an IN Filter
   */
  public static in(match: string, target: string[]): Filter {
    return new Filter(match, FilterOperator.IN, target);
  }

  /**
   * Convenience function to generate a NOT_IN Filter
   */
  public static notIn(match: string, target: string[]): Filter {
    return new Filter(match, FilterOperator.NOT_IN, target);
  }

  /**
   * Convenience function to generate a STARTS_WITH Filter
   */
  public static startsWith(match: string, target: string[]): Filter {
    return new Filter(match, FilterOperator.STARTS_WITH, target);
  }

  /**
   * Convenience function to generate a GREATER_THAN Filter
   */
  public static greaterThan(match: string, target: number): Filter {
    return new Filter(match, FilterOperator.GREATER_THAN, target);
  }

  /**
   * Convenience function to generate a LESS_THAN Filter
   */
  public static lessThan(match: string, target: number): Filter {
    return new Filter(match, FilterOperator.LESS_THAN, target);
  }

  /**
   * Convenience function to generate an EQUAL_TO Filter
   */
  public static equalTo(match: string, target: number): Filter {
    return new Filter(match, FilterOperator.EQUAL_TO, target);
  }

  /**
   * Convenience function to generate a NOT_EQUAL_TO Filter
   */
  public static notEqualTo(match: string, target: number): Filter {
    return new Filter(match, FilterOperator.NOT_EQUAL_TO, target);
  }

  /**
   * Convenience function to generate an IS_PRESENT Filter
   */
  public static isPresent(match: string, target: boolean): Filter {
    return new Filter(match, FilterOperator.IS_PRESENT, target);
  }

  /**
   * The log event field to assess in the filter
   */
  readonly match: string;

  /**
   * The type of Filter to apply
   */
  readonly operator: FilterOperator;

  /**
   * The target field to compare the `match` against
   */
  readonly target: string[] | number | boolean;

  private constructor(match: string, operator: FilterOperator, target: string[] | number | boolean) {
    this.match = match;
    this.operator = operator;
    this.target = target;
  }
}

/**
 * The applicable Log Formats for the Insight Rule
 */
export enum LogFormat {
  /**
   * JSON format
   */
  JSON = 'JSON',

  /**
   * CLF format
   */
  CLF = 'CLF',
}

/**
 * The options to aggregate the log events to evaluate contribution for the Insight Rule
 */
export enum AggregateOptions {
  /**
   * Aggregate contribution by summing a given field
   */
  SUM = 'Sum',

  /**
   * Aggregate contribution by the count of a contributor's appearance in events
   */
  COUNT = 'Count',
}

/**
 * The properties for an Insight Rule
 */
export interface InsightRuleProps {
  /**
   * Option to Aggregate the Log Events for the Insight Rule to assess contribution
   *
   * @default - COUNT
   */
  readonly aggregateOn?: AggregateOptions,

  /**
   * Whether or not the Insight Rule is enabled
   *
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * The Filters to apply to the Insight Rule
   *
   * @default []
   */
  readonly filters?: Filter[],

  /**
   * The keys of the log event to identify a Contributor
   */
  readonly keys: string[],

  /**
   * The Log Format of the Insight Rule
   *
   * @default - JSON
   */
  readonly logFormat?: LogFormat,

  /**
   * The Log Groups to include in the report
   */
  readonly logGroupNames: string[],

  /**
   * The name of the Insight Rule
   */
  readonly insightRuleName: string,

  /**
   * The name of the Schema. Should usually be 'CloudWatchLogRule'
   *
   * @default 'CloudWatchLogRule'
   */
  readonly schemaName?: string,

  /**
   * The value to sum up if the Rule is set to aggregate on SUM
   *
   * @default none
   */
  readonly sumValue?: string,

  /**
   * The version of the Schema. Should usually be 1
   *
   * @default 1
   */
  readonly version?: number,
}

/**
 * Represents Contributor Insight Rule
 */
export interface IInsightRule extends IResource {

  /**
   * Name of this insight rule
   *
   * @attribute
   */
  readonly insightRuleName: string;

  /**
   * Get a metric for this Insight Rule
   *
   * @param metricName The name of the metric to get
   * @param metricOptions Additional metric options to apply
   */
  metric(metricName: string, metricOptions?: MathExpressionOptions): IMetric;
}

/**
 * The base class for an Insight Rule
 */
abstract class InsightRuleBase extends Resource implements IInsightRule {
  /**
   * The name of this InsightRule
   *
   * @attribute insightRuleName
   */
  public abstract readonly insightRuleName: string;

  public metric(metricName: string, metricOptions: MathExpressionOptions = {}): IMetric {
    return new MathExpression({
      ...metricOptions,
      expression: `INSIGHT_RULE_METRIC('${this.insightRuleName}', '${metricName}')`,
    });
  }
}

/**
 * A Contributor Insight Rule Construct
 */
export class InsightRule extends InsightRuleBase {

  /**
  * Import an existing Insight Rule from the rule name
  *
  * @param scope The parent creating construct (usually `this`)
  * @param id The Construct's name
  * @param insightRuleName The name of the Insight Rule
  */
  static fromInsightRuleName(scope: Construct, id: string, insightRuleName: string): IInsightRule {
    class Import extends InsightRuleBase {
      public readonly insightRuleName = insightRuleName;
    }
    return new Import(scope, id);
  }

  /**
   * Name of this Insight Rule
   *
   * @attribute InsightRuleRuleName
   */
  public readonly insightRuleName: string;

  /**
   * ARN of this Insight Rule (i.e. arn:aws:cloudwatch:<region>:<account-id>:insight-rule/Foo)
   *
   * @attribute
   */
  public readonly insightRuleArn: string;

  constructor(scope: Construct, id: string, props: InsightRuleProps) {
    super(scope, id, {
      physicalName: props.insightRuleName,
    });

    const ruleState = props.enabled === false ? 'DISABLED' : 'ENABLED';

    const {
      aggregateOn,
      filters,
      logGroupNames,
      logFormat,
      keys,
      schemaName,
      sumValue,
      version,
    } = props;

    if (filters && filters.length > 4) {
      throw new Error('Only 4 Filters can be applied to an Insight Rule');
    }

    if (aggregateOn === AggregateOptions.SUM && !sumValue) {
      throw new Error('`sumValue` must be specified if using Aggregate Option SUM');
    }

    const ruleBody = JSON.stringify({
      AggregateOn: aggregateOn,
      Contribution: {
        Keys: keys,
        Filters: (filters || []).map((f: Filter) => ({
          Match: f.match,
          [f.operator]: f.target,
        })),
        ValueOf: sumValue || '',
      },
      Schema: {
        Name: schemaName ?? 'CloudWatchLogRule',
        Version: version ?? 1,
      },
      LogGroupNames: logGroupNames,
      LogFormat: logFormat || LogFormat.JSON,
    });

    const cfnInsightRule = new CfnInsightRule(scope, `${id}Resource`, {
      ruleBody,
      ruleName: props.insightRuleName,
      ruleState,
    });

    this.insightRuleName = props.insightRuleName;
    this.insightRuleArn = this.getResourceArnAttribute(cfnInsightRule.attrArn, {
      service: 'cloudwatch',
      resource: 'insight',
      resourceName: this.physicalName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });
  }
}
