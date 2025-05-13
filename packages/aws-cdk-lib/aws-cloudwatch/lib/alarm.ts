import { Construct } from 'constructs';
import { IAlarmAction } from './alarm-action';
import { AlarmBase, IAlarm } from './alarm-base';
import { CfnAlarm, CfnAlarmProps } from './cloudwatch.generated';
import { HorizontalAnnotation } from './graph';
import { CreateAlarmOptions, CreateAnomalyDetectionAlarmProps, MathExpression } from './metric';
import { IMetric, MetricExpressionConfig, MetricStatConfig } from './metric-types';
import { dispatchMetric, metricPeriod } from './private/metric-util';
import { dropUndefined } from './private/object';
import { MetricSet } from './private/rendering';
import { normalizeStatistic, parseStatistic } from './private/statistic';
import { ArnFormat, Lazy, Stack, Token, Annotations, ValidationError } from '../../core';
import { addConstructMetadata, MethodMetadata } from '../../core/lib/metadata-resource';

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
 * Properties for Anomaly Detection Alarms
 */
export interface AnomalyDetectionAlarmProps extends CreateAnomalyDetectionAlarmProps {
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
  /**
   * Specified statistic is greater than or equal to the threshold
   */
  GREATER_THAN_OR_EQUAL_TO_THRESHOLD = 'GreaterThanOrEqualToThreshold',

  /**
   * Specified statistic is strictly greater than the threshold
   */
  GREATER_THAN_THRESHOLD = 'GreaterThanThreshold',

  /**
   * Specified statistic is strictly less than the threshold
   */
  LESS_THAN_THRESHOLD = 'LessThanThreshold',

  /**
   * Specified statistic is less than or equal to the threshold.
   */
  LESS_THAN_OR_EQUAL_TO_THRESHOLD = 'LessThanOrEqualToThreshold',

  /**
   * Specified statistic is lower than or greater than the anomaly model band.
   * Used only for alarms based on anomaly detection models
   */
  LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD = 'LessThanLowerOrGreaterThanUpperThreshold',

  /**
   * Specified statistic is greater than the anomaly model band.
   * Used only for alarms based on anomaly detection models
   */
  GREATER_THAN_UPPER_THRESHOLD = 'GreaterThanUpperThreshold',

  /**
   * Specified statistic is lower than the anomaly model band.
   * Used only for alarms based on anomaly detection models
   */
  LESS_THAN_LOWER_THRESHOLD = 'LessThanLowerThreshold',
}

const OPERATOR_SYMBOLS: { [key: string]: string } = {
  GreaterThanOrEqualToThreshold: '>=',
  GreaterThanThreshold: '>',
  LessThanThreshold: '<',
  LessThanOrEqualToThreshold: '<=',
};

const ANOMALY_DETECTION_OPERATORS: ComparisonOperator[] = [
  ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
  ComparisonOperator.GREATER_THAN_UPPER_THRESHOLD,
  ComparisonOperator.LESS_THAN_LOWER_THRESHOLD,
];

/**
 * Conventional value for the threshold property when creating anomaly detection alarms.
 * This value is required by the CDK API but completely ignored by CloudWatch for anomaly detection alarms.
 */
const THRESHOLD_IGNORED_FOR_ANOMALY_DETECTION = 0;

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
  MISSING = 'missing',
}

/**
 * An alarm on a CloudWatch metric
 */
export class Alarm extends AlarmBase {
  /**
   * Import an existing CloudWatch alarm provided an Name.
   *
   * @param scope The parent creating construct (usually `this`)
   * @param id The construct's name
   * @param alarmName Alarm Name
   */
  public static fromAlarmName(scope: Construct, id: string, alarmName: string): IAlarm {
    const stack = Stack.of(scope);

    return this.fromAlarmArn(scope, id, stack.formatArn({
      service: 'cloudwatch',
      resource: 'alarm',
      resourceName: alarmName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    }));
  }

