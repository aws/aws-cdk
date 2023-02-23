import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct, IConstruct } from 'constructs';
import { Alarm, ComparisonOperator, TreatMissingData } from './alarm';
import { Dimension, IMetric, MetricAlarmConfig, MetricConfig, MetricGraphConfig, Statistic, Unit } from './metric-types';
import { dispatchMetric, metricKey } from './private/metric-util';
import { normalizeStatistic, pairStatisticToString, parseStatistic, singleStatisticToString } from './private/statistic';
import { Stats } from './stats';

export type DimensionHash = { [dim: string]: any };

export type DimensionsMap = { [dim: string]: string };

/**
 * Options shared by most methods accepting metric options
 */
export interface CommonMetricOptions {
  /**
   * The period over which the specified statistic is applied.
   *
   * @default Duration.minutes(5)
   */
  readonly period?: cdk.Duration;

  /**
   * What function to use for aggregating.
   *
   * Use the `aws_cloudwatch.Stats` helper class to construct valid input strings.
   *
   * Can be one of the following:
   *
   * - "Minimum" | "min"
   * - "Maximum" | "max"
   * - "Average" | "avg"
   * - "Sum" | "sum"
   * - "SampleCount | "n"
   * - "pNN.NN"
   * - "tmNN.NN" | "tm(NN.NN%:NN.NN%)"
   * - "iqm"
   * - "wmNN.NN" | "wm(NN.NN%:NN.NN%)"
   * - "tcNN.NN" | "tc(NN.NN%:NN.NN%)"
   * - "tsNN.NN" | "ts(NN.NN%:NN.NN%)"
   *
   * @default Average
   */
  readonly statistic?: string;

  /**
   * Dimensions of the metric
   *
   * @default - No dimensions.
   *
   * @deprecated Use 'dimensionsMap' instead.
   */
  readonly dimensions?: DimensionHash;

  /**
   * Dimensions of the metric
   *
   * @default - No dimensions.
   */
  readonly dimensionsMap?: DimensionsMap;

  /**
   * Unit used to filter the metric stream
   *
   * Only refer to datums emitted to the metric stream with the given unit and
   * ignore all others. Only useful when datums are being emitted to the same
   * metric stream under different units.
   *
   * The default is to use all matric datums in the stream, regardless of unit,
   * which is recommended in nearly all cases.
   *
   * CloudWatch does not honor this property for graphs.
   *
   * @default - All metric datums in the given metric stream
   */
  readonly unit?: Unit;

  /**
   * Label for this metric when added to a Graph in a Dashboard
   *
   * You can use [dynamic labels](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/graph-dynamic-labels.html)
   * to show summary information about the entire displayed time series
   * in the legend. For example, if you use:
   *
   * ```
   * [max: ${MAX}] MyMetric
   * ```
   *
   * As the metric label, the maximum value in the visible range will
   * be shown next to the time series name in the graph's legend.
   *
   * @default - No label
   */
  readonly label?: string;

  /**
   * The hex color code, prefixed with '#' (e.g. '#00ff00'), to use when this metric is rendered on a graph.
   * The `Color` class has a set of standard colors that can be used here.
   * @default - Automatic color
   */
  readonly color?: string;

  /**
   * Account which this metric comes from.
   *
   * @default - Deployment account.
   */
  readonly account?: string;

  /**
   * Region which this metric comes from.
   *
   * @default - Deployment region.
   */
  readonly region?: string;
}

/**
 * Properties for a metric
 */
export interface MetricProps extends CommonMetricOptions {
  /**
   * Namespace of the metric.
   */
  readonly namespace: string;

  /**
   * Name of the metric.
   */
  readonly metricName: string;
}

/**
 * Properties of a metric that can be changed
 */
export interface MetricOptions extends CommonMetricOptions {
}

/**
 * Configurable options for MathExpressions
 */
