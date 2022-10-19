import * as cloudwatch from '@aws-cdk/aws-cloudwatch';

/**
 * Metrics on the rate limiting performed on state machine execution.
 *
 * These rate limits are shared across all state machines.
 */
export class StateTransitionMetric {
  /**
   * Return the given named metric for the service's state transition metrics
   *
   * @default average over 5 minutes
   */
  public static metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/States',
      metricName,
      dimensionsMap: { ServiceMetric: 'StateTransition' },
      ...props,
    });
  }

  /**
   * Metric for the number of available state transitions.
   *
   * @default average over 5 minutes
   */
  public static metricProvisionedBucketSize(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return StateTransitionMetric.metric('ProvisionedBucketSize', props);
  }

  /**
   * Metric for the provisioned steady-state execution rate
   *
   * @default average over 5 minutes
   */
  public static metricProvisionedRefillRate(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return StateTransitionMetric.metric('ProvisionedRefillRate', props);
  }

  /**
   * Metric for the number of available state transitions per second
   *
   * @default average over 5 minutes
   */
  public static metricConsumedCapacity(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return StateTransitionMetric.metric('ConsumedCapacity', props);
  }

  /**
   * Metric for the number of throttled state transitions
   *
   * @default sum over 5 minutes
   */
  public static metricThrottledEvents(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return StateTransitionMetric.metric('ThrottledEvents', { statistic: 'sum', ...props });
  }
}
