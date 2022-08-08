import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as iot from '@aws-cdk/aws-iot';
import { CommonActionProps } from './common-action-props';
import { singletonActionRole } from './private/role';

/**
 * Configuration properties of an action for CloudWatch metric.
 */
export interface CloudWatchPutMetricActionProps extends CommonActionProps {
  /**
   * The CloudWatch metric name.
   *
   * Supports substitution templates.
   * @see https://docs.aws.amazon.com/iot/latest/developerguide/iot-substitution-templates.html
   */
  readonly metricName: string;

  /**
   * The CloudWatch metric namespace name.
   *
   * Supports substitution templates.
   * @see https://docs.aws.amazon.com/iot/latest/developerguide/iot-substitution-templates.html
   */
  readonly metricNamespace: string;

  /**
   * A string that contains the timestamp, expressed in seconds in Unix epoch time.
   *
   * Supports substitution templates.
   * @see https://docs.aws.amazon.com/iot/latest/developerguide/iot-substitution-templates.html
   *
   * @default - none -- Defaults to the current Unix epoch time.
   */
  readonly metricTimestamp?: string;

  /**
   * The metric unit supported by CloudWatch.
   *
   * Supports substitution templates.
   * @see https://docs.aws.amazon.com/iot/latest/developerguide/iot-substitution-templates.html
   */
  readonly metricUnit: string;

  /**
   * A string that contains the CloudWatch metric value.
   *
   * Supports substitution templates.
   * @see https://docs.aws.amazon.com/iot/latest/developerguide/iot-substitution-templates.html
   */
  readonly metricValue: string;
}

/**
 * The action to capture an Amazon CloudWatch metric.
 */
export class CloudWatchPutMetricAction implements iot.IAction {
  constructor(private readonly props: CloudWatchPutMetricActionProps) {
  }

  /**
   * @internal
   */
  public _bind(rule: iot.ITopicRule): iot.ActionConfig {
    const role = this.props.role ?? singletonActionRole(rule);
    cloudwatch.Metric.grantPutMetricData(role);

    return {
      configuration: {
        cloudwatchMetric: {
          metricName: this.props.metricName,
          metricNamespace: this.props.metricNamespace,
          metricTimestamp: this.props.metricTimestamp,
          metricUnit: this.props.metricUnit,
          metricValue: this.props.metricValue,
          roleArn: role.roleArn,
        },
      },
    };
  }
}
