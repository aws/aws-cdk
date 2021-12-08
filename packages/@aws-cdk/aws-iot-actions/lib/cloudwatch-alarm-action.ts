import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as iam from '@aws-cdk/aws-iam';
import * as iot from '@aws-cdk/aws-iot';
import { CommonActionProps } from './common-action-props';
import { singletonActionRole } from './private/role';

/**
 * Configuration properties of an action for CloudWatch alarm.
 */
export interface CloudWatchAlarmActionProps extends CommonActionProps {
  /**
   * The reason for the alarm change.
   */
  readonly stateReason: string;
  /**
   * The value of the alarm state.
   */
  readonly stateValue: string;
}

/**
 * The action to change a CloudWatch alarm state.
 */
export class CloudWatchAlarmAction implements iot.IAction {
  constructor(
    private readonly alarm: cloudwatch.IAlarm,
    private readonly props: CloudWatchAlarmActionProps,
  ) {
  }

  bind(topicRule: iot.ITopicRule): iot.ActionConfig {
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
          stateReason: this.props.stateReason,
          stateValue: this.props.stateValue,
        },
      },
    };
  }
}
