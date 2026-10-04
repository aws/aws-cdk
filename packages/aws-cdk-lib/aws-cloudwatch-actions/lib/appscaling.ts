import type { Construct } from 'constructs';
import type * as appscaling from '../../aws-applicationautoscaling';
import type * as cloudwatch from '../../aws-cloudwatch';

/**
 * Use an ApplicationAutoScaling StepScalingAction as an Alarm Action
 */
export class ApplicationScalingAction implements cloudwatch.IAlarmAction {
  constructor(private readonly stepScalingAction: appscaling.StepScalingAction) {
  }

  /**
   * Returns an alarm action configuration to use an ApplicationScaling StepScalingAction
   * as an alarm action
   */
  public bind(_scope: Construct, _alarm: cloudwatch.IAlarm): cloudwatch.AlarmActionConfig {
    return { alarmActionArn: this.stepScalingAction.scalingPolicyArn };
  }
}