export interface MathExpressionOptions {
  /**
   * Label for this expression when added to a Graph in a Dashboard
   *
   * If this expression evaluates to more than one time series (for
   * example, through the use of `METRICS()` or `SEARCH()` expressions),
   * each time series will appear in the graph using a combination of the
   * expression label and the individual metric label. Specify the empty
   * string (`''`) to suppress the expression label and only keep the
   * metric label.
   *
   * You can use [dynamic labels](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/graph-dynamic-labels.html)
   * to show summary information about the displayed time series
   * in the legend. For example, if you use:
   *
   * ```
   * [max: ${MAX}] MyMetric
   * ```
   *
   * As the metric label, the maximum value in the visible range will
   * be shown next to the time series name in the graph's legend. If the
   * math expression produces more than one time series, the maximum
   * will be shown for each individual time series produce by this
   * math expression.
   *
   * @default - Expression value is used as label
   */
  readonly label?: string;

  /**
   * Color for this metric when added to a Graph in a Dashboard
   *
   * @default - Automatic color
   */
  readonly color?: string;

  /**
   * The period over which the expression's statistics are applied.
   *
   * This period overrides all periods in the metrics used in this
   * math expression.
   *
   * @default Duration.minutes(5)
   */
  readonly period?: cdk.Duration;

  /**
   * Account to evaluate search expressions within.
   *
   * Specifying a searchAccount has no effect to the account used
   * for metrics within the expression (passed via usingMetrics).
   *
   * @default - Deployment account.
   */
  readonly searchAccount?: string;

  /**
   * Region to evaluate search expressions within.
   *
   * Specifying a searchRegion has no effect to the region used
   * for metrics within the expression (passed via usingMetrics).
   *
   * @default - Deployment region.
   */
  readonly searchRegion?: string;
}

/**
 * Properties for a MathExpression
 */
export interface MathExpressionProps extends MathExpressionOptions {
  /**
   * The expression defining the metric.
   *
   * When an expression contains a SEARCH function, it cannot be used
   * within an Alarm.
   */
  readonly expression: string;

  /**
   * The metrics used in the expression, in a map.
   *
   * The key is the identifier that represents the given metric in the
   * expression, and the value is the actual Metric object.
   *
   * @default - Empty map.
   */
  readonly usingMetrics?: Record<string, IMetric>;
}

/**
 * A metric emitted by a service
 *
 * The metric is a combination of a metric identifier (namespace, name and dimensions)
 * and an aggregation function (statistic, period and unit).
 *
 * It also contains metadata which is used only in graphs, such as color and label.
 * It makes sense to embed this in here, so that compound constructs can attach
 * that metadata to metrics they expose.
 *
 * This class does not represent a resource, so hence is not a construct. Instead,
 * Metric is an abstraction that makes it easy to specify metrics for use in both
 * alarms and graphs.
 */
