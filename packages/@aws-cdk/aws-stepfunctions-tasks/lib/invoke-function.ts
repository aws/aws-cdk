import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import iam = require('@aws-cdk/aws-iam');
import lambda = require('@aws-cdk/aws-lambda');
import stepfunctions = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/cdk');

const METRIC_PREFIX_SINGULAR = 'LambdaFunction';
const METRIC_PREFIX_PLURAL = 'LambdaFunctions';

/**
 * Properties for FunctionTask
 */
export interface InvokeFunctionProps extends stepfunctions.BasicTaskProps {
  /**
   * The function to run
   */
  readonly function: lambda.IFunction;
}

/**
 * A StepFunctions Task to invoke a Lambda function.
 *
 * A Function can be used directly as a Resource, but this class mirrors
 * integration with other AWS services via a specific class instance.
 */
export class InvokeFunction extends stepfunctions.Task {
  private readonly functionArn: string;

  constructor(scope: cdk.Construct, id: string, props: InvokeFunctionProps) {
    super(scope, id, {
      ...props,
      resourceArn: props.function.functionArn,
      policyStatements: [new iam.PolicyStatement()
        .addResource(props.function.functionArn)
        .addActions("lambda:InvokeFunction")
      ]
    });

    this.functionArn = props.function.functionArn;
  }

  /**
   * Return the given named metric for this Task
   *
   * @default sum over 5 minutes
   */
  public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/States',
      metricName,
      dimensions: { LambdaFunctionArn: this.functionArn },
      statistic: 'sum',
      ...props
    });
  }

  /**
   * The interval, in milliseconds, between the time the Task starts and the time it closes.
   *
   * @default average over 5 minutes
   */
  public metricRunTime(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric(METRIC_PREFIX_SINGULAR + 'RunTime', { statistic: 'avg', ...props });
  }

  /**
   * The interval, in milliseconds, for which the activity stays in the schedule state.
   *
   * @default average over 5 minutes
   */
  public metricScheduleTime(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric(METRIC_PREFIX_SINGULAR + 'ScheduleTime', { statistic: 'avg', ...props });
  }

  /**
   * The interval, in milliseconds, between the time the activity is scheduled and the time it closes.
   *
   * @default average over 5 minutes
   */
  public metricTime(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric(METRIC_PREFIX_SINGULAR + 'Time', { statistic: 'avg', ...props });
  }

  /**
   * Metric for the number of times this activity is scheduled
   *
   * @default sum over 5 minutes
   */
  public metricScheduled(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric(METRIC_PREFIX_PLURAL + 'Scheduled', props);
  }

  /**
   * Metric for the number of times this activity times out
   *
   * @default sum over 5 minutes
   */
  public metricTimedOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric(METRIC_PREFIX_PLURAL + 'TimedOut', props);
  }

  /**
   * Metric for the number of times this activity is started
   *
   * @default sum over 5 minutes
   */
  public metricStarted(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric(METRIC_PREFIX_PLURAL + 'Started', props);
  }

  /**
   * Metric for the number of times this activity succeeds
   *
   * @default sum over 5 minutes
   */
  public metricSucceeded(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric(METRIC_PREFIX_PLURAL + 'Succeeded', props);
  }

  /**
   * Metric for the number of times this activity fails
   *
   * @default sum over 5 minutes
   */
  public metricFailed(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric(METRIC_PREFIX_PLURAL + 'Failed', props);
  }

  /**
   * Metric for the number of times the heartbeat times out for this activity
   *
   * @default sum over 5 minutes
   */
  public metricHeartbeatTimedOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return this.metric(METRIC_PREFIX_PLURAL + 'HeartbeatTimedOut', props);
  }
}