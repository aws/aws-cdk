import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { Construct, IResource, Lazy, Resource, Stack } from '@aws-cdk/core';
import { CfnActivity } from './stepfunctions.generated';

export interface ActivityProps {
    /**
     * The name for this activity.
     *
     * @default If not supplied, a name is generated
     */
    readonly activityName?: string;
}

/**
 * Define a new StepFunctions activity
 */
export class Activity extends Resource implements IActivity {
    /**
     * Construct an Activity from an existing Activity ARN
     */
    public static fromActivityArn(scope: Construct, id: string, activityArn: string): IActivity {
        class Imported extends Resource implements IActivity {
            public get activityArn() { return activityArn; }
            public get activityName() {
                return Stack.of(this).parseArn(activityArn, ':').resourceName || '';
            }
        }

        return new Imported(scope, id);
    }

    /**
     * Construct an Activity from an existing Activity Name
     */
    public static fromActivityName(scope: Construct, id: string, activityName: string): IActivity {
        return Activity.fromActivityArn(scope, id, Stack.of(scope).formatArn({
            service: 'states',
            resource: 'activity',
            resourceName: activityName,
            sep: ':',
        }));
    }

    /**
     * @attribute
     */
    public readonly activityArn: string;

    /**
     * @attribute
     */
    public readonly activityName: string;

    constructor(scope: Construct, id: string, props: ActivityProps = {}) {
        super(scope, id, {
            physicalName: props.activityName ||
                Lazy.stringValue({ produce: () => this.generateName() }),
        });

        const resource = new CfnActivity(this, 'Resource', {
            name: this.physicalName! // not null because of above call to `super`
        });

        this.activityArn = this.getResourceArnAttribute(resource.ref, {
          service: 'states',
          resource: 'activity',
          resourceName: this.physicalName,
          sep: ':',
        });
        this.activityName = this.getResourceNameAttribute(resource.attrName);
    }

    /**
     * Return the given named metric for this Activity
     *
     * @default sum over 5 minutes
     */
    public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return new cloudwatch.Metric({
            namespace: 'AWS/States',
            metricName,
            dimensions: { ActivityArn: this.activityArn },
            statistic: 'sum',
            ...props
        }).attachTo(this);
    }

    /**
     * The interval, in milliseconds, between the time the activity starts and the time it closes.
     *
     * @default average over 5 minutes
     */
    public metricRunTime(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.metric('ActivityRunTime', { statistic: 'avg', ...props });
    }

    /**
     * The interval, in milliseconds, for which the activity stays in the schedule state.
     *
     * @default average over 5 minutes
     */
    public metricScheduleTime(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.metric('ActivityScheduleTime', { statistic: 'avg', ...props });
    }

    /**
     * The interval, in milliseconds, between the time the activity is scheduled and the time it closes.
     *
     * @default average over 5 minutes
     */
    public metricTime(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.metric('ActivityTime', { statistic: 'avg', ...props });
    }

    /**
     * Metric for the number of times this activity is scheduled
     *
     * @default sum over 5 minutes
     */
    public metricScheduled(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.metric('ActivitiesScheduled', props);
    }

    /**
     * Metric for the number of times this activity times out
     *
     * @default sum over 5 minutes
     */
    public metricTimedOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.metric('ActivitiesTimedOut', props);
    }

    /**
     * Metric for the number of times this activity is started
     *
     * @default sum over 5 minutes
     */
    public metricStarted(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.metric('ActivitiesStarted', props);
    }

    /**
     * Metric for the number of times this activity succeeds
     *
     * @default sum over 5 minutes
     */
    public metricSucceeded(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.metric('ActivitiesSucceeded', props);
    }

    /**
     * Metric for the number of times this activity fails
     *
     * @default sum over 5 minutes
     */
    public metricFailed(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.metric('ActivitiesFailed', props);
    }

    /**
     * Metric for the number of times the heartbeat times out for this activity
     *
     * @default sum over 5 minutes
     */
    public metricHeartbeatTimedOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.metric('ActivitiesHeartbeatTimedOut', props);
    }

    private generateName(): string {
        const name = this.node.uniqueId;
        if (name.length > 80) {
            return name.substring(0, 40) + name.substring(name.length - 40);
        }
        return name;
    }
}

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
