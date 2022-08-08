import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import { CommonActionProps } from './common-action-props';
import { singletonActionRole } from './private/role';

/**
 * Configuration properties of an action for CloudWatch alarm.
 */
export interface CloudWatchSetAlarmStateActionProps extends CommonActionProps {
  /**
   * The reason for the alarm change.
   *
   * @default None
   */
  readonly reason?: string;

  /**
   * The value of the alarm state to set.
   */
  readonly alarmStateToSet: cloudwatch.AlarmState;
}

/**
 * The action to change the state of an Amazon CloudWatch alarm.
 */
export class CloudWatchSetAlarmStateAction implements iot.IAction {
  constructor(
    private readonly alarm: cloudwatch.IAlarm,
    private readonly props: CloudWatchSetAlarmStateActionProps,
  ) {
  }

  /**
   * @internal
   */
  public _bind(topicRule: iot.ITopicRule): iot.ActionConfig {
    const role = this.props.role ?? singletonActionRole(topicRule);
    role.addToPrincipalPolicy(new iam.PolicyStatement({
      actions: ['cloudwatch:SetAlarmState'],
      resources: [this.alarm.alarmArn],
    }));

    return {
      configuration: {
        cloudwatchAlarm: {
          alarmName: this.alarm.alarmName,
          roleArn: role.roleArn,
          stateReason: this.props.reason ?? `Set state of '${this.alarm.alarmName}' to '${this.props.alarmStateToSet}'`,
          stateValue: this.props.alarmStateToSet,
        },
      },
    };
  }
}