  /**
   * Import an existing CloudWatch alarm provided an ARN
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name
   * @param alarmArn Alarm ARN (i.e. arn:aws:cloudwatch:<region>:<account-id>:alarm:Foo)
   */
  public static fromAlarmArn(scope: Construct, id: string, alarmArn: string): IAlarm {
    class Import extends AlarmBase implements IAlarm {
      public readonly alarmArn = alarmArn;
      public readonly alarmName = Stack.of(scope).splitArn(alarmArn, ArnFormat.COLON_RESOURCE_NAME).resourceName!;
    }
    return new Import(scope, id);
  }

  /**
   * Check if a metric is already an anomaly detection metric
   *
   * This checks if the metric is a MathExpression with an ANOMALY_DETECTION_BAND expression
   */
  public static isAnomalyDetectionMetric(metric: IMetric): boolean {
    let isAnomalyDetection = false;

    dispatchMetric(metric, {
      withStat() {
        // Not an anomaly detection metric
        isAnomalyDetection = false;
      },
      withExpression(expr) {
        // Check if the expression is an anomaly detection band
        isAnomalyDetection = expr.expression.includes('ANOMALY_DETECTION_BAND');
      },
    });

    return isAnomalyDetection;
  }

  /**
   * Determine whether this operator is an anomaly detection operator.
   *
   * @param operator the comparison operator for the alarm.
   * @returns true if the operator is an anomaly detection operator, false otherwise.
   */
  public static isAnomalyDetectionOperator(operator?: ComparisonOperator): boolean {
    return operator !== undefined && ANOMALY_DETECTION_OPERATORS.includes(operator);
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

  /**
   * This metric as an annotation
   */
  private readonly annotation: HorizontalAnnotation;

  constructor(scope: Construct, id: string, props: AlarmProps) {
    super(scope, id, {
      physicalName: props.alarmName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    const comparisonOperator = props.comparisonOperator || ComparisonOperator.GREATER_THAN_OR_EQUAL_TO_THRESHOLD;
    const isAnomalyDetection = Alarm.isAnomalyDetectionOperator(comparisonOperator);

    if (isAnomalyDetection && !Alarm.isAnomalyDetectionMetric(props.metric)) {
      throw new ValidationError(
        'Anomaly detection operators require an anomaly detection metric. Use the construct AnomalyDetectionAlarm or wrap your metric in an ANOMALY_DETECTION_BAND expression.',
        this,
      );
    }

    // Validate alarm configuration based on the type of alarm
    if (isAnomalyDetection) {
      // For now the property `threshold` is required, so checking it against 'undefined' is a bit of a stretch, but reasonable.
      if (props.threshold !== undefined && props.threshold !== THRESHOLD_IGNORED_FOR_ANOMALY_DETECTION) {
        Annotations.of(this).addWarningV2(
          'aws-cdk-lib/aws-cloudwatch:thresholdIgnoredForAnomalyDetection',
          'threshold is not used for anomaly detection alarms and will be ignored. Consider using the construct AnomalyDetectionAlarm.',
        );
      }
    } else {
      // For standard alarms, we need a threshold
      if (props.threshold === undefined) {
        throw new ValidationError('threshold must be specified for standard alarms', this);
      }
    }

    // Render metric, process potential overrides from the alarm
    // (It would be preferable if the statistic etc. was worked into the metric,
    // but hey we're allowing overrides...)
    const metricProps: Writeable<Partial<CfnAlarmProps>> = this.renderMetric(props.metric);
    if (props.period) {
      metricProps.period = props.period.toSeconds();
    }
    if (props.statistic) {
      // Will overwrite both fields if present
      Object.assign(metricProps, {
        statistic: renderIfSimpleStatistic(props.statistic),
        extendedStatistic: renderIfExtendedStatistic(props.statistic),
      });
    }

    const threshold = isAnomalyDetection ?
      undefined :
      props.threshold;

    const thresholdMetricId = isAnomalyDetection ?
      this.getThresholdMetricIdForCfnAlarmProps(metricProps.metrics as CfnAlarm.MetricDataQueryProperty[]) :
      undefined;

    const alarm = new CfnAlarm(this, 'Resource', {
      // Meta
      alarmDescription: props.alarmDescription,
      alarmName: this.physicalName,

      // Evaluation
      comparisonOperator,
      threshold: threshold,
      thresholdMetricId: thresholdMetricId,
      datapointsToAlarm: props.datapointsToAlarm,
      evaluateLowSampleCountPercentile: props.evaluateLowSampleCountPercentile,
      evaluationPeriods: props.evaluationPeriods,
      treatMissingData: props.treatMissingData,

      // Actions
      actionsEnabled: props.actionsEnabled,
      alarmActions: Lazy.list({ produce: () => this.alarmActionArns }),
      insufficientDataActions: Lazy.list({ produce: (() => this.insufficientDataActionArns) }),
      okActions: Lazy.list({ produce: () => this.okActionArns }),

      // Metric
      ...metricProps,
    });

    if (isAnomalyDetection) {
      this.ensureAnomalyMetricsReturnData(alarm);
    }

    this.alarmArn = this.getResourceArnAttribute(alarm.attrArn, {
      service: 'cloudwatch',
      resource: 'alarm',
      resourceName: this.physicalName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });

    this.alarmName = this.getResourceNameAttribute(alarm.ref);

    this.metric = props.metric;

    if (isAnomalyDetection) {
      this.annotation = {
        value: THRESHOLD_IGNORED_FOR_ANOMALY_DETECTION,
        label: 'Anomaly Detection Band',
        visible: false,
      };
    } else {
      const datapoints = props.datapointsToAlarm || props.evaluationPeriods;
      this.annotation = {
        // eslint-disable-next-line max-len
        label: `${props.metric} ${OPERATOR_SYMBOLS[comparisonOperator]} ${props.threshold} for ${datapoints} datapoints within ${describePeriod(props.evaluationPeriods * metricPeriod(props.metric).toSeconds())}`,
        value: props.threshold,
      };
    }

    for (const [i, message] of Object.entries(this.metric.warningsV2 ?? {})) {
      Annotations.of(this).addWarningV2(i, message);
    }
  }

  /**
   * Provide custom logic for determining the thresholdMetricId for anomaly detection alarms.
   *
   * @param metrics - The array of metric data queries to validate against
   * @returns The threshold metric ID to use for the anomaly detection alarm
   */
  private getThresholdMetricIdForCfnAlarmProps(metrics: CfnAlarm.MetricDataQueryProperty[]): string | undefined {
    // Try to find the correct metric id from metrics
    const anomalyBandMetric = metrics?.find(m => m.expression && m.expression.includes('ANOMALY_DETECTION_BAND'));

    if (anomalyBandMetric && anomalyBandMetric.id) {
      const thresholdMetricId = anomalyBandMetric.id;
      return thresholdMetricId;
    } else {
      // This should never happen with AnomalyDetectionAlarm since we create the metrics internally
      throw new ValidationError('Could not determine thresholdMetricId for anomaly detection alarm.', this);
    }
  }

  /**
   * Ensures that both the anomaly detection band metric and its source metric have returnData set to true.
   *
   * For anomaly detection alarms to work correctly, both the anomaly detection band metric and the source metric
   * it references must have their returnData property set to true. This is because:
   * 1. The anomaly detection band metric (referenced by thresholdMetricId) needs to return data to be used as the threshold
   * 2. The source metric needs to return data to be compared against the anomaly band
   *
   * This method:
   * 1. Finds the anomaly detection band metric in the metrics array
   * 2. Sets returnData: true for the band metric
   * 3. Extracts the source metric ID from the band's expression
   * 4. Finds the source metric and sets returnData: true for it
   *
   * @param alarm - The CloudWatch alarm to configure
   * @throws {ValidationError} if the anomaly detection band or source metric cannot be found
   */
  private ensureAnomalyMetricsReturnData(alarm: CfnAlarm): void {
    const cfnMetrics = alarm.metrics as CfnAlarm.MetricDataQueryProperty[];
    if (!cfnMetrics || cfnMetrics.length < 2) {
      throw new ValidationError('Anomaly detection alarms require at least two metrics: the source metric and the anomaly detection band.', this);
    }

    // Find the anomaly detection band metric
    const anomalyBandMetric = cfnMetrics.find(m => m.expression && m.expression.includes('ANOMALY_DETECTION_BAND'));
    if (!anomalyBandMetric) {
      throw new ValidationError('Could not find anomaly detection band metric. Anomaly detection alarms require a metric with an expression containing ANOMALY_DETECTION_BAND.', this);
    }

    // Set returnData: true for the anomaly band metric
    (anomalyBandMetric as any).returnData = true;

    // Extract the ID of the source metric from the expression
    const match = anomalyBandMetric.expression?.match(/ANOMALY_DETECTION_BAND\(([^,]+)/);
    if (!match || !match[1]) {
      throw new ValidationError(`Could not extract source metric ID from anomaly detection band expression: ${anomalyBandMetric.expression}`, this);
    }

    const sourceMetricId = match[1].trim();

    // Find the source metric and set returnData: true
    const sourceMetric = cfnMetrics.find(m => m.id === sourceMetricId);
    if (!sourceMetric) {
      throw new ValidationError(`Could not find source metric with ID "${sourceMetricId}" referenced in anomaly detection band.`, this);
    }

    (sourceMetric as any).returnData = true;
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
  @MethodMetadata()
  public toAnnotation(): HorizontalAnnotation {
    return this.annotation;
  }

  /**
   * Trigger this action if the alarm fires
   *
   * Typically SnsAction or AutoScalingAction.
   */
  @MethodMetadata()
  public addAlarmAction(...actions: IAlarmAction[]) {
    if (this.alarmActionArns === undefined) {
      this.alarmActionArns = [];
    }

    this.alarmActionArns.push(...actions.map(a =>
      this.validateActionArn(a.bind(this, this).alarmActionArn),
    ));
  }

  private validateActionArn(actionArn: string): string {
    const ec2ActionsRegexp: RegExp = /arn:aws[a-z0-9-]*:automate:[a-z|\d|-]+:ec2:[a-z]+/;
    if (ec2ActionsRegexp.test(actionArn)) {
      // Check per-instance metric
      const metricConfig = this.metric.toMetricConfig();
      if (metricConfig.metricStat?.dimensions?.length != 1 || !metricConfig.metricStat?.dimensions?.some(dimension => dimension.name === 'InstanceId')) {
        throw new ValidationError(`EC2 alarm actions requires an EC2 Per-Instance Metric. (${JSON.stringify(metricConfig)} does not have an 'InstanceId' dimension)`, this);
      }
    }
    return actionArn;
  }

  private renderMetric(metric: IMetric) {
    const self = this;
    return dispatchMetric(metric, {
      withStat(stat, conf) {
        self.validateMetricStat(stat, metric);
        const canRenderAsLegacyMetric = conf.renderingProperties?.label == undefined && !self.requiresAccountId(stat);
        // Do this to disturb existing templates as little as possible
        if (canRenderAsLegacyMetric) {
          return dropUndefined({
            dimensions: stat.dimensions,
            namespace: stat.namespace,
            metricName: stat.metricName,
            period: stat.period?.toSeconds(),
            statistic: renderIfSimpleStatistic(stat.statistic),
            extendedStatistic: renderIfExtendedStatistic(stat.statistic),
            unit: stat.unitFilter,
          });
        }

        return {
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
              id: 'm1',
              accountId: self.requiresAccountId(stat) ? stat.account : undefined,
              label: conf.renderingProperties?.label,
              returnData: true,
            } as CfnAlarm.MetricDataQueryProperty,
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
                accountId: self.requiresAccountId(stat) ? stat.account : undefined,
                label: conf.renderingProperties?.label,
                returnData: entry.tag ? undefined : false, // entry.tag evaluates to true if the metric is the math expression the alarm is based on.
              };
            },
            withExpression(expr, conf) {
              const hasSubmetrics = mathExprHasSubmetrics(expr);

              if (hasSubmetrics) {
                assertSubmetricsCount(self, expr);
              }

              self.validateMetricExpression(expr);

              return {
                expression: expr.expression,
                id: entry.id || uniqueMetricId(),
                label: conf.renderingProperties?.label,
                period: hasSubmetrics ? undefined : expr.period,
                returnData: entry.tag ? undefined : false, // entry.tag evaluates to true if the metric is the math expression the alarm is based on.
              };
            },
          }) as CfnAlarm.MetricDataQueryProperty),
        };
      },
    });
  }

  /**
   * Validate that if a region is in the given stat config, they match the Alarm
   */
  private validateMetricStat(stat: MetricStatConfig, metric: IMetric) {
    const stack = Stack.of(this);

    if (definitelyDifferent(stat.region, stack.region)) {
      throw new ValidationError(`Cannot create an Alarm in region '${stack.region}' based on metric '${metric}' in '${stat.region}'`, this);
    }
  }

  /**
   * Validates that the expression config does not specify searchAccount or searchRegion props
   * as search expressions are not supported by Alarms.
   */
  private validateMetricExpression(expr: MetricExpressionConfig) {
    if (expr.searchAccount !== undefined || expr.searchRegion !== undefined) {
      throw new ValidationError('Cannot create an Alarm based on a MathExpression which specifies a searchAccount or searchRegion', this);
    }
  }

  /**
   * Determine if the accountId property should be included in the metric.
   */
  private requiresAccountId(stat: MetricStatConfig): boolean {
    const stackAccount = Stack.of(this).account;

    // if stat.account is undefined, it's by definition in the same account
    if (stat.account === undefined) {
      return false;
    }

    // Return true if they're different. The ACCOUNT_ID token is interned
    // so will always have the same string value (and even if we guess wrong
    // it will still work).
    return stackAccount !== stat.account;
  }
}

