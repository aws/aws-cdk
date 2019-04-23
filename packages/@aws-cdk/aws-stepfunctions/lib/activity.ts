import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import { Construct, Resource } from '@aws-cdk/cdk';
import { IStepFunctionsTaskResource, StepFunctionsTaskResourceProps, Task } from './states/task';
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
export class Activity extends Resource implements IActivity, IStepFunctionsTaskResource {
    public readonly activityArn: string;
    public readonly activityName: string;

    constructor(scope: Construct, id: string, props: ActivityProps = {}) {
        super(scope, id);

        const resource = new CfnActivity(this, 'Resource', {
            name: props.activityName || this.generateName()
        });

        this.activityArn = resource.activityArn;
        this.activityName = resource.activityName;
    }

    public asStepFunctionsTaskResource(_callingTask: Task): StepFunctionsTaskResourceProps {
        // No IAM permissions necessary, execution role implicitly has Activity permissions.
        return {
            resourceArn: this.activityArn,
            metricPrefixSingular: 'Activity',
            metricPrefixPlural: 'Activities',
            metricDimensions: { ActivityArn: this.activityArn },
        };
    }

    /**
     * Return the given named metric for this Activity
     *
     * @default sum over 5 minutes
     */
    public metric(metricName: string, props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return new cloudwatch.Metric({
            namespace: 'AWS/States',
            metricName,
            dimensions: { ActivityArn: this.activityArn },
            statistic: 'sum',
            ...props
        });
    }

    /**
     * The interval, in milliseconds, between the time the activity starts and the time it closes.
     *
     * @default average over 5 minutes
     */
    public metricRunTime(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.metric('ActivityRunTime', { statistic: 'avg', ...props });
    }

    /**
     * The interval, in milliseconds, for which the activity stays in the schedule state.
     *
     * @default average over 5 minutes
     */
    public metricScheduleTime(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.metric('ActivityScheduleTime', { statistic: 'avg', ...props });
    }

    /**
     * The interval, in milliseconds, between the time the activity is scheduled and the time it closes.
     *
     * @default average over 5 minutes
     */
    public metricTime(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.metric('ActivityTime', { statistic: 'avg', ...props });
    }

    /**
     * Metric for the number of times this activity is scheduled
     *
     * @default sum over 5 minutes
     */
    public metricScheduled(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.metric('ActivitiesScheduled', props);
    }

    /**
     * Metric for the number of times this activity times out
     *
     * @default sum over 5 minutes
     */
    public metricTimedOut(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.metric('ActivitiesTimedOut', props);
    }

    /**
     * Metric for the number of times this activity is started
     *
     * @default sum over 5 minutes
     */
    public metricStarted(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.metric('ActivitiesStarted', props);
    }

    /**
     * Metric for the number of times this activity succeeds
     *
     * @default sum over 5 minutes
     */
    public metricSucceeded(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.metric('ActivitiesSucceeded', props);
    }

    /**
     * Metric for the number of times this activity fails
     *
     * @default sum over 5 minutes
     */
    public metricFailed(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.metric('ActivitiesFailed', props);
    }

    /**
     * Metric for the number of times the heartbeat times out for this activity
     *
     * @default sum over 5 minutes
     */
    public metricHeartbeatTimedOut(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
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

export interface IActivity extends cdk.IConstruct, IStepFunctionsTaskResource {
    /**
     * The ARN of the activity
     */
    readonly activityArn: string;

    /**
     * The name of the activity
     */
    readonly activityName: string;
}