export class Metric implements IMetric {
  /**
   * Grant permissions to the given identity to write metrics.
   *
   * @param grantee The IAM identity to give permissions to.
   */
  public static grantPutMetricData(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions: ['cloudwatch:PutMetricData'],
      resourceArns: ['*'],
    });
  }

  /** Dimensions of this metric */
  public readonly dimensions?: DimensionHash;
  /** Namespace of this metric */
  public readonly namespace: string;
  /** Name of this metric */
  public readonly metricName: string;
  /** Period of this metric */
  public readonly period: cdk.Duration;
  /** Statistic of this metric */
  public readonly statistic: string;
  /** Label for this metric when added to a Graph in a Dashboard */
  public readonly label?: string;
  /** The hex color code used when this metric is rendered on a graph. */
  public readonly color?: string;

  /** Unit of the metric. */
  public readonly unit?: Unit;

  /** Account which this metric comes from */
  public readonly account?: string;

  /** Region which this metric comes from. */
  public readonly region?: string;

  /** Warnings attached to this metric. */
  public readonly warnings?: string[];

  constructor(props: MetricProps) {
    this.period = props.period || cdk.Duration.minutes(5);
    const periodSec = this.period.toSeconds();
    if (periodSec !== 1 && periodSec !== 5 && periodSec !== 10 && periodSec !== 30 && periodSec % 60 !== 0) {
      throw new Error(`'period' must be 1, 5, 10, 30, or a multiple of 60 seconds, received ${periodSec}`);
    }

    this.warnings = undefined;
    this.dimensions = this.validateDimensions(props.dimensionsMap ?? props.dimensions);
    this.namespace = props.namespace;
    this.metricName = props.metricName;

    const parsedStat = parseStatistic(props.statistic || Stats.AVERAGE);
    if (parsedStat.type === 'generic') {
      // Unrecognized statistic, do not throw, just warn
      // There may be a new statistic that this lib does not support yet
      const label = props.label ? `, label "${props.label}"`: '';
      this.warnings = [
        `Unrecognized statistic "${props.statistic}" for metric with namespace "${props.namespace}"${label} and metric name "${props.metricName}".` +
          ' Preferably use the `aws_cloudwatch.Stats` helper class to specify a statistic.' +
          ' You can ignore this warning if your statistic is valid but not yet supported by the `aws_cloudwatch.Stats` helper class.',
      ];
    }
    this.statistic = normalizeStatistic(parsedStat);

    this.label = props.label;
    this.color = props.color;
    this.unit = props.unit;
    this.account = props.account;
    this.region = props.region;
  }

  /**
   * Return a copy of Metric `with` properties changed.
   *
   * All properties except namespace and metricName can be changed.
   *
   * @param props The set of properties to change.
   */
  public with(props: MetricOptions): Metric {
    // Short-circuit creating a new object if there would be no effective change
    if ((props.label === undefined || props.label === this.label)
      && (props.color === undefined || props.color === this.color)
      && (props.statistic === undefined || props.statistic === this.statistic)
      && (props.unit === undefined || props.unit === this.unit)
      && (props.account === undefined || props.account === this.account)
      && (props.region === undefined || props.region === this.region)
      // For these we're not going to do deep equality, misses some opportunity for optimization
      // but that's okay.
      && (props.dimensions === undefined)
      && (props.dimensionsMap === undefined)
      && (props.period === undefined || props.period.toSeconds() === this.period.toSeconds())) {
      return this;
    }

    return new Metric({
      dimensionsMap: props.dimensionsMap ?? props.dimensions ?? this.dimensions,
      namespace: this.namespace,
      metricName: this.metricName,
      period: ifUndefined(props.period, this.period),
      statistic: ifUndefined(props.statistic, this.statistic),
      unit: ifUndefined(props.unit, this.unit),
      label: ifUndefined(props.label, this.label),
      color: ifUndefined(props.color, this.color),
      account: ifUndefined(props.account, this.account),
      region: ifUndefined(props.region, this.region),
    });
  }

  /**
   * Attach the metric object to the given construct scope
   *
   * Returns a Metric object that uses the account and region from the Stack
   * the given construct is defined in. If the metric is subsequently used
   * in a Dashboard or Alarm in a different Stack defined in a different
   * account or region, the appropriate 'region' and 'account' fields
   * will be added to it.
   *
   * If the scope we attach to is in an environment-agnostic stack,
   * nothing is done and the same Metric object is returned.
   */
  public attachTo(scope: IConstruct): Metric {
    const stack = cdk.Stack.of(scope);

    return this.with({
      region: cdk.Token.isUnresolved(stack.region) ? undefined : stack.region,
      account: cdk.Token.isUnresolved(stack.account) ? undefined : stack.account,
    });
  }

  public toMetricConfig(): MetricConfig {
    const dims = this.dimensionsAsList();
    return {
      metricStat: {
        dimensions: dims.length > 0 ? dims : undefined,
        namespace: this.namespace,
        metricName: this.metricName,
        period: this.period,
        statistic: this.statistic,
        unitFilter: this.unit,
        account: this.account,
        region: this.region,
      },
      renderingProperties: {
        color: this.color,
        label: this.label,
      },
    };
  }

  /** @deprecated use toMetricConfig() */
  public toAlarmConfig(): MetricAlarmConfig {
    const metricConfig = this.toMetricConfig();
    if (metricConfig.metricStat === undefined) {
      throw new Error('Using a math expression is not supported here. Pass a \'Metric\' object instead');
    }

    const parsed = parseStatistic(metricConfig.metricStat.statistic);

    let extendedStatistic: string | undefined = undefined;
    if (parsed.type === 'single') {
      extendedStatistic = singleStatisticToString(parsed);
    } else if (parsed.type === 'pair') {
      extendedStatistic = pairStatisticToString(parsed);
    }

    return {
      dimensions: metricConfig.metricStat.dimensions,
      namespace: metricConfig.metricStat.namespace,
      metricName: metricConfig.metricStat.metricName,
      period: metricConfig.metricStat.period.toSeconds(),
      statistic: parsed.type === 'simple' ? parsed.statistic as Statistic : undefined,
      extendedStatistic,
      unit: this.unit,
    };
  }

  /**
   * @deprecated use toMetricConfig()
   */
  public toGraphConfig(): MetricGraphConfig {
    const metricConfig = this.toMetricConfig();
    if (metricConfig.metricStat === undefined) {
      throw new Error('Using a math expression is not supported here. Pass a \'Metric\' object instead');
    }

    return {
      dimensions: metricConfig.metricStat.dimensions,
      namespace: metricConfig.metricStat.namespace,
      metricName: metricConfig.metricStat.metricName,
      renderingProperties: {
        period: metricConfig.metricStat.period.toSeconds(),
        stat: metricConfig.metricStat.statistic,
        color: asString(metricConfig.renderingProperties?.color),
        label: asString(metricConfig.renderingProperties?.label),
      },
      // deprecated properties for backwards compatibility
      period: metricConfig.metricStat.period.toSeconds(),
      statistic: metricConfig.metricStat.statistic,
      color: asString(metricConfig.renderingProperties?.color),
      label: asString(metricConfig.renderingProperties?.label),
      unit: this.unit,
    };
  }

  /**
   * Make a new Alarm for this metric
   *
   * Combines both properties that may adjust the metric (aggregation) as well
   * as alarm properties.
   */
  public createAlarm(scope: Construct, id: string, props: CreateAlarmOptions): Alarm {
    return new Alarm(scope, id, {
      metric: this.with({
        statistic: props.statistic,
        period: props.period,
      }),
      alarmName: props.alarmName,
      alarmDescription: props.alarmDescription,
      comparisonOperator: props.comparisonOperator,
      datapointsToAlarm: props.datapointsToAlarm,
      threshold: props.threshold,
      evaluationPeriods: props.evaluationPeriods,
      evaluateLowSampleCountPercentile: props.evaluateLowSampleCountPercentile,
      treatMissingData: props.treatMissingData,
      actionsEnabled: props.actionsEnabled,
    });
  }

  public toString() {
    return this.label || this.metricName;
  }

  /**
   * Return the dimensions of this Metric as a list of Dimension.
   */
  private dimensionsAsList(): Dimension[] {
    const dims = this.dimensions;

    if (dims === undefined) {
      return [];
    }

    const list = Object.keys(dims).sort().map(key => ({ name: key, value: dims[key] }));

    return list;
  }

  private validateDimensions(dims?: DimensionHash): DimensionHash | undefined {
    if (!dims) {
      return dims;
    }

    var dimsArray = Object.keys(dims);
    if (dimsArray?.length > 10) {
      throw new Error(`The maximum number of dimensions is 10, received ${dimsArray.length}`);
    }

    dimsArray.map(key => {
      if (dims[key] === undefined || dims[key] === null) {
        throw new Error(`Dimension value of '${dims[key]}' is invalid`);
      };
      if (key.length < 1 || key.length > 255) {
        throw new Error(`Dimension name must be at least 1 and no more than 255 characters; received ${key}`);
      };

      if (dims[key].length < 1 || dims[key].length > 255) {
        throw new Error(`Dimension value must be at least 1 and no more than 255 characters; received ${dims[key]}`);
      };
    });

    return dims;
  }
}

