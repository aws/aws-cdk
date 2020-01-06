import { Construct, IResource, Lazy, Resource, Stack, Token } from '@aws-cdk/core';
import { IAlarmAction } from './alarm-action';
import { CfnAlarm } from './cloudwatch.generated';
import { HorizontalAnnotation } from './graph';
import { CreateAlarmOptions } from './metric';
import { IMetric, MetricStatConfig } from './metric-types';
import { dispatchMetric, metricPeriod } from './private/metric-util';
import { MetricSet } from './private/rendering';
import { dropUndefined } from './private/util';
import { parseStatistic } from './private/util.statistic';

export interface IAlarm extends IResource {
  /**
   * @attribute
   */
  readonly alarmArn: string;

  /**
   * @attribute
   */
  readonly alarmName: string;
}

/**
 * Properties for Alarms
 */
export interface AlarmProps extends CreateAlarmOptions {
  /**
   * The metric to add the alarm on
   *
   * Metric objects can be obtained from most resources, or you can construct
   * custom Metric objects by instantiating one.
   */
  readonly metric: IMetric;
}

/**
 * Comparison operator for evaluating alarms
 */
export enum ComparisonOperator {
  GREATER_THAN_OR_EQUAL_TO_THRESHOLD = 'GreaterThanOrEqualToThreshold',
  GREATER_THAN_THRESHOLD = 'GreaterThanThreshold',
  LESS_THAN_THRESHOLD = 'LessThanThreshold',
  LESS_THAN_OR_EQUAL_TO_THRESHOLD = 'LessThanOrEqualToThreshold',
}

const OPERATOR_SYMBOLS: {[key: string]: string} = {
  GreaterThanOrEqualToThreshold: '>=',
  GreaterThanThreshold: '>',
  LessThanThreshold: '<',
  LessThanOrEqualToThreshold: '>=',
};

/**
 * Specify how missing data points are treated during alarm evaluation
 */
export enum TreatMissingData {
  /**
   * Missing data points are treated as breaching the threshold
   */
  BREACHING = 'breaching',

  /**
   * Missing data points are treated as being within the threshold
   */
  NOT_BREACHING = 'notBreaching',

  /**
   * The current alarm state is maintained
   */
  IGNORE = 'ignore',

  /**
   * The alarm does not consider missing data points when evaluating whether to change state
   */
  MISSING = 'missing'
}

/**
 * An alarm on a CloudWatch metric
 */
export class Alarm extends Resource implements IAlarm {

  public static fromAlarmArn(scope: Construct, id: string, alarmArn: string): IAlarm {
    class Import extends Resource implements IAlarm {
      public readonly alarmArn = alarmArn;
      public readonly alarmName = Stack.of(scope).parseArn(alarmArn, ':').resourceName!;
    }
    return new Import(scope, id);
  }

  /**
   * ARN of this alarm
   *
   * @attribute
   */
  public readonly alarmArn: string;

  /**
   * Name of this alarm.
   *
   * @attribute
   */
  public readonly alarmName: string;

  /**
   * The metric object this alarm was based on
   */
  public readonly metric: IMetric;

  private alarmActionArns?: string[];
  private insufficientDataActionArns?: string[];
  private okActionArns?: string[];

  /**
   * This metric as an annotation
   */
  private readonly annotation: HorizontalAnnotation;

  constructor(scope: Construct, id: string, props: AlarmProps) {
    super(scope, id, {
      physicalName: props.alarmName,
    });

    const comparisonOperator = props.comparisonOperator || ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD;

    const alarm = new CfnAlarm(this, 'Resource', {
      // Meta
      alarmDescription: props.alarmDescription,
      alarmName: this.physicalName,

      // Evaluation
      comparisonOperator,
      threshold: props.threshold,
      datapointsToAlarm: props.datapointsToAlarm,
      evaluateLowSampleCountPercentile: props.evaluateLowSampleCountPercentile,
      evaluationPeriods: props.evaluationPeriods,
      treatMissingData: props.treatMissingData,

      // Actions
      actionsEnabled: props.actionsEnabled,
      alarmActions: Lazy.listValue({ produce: () => this.alarmActionArns }),
      insufficientDataActions: Lazy.listValue({ produce: (() => this.insufficientDataActionArns) }),
      okActions: Lazy.listValue({ produce: () => this.okActionArns }),

      // Metric
      ...this.renderMetric(props.metric),
      ...dropUndefined({
        // Alarm overrides
        period: props.period && props.period.toSeconds(),
        statistic: renderIfSimpleStatistic(props.statistic),
        extendedStatistic: renderIfExtendedStatistic(props.statistic),
      })
    });

    this.alarmArn = this.getResourceArnAttribute(alarm.attrArn, {
      service: 'cloudwatch',
      resource: 'alarm',
      resourceName: this.physicalName,
      sep: ':',
    });
    this.alarmName = this.getResourceNameAttribute(alarm.ref);

    this.metric = props.metric;
    this.annotation = {
      // tslint:disable-next-line:max-line-length
      label: `${this.metric} ${OPERATOR_SYMBOLS[comparisonOperator]} ${props.threshold} for ${props.evaluationPeriods} datapoints within ${describePeriod(props.evaluationPeriods * metricPeriod(props.metric).toSeconds())}`,
      value: props.threshold,
    };
  }

