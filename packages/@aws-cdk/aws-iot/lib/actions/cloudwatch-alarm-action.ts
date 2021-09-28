import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as iam from '@aws-cdk/aws-iam';
import { IAction, ActionConfig, ITopicRule } from '..';
import { singletonActionRole } from './util';

/**
 * Configuration properties of an action for CloudWatch alarm.
 */
export interface CloudwatchAlarmActionProps {
  /**
   * Reason for the alarm change.
   *
   * Supports substitution templates.
   * @see https://docs.aws.amazon.com/iot/latest/developerguide/iot-substitution-templates.html
   *
   * @default 'This state was set by the rule of AWS IoT Core.' will be set
   */
  readonly stateReason?: string;
  /**
   * The IAM role that allows access to the CloudWatch alarm.
   *
   * @default a new role will be created
   */
  readonly role?: iam.IRole;
}

/**
 * The action to change the state of an Amazon CloudWatch alarm.
 */
export class CloudwatchAlarmAction implements IAction {
  private readonly stateReason?: string;
  private readonly role?: iam.IRole;

  /**
   * `stateValue` supports substitution templates.
   * @see https://docs.aws.amazon.com/iot/latest/developerguide/iot-substitution-templates.html
   *
   * @param alarm The CloudWatch alarm that set state by the rule
   * @param stateValue The value of the alarm state.
   *   Valid values: OK, ALARM, INSUFFICIENT_DATA or substitution templates.
   * @param props Optional properties to not use default
   */
  constructor(
    private readonly alarm: cloudwatch.IAlarm,
    private readonly stateValue: cloudwatch.AlarmState | string,
    props: CloudwatchAlarmActionProps = {},
  ) {
    this.stateReason = props.stateReason;
    this.role = props.role;
  }

  bind(rule: ITopicRule): ActionConfig {
    const role = this.role ?? singletonActionRole(rule);
    role.addToPrincipalPolicy(this.putEventStatement(this.alarm));

    return {
      cloudwatchAlarm: {
        alarmName: this.alarm.alarmName,
        stateReason: this.stateReason ?? 'This state was set by the rule of AWS IoT Core.',
        stateValue: this.stateValue,
        roleArn: role.roleArn,
      },
    };
  }

  private putEventStatement(alarm: cloudwatch.IAlarm) {
    return new iam.PolicyStatement({
      actions: ['cloudwatch:SetAlarmState'],
      resources: [alarm.alarmArn],
    });
  }
}
