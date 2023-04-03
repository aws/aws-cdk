import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as iam from '@aws-cdk/aws-iam';
import { IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
/**
 * Properties for defining a new Step Functions Activity
 */
export interface ActivityProps {
    /**
     * The name for this activity.
     *
     * @default - If not supplied, a name is generated
     */
    readonly activityName?: string;
}
/**
 * Define a new Step Functions Activity
 */
export declare class Activity extends Resource implements IActivity {
    /**
     * Construct an Activity from an existing Activity ARN
     */
    static fromActivityArn(scope: Construct, id: string, activityArn: string): IActivity;
    /**
     * Construct an Activity from an existing Activity Name
     */
    static fromActivityName(scope: Construct, id: string, activityName: string): IActivity;
    /**
     * @attribute
     */
    readonly activityArn: string;
    /**
     * @attribute
     */
    readonly activityName: string;
    constructor(scope: Construct, id: string, props?: ActivityProps);
    /**
     * Grant the given identity permissions on this Activity
     *
     * @param identity The principal
     * @param actions The list of desired actions
     */
    grant(identity: iam.IGrantable, ...actions: string[]): iam.Grant;
    /**
     * Return the given named metric for this Activity
     *
     * @default sum over 5 minutes
     */
    metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * The interval, in milliseconds, between the time the activity starts and the time it closes.
     *
     * @default average over 5 minutes
     */
    metricRunTime(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * The interval, in milliseconds, for which the activity stays in the schedule state.
     *
     * @default average over 5 minutes
     */
    metricScheduleTime(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * The interval, in milliseconds, between the time the activity is scheduled and the time it closes.
     *
     * @default average over 5 minutes
     */
    metricTime(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of times this activity is scheduled
     *
     * @default sum over 5 minutes
     */
    metricScheduled(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of times this activity times out
     *
     * @default sum over 5 minutes
     */
    metricTimedOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of times this activity is started
     *
     * @default sum over 5 minutes
     */
    metricStarted(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of times this activity succeeds
     *
     * @default sum over 5 minutes
     */
    metricSucceeded(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of times this activity fails
     *
     * @default sum over 5 minutes
     */
    metricFailed(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of times the heartbeat times out for this activity
     *
     * @default sum over 5 minutes
     */
    metricHeartbeatTimedOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    private generateName;
    private cannedMetric;
}
/**
 * Represents a Step Functions Activity
 * https://docs.aws.amazon.com/step-functions/latest/dg/concepts-activities.html
 */
export interface IActivity extends IResource {
    /**
     * The ARN of the activity
     *
     * @attribute
     */
    readonly activityArn: string;
    /**
     * The name of the activity
     *
     * @attribute
     */
    readonly activityName: string;
}
