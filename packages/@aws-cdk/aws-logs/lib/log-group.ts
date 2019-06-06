import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import iam = require('@aws-cdk/aws-iam');
import { applyRemovalPolicy, Construct, IResource, RemovalPolicy, Resource, Stack } from '@aws-cdk/cdk';
import { LogStream } from './log-stream';
import { CfnLogGroup } from './logs.generated';
import { MetricFilter } from './metric-filter';
import { FilterPattern, IFilterPattern } from './pattern';
import { ILogSubscriptionDestination, SubscriptionFilter } from './subscription-filter';

export interface ILogGroup extends IResource {
  /**
   * The ARN of this log group
   * @attribute
   */
  readonly logGroupArn: string;

  /**
   * The name of this log group
   * @attribute
   */
  readonly logGroupName: string;

  /**
   * Create a new Log Stream for this Log Group
   *
   * @param scope Parent construct
   * @param id Unique identifier for the construct in its parent
   * @param props Properties for creating the LogStream
   */
  newStream(scope: Construct, id: string, props?: NewLogStreamProps): LogStream;

  /**
   * Create a new Subscription Filter on this Log Group
   *
   * @param scope Parent construct
   * @param id Unique identifier for the construct in its parent
   * @param props Properties for creating the SubscriptionFilter
   */
  newSubscriptionFilter(scope: Construct, id: string, props: NewSubscriptionFilterProps): SubscriptionFilter;

  /**
   * Create a new Metric Filter on this Log Group
   *
   * @param scope Parent construct
   * @param id Unique identifier for the construct in its parent
   * @param props Properties for creating the MetricFilter
   */
  newMetricFilter(scope: Construct, id: string, props: NewMetricFilterProps): MetricFilter;

  /**
   * Extract a metric from structured log events in the LogGroup
   *
   * Creates a MetricFilter on this LogGroup that will extract the value
   * of the indicated JSON field in all records where it occurs.
   *
   * The metric will be available in CloudWatch Metrics under the
   * indicated namespace and name.
   *
   * @param jsonField JSON field to extract (example: '$.myfield')
   * @param metricNamespace Namespace to emit the metric under
   * @param metricName Name to emit the metric under
   * @returns A Metric object representing the extracted metric
   */
  extractMetric(jsonField: string, metricNamespace: string, metricName: string): cloudwatch.Metric;

  /**
   * Give permissions to write to create and write to streams in this log group
   */
  grantWrite(grantee: iam.IGrantable): iam.Grant;

  /**
   * Give the indicated permissions on this log group and all streams
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;
}

/**
 * An CloudWatch Log Group
 */
abstract class LogGroupBase extends Resource implements ILogGroup {
  /**
   * The ARN of this log group
   */
  public abstract readonly logGroupArn: string;

  /**
   * The name of this log group
   */
  public abstract readonly logGroupName: string;

  /**
   * Create a new Log Stream for this Log Group
   *
   * @param scope Parent construct
   * @param id Unique identifier for the construct in its parent
   * @param props Properties for creating the LogStream
   */
  public newStream(scope: Construct, id: string, props: NewLogStreamProps = {}): LogStream {
    return new LogStream(scope, id, {
      logGroup: this,
      ...props
    });
  }

  /**
   * Create a new Subscription Filter on this Log Group
   *
   * @param scope Parent construct
   * @param id Unique identifier for the construct in its parent
   * @param props Properties for creating the SubscriptionFilter
   */
  public newSubscriptionFilter(scope: Construct, id: string, props: NewSubscriptionFilterProps): SubscriptionFilter {
    return new SubscriptionFilter(scope, id, {
      logGroup: this,
      ...props
    });
  }

  /**
   * Create a new Metric Filter on this Log Group
   *
   * @param scope Parent construct
   * @param id Unique identifier for the construct in its parent
   * @param props Properties for creating the MetricFilter
   */
  public newMetricFilter(scope: Construct, id: string, props: NewMetricFilterProps): MetricFilter {
    return new MetricFilter(scope, id, {
      logGroup: this,
      ...props
    });
  }

  /**
   * Extract a metric from structured log events in the LogGroup
   *
   * Creates a MetricFilter on this LogGroup that will extract the value
   * of the indicated JSON field in all records where it occurs.
   *
   * The metric will be available in CloudWatch Metrics under the
   * indicated namespace and name.
   *
   * @param jsonField JSON field to extract (example: '$.myfield')
   * @param metricNamespace Namespace to emit the metric under
   * @param metricName Name to emit the metric under
   * @returns A Metric object representing the extracted metric
   */
  public extractMetric(jsonField: string, metricNamespace: string, metricName: string) {
    new MetricFilter(this, `${metricNamespace}_${metricName}`, {
      logGroup: this,
      metricNamespace,
      metricName,
      filterPattern: FilterPattern.exists(jsonField),
      metricValue: jsonField
    });

    return new cloudwatch.Metric({ metricName, namespace: metricNamespace });
  }

  /**
   * Give permissions to write to create and write to streams in this log group
   */
  public grantWrite(grantee: iam.IGrantable) {
    return this.grant(grantee, 'logs:CreateLogStream', 'logs:PutLogEvents');
  }

