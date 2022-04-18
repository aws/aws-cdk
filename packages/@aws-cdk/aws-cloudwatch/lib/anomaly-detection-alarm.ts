import { Annotations, ArnFormat, Lazy, Stack, Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IAlarmAction } from './alarm-action';
import { AlarmBase } from './alarm-base';
import { CfnAlarm } from './cloudwatch.generated';;
import { TreatMissingData } from './metric';
import { IMetric, MetricExpressionConfig, MetricStatConfig } from './metric-types';
import { dispatchMetric } from './private/metric-util';
import { MetricSet } from './private/rendering';

/**
 * Options for an AnomolyDetectionAlarm
 */
export interface AnomalyDetectionAlarmOptions {

  /**
   * Name of the alarm
   *
   * @default - Automatically generated name
   */
  readonly alarmName?: string;

  /**
   * Description for the alarm
   *
   * @default - No description
   */
  readonly alarmDescription?: string;

  /**
   * Comparison to use to check if metric is breaching
   *
   * @default - AnomalyDetectionComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD
   */
  readonly comparisonOperator?: AnomalyDetectionComparisonOperator;

  /**
   * The number of standard deviations used when generating the anomaly detection band.
   *
   * Higher number means thicker band, lower number means thinner band.
   */
  readonly threshold: number;

  /**
   * The number of periods over which data is compared to the specified threshold.
   */
  readonly evaluationPeriods: number;

  /**
   * Sets how this alarm is to handle missing data points.
   *
   * @default - TreatMissingData.MISSING
   */
  readonly treatMissingData?: TreatMissingData;

  /**
   * Whether the actions for this alarm are enabled
   *
   * @default - true
   */
  readonly actionsEnabled?: boolean;

  /**
   * The number of datapoints that must be breaching to trigger the alarm. This is used only if you are setting an "M
   * out of N" alarm. In that case, this value is the M. For more information, see Evaluating an Alarm in the Amazon
   * CloudWatch User Guide.
   *
   * @default - same as evaluationPeriods
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarm-evaluation
   */
  readonly datapointsToAlarm?: number;
}

/**
 * Properties for AnomolyDetectionAlarms
 */
export interface AnomalyDetectionAlarmProps extends AnomalyDetectionAlarmOptions {
  /**
   * The metric to add the alarm on
   *
   * Metric objects can be obtained from most resources, or you can construct
   * custom Metric objects by instantiating one.
   */
  readonly metric: IMetric;
}

/**
 * Comparison operator for evaluating anomaly detection alarms
 */
export enum AnomalyDetectionComparisonOperator {
  /**
   * Specified statistic is lower than or greater than the anomaly model band.
   */
  LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD = 'LessThanLowerOrGreaterThanUpperThreshold',

  /**
   * Specified statistic is greater than the anomaly model band.
   */
  GREATER_THAN_UPPER_THRESHOLD = 'GreaterThanUpperThreshold',

  /**
   * Specified statistic is lower than the anomaly model band.
   */
  LESS_THAN_LOWER_THRESHOLD = 'LessThanLowerThreshold',
}

/**
 * An anomaly detection alarm on a CloudWatch metric.
 *
 * @resource AWS::CloudWatch::Alarm
 */
export class AnomalyDetectionAlarm extends AlarmBase {

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

  constructor(scope: Construct, id: string, props: AnomalyDetectionAlarmProps) {
    super(scope, id, {
      physicalName: props.alarmName,
    });

    const comparisonOperator = props.comparisonOperator ?? AnomalyDetectionComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD;

    const alarm = new CfnAlarm(this, 'Resource', {
      // Meta
      alarmDescription: props.alarmDescription,
      alarmName: this.physicalName,

      // Evaluation
      comparisonOperator,
      datapointsToAlarm: props.datapointsToAlarm,
      evaluationPeriods: props.evaluationPeriods,
      treatMissingData: props.treatMissingData,

      // Actions
      actionsEnabled: props.actionsEnabled,
      alarmActions: Lazy.list({ produce: () => this.alarmActionArns }),
      insufficientDataActions: Lazy.list({ produce: (() => this.insufficientDataActionArns) }),
      okActions: Lazy.list({ produce: () => this.okActionArns }),

      // Metric
      ...this.renderMetric(props.metric, props.threshold),
    });

    this.alarmArn = this.getResourceArnAttribute(alarm.attrArn, {
      service: 'cloudwatch',
      resource: 'alarm',
      resourceName: this.physicalName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });
    this.alarmName = this.getResourceNameAttribute(alarm.ref);

    this.metric = props.metric;

    for (const w of this.metric.warnings ?? []) {
      Annotations.of(this).addWarning(w);
    }
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

    this.alarmActionArns.push(...actions.map(a =>
      this.validateActionArn(a.bind(this, this).alarmActionArn),
    ));
  }