/**
 * CloudWatch Alarm that uses anomaly detection to trigger alarms
 *
 * This alarm type is specifically designed for use with anomaly detection operators
 * like LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD.
 */
export class AnomalyDetectionAlarm extends Alarm {
  /**
   * Creates an anomaly detection metric from the provided metric
   *
   * @param scope The construct scope
   * @param props The anomaly detection alarm properties
   * @returns An anomaly detection metric
   */
  static createAnomalyDetectionMetric(scope: Construct, props: AnomalyDetectionAlarmProps): IMetric {
    // Validate stdDevs
    if (props.stdDevs !== undefined && props.stdDevs <= 0) {
      throw new ValidationError('stdDevs must be greater than 0', scope);
    }

    if (!Alarm.isAnomalyDetectionOperator(props.comparisonOperator)) {
      throw new ValidationError(`Invalid comparison operator for anomaly detection alarm: ${props.comparisonOperator}`, scope);
    }

    // Create the anomaly detection band expression
    const anomalyDetectionExpression = new MathExpression({
      expression: `ANOMALY_DETECTION_BAND(m0, ${props.stdDevs ?? 2})`,
      usingMetrics: { m0: props.metric },
      period: props.period,
      label: 'Anomaly Detection Band',
    });

    return anomalyDetectionExpression;
  }