  /**
   * Give the indicated permissions on this log group and all streams
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]) {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      // A LogGroup ARN out of CloudFormation already includes a ':*' at the end to include the log streams under the group.
      // See https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html#w2ab1c21c10c63c43c11
      resourceArns: [this.logGroupArn],
      scope: this,
    });
  }
}

/**
 * How long, in days, the log contents will be retained.
 */
export enum RetentionDays {
  /**
   * 1 day
   */
  OneDay = 1,

  /**
   * 3 days
   */
  ThreeDays = 3,

  /**
   * 5 days
   */
  FiveDays = 5,

  /**
   * 1 week
   */
  OneWeek = 7,

  /**
   * 2 weeks
   */
  TwoWeeks =  14,

  /**
   * 1 month
   */
  OneMonth = 30,

  /**
   * 2 months
   */
  TwoMonths = 60,

  /**
   * 3 months
   */
  ThreeMonths = 90,

  /**
   * 4 months
   */
  FourMonths = 120,

  /**
   * 5 months
   */
  FiveMonths = 150,

  /**
   * 6 months
   */
  SixMonths = 180,

  /**
   * 1 year
   */
  OneYear = 365,

  /**
   * 13 months
   */
  ThirteenMonths = 400,

  /**
   * 18 months
   */
  EighteenMonths = 545,

  /**
   * 2 years
   */
  TwoYears = 731,

  /**
   * 5 years
   */
  FiveYears = 1827,

  /**
   * 10 years
   */
  TenYears = 3653
}

/**
 * Properties for a LogGroup
 */
export interface LogGroupProps {
  /**
   * Name of the log group.
   *
   * @default Automatically generated
   */
  readonly logGroupName?: string;

  /**
   * How long, in days, the log contents will be retained.
   *
   * To retain all logs, set this value to Infinity.
   *
   * @default 731 days (2 years)
   */
  readonly retentionDays?: RetentionDays;

  /**
   * Retain the log group if the stack or containing construct ceases to exist
   *
   * Normally you want to retain the log group so you can diagnose issues
   * from logs even after a deployment that no longer includes the log group.
   * In that case, use the normal date-based retention policy to age out your
   * logs.
   *
   * @default true
   */
  readonly retainLogGroup?: boolean;
}

/**
 * Define a CloudWatch Log Group
 */
export class LogGroup extends LogGroupBase {
  /**
   * Import an existing LogGroup
   */
  public static fromLogGroupArn(scope: Construct, id: string, logGroupArn: string): ILogGroup {
    class Import extends LogGroupBase {
      public readonly logGroupArn = logGroupArn;
      public readonly logGroupName = Stack.of(scope).parseArn(logGroupArn, ':').resourceName!;
    }

    return new Import(scope, id);
  }

  /**
   * The ARN of this log group
   */
  public readonly logGroupArn: string;

  /**
   * The name of this log group
   */
  public readonly logGroupName: string;

  constructor(scope: Construct, id: string, props: LogGroupProps = {}) {
    super(scope, id);

    let retentionInDays = props.retentionDays;
    if (retentionInDays === undefined) { retentionInDays = RetentionDays.TwoYears; }
    if (retentionInDays === Infinity) { retentionInDays = undefined; }

    if (retentionInDays !== undefined && retentionInDays <= 0) {
      throw new Error(`retentionInDays must be positive, got ${retentionInDays}`);
    }

    const resource = new CfnLogGroup(this, 'Resource', {
      logGroupName: props.logGroupName,
      retentionInDays,
    });

    if (props.retainLogGroup !== false) {
      applyRemovalPolicy(resource, RemovalPolicy.Orphan);
    }

    this.logGroupArn = resource.logGroupArn;
    this.logGroupName = resource.logGroupName;
  }
}

/**
 * Properties for a new LogStream created from a LogGroup
 */
export interface NewLogStreamProps {
  /**
   * The name of the log stream to create.
   *
   * The name must be unique within the log group.
   *
   * @default Automatically generated
   */
  readonly logStreamName?: string;
}

/**
 * Properties for a new SubscriptionFilter created from a LogGroup
 */
export interface NewSubscriptionFilterProps {
  /**
   * The destination to send the filtered events to.
   *
   * For example, a Kinesis stream or a Lambda function.
   */
  readonly destination: ILogSubscriptionDestination;

  /**
   * Log events matching this pattern will be sent to the destination.
   */
  readonly filterPattern: IFilterPattern;
}

/**
 * Properties for a MetricFilter created from a LogGroup
 */
export interface NewMetricFilterProps {
  /**
   * Pattern to search for log events.
   */
  readonly filterPattern: IFilterPattern;

  /**
   * The namespace of the metric to emit.
   */
  readonly metricNamespace: string;

  /**
   * The name of the metric to emit.
   */
  readonly metricName: string;

  /**
   * The value to emit for the metric.
   *
   * Can either be a literal number (typically "1"), or the name of a field in the structure
   * to take the value from the matched event. If you are using a field value, the field
   * value must have been matched using the pattern.
   *
   * If you want to specify a field from a matched JSON structure, use '$.fieldName',
   * and make sure the field is in the pattern (if only as '$.fieldName = *').
   *
   * If you want to specify a field from a matched space-delimited structure,
   * use '$fieldName'.
   *
   * @default "1"
   */
  readonly metricValue?: string;

  /**
   * The value to emit if the pattern does not match a particular event.
   *
   * @default No metric emitted.
   */
  readonly defaultValue?: number;
}