function asString(x?: unknown): string | undefined {
  if (x === undefined) { return undefined; }
  if (typeof x !== 'string') {
    throw new Error(`Expected string, got ${x}`);
  }
  return x;
}

/**
 * A math expression built with metric(s) emitted by a service
 *
 * The math expression is a combination of an expression (x+y) and metrics to apply expression on.
 * It also contains metadata which is used only in graphs, such as color and label.
 * It makes sense to embed this in here, so that compound constructs can attach
 * that metadata to metrics they expose.
 *
 * MathExpression can also be used for search expressions. In this case,
 * it also optionally accepts a searchRegion and searchAccount property for cross-environment
 * search expressions.
 *
 * This class does not represent a resource, so hence is not a construct. Instead,
 * MathExpression is an abstraction that makes it easy to specify metrics for use in both
 * alarms and graphs.
 */
export class MathExpression implements IMetric {
  /**
   * The expression defining the metric.
   */
  public readonly expression: string;

  /**
   * The metrics used in the expression as KeyValuePair <id, metric>.
   */
  public readonly usingMetrics: Record<string, IMetric>;

  /**
   * Label for this metric when added to a Graph.
   */
  public readonly label?: string;

  /**
   * The hex color code, prefixed with '#' (e.g. '#00ff00'), to use when this metric is rendered on a graph.
   * The `Color` class has a set of standard colors that can be used here.
   */
  public readonly color?: string;

