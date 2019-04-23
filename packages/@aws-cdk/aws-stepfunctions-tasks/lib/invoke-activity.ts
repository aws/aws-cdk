import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import stepfunctions = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/cdk');

const METRIC_PREFIX_SINGULAR = 'Activity';
const METRIC_PREFIX_PLURAL = 'Activities';

/**
 * Properties for FunctionTask
 */
export interface InvokeActivityProps extends stepfunctions.BasicTaskProps {
  /**
   * The activity to invoke
   */
  activity: stepfunctions.IActivity;

  /**
   * Maximum time between heart beats
   *
   * If the time between heart beats takes longer than this, a 'Timeout' error is raised.
   *
   * @default No heart beat timeout
   */
  readonly heartbeatSeconds?: number;
}

/**
 * A StepFunctions Task to invoke a Lambda function.
 *
 * A Function can be used directly as a Resource, but this class mirrors
 * integration with other AWS services via a specific class instance.
 */
export class InvokeActivity extends stepfunctions.Task {
  private readonly activityArn: string;

  constructor(scope: cdk.Construct, id: string, props: InvokeActivityProps) {
    super(scope, id, {
      ...props,
      resourceArn: props.activity.activityArn,
      heartbeatSeconds: props.heartbeatSeconds,
      // No IAM permissions necessary, execution role implicitly has Activity permissions.
    });

    this.activityArn = props.activity.activityArn;
  }

  /**
   * Return the given named metric for this Task
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
   * The interval, in milliseconds, between the time the Task starts and the time it closes.
   *
   * @default average over 5 minutes
   */
  public metricRunTime(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return this.metric(METRIC_PREFIX_SINGULAR + 'RunTime', { statistic: 'avg', ...props });
  }

  /**
   * The interval, in milliseconds, for which the activity stays in the schedule state.
   *
   * @default average over 5 minutes
   */
  public metricScheduleTime(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return this.metric(METRIC_PREFIX_SINGULAR + 'ScheduleTime', { statistic: 'avg', ...props });
  }

  /**
   * The interval, in milliseconds, between the time the activity is scheduled and the time it closes.
   *
   * @default average over 5 minutes
   */
  public metricTime(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return this.metric(METRIC_PREFIX_SINGULAR + 'Time', { statistic: 'avg', ...props });
  }

  /**
   * Metric for the number of times this activity is scheduled
   *
   * @default sum over 5 minutes
   */
  public metricScheduled(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return this.metric(METRIC_PREFIX_PLURAL + 'Scheduled', props);
  }

  /**
   * Metric for the number of times this activity times out
   *
   * @default sum over 5 minutes
   */
  public metricTimedOut(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return this.metric(METRIC_PREFIX_PLURAL + 'TimedOut', props);
  }

  /**
   * Metric for the number of times this activity is started
   *
   * @default sum over 5 minutes
   */
  public metricStarted(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return this.metric(METRIC_PREFIX_PLURAL + 'Started', props);
  }

  /**
   * Metric for the number of times this activity succeeds
   *
   * @default sum over 5 minutes
   */
  public metricSucceeded(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return this.metric(METRIC_PREFIX_PLURAL + 'Succeeded', props);
  }

  /**
   * Metric for the number of times this activity fails
   *
   * @default sum over 5 minutes
   */
  public metricFailed(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return this.metric(METRIC_PREFIX_PLURAL + 'Failed', props);
  }

  /**
   * Metric for the number of times the heartbeat times out for this activity
   *
   * @default sum over 5 minutes
   */
  public metricHeartbeatTimedOut(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
    return this.metric(METRIC_PREFIX_PLURAL + 'HeartbeatTimedOut', props);
  }
}