  /**
   * Trigger this action if the alarm fires
   *
   * Typically the ARN of an SNS topic or ARN of an AutoScaling policy.
   */
  public addAlarmAction(...actions: IAlarmAction[]) {
    if (this.alarmActionArns === undefined) {
      this.alarmActionArns = [];
    }

    this.alarmActionArns.push(...actions.map(a => a.bind(this, this).alarmActionArn));
  }

  /**
   * Trigger this action if there is insufficient data to evaluate the alarm
   *
   * Typically the ARN of an SNS topic or ARN of an AutoScaling policy.
   */
  public addInsufficientDataAction(...actions: IAlarmAction[]) {
    if (this.insufficientDataActionArns === undefined) {
      this.insufficientDataActionArns = [];
    }

    this.insufficientDataActionArns.push(...actions.map(a => a.bind(this, this).alarmActionArn));
  }

  /**
   * Trigger this action if the alarm returns from breaching state into ok state
   *
   * Typically the ARN of an SNS topic or ARN of an AutoScaling policy.
   */
  public addOkAction(...actions: IAlarmAction[]) {
    if (this.okActionArns === undefined) {
      this.okActionArns = [];
    }

    this.okActionArns.push(...actions.map(a => a.bind(this, this).alarmActionArn));
  }

  /**
   * Turn this alarm into a horizontal annotation
   *
   * This is useful if you want to represent an Alarm in a non-AlarmWidget.
   * An `AlarmWidget` can directly show an alarm, but it can only show a
   * single alarm and no other metrics. Instead, you can convert the alarm to
   * a HorizontalAnnotation and add it as an annotation to another graph.
   *
   * This might be useful if:
   *
   * - You want to show multiple alarms inside a single graph, for example if
   *   you have both a "small margin/long period" alarm as well as a
   *   "large margin/short period" alarm.
   *
   * - You want to show an Alarm line in a graph with multiple metrics in it.
   */
  public toAnnotation(): HorizontalAnnotation {
    return this.annotation;
  }

  private renderMetric(metric: IMetric) {
    const self = this;
    return dispatchMetric(metric, {
      withStat(st) {
        self.validateMetricStat(st, metric);

        return dropUndefined({
          dimensions: st.dimensions,
          namespace: st.namespace,
          metricName: st.metricName,
          period: st.period?.toSeconds(),
          statistic: renderIfSimpleStatistic(st.statistic),
          extendedStatistic: renderIfExtendedStatistic(st.statistic),
          unit: st.unitFilter,
        });
      },

      withExpression() {
        // Expand the math expression metric into a set
        const mset = new MetricSet<boolean>();
        mset.addTopLevel(true, metric);

        let eid = 0;
        function uniqueMetricId() {
          return `expr_${++eid}`;
        }

        return {
          metrics: mset.entries.map(entry => dispatchMetric(entry.metric, {
            withStat(stat, conf) {
              self.validateMetricStat(stat, entry.metric);

              return {
                metricStat: {
                  metric: {
                    metricName: stat.metricName,
                    namespace: stat.namespace,
                    dimensions: stat.dimensions,
                  },
                  period: stat.period.toSeconds(),
                  stat: stat.statistic,
                  unit: stat.unitFilter,
                },
                id: entry.id || uniqueMetricId(),
                label: conf.renderingProperties?.label,
                returnData: entry.tag ? undefined : false, // Tag stores "primary" attribute, default is "true"
              };
            },
            withExpression(expr, conf) {
              return {
                expression: expr.expression,
                id: entry.id || uniqueMetricId(),
                label: conf.renderingProperties?.label,
                returnData: entry.tag ? undefined : false, // Tag stores "primary" attribute, default is "true"
              };
            },
          }) as CfnAlarm.MetricDataQueryProperty)
        };
      }
    });
  }

  /**
   * Validate that if a region and account are in the given stat config, they match the Alarm
   */
  private validateMetricStat(stat: MetricStatConfig, metric: IMetric) {
    const stack = Stack.of(this);

    if (definitelyDifferent(stat.region, stack.region)) {
      throw new Error(`Cannot create an Alarm in region '${stack.region}' based on metric '${metric}' in '${stat.region}'`);
    }
    if (definitelyDifferent(stat.account, stack.account)) {
      throw new Error(`Cannot create an Alarm in account '${stack.account}' based on metric '${metric}' in '${stat.account}'`);
    }
  }
}

function definitelyDifferent(x: string | undefined, y: string) {
  return x && !Token.isUnresolved(y) && x !== y;
}

/**
 * Return a human readable string for this period
 *
 * We know the seconds are always one of a handful of allowed values.
 */
function describePeriod(seconds: number) {
  if (seconds === 60) { return '1 minute'; }
  if (seconds === 1) { return '1 second'; }
  if (seconds > 60) { return (seconds / 60) + ' minutes'; }
  return seconds + ' seconds';
}

function renderIfSimpleStatistic(statistic?: string): string | undefined {
  if (statistic === undefined) { return undefined; }

  const parsed = parseStatistic(statistic);
  if (parsed.type === 'simple') {
    return parsed.statistic;
  }
  return undefined;
}

function renderIfExtendedStatistic(statistic?: string): string | undefined {
  if (statistic === undefined) { return undefined; }

  const parsed = parseStatistic(statistic);
  if (parsed.type === 'percentile') {
    // Already percentile. Avoid parsing because we might get into
    // floating point rounding issues, return as-is but lowercase the p.
    return statistic.toLowerCase();
  }
  return undefined;
}
