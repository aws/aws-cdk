import * as appscaling from '@aws-cdk/aws-applicationautoscaling';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { Construct } from 'constructs';

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
