import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import { RemovalPolicy, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { LogStream } from './log-stream';
import { MetricFilter } from './metric-filter';
import { IFilterPattern } from './pattern';
import { ILogSubscriptionDestination, SubscriptionFilter } from './subscription-filter';
export interface ILogGroup extends iam.IResourceWithPolicy {
    /**
     * The ARN of this log group, with ':*' appended
     *
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
     * @param id Unique identifier for the construct in its parent
     * @param props Properties for creating the LogStream
     */
    addStream(id: string, props?: StreamOptions): LogStream;
    /**
     * Create a new Subscription Filter on this Log Group
     *
     * @param id Unique identifier for the construct in its parent
     * @param props Properties for creating the SubscriptionFilter
     */
    addSubscriptionFilter(id: string, props: SubscriptionFilterOptions): SubscriptionFilter;
    /**
     * Create a new Metric Filter on this Log Group
     *
     * @param id Unique identifier for the construct in its parent
     * @param props Properties for creating the MetricFilter
     */
    addMetricFilter(id: string, props: MetricFilterOptions): MetricFilter;
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
     * Give permissions to read from this log group and streams
     */
    grantRead(grantee: iam.IGrantable): iam.Grant;
    /**
     * Give the indicated permissions on this log group and all streams
     */
    grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;
    /**
     * Public method to get the physical name of this log group
     */
    logGroupPhysicalName(): string;
}
/**
 * An CloudWatch Log Group
 */
declare abstract class LogGroupBase extends Resource implements ILogGroup {
    /**
     * The ARN of this log group, with ':*' appended
     */
    abstract readonly logGroupArn: string;
    /**
     * The name of this log group
     */
    abstract readonly logGroupName: string;
    private policy?;
    /**
     * Create a new Log Stream for this Log Group
     *
     * @param id Unique identifier for the construct in its parent
     * @param props Properties for creating the LogStream
     */
    addStream(id: string, props?: StreamOptions): LogStream;
    /**
     * Create a new Subscription Filter on this Log Group
     *
     * @param id Unique identifier for the construct in its parent
     * @param props Properties for creating the SubscriptionFilter
     */
    addSubscriptionFilter(id: string, props: SubscriptionFilterOptions): SubscriptionFilter;
    /**
     * Create a new Metric Filter on this Log Group
     *
     * @param id Unique identifier for the construct in its parent
     * @param props Properties for creating the MetricFilter
     */
    addMetricFilter(id: string, props: MetricFilterOptions): MetricFilter;
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
     * Give permissions to create and write to streams in this log group
     */
    grantWrite(grantee: iam.IGrantable): iam.Grant;
    /**
     * Give permissions to read and filter events from this log group
     */
    grantRead(grantee: iam.IGrantable): iam.Grant;
    /**
     * Give the indicated permissions on this log group and all streams
     */
    grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;
    /**
     * Public method to get the physical name of this log group
     * @returns Physical name of log group
     */
    logGroupPhysicalName(): string;
    /**
     * Adds a statement to the resource policy associated with this log group.
     * A resource policy will be automatically created upon the first call to `addToResourcePolicy`.
     *
     * Any ARN Principals inside of the statement will be converted into AWS Account ID strings
     * because CloudWatch Logs Resource Policies do not accept ARN principals.
     *
     * @param statement The policy statement to add
     */
    addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult;
    private convertArnPrincpalToAccountId;
}
/**
 * How long, in days, the log contents will be retained.
 */
export declare enum RetentionDays {
    /**
     * 1 day
     */
    ONE_DAY = 1,
    /**
     * 3 days
     */
    THREE_DAYS = 3,
    /**
     * 5 days
     */
    FIVE_DAYS = 5,
    /**
     * 1 week
     */
    ONE_WEEK = 7,
    /**
     * 2 weeks
     */
    TWO_WEEKS = 14,
    /**
     * 1 month
     */
    ONE_MONTH = 30,
    /**
     * 2 months
     */
    TWO_MONTHS = 60,
    /**
     * 3 months
     */
    THREE_MONTHS = 90,
    /**
     * 4 months
     */
    FOUR_MONTHS = 120,
    /**
     * 5 months
     */
    FIVE_MONTHS = 150,
    /**
     * 6 months
     */
    SIX_MONTHS = 180,
    /**
     * 1 year
     */
    ONE_YEAR = 365,
    /**
     * 13 months
     */
    THIRTEEN_MONTHS = 400,
    /**
     * 18 months
     */
    EIGHTEEN_MONTHS = 545,
    /**
     * 2 years
     */
    TWO_YEARS = 731,
    /**
     * 3 years
     */
    THREE_YEARS = 1096,
    /**
     * 5 years
     */
    FIVE_YEARS = 1827,
    /**
     * 6 years
     */
    SIX_YEARS = 2192,
    /**
     * 7 years
     */
    SEVEN_YEARS = 2557,
    /**
     * 8 years
     */
    EIGHT_YEARS = 2922,
    /**
     * 9 years
     */
    NINE_YEARS = 3288,
    /**
     * 10 years
     */
    TEN_YEARS = 3653,
    /**
     * Retain logs forever
     */
    INFINITE = 9999
}
/**
 * Properties for a LogGroup
 */
export interface LogGroupProps {
    /**
     * The KMS customer managed key to encrypt the log group with.
     *
     * @default Server-side encrpytion managed by the CloudWatch Logs service
     */
    readonly encryptionKey?: kms.IKey;
    /**
     * Name of the log group.
     *
     * @default Automatically generated
     */
    readonly logGroupName?: string;
    /**
     * How long, in days, the log contents will be retained.
     *
     * To retain all logs, set this value to RetentionDays.INFINITE.
     *
     * @default RetentionDays.TWO_YEARS
     */
    readonly retention?: RetentionDays;
    /**
     * Determine the removal policy of this log group.
     *
     * Normally you want to retain the log group so you can diagnose issues
     * from logs even after a deployment that no longer includes the log group.
     * In that case, use the normal date-based retention policy to age out your
     * logs.
     *
     * @default RemovalPolicy.Retain
     */
    readonly removalPolicy?: RemovalPolicy;
}
/**
 * Define a CloudWatch Log Group
 */
export declare class LogGroup extends LogGroupBase {
    /**
     * Import an existing LogGroup given its ARN
     */
    static fromLogGroupArn(scope: Construct, id: string, logGroupArn: string): ILogGroup;
    /**
     * Import an existing LogGroup given its name
     */
    static fromLogGroupName(scope: Construct, id: string, logGroupName: string): ILogGroup;
    /**
     * The ARN of this log group
     */
    readonly logGroupArn: string;
    /**
     * The name of this log group
     */
    readonly logGroupName: string;
    constructor(scope: Construct, id: string, props?: LogGroupProps);
}
/**
 * Properties for a new LogStream created from a LogGroup
 */
export interface StreamOptions {
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
export interface SubscriptionFilterOptions {
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
export interface MetricFilterOptions {
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
    /**
     * The fields to use as dimensions for the metric. One metric filter can include as many as three dimensions.
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-metrictransformation.html#cfn-logs-metricfilter-metrictransformation-dimensions
     * @default - No dimensions attached to metrics.
     */
    readonly dimensions?: Record<string, string>;
    /**
     * The unit to assign to the metric.
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-logs-metricfilter-metrictransformation.html#cfn-logs-metricfilter-metrictransformation-unit
     * @default - No unit attached to metrics.
     */
    readonly unit?: cloudwatch.Unit;
}
export {};
