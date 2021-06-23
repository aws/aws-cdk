import * as autoscaling from '@aws-cdk/aws-autoscaling';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * Use an AutoScaling StepScalingAction as an Alarm Action
 */
export class AutoScalingAction implements cloudwatch.IAlarmAction {
  constructor(private readonly stepScalingAction: autoscaling.StepScalingAction) {
  }

  /**
   * Returns an alarm action configuration to use an AutoScaling StepScalingAction
   * as an alarm action
   */
  public bind(_scope: Construct, _alarm: cloudwatch.IAlarm): cloudwatch.AlarmActionConfig {
    return { alarmActionArn: this.stepScalingAction.scalingPolicyArn };
  }
}
