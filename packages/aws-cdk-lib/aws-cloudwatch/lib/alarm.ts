import { Construct } from 'constructs';
import { IAlarmAction } from './alarm-action';
import { AlarmBase, IAlarm } from './alarm-base';
import { CfnAlarm, CfnAlarmProps } from './cloudwatch.generated';
import { HorizontalAnnotation } from './graph';
import { CreateAlarmOptions, Metric } from './metric';
import { IMetric, MetricExpressionConfig, MetricStatConfig } from './metric-types';
import { CreateAlarmOptionsBase } from './private/alarm-options';
import { isAnomalyDetectionOperator } from './private/anomaly-detection';
import { dispatchMetric, metricPeriod } from './private/metric-util';
import { dropUndefined } from './private/object';
import { MetricSet } from './private/rendering';
import { normalizeStatistic, parseStatistic } from './private/statistic';
import { ArnFormat, Lazy, Stack, Token, Annotations, ValidationError, AssumptionError } from '../../core';
import { addConstructMetadata, MethodMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

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
export interface AnomalyDetectionAlarmProps extends CreateAlarmOptionsBase {
  /**
   * The metric to add the alarm on
   *
   * Metric objects can be obtained from most resources, or you can construct
   * custom Metric objects by instantiating one.
   */
  readonly metric: IMetric;

  /**
   * The number of standard deviations to use for the anomaly detection band. The higher the value, the wider the band.
   *
   * - Must be greater than 0. A value of 0 or negative values would not make sense in the context of calculating standard deviations.
   * - There is no strict maximum value defined, as standard deviations can theoretically extend infinitely. However, in practice, values beyond 5 or 6 standard deviations are rarely used, as they would result in an extremely wide anomaly detection band, potentially missing significant anomalies.
   *
   * @default 2
   */
  readonly stdDevs?: number;

  /**
   * Comparison operator to use to check if metric is breaching.
   * Must be one of the anomaly detection operators:
   * - LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD
   * - GREATER_THAN_UPPER_THRESHOLD
   * - LESS_THAN_LOWER_THRESHOLD
   *
   * @default LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD
   */
  readonly comparisonOperator?: ComparisonOperator;
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
@propertyInjectable
export class Alarm extends AlarmBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-cloudwatch.Alarm';

  /**
   * Conventional value for the threshold property when creating anomaly detection alarms.
   *
   * Anomaly detection alarms don't have numbered threshold. Instead, they have a dynamically
   * calculated threshold based on the metric math expression that contains a metric expression.
   *
   * The `threshold` property is required, but the value is ignored. This
   * constant has the value 0, and has a symbolic name to indicate why the
   * threshold is 0. You can use `new AnomalyDetectionAlarm()` to avoid having to pass
   * the `threshold` property at all.
   */
  public static readonly ANOMALY_DETECTION_NO_THRESHOLD = 0;

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
    const isAnomalyDetection = isAnomalyDetectionOperator(comparisonOperator);

    let threshold: number | undefined; // For a literal threshold value
    let thresholdMetricId: string | undefined; // For anomaly detection
    if (isAnomalyDetection) {
      if (!isAnomalyDetectionMetric(props.metric)) {
        throw new ValidationError(
          `Anomaly detection operator ${comparisonOperator} requires an ANOMALY_DETECTION_BAND() metric. Use the construct AnomalyDetectionAlarm or wrap your metric in an ANOMALY_DETECTION_BAND expression.`,
          this,
        );
      }

      // For now the property `threshold` is required, so checking it against 'undefined' is a bit of a stretch, but reasonable.
      if (props.threshold !== undefined && props.threshold !== Alarm.ANOMALY_DETECTION_NO_THRESHOLD) {
        Annotations.of(this).addWarningV2(
          'aws-cdk-lib/aws-cloudwatch:thresholdIgnoredForAnomalyDetection',
          'threshold is unused for anomaly detection alarms. Use \'Alarm.ANOMALY_DETECTION_NO_THRESHOLD\' or use the AnomalyDetectionAlarm construct.',
        );
      }

      // thresholdMetricId will be assigned below (only becomes available after rendering)
    } else {
      if (isAnomalyDetectionMetric(props.metric)) {
        throw new ValidationError(
          `Fixed threshold operator ${props.comparisonOperator} can not be used with an ANOMALY_DETECTION_BAND() math expression; use an anomaly threshold operator instead.`,
          this,
        );
      }

      // For standard alarms, we need a threshold
      if (props.threshold === undefined) {
        throw new ValidationError('threshold must be specified for standard alarms', this);
      }

      threshold = props.threshold;
    }

    // Render metric, process potential overrides from the alarm
    // (It would be preferable if the statistic etc. was worked into the metric,
    // but hey we're allowing overrides...)
    const rendered = this.renderMetric(props.metric, isAnomalyDetection);
    const metricProps: Writeable<Partial<CfnAlarmProps>> = rendered.props;
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

    if (isAnomalyDetection) {
      // Only available after rendering
      thresholdMetricId = rendered.primaryId;
    }

    const alarm = new CfnAlarm(this, 'Resource', {
      // Meta
      alarmDescription: props.alarmDescription,
      alarmName: this.physicalName,

      // Evaluation
      comparisonOperator,
      threshold,
      thresholdMetricId,
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

    this.alarmArn = this.getResourceArnAttribute(alarm.attrArn, {
      service: 'cloudwatch',
      resource: 'alarm',
      resourceName: this.physicalName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });

    this.alarmName = this.getResourceNameAttribute(alarm.ref);

    this.metric = props.metric;

    if (isAnomalyDetection) {
      // We made it required to be able to convert an Alarms to an Annotation, but there is no useful annotation for us to use here.
      this.annotation = {
        value: Alarm.ANOMALY_DETECTION_NO_THRESHOLD,
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

  /**
   * Render the given metric to properties of CfnAlarmProps
   *
   * - Tries to render to the legacy fields if possible (to not unduly change
   *   existing templates from before the modern fields were added).
   * - If the metric is a math expression that depends on other metrics, recursively
   *   render all of them to the `metrics[]` array.
   *
   * Returns the alarm fields, as well as the 'id' that was assigned to the primary metric
   * (if rendering to the modern fields, because the legacy fields don't have an id).
   *
   * The metric we are trying to render (potentially) forms a tree that looks like this
   * (the example doesn't make sense but it shows the data structures)
   *
   * ```
   *    +-- MathExpression('m1 + m2')
   *          |
   *          +--- m1: MetricStat('AWS/DynamoDB', 'Errors', 'SUM')
   *          +--- m2: MathExpression('m3 * m4')
   *                     |
   *                     +--- m3: MetricStat('AWS/DynamoDB', 'BytesWritten', 'AVG')
   *                     +--- m4: MetricStat('AWS/SQS', 'MessagesReceived', 'MIN')
   * ```
   *
   * `metric` is the root of this metric tree, and we need to render this to a
   * flat list of 5 `MetricData` objects where we make sure that all metrics
   * have a (unique) identifier assigned and only the root one has `ReturnData:
   * true` set.
   *
   * ## doubleReturnData
   *
   * Normally, exactly one metric in the list needs to have `ReturnData: true` set, and it's
   * the "primary" metric, i.e., the metric that the actual alarm should trigger on. There is
   * an exception to this rule: for anomaly detection alarms, both the anomaly detection
   * math expression *AND* the metric that the expression is based on must have `ReturnData: true`
   * set.
   *
   * This flag controls whether we set `ReturnData: true` only on the top-level math expression, or
   * on both the top-level and the second-level expression.
   */
  private renderMetric(metric: IMetric, doubleReturnData: boolean): { props: AlarmMetricFields; primaryId?: string } {
    const returnDataLevel = doubleReturnData ? 2 : 1;

    const self = this;
    return dispatchMetric(metric, {
      withStat(stat, conf) {
        self.validateMetricStat(stat, metric);
        const canRenderAsLegacyMetric = conf.renderingProperties?.label == undefined && !self.requiresAccountId(stat);
        // Do this to disturb existing templates as little as possible
        if (canRenderAsLegacyMetric) {
          return {
            props: dropUndefined({
              dimensions: stat.dimensions,
              namespace: stat.namespace,
              metricName: stat.metricName,
              period: stat.period?.toSeconds(),
              statistic: renderIfSimpleStatistic(stat.statistic),
              extendedStatistic: renderIfExtendedStatistic(stat.statistic),
              unit: stat.unitFilter,
            } satisfies AlarmMetricFields),
            primaryId: undefined,
          };
        }

        return {
          props: {
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
                label: conf.renderingProperties?.label as string,
                returnData: true,
              } as CfnAlarm.MetricDataQueryProperty,
            ],
          } satisfies AlarmMetricFields,
          primaryId: 'm1',
        };
      },

      withMathExpression: () => {
        // Expand the math expression metric into a set
        const mset = new MetricSet<boolean>();
        mset.addTopLevel(true, metric);

        let eid = 0;
        function uniqueMetricId() {
          return `expr_${++eid}`;
        }

        let primaryId: string | undefined;
        const props = {
          metrics: mset.entries.map(entry => {
            const id = entry.id || uniqueMetricId();

            if (entry.tag) {
              primaryId = id;
            }

            const returnData = entry.level <= returnDataLevel;

            return dispatchMetric(entry.metric, {
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
                  id,
                  accountId: self.requiresAccountId(stat) ? stat.account : undefined,
                  label: conf.renderingProperties?.label as string,
                  returnData,
                };
              },
              withMathExpression(mathExpr, conf) {
                const hasSubmetrics = mathExprHasSubmetrics(mathExpr);

                if (hasSubmetrics) {
                  assertSubmetricsCount(self, mathExpr);
                }

                self.validateMetricExpression(mathExpr);

                return {
                  expression: mathExpr.expression,
                  id,
                  label: conf.renderingProperties?.label as string,
                  period: hasSubmetrics ? undefined : mathExpr.period,
                  returnData,
                };
              },
              withSearchExpression: (_searchExpr, _conf) => {
                throw new ValidationError('Search expressions are not supported in CloudWatch Alarms. Use search expressions only in dashboard graphs.', this);
              },
            });
          }),
        } satisfies AlarmMetricFields;

        if (!primaryId) {
          throw new AssumptionError('Expected at least one metric to be the primary');
        }

        return { props, primaryId };
      },
      withSearchExpression: () => {
        throw new ValidationError('Search expressions are not supported in CloudWatch Alarms. Use search expressions only in dashboard graphs.', this);
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
 * The fields an CfnAlarm that represent a Metric
 *
 * "Legacy" metrics are represented with a set of fields at the top level
 * of the Alarm. "Modern" metrics are in a `metrics[]` array in the alarm
 * and have more features, like metric math.
 */
type AlarmMetricFields = Pick<CfnAlarmProps, 'dimensions' | 'namespace' | 'metricName' | 'period' | 'statistic' | 'extendedStatistic' | 'unit' | 'metrics'>

/**
 * Check if a metric is already an anomaly detection metric
 *
 * This checks if the metric is a MathExpression with an ANOMALY_DETECTION_BAND expression
 */
function isAnomalyDetectionMetric(metric: IMetric): boolean {
  let isAnomalyDetection = false;

  dispatchMetric(metric, {
    withStat() {
      // Not an anomaly detection metric
      isAnomalyDetection = false;
    },
    withMathExpression(mathExpr) {
      // Check if the expression is an anomaly detection band
      isAnomalyDetection = mathExpr.expression.includes('ANOMALY_DETECTION_BAND');
    },
    withSearchExpression() {
      // Search expressions return multiple metrics; anomaly is only applicable for a single metric
      isAnomalyDetection = false;
    },
  });

  return isAnomalyDetection;
}

/**
 * CloudWatch Alarm that uses anomaly detection to trigger alarms
 *
 * This alarm type is specifically designed for use with anomaly detection operators
 * like LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD.
 */
@propertyInjectable
export class AnomalyDetectionAlarm extends Alarm {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-cloudwatch.AnomalyDetectionAlarm';

  constructor(scope: Construct, id: string, props: AnomalyDetectionAlarmProps) {
    super(scope, id, {
      ...props,
      comparisonOperator: props.comparisonOperator ?? ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
      metric: Metric.anomalyDetectionFor(props),
      threshold: Alarm.ANOMALY_DETECTION_NO_THRESHOLD,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    if (props.comparisonOperator && !isAnomalyDetectionOperator(props.comparisonOperator)) {
      throw new ValidationError(`Must use one of the anomaly detection operators, got ${props.comparisonOperator}`, this);
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