  /**
   * Aggregation period of this metric
   */
  public readonly period: cdk.Duration;

  /**
   * Account to evaluate search expressions within.
   */
  public readonly searchAccount?: string;

  /**
   * Region to evaluate search expressions within.
   */
  public readonly searchRegion?: string;

  /**
   * Warnings generated by this math expression
   */
  public readonly warnings?: string[];

  constructor(props: MathExpressionProps) {
    this.period = props.period || cdk.Duration.minutes(5);
    this.expression = props.expression;
    this.usingMetrics = changeAllPeriods(props.usingMetrics ?? {}, this.period);
    this.label = props.label;
    this.color = props.color;
    this.searchAccount = props.searchAccount;
    this.searchRegion = props.searchRegion;

    const invalidVariableNames = Object.keys(this.usingMetrics).filter(x => !validVariableName(x));
    if (invalidVariableNames.length > 0) {
      throw new Error(`Invalid variable names in expression: ${invalidVariableNames}. Must start with lowercase letter and only contain alphanumerics.`);
    }

    this.validateNoIdConflicts();

    // Check that all IDs used in the expression are also in the `usingMetrics` map. We
    // can't throw on this anymore since we didn't use to do this validation from the start
    // and now there will be loads of people who are violating the expected contract, but
    // we can add warnings.
    const missingIdentifiers = allIdentifiersInExpression(this.expression).filter(i => !this.usingMetrics[i]);

    const warnings: string[] = [];

    if (!this.expression.toUpperCase().match('\\s*SELECT|SEARCH|METRICS\\s.*') && missingIdentifiers.length > 0) {
      warnings.push(`Math expression '${this.expression}' references unknown identifiers: ${missingIdentifiers.join(', ')}. Please add them to the 'usingMetrics' map.`);
    }

    // Also copy warnings from deeper levels so graphs, alarms only have to inspect the top-level objects
    for (const m of Object.values(this.usingMetrics)) {
      warnings.push(...m.warnings ?? []);
    }

    if (warnings.length > 0) {
      this.warnings = warnings;
    }
  }

  /**
   * Return a copy of Metric with properties changed.
   *
   * All properties except namespace and metricName can be changed.
   *
   * @param props The set of properties to change.
   */
  public with(props: MathExpressionOptions): MathExpression {
    // Short-circuit creating a new object if there would be no effective change
    if ((props.label === undefined || props.label === this.label)
      && (props.color === undefined || props.color === this.color)
      && (props.period === undefined || props.period.toSeconds() === this.period.toSeconds())
      && (props.searchAccount === undefined || props.searchAccount === this.searchAccount)
      && (props.searchRegion === undefined || props.searchRegion === this.searchRegion)) {
      return this;
    }

    return new MathExpression({
      expression: this.expression,
      usingMetrics: this.usingMetrics,
      label: ifUndefined(props.label, this.label),
      color: ifUndefined(props.color, this.color),
      period: ifUndefined(props.period, this.period),
      searchAccount: ifUndefined(props.searchAccount, this.searchAccount),
      searchRegion: ifUndefined(props.searchRegion, this.searchRegion),
    });
  }