  private validateActionArn(actionArn: string): string {
    const ec2ActionsRegexp: RegExp = /arn:aws:automate:[a-z|\d|-]+:ec2:[a-z]+/;
    if (ec2ActionsRegexp.test(actionArn)) {
      // Check per-instance metric
      const metricConfig = this.metric.toMetricConfig();
      if (metricConfig.metricStat?.dimensions?.length != 1 || metricConfig.metricStat?.dimensions![0].name != 'InstanceId') {
        throw new Error(`EC2 alarm actions requires an EC2 Per-Instance Metric. (${JSON.stringify(metricConfig)} does not have an 'InstanceId' dimension)`);
      }
    }
    return actionArn;
  }

  private renderMetric(metric: IMetric, threshold: number) {
    const self = this;
    return dispatchMetric(metric, {
      withStat(stat, conf) {
        self.validateMetricStat(stat, metric);

        const thresholdMetricId = 'ad1';
        const metricId = 'm1';

        return {
          thresholdMetricId,
          metrics: [
            {
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
              id: metricId,
              label: conf.renderingProperties?.label,
              returnData: true,
            } as CfnAlarm.MetricDataQueryProperty,
            {
              expression: `ANOMALY_DETECTION_BAND(${metricId}, ${threshold})`,
              id: thresholdMetricId,
              label: 'Expected',
              returnData: true,
            },
          ],
        };
      },

      withExpression() {
        // Expand the math expression metric into a set
        const mset = new MetricSet<boolean>();
        mset.addTopLevel(true, metric);

        let eid = 0;
        function uniqueMetricId() {
          return `expr_${++eid}`;
        }

        const thresholdMetricId = uniqueMetricId();
        let metricId: string | null = null;

        const metrics: CfnAlarm.MetricDataQueryProperty[] = [];

        for (const entry of mset.entries) {
          if (entry.tag) {
            if (metricId !== null) {
              throw new Error('Multiple metrics detected as the target for anomaly detection');
            }

            if (entry.id === undefined) {
              entry.id = uniqueMetricId();
            }

            metricId = entry.id;
          }

          metrics.push(
            dispatchMetric(entry.metric, {
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
                  id: entry.id ?? uniqueMetricId(),
                  label: conf.renderingProperties?.label,
                  returnData: entry.tag ? true : false, // entry.tag evaluates to true if the metric is the math expression the alarm is based on.
                };
              },
              withExpression(expr, conf) {

                const hasSubmetrics = mathExprHasSubmetrics(expr);

                if (hasSubmetrics) {
                  assertSubmetricsCount(expr);
                }

                self.validateMetricExpression(expr);

                return {
                  expression: expr.expression,
                  id: entry.id || uniqueMetricId(),
                  label: conf.renderingProperties?.label,
                  period: hasSubmetrics ? undefined : expr.period,
                  returnData: entry.tag ? true : false, // entry.tag evaluates to true if the metric is the math expression the alarm is based on.
                };
              },
            }) as CfnAlarm.MetricDataQueryProperty);
        }

        if (metricId === null) {
          throw new Error('No metrics detected as the target for anomaly detection');
        }

        return {
          thresholdMetricId,
          metrics: [
            ...metrics,
            {
              expression: `ANOMALY_DETECTION_BAND(${metricId}, ${threshold})`,
              id: thresholdMetricId,
              label: 'Expected',
              returnData: true,
            },
          ],
        };
      },
    });
  }

  /**
   * Validate that if an account or region is in the given stat config, they match the alarm
   */
  private validateMetricStat(stat: MetricStatConfig, metric: IMetric) {
    const stack = Stack.of(this);

    if (definitelyDifferent(stat.account, stack.account)) {
      throw new Error(`Cannot create an Anomaly Detection Alarm in account '${stack.account}' based on metric '${metric}' in '${stat.account}'`);
    }

    if (definitelyDifferent(stat.region, stack.region)) {
      throw new Error(`Cannot create an Anomaly Detection Alarm in region '${stack.region}' based on metric '${metric}' in '${stat.region}'`);
    }
  }

  /**
   * Validates that the expression config does not specify searchAccount or searchRegion props
   * as search expressions are not supported by alarms.
   */
  private validateMetricExpression(expr: MetricExpressionConfig) {
    if (expr.searchAccount !== undefined || expr.searchRegion !== undefined) {
      throw new Error('Cannot create an Anomaly Detection Alarm based on a MathExpression which specifies a searchAccount or searchRegion');
    }
  }
}

function definitelyDifferent(x: string | undefined, y: string) {
  return x && !Token.isUnresolved(y) && x !== y;
}

function mathExprHasSubmetrics(expr: MetricExpressionConfig) {
  return Object.keys(expr.usingMetrics).length > 0;
}

function assertSubmetricsCount(expr: MetricExpressionConfig) {
  if (Object.keys(expr.usingMetrics).length > 9) {
    // https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarms-on-metric-math-expressions
    throw new Error('Anomaly Detection Alarms on math expressions cannot contain more than 9 individual metrics');
  };
}
