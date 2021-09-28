import * as iam from '@aws-cdk/aws-iam';
import { IAction, ActionConfig, ITopicRule } from '..';
import { singletonActionRole } from './util';

/**
 * Configuration properties of an action for CloudWatch metric.
 */
export interface CloudwatchMetricActionProps {
  /**
   * The CloudWatch metric name.
   *
   * Supports substitution templates.
   * @see https://docs.aws.amazon.com/iot/latest/developerguide/iot-substitution-templates.html
   */
  readonly metricName: string,
  /**
   * The CloudWatch metric namespace name.
   *
   * Supports substitution templates.
   * @see https://docs.aws.amazon.com/iot/latest/developerguide/iot-substitution-templates.html
   */
  readonly metricNamespace: string,
  /**
   * A string that contains the timestamp, expressed in seconds in Unix epoch time.
   *
   * Supports substitution templates.
   * @see https://docs.aws.amazon.com/iot/latest/developerguide/iot-substitution-templates.html
   *
   * @default None - Defaults to the current Unix epoch time.
   */
  readonly metricTimestamp?: string,
  /**
   * The metric unit supported by CloudWatch.
   *
   * Supports substitution templates.
   * @see https://docs.aws.amazon.com/iot/latest/developerguide/iot-substitution-templates.html
   */
  readonly metricUnit: string,
  /**
   * A string that contains the CloudWatch metric value.
   *
   * Supports substitution templates.
   * @see https://docs.aws.amazon.com/iot/latest/developerguide/iot-substitution-templates.html
   */
  readonly metricValue: string,
  /**
   * The IAM role that allows access to the CloudWatch metric.
   *
   * @default a new role will be created
   */
  readonly role?: iam.IRole;
}

/**
 * The action to capture an Amazon CloudWatch metric.
 */
export class CloudwatchMetricAction implements IAction {
  constructor(private readonly props: CloudwatchMetricActionProps) {
  }

  bind(rule: ITopicRule): ActionConfig {
    const role = this.props.role ?? singletonActionRole(rule);
    role.addToPrincipalPolicy(this.putEventStatement());

    return {
      cloudwatchMetric: {
        metricName: this.props.metricName,
        metricNamespace: this.props.metricNamespace,
        metricTimestamp: this.props.metricTimestamp,
        metricUnit: this.props.metricUnit,
        metricValue: this.props.metricValue,
        roleArn: role.roleArn,
      },
    };
  }

  private putEventStatement() {
    return new iam.PolicyStatement({
      actions: ['cloudwatch:PutMetricData'],
      resources: ['*'],
    });
  }
}