  /**
   * @deprecated use toMetricConfig()
   */
  public toAlarmConfig(): MetricAlarmConfig {
    throw new Error('Using a math expression is not supported here. Pass a \'Metric\' object instead');
  }

  /**
   * @deprecated use toMetricConfig()
   */
  public toGraphConfig(): MetricGraphConfig {
    throw new Error('Using a math expression is not supported here. Pass a \'Metric\' object instead');
  }

  public toMetricConfig(): MetricConfig {
    return {
      mathExpression: {
        period: this.period.toSeconds(),
        expression: this.expression,
        usingMetrics: this.usingMetrics,
        searchAccount: this.searchAccount,
        searchRegion: this.searchRegion,
      },
      renderingProperties: {
        label: this.label,
        color: this.color,
      },
    };
  }

  /**
   * Make a new Alarm for this metric
   *
   * Combines both properties that may adjust the metric (aggregation) as well
   * as alarm properties.
   */
  public createAlarm(scope: Construct, id: string, props: CreateAlarmOptions): Alarm {
    return new Alarm(scope, id, {
      metric: this.with({
        period: props.period,
      }),
      alarmName: props.alarmName,
      alarmDescription: props.alarmDescription,
      comparisonOperator: props.comparisonOperator,
      datapointsToAlarm: props.datapointsToAlarm,
      threshold: props.threshold,
      evaluationPeriods: props.evaluationPeriods,
      evaluateLowSampleCountPercentile: props.evaluateLowSampleCountPercentile,
      treatMissingData: props.treatMissingData,
      actionsEnabled: props.actionsEnabled,
    });
  }

  public toString() {
    return this.label || this.expression;
  }

  private validateNoIdConflicts() {
    const seen = new Map<string, IMetric>();
    visit(this);

    function visit(metric: IMetric) {
      dispatchMetric(metric, {
        withStat() {
          // Nothing
        },
        withExpression(expr) {
          for (const [id, subMetric] of Object.entries(expr.usingMetrics)) {
            const existing = seen.get(id);
            if (existing && metricKey(existing) !== metricKey(subMetric)) {
              throw new Error(`The ID '${id}' used for two metrics in the expression: '${subMetric}' and '${existing}'. Rename one.`);
            }
            seen.set(id, subMetric);
            visit(subMetric);
          }
        },
      });
    }
  }
}

/**
 * Pattern for a variable name. Alphanum starting with lowercase.
 */
const VARIABLE_PAT = '[a-z][a-zA-Z0-9_]*';

const VALID_VARIABLE = new RegExp(`^${VARIABLE_PAT}$`);
const FIND_VARIABLE = new RegExp(VARIABLE_PAT, 'g');

function validVariableName(x: string) {
  return VALID_VARIABLE.test(x);
}

/**
 * Return all variable names used in an expression
 */
function allIdentifiersInExpression(x: string) {
  return Array.from(matchAll(x, FIND_VARIABLE)).map(m => m[0]);
}

/**
 * Properties needed to make an alarm from a metric
 */
export interface CreateAlarmOptions {
  /**
   * The period over which the specified statistic is applied.
   *
   * Cannot be used with `MathExpression` objects.
   *
   * @default - The period from the metric
   * @deprecated Use `metric.with({ period: ... })` to encode the period into the Metric object
   */
  readonly period?: cdk.Duration;

  /**
   * What function to use for aggregating.
   *
   * Can be one of the following:
   *
   * - "Minimum" | "min"
   * - "Maximum" | "max"
   * - "Average" | "avg"
   * - "Sum" | "sum"
   * - "SampleCount | "n"
   * - "pNN.NN"
   *
   * Cannot be used with `MathExpression` objects.
   *
   * @default - The statistic from the metric
   * @deprecated Use `metric.with({ statistic: ... })` to encode the period into the Metric object
   */
  readonly statistic?: string;

