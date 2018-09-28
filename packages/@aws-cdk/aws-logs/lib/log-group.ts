import cdk = require('@aws-cdk/cdk');
import { LogStream } from './log-stream';
import { cloudformation } from './logs.generated';
import { MetricFilter } from './metric-filter';
import { FilterPattern, IFilterPattern } from './pattern';
import { ILogSubscriptionDestination, SubscriptionFilter } from './subscription-filter';

/**
 * Properties for importing a LogGroup
 */
export interface LogGroupRefProps {
  logGroupArn: string;
}

/**
 * An CloudWatch Log Group
 */
export abstract class LogGroupRef extends cdk.Construct {
  /**
   * Import an existing LogGroup
   */
  public static import(parent: cdk.Construct, id: string, props: LogGroupRefProps): LogGroupRef {
    return new ImportedLogGroup(parent, id, props);
  }

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
   * @param parent Parent construct
   * @param id Unique identifier for the construct in its parent
   * @param props Properties for creating the LogStream
   */
  public newStream(parent: cdk.Construct, id: string, props: NewLogStreamProps = {}): LogStream {
    return new LogStream(parent, id, {
      logGroup: this,
      ...props
    });
  }

  /**
   * Create a new Subscription Filter on this Log Group
   *
   * @param parent Parent construct
   * @param id Unique identifier for the construct in its parent
   * @param props Properties for creating the SubscriptionFilter
   */
  public newSubscriptionFilter(parent: cdk.Construct, id: string, props: NewSubscriptionFilterProps): SubscriptionFilter {
    return new SubscriptionFilter(parent, id, {
      logGroup: this,
      ...props
    });
  }

  /**
   * Create a new Metric Filter on this Log Group
   *
   * @param parent Parent construct
   * @param id Unique identifier for the construct in its parent
   * @param props Properties for creating the MetricFilter
   */
  public newMetricFilter(parent: cdk.Construct, id: string, props: NewMetricFilterProps): MetricFilter {
    return new MetricFilter(parent, id, {
      logGroup: this,
      ...props
    });
  }

  /**
   * Export this LogGroup
   */
  public export(): LogGroupRefProps {
    return {
      logGroupArn: new cdk.Output(this, 'LogGroupArn', { value: this.logGroupArn }).makeImportValue().toString()
    };
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
   */
  public extractMetric(jsonField: string, metricNamespace: string, metricName: string) {
    new MetricFilter(this, `${metricNamespace}_${metricName}`, {
      logGroup: this,
      metricNamespace,
      metricName,
      filterPattern: FilterPattern.exists(jsonField),
      metricValue: jsonField
    });
  }
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
  logGroupName?: string;

  /**
   * How long, in days, the log contents will be retained.
   *
   * To retain all logs, set this value to Infinity.
   *
   * @default 730 days (2 years)
   */
  retentionDays?: number;

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
  retainLogGroup?: boolean;
}

/**
 * Define a CloudWatch Log Group
 */
export class LogGroup extends LogGroupRef {
  /**
   * The ARN of this log group
   */
  public readonly logGroupArn: string;

  /**
   * The name of this log group
   */
  public readonly logGroupName: string;

  constructor(parent: cdk.Construct, id: string, props: LogGroupProps = {}) {
    super(parent, id);

    let retentionInDays = props.retentionDays;
    if (retentionInDays === undefined) { retentionInDays = 730; }
    if (retentionInDays === Infinity) { retentionInDays = undefined; }

    if (retentionInDays !== undefined && retentionInDays <= 0) {
      throw new Error(`retentionInDays must be positive, got ${retentionInDays}`);
    }

    const resource = new cloudformation.LogGroupResource(this, 'Resource', {
      logGroupName: props.logGroupName,
      retentionInDays,
    });

    if (props.retainLogGroup !== false) {
      cdk.applyRemovalPolicy(resource, cdk.RemovalPolicy.Orphan);
    }

    this.logGroupArn = resource.logGroupArn;
    this.logGroupName = resource.logGroupName;
  }
}

/**
 * An imported CloudWatch Log Group
 */
class ImportedLogGroup extends LogGroupRef {
  /**
   * The ARN of this log group
   */
  public readonly logGroupArn: string;

  /**
   * The name of this log group
   */
  public readonly logGroupName: string;

  constructor(parent: cdk.Construct, id: string, props: LogGroupRefProps) {
    super(parent, id);

    this.logGroupArn = props.logGroupArn;
    this.logGroupName = cdk.ArnUtils.resourceNameComponent(props.logGroupArn, ':');
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
  logStreamName?: string;
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
  destination: ILogSubscriptionDestination;

  /**
   * Log events matching this pattern will be sent to the destination.
   */
  filterPattern: IFilterPattern;
}

/**
 * Properties for a MetricFilter created from a LogGroup
 */
export interface NewMetricFilterProps {
  /**
   * Pattern to search for log events.
   */
  filterPattern: IFilterPattern;

  /**
   * The namespace of the metric to emit.
   */
  metricNamespace: string;

  /**
   * The name of the metric to emit.
   */
  metricName: string;

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
  metricValue?: string;

  /**
   * The value to emit if the pattern does not match a particular event.
   *
   * @default No metric emitted.
   */
  defaultValue?: number;
}