  constructor(scope: Construct, id: string, props: AnomalyDetectionAlarmProps) {
    super(scope, id, {
      ...props,
      metric: AnomalyDetectionAlarm.createAnomalyDetectionMetric(scope, props),
      threshold: THRESHOLD_IGNORED_FOR_ANOMALY_DETECTION,
    });
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
    return normalizeStatistic(parsed);
  }
  return undefined;
}

function renderIfExtendedStatistic(statistic?: string): string | undefined {
  if (statistic === undefined) { return undefined; }

  const parsed = parseStatistic(statistic);
  if (parsed.type === 'simple') {
    // This statistic will have been rendered by renderIfSimpleStatistic
    return undefined;
  }

  if (parsed.type === 'single' || parsed.type === 'pair') {
    return normalizeStatistic(parsed);
  }

  // We can't not render anything here. Just put whatever we got as input into
  // the ExtendedStatistic and hope it's correct. Either that, or we throw
  // an error.
  return parsed.statistic;
}

function mathExprHasSubmetrics(expr: MetricExpressionConfig) {
  return Object.keys(expr.usingMetrics).length > 0;
}

function assertSubmetricsCount(scope: Construct, expr: MetricExpressionConfig) {
  if (Object.keys(expr.usingMetrics).length > 10) {
    // https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarms-on-metric-math-expressions
    throw new ValidationError('Alarms on math expressions cannot contain more than 10 individual metrics', scope);
  }
}

type Writeable<T> = { -readonly [P in keyof T]: T[P] };