  /**
   * Name of the alarm
   *
   * @default Automatically generated name
   */
  readonly alarmName?: string;

  /**
   * Description for the alarm
   *
   * @default No description
   */
  readonly alarmDescription?: string;

  /**
   * Comparison to use to check if metric is breaching
   *
   * @default GreaterThanOrEqualToThreshold
   */
  readonly comparisonOperator?: ComparisonOperator;

  /**
   * The value against which the specified statistic is compared.
   */
  readonly threshold: number;

  /**
   * The number of periods over which data is compared to the specified threshold.
   */
  readonly evaluationPeriods: number;

  /**
   * Specifies whether to evaluate the data and potentially change the alarm state if there are too few data points to be statistically significant.
   *
   * Used only for alarms that are based on percentiles.
   *
   * @default - Not configured.
   */
  readonly evaluateLowSampleCountPercentile?: string;

  /**
   * Sets how this alarm is to handle missing data points.
   *
   * @default TreatMissingData.Missing
   */
  readonly treatMissingData?: TreatMissingData;

  /**
   * Whether the actions for this alarm are enabled
   *
   * @default true
   */
  readonly actionsEnabled?: boolean;

  /**
   * The number of datapoints that must be breaching to trigger the alarm. This is used only if you are setting an "M
   * out of N" alarm. In that case, this value is the M. For more information, see Evaluating an Alarm in the Amazon
   * CloudWatch User Guide.
   *
   * @default ``evaluationPeriods``
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarm-evaluation
   */
  readonly datapointsToAlarm?: number;
}

function ifUndefined<T>(x: T | undefined, def: T | undefined): T | undefined {
  if (x !== undefined) {
    return x;
  }
  return def;
}

/**
 * Change periods of all metrics in the map
 */
function changeAllPeriods(metrics: Record<string, IMetric>, period: cdk.Duration): Record<string, IMetric> {
  const ret: Record<string, IMetric> = {};
  for (const [id, metric] of Object.entries(metrics)) {
    ret[id] = changePeriod(metric, period);
  }
  return ret;
}

/**
 * Return a new metric object which is the same type as the input object, but with the period changed
 *
 * Relies on the fact that implementations of `IMetric` are also supposed to have
 * an implementation of `with` that accepts an argument called `period`. See `IModifiableMetric`.
 */
function changePeriod(metric: IMetric, period: cdk.Duration): IMetric {
  if (isModifiableMetric(metric)) {
    return metric.with({ period });
  }

  throw new Error(`Metric object should also implement 'with': ${metric}`);
}

/**
 * Private protocol for metrics
 *
 * Metric types used in a MathExpression need to implement at least this:
 * a `with` method that takes at least a `period` and returns a modified copy
 * of the metric object.
 *
 * We put it here instead of on `IMetric` because there is no way to type
 * it in jsii in a way that concrete implementations `Metric` and `MathExpression`
 * can be statically typable about the fields that are changeable: all
 * `with` methods would need to take the same argument type, but not all
 * classes have the same `with`-able properties.
 *
 * This class exists to prevent having to use `instanceof` in the `changePeriod`
 * function, so that we have a system where in principle new implementations
 * of `IMetric` can be added. Because it will be rare, the mechanism doesn't have
 * to be exposed very well, just has to be possible.
 */
interface IModifiableMetric {
  with(options: { period?: cdk.Duration }): IMetric;
}

function isModifiableMetric(m: any): m is IModifiableMetric {
  return typeof m === 'object' && m !== null && !!m.with;
}

// Polyfill for string.matchAll(regexp)
function matchAll(x: string, re: RegExp): RegExpMatchArray[] {
  const ret = new Array<RegExpMatchArray>();
  let m: RegExpExecArray | null;
  while (m = re.exec(x)) {
    ret.push(m);
  }
  return ret;
}
